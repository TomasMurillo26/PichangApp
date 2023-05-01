import { Request, Response } from 'express';
import db from '../config/database';

import Commune from '../models/communes-model';
import Region from '../models/regions-model';

export const getAll = async (req: Request, res: Response) => {
    try{
        const { region_id } = req.query;
        const elementList = await Commune.findAll({
            attributes: { exclude: ['updatedAt', 'createdAt', 'region_id'] },
            include: {
                model: Region,
                attributes: { exclude: ['updatedAt', 'createdAt'] },
                where: {
                    ...(region_id && { id: region_id })
                }
            },
        });

        return elementList.length > 0
        ? res.json({
            status: 200,
            data: elementList,
            message: 'Get all Communes'
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

        const element = await Commune.findOne({
            attributes: { exclude: ['updatedAt', 'createdAt', 'password'] },
            include: {
                model: Region,
                attributes: { exclude: ['updatedAt', 'createdAt'] },
            },
            where: { id }
        });

        return res.json({
            status: 200,
            data: element,
            message: 'Get one Commune'
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
            region_id
        } = req.body as Commune;
        
        const element = await Commune.create(
        {
            name,
            region_id
        },
        { transaction }
        );

        if(!element) throw new Error('No se pudo crear esta comuna');

        await transaction.commit();

        return res.json({
            status: 200,
            data: element,
            message: 'Comuna creada con éxito'
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
            region_id
        } = req.body as Commune;

        const commune = await Commune.findByPk(id);
        
        if (!commune) throw new Error('No existe esta Comuna');

        const success = await commune.update(
            {
                name,
                region_id
            }, 
            { transaction }
            );

        if(!success) throw new Error('No se pudo actualizar la comuna');

        await transaction.commit();

        return res.json({
            status: 200,
            data: [],
            message: 'Comuna actualizada con éxito'
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