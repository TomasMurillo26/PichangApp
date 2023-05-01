import { Request, Response } from 'express';
import db from '../config/database';
import { Op } from 'sequelize';

import Friend from '../models/friends-model';
import User from '../models/users-model';
import FriendRequestStatus from '../models/friendrequeststatus-model';


export const getAll = async (req: Request, res: Response) => {
    try{
        const { activated, friend_name } = req.query;

        const elementList = await Friend.findAll({
            attributes: { exclude: ['updatedAt', 'createdAt',
            'user_id', 'friend_id', 'friendrequest_id'] },
            include: 
            [
                {
                    model: User,
                    as: 'friends',
                    attributes: { exclude: ['updatedAt', 'createdAt', 'password',
                    'profile_image', 'email', 'birthday'] },
                    where: {
                        ...(friend_name && {[Op.like]: {name: friend_name}})
                    }
                },
                {
                    model: User,
                    as: 'users',
                    attributes: { exclude: ['updatedAt', 'createdAt', 'password',
                    'profile_image', 'email', 'birthday'] },
                },
                {
                    model: FriendRequestStatus,
                    attributes: { exclude: ['updatedAt', 'createdAt']},
                }
            ],
            where:{
                ...(activated && { activated }),
            }
        });

        return elementList.length > 0
        ? res.json({
            status: 200,
            data: elementList,
            message: 'Get all Friends'
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

        const element = await Friend.findOne({
            attributes: { exclude: ['updatedAt', 'createdAt', 'user_id',
            'friend_id', 'friendrequest_id'] },
            include: 
            [
                {
                    model: User,
                    as: 'friends',
                    attributes: { exclude: ['updatedAt', 'createdAt', 'password',
                    'profile_image', 'email', 'birthday'] },
                },
                {
                    model: User,
                    as: 'users',
                    attributes: { exclude: ['updatedAt', 'createdAt', 'password',
                    'profile_image', 'email', 'birthday'] },
                },
                {
                    model: FriendRequestStatus,
                    attributes: { exclude: ['updatedAt', 'createdAt']},
                }
            ],
            where: { id }
        });

        return res.json({
            status: 200,
            data: element,
            message: 'Get one friend'
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
            friend_id,
        } = req.body as Friend;
        
        const element = await Friend.create({
            user_id: req.user.id,
            friend_id,
            friendrequest_id: 2,
            activated: false
        }, 
        { transaction }
        );

        if(!element) throw new Error('No se pudo agregar a este usuario');

        await transaction.commit();

        return res.json({
            status: 200,
            data: element,
            message: 'Amigo agregado con éxito'
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
            friend_id
        } = req.body as Friend;

        const friend = await Friend.findByPk(id);
        
        if (!friend) throw new Error('No existe este amigo');

        const success = await friend.update(
            {
                // user_id,
                friend_id,
                requeststatus_id: 2,
                activated: false
            }, 
        { transaction });

        if(!success) throw new Error('No se pudo actualizar este amigo');

        await transaction.commit();

        return res.json({
            status: 200,
            data: [],
            message: 'Amigo actualizado con éxito'
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

        const friend = await Friend.findByPk(id);
        
        if (!friend) throw new Error('No existe este amigo');

        if(friend.activated){
            await friend.update({activated: false}, { transaction });
        }else{
            await friend.update({activated: true}, { transaction });
        }

        await transaction.commit();

        await friend.reload();

        return res.json({
            status: 200,
            data: [],
            message: 'Amigo actualizado'
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