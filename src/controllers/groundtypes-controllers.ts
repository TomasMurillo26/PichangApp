import { Request, Response } from 'express';
import GroundType from '../models/groundtypes-model';
import db from '../config/database';

export const getAll = async (_req: Request, res: Response) => {
    try{
        const elementList = await GroundType.findAll({
            attributes: { exclude: ['updatedAt', 'createdAt'] },
        });

        return elementList.length > 0
        ? res.json({
            status: 200,
            data: elementList,
            message: 'Get all GroundTypes'
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

        const element = await GroundType.findOne({
            attributes: { exclude: ['updatedAt', 'createdAt'] },
            where: { id }
        });

        return res.json({
            status: 200,
            data: element,
            message: 'Get one GroundType'
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
        } = req.body as GroundType;
        
        const element = await GroundType.create({
            name,
        }, 
        { transaction }
        );

        if(!element) throw new Error('No se pudo crear este tipo de cancha');

        await transaction.commit();

        return res.json({
            status: 200,
            data: element,
            message: 'Tipo de cancha creado con éxito'
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
        } = req.body as GroundType;

        const groundType = await GroundType.findByPk(id);
        
        if (!groundType) throw new Error('No existe este tipo de cancha');

        const success = await groundType.update(
            {
                name,
            }, 
        { transaction });

        if(!success) throw new Error('No se pudo actualizar este tipo de cancha');

        await transaction.commit();

        return res.json({
            status: 200,
            data: [],
            message: 'Tipo de cancha actualizada con éxito'
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