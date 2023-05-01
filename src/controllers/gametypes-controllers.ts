import { Request, Response } from 'express';
import GameType from '../models/gametypes-model';
import db from '../config/database';

export const getAll = async (_req: Request, res: Response) => {
    try{
        const elementList = await GameType.findAll({
            attributes: { exclude: ['updatedAt', 'createdAt'] },
        });

        return elementList.length > 0
        ? res.json({
            status: 200,
            data: elementList,
            message: 'Get all GameTypes'
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

        const element = await GameType.findOne({
            attributes: { exclude: ['updatedAt', 'createdAt'] },
            where: { id }
        });

        return res.json({
            status: 200,
            data: element,
            message: 'Get one GameTypes'
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
            name
        } = req.body as GameType;
        
        const element = await GameType.create({
            name,
        }, 
        { transaction }
        );

        if(!element) throw new Error('No se pudo crear este tipo de juego');

        await transaction.commit();

        return res.json({
            status: 200,
            data: element,
            message: 'Tipo de juego creado con éxito'
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
};

export const put = async (req: Request, res: Response) => {
    const transaction = await db.transaction();
    try{
        const { id } = req.params;
        const {
            name,
        } = req.body as GameType;

        const gameType = await GameType.findByPk(id);
        
        if (!gameType) throw new Error('No existe este tipo de juego');

        const success = await gameType.update(
            {
                name,
            }, 
        { transaction });

        if(!success) throw new Error('No se pudo actualizar este tipo de juego');

        await transaction.commit();

        return res.json({
            status: 200,
            data: [],
            message: 'Tipo de juego actualizado con éxito'
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
};