import { Request, Response } from 'express';
import db from '../config/database';
import { Op } from 'sequelize';

import Team from '../models/teams-model';
import Sport from '../models/sports-model';
import User from '../models/users-model';

export const getAll = async (req: Request, res: Response) => {
    try{
        const { sport_name, sport_id, team_name, activated } = req.query;

        const elementList = await Team.findAll({
            attributes: { exclude: ['updatedAt', 'createdAt', 'sport_id',
            'createduser_id'] },
            include: 
            [
                {
                    model: Sport,
                    attributes: { exclude: ['updatedAt', 'createdAt', 
                    'min_players', 'max_players']},
                    where: {
                        ...(sport_name && {name: {[Op.like]: sport_name} }),
                        ...(sport_id && {id: sport_id })
                    }
                },
            ],
            where:{
                ...(activated && { activated }),
                ...(team_name && {name: {[Op.like]: team_name} }),
            }
        });

        return elementList.length > 0
        ? res.json({
            status: 200,
            data: elementList,
            message: 'Get all Teams'
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

        const element = await Team.findOne({
            attributes: { exclude: ['updatedAt', 'createdAt'] },
            include: 
            [
                {
                    model: Sport,
                    attributes: { exclude: ['updatedAt', 'createdAt', 
                    'min_players', 'max_players']},
                },
                {
                    model: User,
                    attributes: { exclude: ['updatedAt', 'createdAt', 
                    'password', 'email', 'birthday']},
                }
            ],
            where: { id }
        });

        return res.json({
            status: 200,
            data: element,
            message: 'Get one team'
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
        } = req.body as Team;
        
        const element = await Team.create({
            name,
            sport_id,
            createduser_id: req.user.id
        }, 
        { transaction }
        );

        if(!element) throw new Error('No se pudo crear el equipo');

        await transaction.commit();

        return res.json({
            status: 200,
            data: element,
            message: 'Equipo creado con éxito'
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

        } = req.body as Team;

        const team = await Team.findByPk(id);
        
        if (!team) throw new Error('No existe este equipo');

        const success = await team.update(
            {
                name,
                sport_id
            }, 
        { transaction });

        if(!success) throw new Error('No se pudo actualizar este equipo');

        await transaction.commit();

        return res.json({
            status: 200,
            data: [],
            message: 'Equipo actualizado con éxito'
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

        const team = await Team.findByPk(id);
        
        if (!team) throw new Error('No existe este deporte');

        if(team.activated){
            await team.update({activated: false}, { transaction });
        }else{
            await team.update({activated: true}, { transaction });
        }

        await transaction.commit();

        await team.reload();

        return res.json({
            status: 200,
            data: [],
            message: 'Estado del tema actualizado'
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