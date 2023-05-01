import { Request, Response } from 'express';
import Position from '../models/positions-model';
import Sport from '../models/sports-model';
import db from '../config/database';

export const getAll = async (req: Request, res: Response) => {
    try{
        const { sport_id } = req.query;

        const elementList = await Position.findAll({
            attributes: { exclude: ['updatedAt', 'createdAt', 'sport_id'] },
            include: {
                model: Sport,
                attributes: { exclude: ['updatedAt', 'createdAt',
                'max_players', 'min_players'] },
                where:{
                    ...(sport_id && { id: sport_id }),
                }
            },
        });

        return elementList.length > 0
        ? res.json({
            status: 200,
            data: elementList,
            message: 'Get all Positions'
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

        const element = await Position.findOne({
            attributes: { exclude: ['updatedAt', 'createdAt', 'sport_id'] },
            include: {
                model: Sport,
                attributes: { exclude: ['updatedAt', 'createdAt', 
                'max_players', 'min_players'] },
            },
            where: { id }
        });

        return res.json({
            status: 200,
            data: element,
            message: 'Get one position'
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
        } = req.body as Position;
        
        const element = await Position.create({
            name,
            sport_id
        }, 
        { transaction }
        );

        if(!element) throw new Error('No se pudo crear esta posición');

        await transaction.commit();

        return res.json({
            status: 200,
            data: element,
            message: 'Posición creada con éxito'
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
            name,
            sport_id,
        } = req.body as Position;

        const sport = await Position.findByPk(id);
        
        if (!sport) throw new Error('No existe esta posición');

        const success = await sport.update(
            {
                name,
                sport_id
            }, 
        { transaction });

        if(!success) throw new Error('No se pudo actualizar esta posición');

        await transaction.commit();

        return res.json({
            status: 200,
            data: [],
            message: 'Posición actualizada con éxito'
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