import { Request, Response } from 'express';
import db from '../config/database';
// import { Op } from 'sequelize';

import QualificationGame from '../models/qualificationgames-model';
import User from '../models/users-model';
import Game from '../models/games-model';
import Sport from '../models/sports-model';

export const getAll = async (req: Request, res: Response) => {
    try{
        const { game_id, user_id } = req.query;

        const elementList = await QualificationGame.findAll({
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
                    attributes: [],
                    where: {
                        ...( user_id && { id: user_id })
                    }
                }
            ],
        });

        return elementList.length > 0
        ? res.json({
            status: 200,
            data: elementList,
            message: 'Get all Qualification Game'
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

        const element = await QualificationGame.findOne({
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
            value,
            // user_id: req
        } = req.body as QualificationGame;
        
        const element = await QualificationGame.create({
            game_id,
            value,
            // user_id: req
        }, 
        { transaction }
        );

        if(!element) throw new Error('Tu calificación no pudo ser enviada');

        await transaction.commit();

        return res.json({
            status: 200,
            data: element,
            message: 'Calificación enviada con éxito'
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

