import { Request, Response } from 'express';
import db from '../config/database';
import { Op } from 'sequelize';

import Team from '../models/teams-model';
import Sport from '../models/sports-model';
import User from '../models/users-model';
import UserTeam from '../models/user_teams-model';
import UserteamRequest from '../models/userteamrequests-model';
import Position from '../models/positions-model';

export const getAll = async (req: Request, res: Response) => {
    try{
        const { sport_name, sport_id, team_name, activated } = req.query;

        let elementList = await Team.findAll({
            attributes: { exclude: ['updatedAt', 'createdAt',
            'createduser_id'] },
            include: 
            [
                {
                    model: Sport,
                    attributes: { exclude: ['updatedAt', 'createdAt', 
                    'min_players', 'max_players']},
                    where: {
                        ...(sport_name && {name: {[Op.like]: sport_name} }),
                        ...(sport_id && {id: sport_id })
                    }
                },
                {
                    model: UserTeam,
                    attributes: [],
                    where: {
                        ...(req.user.roles[0].id === 2 && {
                            [Op.and]: [{user_id: req.user.id},
                            {userteamrequest_id: 2}] 
                        })
                    }
                }
            ],
            where:{
                ...(activated && { activated }),
                ...(team_name && {name: {[Op.like]: team_name} }),
            }
        });

        elementList = JSON.parse(JSON.stringify(elementList));

        for(const i of elementList){
            let sport = await Sport.findByPk(i.sport_id);

            if(!sport) throw new Error('No se encontró un deporte');

            const userteams = await UserTeam.count({
                where: {
                    team_id: i.id 
                }
            });

            /*Si el equipo está completo, full = true
            Sino es false*/
            if(userteams < sport.max_players){
                i.full = false;
            }else{
                i.full = true;
            }
        }

        return elementList.length > 0
        ? res.json({
            status: 200,
            data: elementList,
            message: 'Get all Teams'
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

        const element = await Team.findOne({
            attributes: { exclude: ['updatedAt', 'createdAt', 'sport_id',
            'captain_id'] },
            include: 
            [
                {
                    model: Sport,
                    attributes: { exclude: ['updatedAt', 'createdAt', 
                    'min_players', 'max_players']},
                },
                {
                    model: User,
                    attributes: { exclude: ['updatedAt', 'createdAt', 
                    'password', 'email', 'birthday']},
                },
                {
                    model: UserTeam,
                    attributes: { exclude: ['updatedAt', 'createdAt', 'isCaptain',
                    'user_id', 'position_id', 'team_id', 'userteamrequest_id']},
                    include: [
                        {
                            model: User,
                            attributes: { exclude: ['updatedAt', 'createdAt', 
                            'password', 'email', 'birthday']},
                            where: {activated: true}
                        },
                        {
                            model: Position,
                            attributes: { exclude: ['updatedAt', 'createdAt',
                            'sport_id']},
                        },
                        {
                            model: UserteamRequest,
                            attributes: [],
                            where: {id: 2}
                        }
                ]
                }
            ],
            where: { id }
        });

        return res.json({
            status: 200,
            data: element,
            message: 'Get one team'
        })
    }catch (error){

        return res.status(500).json({
            status: 500,
            data: {},
            message: 'Error general',
        });
    }
}

export const getUserteamRequest = async (req: Request, res: Response) => {
    try{
        const elementList = await UserTeam.findAll({
            attributes: { exclude: ['updatedAt', 'createdAt', 'position_id',
            'team_id', 'user_id'] },
            include: 
            [
                {
                    model: Position,
                    attributes: { exclude: ['updatedAt', 'createdAt', 'sport_id']},
                },
                {
                    model: User,
                    attributes: { exclude: ['updatedAt', 'createdAt', 
                    'password', 'email', 'birthday']},
                },
                {
                    model: Team,
                    attributes: { exclude: ['updatedAt', 'createdAt', 
                    'captain_id']},
                    include: [{
                        model: Sport,
                        attributes: { exclude: ['updatedAt', 'createdAt', 
                        'min_players', 'max_players']},
                    }]
                },
                {
                    model: UserteamRequest,
                    attributes: [],
                    where:{
                        id: 1
                    },
                }
            ],
            where: {user_id: req.user.id}
        });

        return elementList.length > 0
        ? res.json({
            status: 200,
            data: elementList,
            message: 'Get all Teams'
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

export const post = async (req: Request, res: Response) => {
    const transaction = await db.transaction();
    try{
        const {
            name,
            sport_id,
        } = req.body as Team;
        
        //Se crea un equipo
        const element = await Team.create({
            name,
            sport_id,
            captain_id: req.user.id
        }, 
        { transaction }
        );

        if(!element) throw new Error('No se pudo crear el equipo');

        //El jugador que crea el equipo automaticamente se convierte
        //en capitán
        const captain = await UserTeam.create({
            position_id: null,
            team_id: element.id,
            user_id: req.user.id,
            isCaptain: 1,
            userteamrequest_id: 2
        },
        { transaction }
        );

        if(!captain) throw new Error('No se pudo añadir al jugador');

        await transaction.commit();

        return res.json({
            status: 200,
            data: element,
            message: 'Equipo creado con éxito'
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
            name
        } = req.body as Team;

        const user = await UserTeam.findOne({
            where: { [Op.and]: [
                {team_id: id},
                {user_id: req.user.id}
            ]}
        });

        /*Solo un jugador que pertenezca al equipo puede actualizar 
        la información del equipo*/
        if(!user){
            await transaction.rollback();

            return res.status(401).json({
                status: 401,
                message: 'No puedes editar un equipo al que no perteneces.',
            });
        }

        const team = await Team.findByPk(id);
        
        if (!team) throw new Error('No existe este equipo');

        //Solo se puede actualizar el nombre del equipo
        const success = await team.update(
            {
                name
            }, 
        { transaction });

        if(!success) throw new Error('No se pudo actualizar este equipo');

        await transaction.commit();

        return res.json({
            status: 200,
            data: [],
            message: 'Equipo actualizado con éxito'
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

export const toggleActivated = async (req: Request, res: Response) => {
    const transaction = await db.transaction();
    try{
        const { id } = req.params;

        const team = await Team.findByPk(id);

        if (!team) throw new Error('No existe este deporte');

        if(team.captain_id !== req.user.id){
            await transaction.rollback();

            return res.status(401).json({
                status: 401,
                message: 'Solo el capitán puede eliminar un equipo.',
            });
        }

        //Se desactiva o activa un equipo, solo el capitan puede realizar
        //esta acción
        if(team.activated){
            await team.update({activated: false}, { transaction });
        }else{
            await team.update({activated: true}, { transaction });
        }

        await transaction.commit();

        await team.reload();

        return res.json({
            status: 200,
            data: [],
            message: 'Estado del equipo actualizado'
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

export const changeCaptain = async (req: Request, res: Response) => {
    const transaction = await db.transaction();
    try{
        const { userteam_id } = req.params;
        //Se busca al usuario que el ya retirado capitán eligió como nuevo capitán
        const userTeam = await UserTeam.findByPk(userteam_id);
        
        if (!userTeam) throw new Error('No existe este jugador');

        //Se verifica si es el usuario logeado es capitán del equipo
        const user = await UserTeam.findOne({
            where: { [Op.and]: [
                {team_id: userTeam.team_id},
                {user_id: req.user.id}
            ]}
        });

        if (!user) throw new Error('No existe este usuario');

        /* Si isCaptain es falso (es decir, el jugador no es capitán), 
        rechaza la petición*/
        if(user.isCaptain === false){
            await transaction.rollback();

            return res.status(401).json({
                status: 401,
                message: 'Solo el capitán puede realizar esta acción',
            });
        }

        if(userTeam.isCaptain === true){
            await transaction.rollback();

            return res.status(401).json({
                status: 401,
                message: 'Ya eres capitán de este equipo.',
            });
        }

        if(user.id === userTeam.user_id){
            await transaction.rollback();

            return res.status(401).json({
                status: 401,
                message: 'Ya eres capitán de este equipo',
            });
        }

        /*Si el usuario es capitan, se actualiza el campo isCaptain a false
        ya que deja de ser capitán*/
        await user.update({isCaptain: false}, { transaction});

        const team = await Team.findByPk(userTeam.team_id);

        if (!team) throw new Error('No existe este equipo');

        //Se actualiza el capitan en el Team también
        await team.update({captain_id: userTeam.user_id}, {transaction});

        //Al encontrarlo, actualiza el campo isCaptain a true
        await userTeam.update({isCaptain: true}, { transaction });

        await transaction.commit();

        await userTeam.reload();

        return res.json({
            status: 200,
            data: [],
            message: `Capitán actualizado con éxito`
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

export const sendTeamrequest = async (req: Request, res: Response) => {
    const transaction = await db.transaction();
    try{
        const { id } = req.params;
        const {
            user_id
        } = req.body;

        const userteamExist = await UserTeam.findOne({
            where: {[Op.and]: [
                {user_id},
                {team_id: id},
            ]}
        });

        /*Si el usuario que envía la solicitud ya forma parte del equipo
        se le manda un mensaje*/
        if(userteamExist?.userteamrequest_id === 2){
            await transaction.rollback();

            return res.status(401).json({
                status: 401,
                message: 'Este jugador ya forma parte de este equipo.',
            });
        }

        //Si el usuario mandó una solicitud antes y todavía no le responden
        if(userteamExist){
            await transaction.rollback();

            return res.status(401).json({
                status: 401,
                message: 'Ya enviaste una solicitud a este jugador.',
            });
        }

        //Se crea el usuario y la solicitud
        const request = await UserTeam.create(
            {
                team_id: id,
                user_id,
                userteamrequest_id: 1
            },{ transaction }
        );

        if (!request) throw new Error('Error al enviar solicitud');

        await transaction.commit();

        return res.json({
            status: 200,
            data: [],
            message: `Solicitud enviada con éxito`
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


export const respondRequest = async (req: Request, res: Response) => {
    const transaction = await db.transaction();
    try{
        const { userteam_id } = req.params;
        const {
            userteamrequest_id
        } = req.body;

        const userteam = await UserTeam.findByPk(userteam_id)

        if (!userteam) throw new Error('No existe esta solicitud');

        /*Si el usuario que responde la solicitud no es el mismo
        que el usuario al que se le mandó la solicitud, se impide esta
        acción*/
        if(userteam.user_id !== req.user.id){
            await transaction.rollback();

            return res.status(401).json({
                status: 401,
                message: 'No puedes realizar esta acción.',
            });
        }

        /*Si se rechaza la solicitud (userteamrequest_id = 3), se elimina
        al jugador del equipo*/
        if(userteamrequest_id === 3){
            await userteam.destroy({transaction});

            await transaction.commit();

            return res.json({
                status: 200,
                data: [],
                message: `Solicitud rechazada con éxito`
            })
        }

        /*Se actualiza el estado de la solicitud y se acepta al jugador
        para ello se le asigna el userteamrequest_id = 2*/
        const success = await userteam.update({
            userteamrequest_id
        },{transaction});

        if (!success) throw new Error('Error al responder la solicitud');

        await transaction.commit();

        await success.reload();

        return res.json({
            status: 200,
            data: [],
            message: `Solicitud respondida con éxito`
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


export const selectPosition = async (req: Request, res: Response) => {
    const transaction = await db.transaction();
    try{
        const { userteam_id } = req.params;
        const {
            position_id
        } = req.body;

        //Se busca al miembro del equipo al que se cambiará de posición
        const userTeam = await UserTeam.findByPk(userteam_id);

        if (!userTeam) throw new Error('No existe este jugador');

        const captain = await UserTeam.findOne({
            where: {
                [Op.and]: [
                {user_id: req.user.id},
                {isCaptain: true},
                {team_id: userTeam.team_id}
                ]
            }
        });

        /*Solo el capitan del equipo puede seleccionar
        las posiciones de los demás jugadores de su equipo*/
        if(!captain){
            await transaction.rollback();

            return res.status(401).json({
                status: 401,
                message: 'Solo el capitan del equipo puede realizar esta acción.',
            });
        }

        //Actualiza la posición del jugador
        await userTeam.update({position_id}, { transaction });

        await transaction.commit();

        await userTeam.reload();

        return res.json({
            status: 200,
            data: [],
            message: `Posición cambiada con éxito.`
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

export const deleteUserteam = async (req: Request, res: Response) => {
    const transaction = await db.transaction();
    try{
        const { userteam_id } = req.params;

        //Se verifica si el jugador existe en el equipo.
        const userteam = await UserTeam.findByPk(userteam_id);

        if (!userteam) throw new Error('No existe este jugador');

        //Solo el jugador que pertenece al equipo puede retirarse de el.
        if(req.user.id !== userteam.user_id){
            await transaction.rollback();

            return res.status(401).json({
                status: 401,
                message: 'No puedes realizar esta acción',
            });
        }

        //El capitán no puede abandonar el equipo.
        if(userteam.isCaptain === true){
            await transaction.rollback();

            return res.status(401).json({
                status: 401,
                message: 'El capitán no puede abandonar el equipo.',
            });
        }

        await userteam.destroy({transaction});

        await transaction.commit();

        return res.json({
            status: 200,
            data: [],
            message: 'Abandonaste el equipo con éxito'
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