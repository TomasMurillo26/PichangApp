import { Request, Response } from 'express';
import db from '../config/database';
import { Op } from 'sequelize';

import Sport from '../models/sports-model';
import Game from '../models/games-model';
import Ground from '../models/grounds-model';
import GameType from '../models/gametypes-model';
import User from '../models/users-model';
import GameStatus from '../models/gamestatuses-model';
import Commune from '../models/communes-model';
import GroundType from '../models/groundtypes-model';
import Region from '../models/regions-model';
import UserGame from '../models/user_games-model';
import UserTeam from '../models/user_teams-model';
import Team from '../models/teams-model';

export const getAll = async (req: Request, res: Response) => {
    try{
        const { 
            date, 
            gamestatus_id, 
            sport_id, 
            gametype_id, 
            commune_id,
            region_id,
            groundtype_id
        } = req.query;

        const elementList = await Game.findAll({
            attributes: { exclude: ['updatedAt', 'createdAt',
            'sport_id', 'ground_id', 'gametype_id', 'createduser_id',
            'gamestatus_id', 'latitude', 'longitude'] },
            include: 
            [
                {
                    model: Sport,
                    attributes: { exclude: ['updatedAt', 'createdAt',
                    'max_players', 'min_players', 'activated']},
                    where:{
                        ...(sport_id && { id: sport_id }),
                    }
                },
                {
                    model: GameStatus,
                    attributes: { exclude: ['updatedAt', 'createdAt']},
                    where: {
                        ...( gamestatus_id && { id: gamestatus_id })
                    }
                },
                {
                    model: GameType,
                    attributes: { exclude: ['updatedAt', 'createdAt']},
                    where: {
                        ...( gametype_id && { id: gametype_id })
                    }
                },
                {
                    model: Ground,
                    attributes: { exclude: ['updatedAt', 'createdAt',
                    'latitude', 'longitude', 'tariff', 'groundtype_id',
                    'commune_id']},
                    include: 
                    [
                        {
                            model: Commune,
                            attributes: { exclude: ['updatedAt', 'createdAt', 
                            'region_id']},
                            where: {
                                ...( commune_id && { id: commune_id })
                            },
                            include:
                            [
                                {
                                    model: Region,
                                    attributes: { exclude: ['updatedAt', 'createdAt']},
                                    where: {
                                        ...( region_id && { id: region_id })
                                    }
                                }
                            ]
                        },
                        {
                            model: GroundType,
                            attributes: { exclude: ['updatedAt', 'createdAt']},
                            where: {
                                ...( groundtype_id && { id: groundtype_id})
                            }
                        }
                    ]
                }
            ],
            where: {
                ...( date && { date }) //Revisar
            }
        });

        return elementList.length > 0
        ? res.json({
            status: 200,
            data: elementList,
            message: 'Get all Games'
        })
        : res.status(404).json({
            status: 404,
            data: [],
            message: 'No se han encontrado resultados'
        })
    }catch (error){
        
        return res.status(500).json({
            status: 500,
            data: {},
            message: 'Error general',
        });
    }
}

export const getOne = async (req: Request, res: Response) => {
    try{
        const { id } = req.params;

        const element = await Game.findOne({
            attributes: { exclude: ['updatedAt', 'createdAt',
            'sport_id', 'ground_id', 'gametype_id', 'createduser_id',
            'gamestatus_id'] },
            include: 
            [
                {
                    model: Sport,
                    attributes: { exclude: ['updatedAt', 'createdAt',
                    'max_players', 'min_players', 'activated']},
                },
                {
                    model: GameStatus,
                    attributes: { exclude: ['updatedAt', 'createdAt']},
                },
                {
                    model: GameType,
                    attributes: { exclude: ['updatedAt', 'createdAt']},
                },
                {
                    model: User,
                    attributes: { exclude: ['updatedAt', 'createdAt',
                    'password', 'email', 'birthday', 'activated',
                    'profile_image']},
                },
                {
                    model: Ground,
                    attributes: { exclude: ['updatedAt', 'createdAt',
                    'groundtype_id',
                    'commune_id']},
                    include: 
                    [
                        {
                            model: Commune,
                            attributes: { exclude: ['updatedAt', 'createdAt', 
                            'region_id']},
                            include:
                            [
                                {
                                    model: Region,
                                    attributes: { exclude: ['updatedAt', 'createdAt']},
                                }
                            ]
                        },
                        {
                            model: GroundType,
                            attributes: { exclude: ['updatedAt', 'createdAt']},
                        }
                    ]
                },
                {
                    model: UserGame,
                    attributes: { exclude: ['updatedAt', 'createdAt', 'game_id', 'user_id']},
                    include: 
                    [
                        {
                            model: User,
                            attributes: { exclude: ['updatedAt', 'createdAt',
                            'password', 'email', 'birthday', 'activated',
                            'profile_image']},
                        }
                    ]
                }
            ],
            where: { id }
        });

        return res.json({
            status: 200,
            data: element,
            message: 'Get one game'
        })
    }catch (error){

        return res.status(500).json({
            status: 500,
            data: {},
            message: 'Error general',
        });
    }
}

export const post = async (req: Request, res: Response) => {
    const transaction = await db.transaction();
    try{
        const {
            start_hour,
            end_hour,
            date,
            num_players,
            sport_id,
            ground_id,
            gametype_id,
        } = req.body as Game;
        
        const element = await Game.create({
            start_hour,
            end_hour,
            date,
            num_players,
            sport_id,
            ground_id,
            gametype_id,
            gamestatus_id: 1,
            createduser_id: req.user.id
        }, 
        { transaction }
        );

        if(!element) throw new Error('No se pudo crear el partido');

        if(element.gametype_id === 2){
            //Si el partido es informal, te unes normalmente al partido.
            const userGame = await UserGame.create({
                game_id: element.id,
                user_id: req.user.id
            }, 
            { transaction }
            );
    
            if(!userGame) throw new Error('Error al unirse al partido');
        }else{
            //Busca el equipo según el deporte e ID del capitan
            const team = await Team.findOne({
                where: {
                    [Op.and]: 
                    [
                        {captain_id: req.user.id},
                        {sport_id}
                    ]
                }
            });

            if (!team){
                await transaction.rollback();

                return res.status(401).json({
                    status: 401,
                    message: 'Solo el capitán puede realizar esta acción.',
                });
            };
            
            //Se cuenta cuantos jugadores tiene el equipo
            const userteams = await UserTeam.count({
                where: { team_id: team.id }
            });

            /*Si el número de jugadores del equipo es menor que
            el número de jugadores del juego, retorna un 401*/
            if (userteams < element.num_players){
                await transaction.rollback();

                return res.status(401).json({
                    status: 401,
                    message: 'No puedes crear un partido formal si no tienes tu equipo completo.',
                });
            }

            //Si el equipo está completo, se añade a cada jugador al juego
            let completeTeam = await UserTeam.findAll({
                where: { team_id: team.id }
            });

            completeTeam = JSON.parse(JSON.stringify(completeTeam));

            for(const element of completeTeam){
                const userGame = await UserGame.create({
                    game_id: element.id,
                    user_id: element.user_id,
                    userteam_id: element.id
                }, 
                { transaction }
                );
        
                if(!userGame) throw new Error('Error al unirte como equipo');
            }
        }
        
        await transaction.commit();

        return res.json({
            status: 200,
            data: element,
            message: 'Partido creado con éxito'
        })
    }catch (error){
        console.log(error);

        await transaction.rollback();

        return res.status(500).json({
            status: 500,
            data: {},
            message: 'Error general',
        });
    }
}

export const put = async (req: Request, res: Response) => {
    const transaction = await db.transaction();
    try{
        const { id } = req.params;
        const {
            start_hour,
            end_hour,
        } = req.body as Game;

        const game = await Game.findByPk(id);
        
        if (!game) throw new Error('No existe este partido');

        /*Se puede actualizar solamente la hora de comienzo,
        la hora de fin*/
        
        const success = await game.update(
            {
                start_hour,
                end_hour,
            }, 
        { transaction });

        if(!success) throw new Error('No se pudo actualizar el partido');

        await transaction.commit();

        return res.json({
            status: 200,
            data: [],
            message: 'Partido actualizado con éxito'
        })
    }catch (error){
        console.log(error);

        await transaction.rollback();
        return res.status(500).json({
            status: 500,
            data: {},
            message: 'Error general',
        });
    }
}

export const enterGame = async (req: Request, res: Response) => {
    const transaction = await db.transaction();
    try{
        const { id } = req.params;

        //Se busca el partido al que se unirá.
        const game = await Game.findByPk(id);

        if(!game) throw new Error('No existe este partido');

        //Se verifica que el jugador no se haya unido al partido ya.
        const usergame = await UserGame.findOne({
            where: { [Op.and]: [
                {user_id: req.user.id},
                {game_id: id}
            ] }
        });

        if(usergame){
            await transaction.rollback();

            return res.status(401).json({
                status: 401,
                message: 'Ya te uniste a este partido',
            });
        }

        //Según el tipo de juego (formal/informal) varía el comportamiento
        if(game.gametype_id === 1){
            //Busca el equipo según el deporte e ID del capitan
            const team = await Team.findOne({
                where: {
                    [Op.and]: 
                    [
                        {captain_id: req.user.id},
                        {sport_id: game.sport_id}
                    ]
                }
            });

            //Si el usuario no es capitán retorna un 401
            if (!team){
                await transaction.rollback();

                return res.status(401).json({
                    status: 401,
                    message: 'Solo el capitán puede realizar esta acción.',
                });
            };

            //Se cuenta cuantos jugadores tiene el equipo
            const userteams = await UserTeam.count({
                where: { team_id: team.id }
            });

            /*Si el número de jugadores del equipo es menor que
            el número de jugadores del juego, retorna un 401*/
            if (userteams < game.num_players){
                await transaction.rollback();

                return res.status(401).json({
                    status: 401,
                    message: 'No puedes unirte a un partido formal si no tienes tu equipo completo.',
                });
            }

            //Si el equipo está completo, se añade a cada jugador al juego
            let completeTeam = await UserTeam.findAll({
                where: { team_id: team.id }
            });

            completeTeam = JSON.parse(JSON.stringify(completeTeam));

            for(const element of completeTeam){
                const userGame = await UserGame.create({
                    game_id: element.id,
                    user_id: element.user_id,
                    userteam_id: element.id
                }, 
                { transaction }
                );
        
                if(!userGame) throw new Error('Error al unirte como equipo');
            }
        }else{
            //Si no se ha unido todavía, procede a unirse al partido.
            const element = await UserGame.create({
                game_id: id,
                user_id: req.user.id
            }, 
            { transaction }
            );

            if(!element) throw new Error('No pudiste entrar al partido');
        }
        
        /*Si el número de jugadores que hay en el partido y
        el número de jugadores del partido son el mismo
        el partido cambia de estado a "EN PROCESO" y no debiese dejar
        unirse a más personas.*/
        const count = await UserGame.count({
            where: {game_id: id}
        });

        if(count === game.num_players ){
            const success = await game.update(
                {
                    gamestatus_id: 2
                }, 
            { transaction });
    
            if(!success) throw new Error('No se pudo actualizar el partido');
        }

        await transaction.commit();

        return res.json({
            status: 200,
            data: [],
            message: 'Entraste al partido con éxito'
        })
    }catch (error){
        console.log(error);

        await transaction.rollback();

        return res.status(500).json({
            status: 500,
            data: {},
            message: 'Error general',
        });
    }
}

export const leaveGame = async (req: Request, res: Response) => {
    const transaction = await db.transaction();
    try{
        const { id } = req.params;

        //Se busca el partido por su ID
        const game = await Game.findByPk(id);

        if(!game) throw new Error('No existe este partido');

        const user = await UserGame.findOne({
            where: {[Op.and]: [
                {game_id: id},
                {user_id: req.user.id}
            ]}
        });

        //Si no existe este jugador en este partido, lanza un 400
        if(!user){
            await transaction.rollback();

            return res.status(400).json({
                status: 400,
                data: [],
                message: 'No formas parte de este partido.',
            });
        }

        if(game.gametype_id === 1){
             //Busca el equipo según el deporte e ID del capitan
            const team = await Team.findOne({
                where: {
                    [Op.and]: 
                    [
                        {captain_id: req.user.id},
                        {sport_id: game.sport_id}
                    ]
                }
            });

            //Si el usuario no es capitán retorna un 401
            if (!team){
                await transaction.rollback();

                return res.status(401).json({
                    status: 401,
                    message: 'Solo el capitán puede realizar esta acción.',
                });
            };
            
            //Si el equipo está completo, se añade a cada jugador al juego
            let completeTeam = await UserTeam.findAll({
                where: { team_id: team.id }
            });

            completeTeam = JSON.parse(JSON.stringify(completeTeam));

            //Se elimina a cada miembro del equipo del partido
            for(const element of completeTeam){

                const userGame = await UserGame.findOne({
                    where: {[Op.and]: [
                        {userteam_id: element.id}, 
                        {game_id: id}
                    ]}
                });

                if(!userGame) throw new Error('Error al abandonar el partido');

                await userGame.destroy({ transaction });
            }

        }else{
            //Se busca al jugador por su ID y el ID del partido
            const userGame = await UserGame.findOne({
                where: { [Op.and]: [
                    {game_id: id}, 
                    {user_id: req.user.id}
                ]}
            });

            if (!userGame) throw new Error('No existe este jugador');

            //Se elimina al jugador
            await userGame.destroy({ transaction });
        }

        /*Si el jugador que se sale del partido es el creador del mismo
        el partido se elimina*/
        if(game?.createduser_id === req.user.id){
            await game?.destroy({ transaction });

            await transaction.commit();

            return res.json({
                status: 200,
                data: [],
                message: 'El partido se eliminó con éxito'
            })
        }

        //Se cuenta cuantos jugadores hay en el partido
        const count = await UserGame.count({
            where: {game_id: id}
        });

        /*Si al abandonar el partido, la cuenta es menor 
        al número de jugadores, el partido cambia de estado a
        'EN ESPERA' */
        if(count < game.num_players ){
            const success = await game.update(
                {
                    gamestatus_id: 1
                }, 
            { transaction });
    
            if(!success) throw new Error('No se pudo actualizar el partido');
        }

        await transaction.commit();

        return res.json({
            status: 200,
            data: [],
            message: 'Abandonaste el partido con éxito'
        })
    }catch (error){
        console.log(error);

        await transaction.rollback();
        return res.status(500).json({
            status: 500,
            data: {},
            message: 'Error general',
        });
    }
}

