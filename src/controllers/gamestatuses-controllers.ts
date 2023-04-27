import { Request, Response } from 'express';
import GameStatus from '../models/gamestatuses-model';
import db from '../config/database';

export const getAll = async (_req: Request, res: Response) => {
    try{
        const elementList = await GameStatus.findAll({
            attributes: { exclude: ['updatedAt', 'createdAt'] },
        });

        return elementList.length > 0
        ? res.json({
            status: 200,
            data: elementList,
            message: 'Get all Gamestatuses'
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

        const element = await GameStatus.findOne({
            attributes: { exclude: ['updatedAt', 'createdAt'] },
            where: { id }
        });

        return res.json({
            status: 200,
            data: element,
            message: 'Get one Gamestatus'
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
        } = req.body as GameStatus;
        
        const element = await GameStatus.create({
            name,
        }, 
        { transaction }
        );

        if(!element) throw new Error('No se pudo crear este status de juego');

        await transaction.commit();

        return res.json({
            status: 200,
            data: element,
            message: 'Status de juego creado con éxito'
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
        } = req.body as GameStatus;

        const gameStatus = await GameStatus.findByPk(id);
        
        if (!gameStatus) throw new Error('No existe este status de juego');

        const success = await gameStatus.update(
            {
                name,
            }, 
        { transaction });

        if(!success) throw new Error('No se pudo actualizar este status de juego');

        await transaction.commit();

        return res.json({
            status: 200,
            data: [],
            message: 'Status de juego actualizado con éxito'
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