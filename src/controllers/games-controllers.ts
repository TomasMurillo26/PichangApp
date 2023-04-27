import { Request, Response } from 'express';
import db from '../config/database';
// import { Op } from 'sequelize';

import Sport from '../models/sports-model';
import Game from '../models/games-model';
import Ground from '../models/grounds-model';
import GameType from '../models/gametypes-model';
import User from '../models/users-model';
import GameStatus from '../models/gamestatuses-model';
import Commune from '../models/communes-model';
import GroundType from '../models/groundtypes-model';
import Region from '../models/regions-model';

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
                    'password', 'email', 'birthday', 'activated', 'nickname',
                    'profile_image', 'name']},
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
            latitude,
            longitude,
            address,
            start_hour,
            end_hour,
            date,
            num_players,
            sport_id,
            ground_id,
            gametype_id,
            // createduser_id REQ
        } = req.body as Game;
        
        const element = await Game.create({
            latitude,
            longitude,
            address,
            start_hour,
            end_hour,
            date,
            num_players,
            sport_id,
            ground_id,
            gametype_id,
            gamestatus_id: 1,
        }, 
        { transaction }
        );

        if(!element) throw new Error('No se pudo crear el partido');

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
            num_players,
            // createduser_id REQ
        } = req.body as Game;

        const sport = await Game.findByPk(id);
        
        if (!sport) throw new Error('No existe este partido');

        const success = await sport.update(
            {
                start_hour,
                end_hour,
                num_players,
                // createduser_id REQ
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
