import { Request, Response } from 'express';
import db from '../config/database';
// import { Op } from 'sequelize';

import UserTeam from '../models/user_teams-model';
import Position from '../models/positions-model';
import Team from '../models/teams-model';
import User from '../models/users-model';
import Sport from '../models/sports-model';
import UserteamRequest from '../models/userteamrequests-model';

export const getAll = async (req: Request, res: Response) => {
    try{
        const { team_id, userteamrequest_id } = req.query;

        const elementList = await UserTeam.findAll({
            attributes: { exclude: ['updatedAt', 'createdAt', 'position_id',
            'team_id', 'user_id'] },
            include: 
            [
                {
                    model: Position,
                    attributes: { exclude: ['updatedAt', 'createdAt']},
                },
                {
                    model: User,
                    attributes: { exclude: ['updatedAt', 'createdAt', 
                    'password', 'email', 'birthday']},
                },
                {
                    model: Team,
                    attributes: { exclude: ['updatedAt', 'createdAt', 
                    'createduser_id']},
                    where:{
                        ...(team_id && { id: team_id }),
                    },
                    include: [{
                        model: Sport,
                        attributes: { exclude: ['updatedAt', 'createdAt', 
                        'min_players', 'max_players']},
                    }]
                },
                {
                    model: UserteamRequest,
                    attributes: [],
                    where:{
                        ...(userteamrequest_id && { id: userteamrequest_id  }),
                    },
                }
            ],
        });

        return elementList.length > 0
        ? res.json({
            status: 200,
            data: elementList,
            message: 'Get all Players'
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

        const element = await UserTeam.findOne({
            attributes: { exclude: ['updatedAt', 'createdAt'] },
            include: 
            [
                {
                    model: Position,
                    attributes: { exclude: ['updatedAt', 'createdAt']},
                },
                {
                    model: User,
                    attributes: { exclude: ['updatedAt', 'createdAt', 
                    'password', 'email', 'birthday']},
                },
                {
                    model: Team,
                    attributes: { exclude: ['updatedAt', 'createdAt', 
                    'createduser_id']},
                    include: [{
                        model: Sport,
                        attributes: { exclude: ['updatedAt', 'createdAt', 
                        'min_players', 'max_players']},
                    }]
                }
            ],
            where: { id }
        });

        return res.json({
            status: 200,
            data: element,
            message: 'Get one player'
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
            position_id,
            team_id,
        } = req.body as UserTeam;

        const element = await UserTeam.create({
            position_id,
            team_id,
            user_id: req.user.id
        }, 
        { transaction }
        );

        if(!element) throw new Error('Jugador agregado con éxito');

        await transaction.commit();

        return res.json({
            status: 200,
            data: element,
            message: 'Jugador agregado con éxito'
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
            position_id,
        } = req.body as UserTeam;

        const userTeam = await UserTeam.findByPk(id);
        
        if (!userTeam) throw new Error('No existe jugador');

        const success = await userTeam.update(
            {
                position_id,
            }, 
        { transaction });

        if(!success) throw new Error('No se pudo actualizar tus datos');

        await transaction.commit();

        return res.json({
            status: 200,
            data: [],
            message: 'Jugador actualizado con éxito'
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

