import { Request, Response } from 'express';
import Region from '../models/regions-model';
import db from '../config/database';

export const getAll = async (_req: Request, res: Response) => {
    try{
        const elementList = await Region.findAll({
            attributes: { exclude: ['updatedAt', 'createdAt'] },
        });

        return elementList.length > 0
        ? res.json({
            status: 200,
            data: elementList,
            message: 'Get all Regiones'
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

        const element = await Region.findOne({
            attributes: { exclude: ['updatedAt', 'createdAt', 'password'] },
            where: { id }
        });

        return res.json({
            status: 200,
            data: element,
            message: 'Get one region'
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
        } = req.body as Region;
        
        const element = await Region.create(
            {
            name,
            },
            { transaction }
        );

        if(!element) throw new Error('No se pudo crear esta region');

        await transaction.commit();

        return res.json({
            status: 200,
            data: element,
            message: 'Regiones creado con éxito'
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

        const region = await Region.findByPk(id);
        
        if (!region) throw new Error('No existe esta region');

        const success = await region.update(
        {
            body
        },
        { transaction } 
        );

        if(!success) throw new Error('No se pudo actualizar esta region');

        await transaction.commit();

        return res.json({
            status: 200,
            data: [],
            message: 'Regiones actualizado con éxito'
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