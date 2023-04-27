import { Request, Response } from 'express';
import Sport from '../models/sports-model';
import db from '../config/database';
import { Op } from 'sequelize';

export const getAll = async (req: Request, res: Response) => {
    try{
        const { name, activated } = req.query;

        const elementList = await Sport.findAll({
            attributes: { exclude: ['updatedAt', 'createdAt'] },
            where:{
                ...(activated && { activated }),
                ...(name && { name: {[Op.like]: name} }),
            }
        });

        return elementList.length > 0
        ? res.json({
            status: 200,
            data: elementList,
            message: 'Get all Sports'
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

        const element = await Sport.findOne({
            attributes: { exclude: ['updatedAt', 'createdAt'] },
            where: { id }
        });

        return res.json({
            status: 200,
            data: element,
            message: 'Get one sport'
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
            min_players,
            max_players,
            // icon_path
        } = req.body as Sport;
        
        const element = await Sport.create({
            name,
            min_players,
            max_players,
            // icon_path,
        }, 
        { transaction }
        );

        if(!element) throw new Error('No se pudo crear este deporte');

        await transaction.commit();

        return res.json({
            status: 200,
            data: element,
            message: 'Deporte creado con éxito'
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
            min_players,
            max_players,
            // icon_path
        } = req.body as Sport;

        const sport = await Sport.findByPk(id);
        
        if (!sport) throw new Error('No existe este deporte');

        const success = await sport.update(
            {
                name,
                min_players,
                max_players,
                // icon_path
            }, 
        { transaction });

        if(!success) throw new Error('No se pudo actualizar este deporte');

        await transaction.commit();

        return res.json({
            status: 200,
            data: [],
            message: 'Deporte actualizado con éxito'
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

export const toggleActivated = async (req: Request, res: Response) => {
    const transaction = await db.transaction();
    try{
        const { id } = req.params;

        const sport = await Sport.findByPk(id);
        
        if (!sport) throw new Error('No existe este deporte');

        if(sport.activated){
            await sport.update({activated: false}, { transaction });
        }else{
            await sport.update({activated: true}, { transaction });
        }

        await transaction.commit();

        await sport.reload();

        return res.json({
            status: 200,
            data: [],
            message: 'Estado del deporte actualizado'
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