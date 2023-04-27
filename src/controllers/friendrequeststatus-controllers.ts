import { Request, Response } from 'express';
import FriendRequeststatus from '../models/friendrequeststatus-model';
import db from '../config/database';

export const getAll = async (_req: Request, res: Response) => {
    try{
        const elementList = await FriendRequeststatus.findAll({
            attributes: { exclude: ['updatedAt', 'createdAt'] },
        });

        return elementList.length > 0
        ? res.json({
            status: 200,
            data: elementList,
            message: 'Get all FriendRequeststatus'
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

        const element = await FriendRequeststatus.findOne({
            attributes: { exclude: ['updatedAt', 'createdAt'] },
            where: { id }
        });

        return res.json({
            status: 200,
            data: element,
            message: 'Get one FriendRequeststatus'
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
        } = req.body as FriendRequeststatus;
        
        const element = await FriendRequeststatus.create(
        {
            name
        },
        { transaction }
        );

        if(!element) throw new Error('No se pudo crear esta FriendRequeststatus');

        await transaction.commit();

        return res.json({
            status: 200,
            data: element,
            message: 'FriendRequeststatus creada con éxito'
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
        const { body } = req;

        const status = await FriendRequeststatus.findByPk(id);
        
        if (!status) throw new Error('No existe estaFriendRequeststatus ');

        const success = await status.update({body}, { transaction });

        if(!success) throw new Error('No se pudo actualizar el FriendRequeststatus ');

        await transaction.commit();

        return res.json({
            status: 200,
            data: [],
            message: 'FriendRequeststatus actualizada con éxito'
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