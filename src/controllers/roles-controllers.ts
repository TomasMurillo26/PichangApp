import { Request, Response } from 'express';
import Roles from '../models/roles-model';
import db from '../config/database';


export const getAll = async (_req: Request, res: Response) => {
    try{
        const elementList = await Roles.findAll({
            attributes: { exclude: ['updatedAt', 'createdAt'] },
        });

        return elementList.length > 0
        ? res.json({
            status: 200,
            data: elementList,
            message: 'Get all Roles'
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

        const element = await Roles.findOne({
            attributes: { exclude: ['updatedAt', 'createdAt', 'password'] },
            where: { id }
        });

        return res.json({
            status: 200,
            data: element,
            message: 'Get one Role'
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
        } = req.body as Roles;
        
        const element = await Roles.create(
        {
            name,
        },
        { transaction }
        );

        if(!element) throw new Error('No se pudo crear este rol');

        await transaction.commit();

        return res.json({
            status: 200,
            data: element,
            message: 'Roles creado con éxito'
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

        const roles = await Roles.findByPk(id);
        
        if (!roles) throw new Error('No existe esta region');

        const success = await roles.update(
        {
            body
        },
        { transaction }
        );

        if(!success) throw new Error('No se pudo actualizar el rol');

        await transaction.commit();

        return res.json({
            status: 200,
            data: [],
            message: 'Roles actualizado con éxito'
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