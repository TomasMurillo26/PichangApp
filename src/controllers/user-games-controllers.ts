import { Request, Response } from 'express';
import db from '../config/database';
// import { Op } from 'sequelize';

import UserGame from '../models/user_games-model';
import Position from '../models/positions-model';
import Team from '../models/teams-model';
import User from '../models/users-model';
import Sport from '../models/sports-model';
import Game from '../models/games-model';
import UserTeam from '../models/user_teams-model';

export const getAll = async (req: Request, res: Response) => {
    try{
        const { game_id } = req.query;

        const elementList = await UserGame.findAll({
            attributes: { exclude: ['updatedAt', 'createdAt', 
            'position_id', 'team_id', 'user_id'] },
            include: 
            [
                {
                    model: Game,
                    attributes: { exclude: ['updatedAt', 'createdAt', 
                    'start_hour', 'end_hour', 'latitude', 'longitude', 
                    'sport_id', 'gametype_id', 'crerateduser_id', 
                    'gamestatus_id', 'ground_id']},
                    include: 
                    [
                        {
                            model: Sport,
                            attributes: { exclude: ['updatedAt', 'createdAt',
                            'max_players', 'min_players', 'activated'] },
                        }
                    ],
                    where: {
                        ...( game_id && {id: game_id})
                    },
                },
                {
                    model: User,
                    attributes: { exclude: ['updatedAt', 'createdAt', 
                    'password', 'email', 'birthday']},
                },
                {
                    model: UserTeam,
                    attributes: { exclude: ['updatedAt', 'createdAt', 
                    'user_id', 'team_id', 'position_id']},
                    include: 
                    [
                        {
                            model: Team,
                            attributes: { exclude: ['updatedAt', 'createdAt', 
                            'sport_id', 'createduser_id', 'activated']},
                        },
                        {
                            model: Position,
                            attributes: { exclude: ['updatedAt', 'createdAt', 
                            'sport_id']},
                        },
                        {
                            model: User,
                            attributes: { exclude: ['updatedAt', 'createdAt', 
                            'password', 'email', 'birthday']},
                        }
                    ]
                }
            ],
        });

        return elementList.length > 0
        ? res.json({
            status: 200,
            data: elementList,
            message: 'Get all Players of All Games'
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

        const element = await UserGame.findOne({
            attributes: { exclude: ['updatedAt', 'createdAt', 
            'position_id', 'team_id', 'user_id'] },
            include: 
            [
                {
                    model: Game,
                    attributes: { exclude: ['updatedAt', 'createdAt', 
                    'start_hour', 'end_hour', 'latitude', 'longitude', 
                    'sport_id', 'gametype_id', 'crerateduser_id', 
                    'gamestatus_id', 'ground_id']},
                    include: 
                    [
                        {
                            model: Sport,
                            attributes: { exclude: ['updatedAt', 'createdAt',
                            'max_players', 'min_players', 'activated'] },
                        }
                    ],
                },
                {
                    model: User,
                    attributes: { exclude: ['updatedAt', 'createdAt', 
                    'password', 'email', 'birthday']},
                },
                {
                    model: UserTeam,
                    attributes: { exclude: ['updatedAt', 'createdAt', 
                    'user_id', 'team_id', 'position_id']},
                    include: 
                    [
                        {
                            model: Team,
                            attributes: { exclude: ['updatedAt', 'createdAt', 
                            'sport_id', 'createduser_id', 'activated']},
                        },
                        {
                            model: Position,
                            attributes: { exclude: ['updatedAt', 'createdAt', 
                            'sport_id']},
                        },
                        {
                            model: User,
                            attributes: { exclude: ['updatedAt', 'createdAt', 
                            'password', 'email', 'birthday']},
                        }
                    ]
                }
            ],
            where: { id }
        });

        return res.json({
            status: 200,
            data: element,
            message: 'Get one player of a game'
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
            game_id,
            //userteam_id
        } = req.body as UserGame;

        console.log('NO ENTRES', game_id);

        const element = await UserGame.create({
            game_id,
            //userteam_id
            user_id: req.user.id
        }, 
        { transaction }
        );

        if(!element) throw new Error('No se pudo agregar al jugador');

        await transaction.commit();

        return res.json({
            status: 200,
            data: element,
            message: 'Jugador agregado con éxito'
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

