import { Request, Response } from 'express';
import db from '../config/database';
import { Op, Sequelize } from 'sequelize';

import Friend from '../models/friends-model';
import User from '../models/users-model';
import FriendRequestStatus from '../models/friendrequeststatus-model';


export const getAll = async (req: Request, res: Response) => {
    try{
        const { activated, friendrequeststatus_id } = req.query;

        let users = await Friend.findAll({
            attributes: { exclude: ['updatedAt', 'createdAt',
            'user_id', 'friend_id', 'friendrequest_id'],
            include: [
                [Sequelize.literal('friends.name'), 'name'],
                [Sequelize.literal('friends.nickname'), 'nickname'],
                [Sequelize.literal('users.id'), 'user_id'],
                [Sequelize.literal('friends.id'), 'friend_id'],
            ] 
        },
            include: 
            [
                {
                    model: User,
                    as: 'friends',
                    attributes: [],
                    // where: 
                    // {
                    //     ...(friendrequeststatus_id === '2' && {id: {[Op.ne]: req.user.id}})
                    // }
                },
                {
                    model: User,
                    as: 'users',
                    attributes: [],
                    where: 
                    {
                        ...(friendrequeststatus_id === '2' && {
                            id: {
                                [Op.not]: req.user.id
                            }
                        })
                    }
                },
                {
                    model: FriendRequestStatus,
                    attributes: { exclude: ['updatedAt', 'createdAt']},
                    where: { 
                        ...(friendrequeststatus_id && { id: friendrequeststatus_id }),
                        ...(!friendrequeststatus_id && { id: 1 })    
                    }
                }
            ],
            where:{
                ...(activated && { activated }),
            },        
        });

        for(const i of users){
            if(req.user.id !== i.user_id){
                users = [];
            }
        }

        let friends = await Friend.findAll({
            attributes: { exclude: ['updatedAt', 'createdAt',
            'user_id', 'friend_id', 'friendrequest_id'],
            include: [
                [Sequelize.literal('users.name'), 'name'],
                [Sequelize.literal('users.nickname'), 'nickname'],
                [Sequelize.literal('friends.id'), 'user_id'],
                [Sequelize.literal('users.id'), 'friend_id']
            ] 
        },
            include: 
            [
                {
                    model: User,
                    as: 'users',
                    attributes: []
                },
                {
                    model: User,
                    as: 'friends',
                    attributes: [],
                    where: {
                        id: req.user.id
                    }
                },
                {
                    model: FriendRequestStatus,
                    attributes: { exclude: ['updatedAt', 'createdAt']},
                    where: {
                        ...(friendrequeststatus_id && { id: friendrequeststatus_id }),
                        ...(!friendrequeststatus_id && { id: 1 }) 
                    }
                }
            ],
            where:{
                ...(activated && { activated }),
            },
        });

        let elementList = users.concat(friends);

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
            nickname
        } = req.body;

        //Se busca un usuario a través de su nickname
        const user = await User.findOne({
            where: {
                nickname
            }
        });

        if(!user) throw new Error('Este usuario no existe');

        //Si encuentra el usuario se almacena el id en esta
        //constante
        const friend_id = user.id;

        const userReq = await User.findByPk(req.user.id);

        if(!userReq) throw new Error('Este usuario no existe');

        //Se verifica si el usuario que envía la solicitud de
        //amigo posee una solicitud del usuario que va a agregar.
        const existFriend = await Friend.findOne({
            where: 
            { 
                [Op.and]: 
                [
                    { user_id: friend_id },
                    { friend_id: req.user.id },
                ]
            } 
        });

        if(user.nickname === userReq.nickname){
            await transaction.rollback();

            return res.status(401).json({
                status: 401,
                message: 'No puedes enviar una solicitud a ti mismo',
            });
        }

        //Si el usuario existe se cancela la transacción.
        if(existFriend){
            await transaction.rollback();

            return res.status(401).json({
                status: 401,
                message: 'Ya tienes una solicitud de este jugador',
            });
        };

        //Se crea el amigo, el estado de la solicitud queda en
        //pendiente (2)
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

export const toggleActivated = async (req: Request, res: Response) => {
    const transaction = await db.transaction();
    try{
        const { id } = req.params;

        const friend = await Friend.findByPk(id);
        
        if (!friend) throw new Error('No existe este amigo');

        if(friend.friend_id !== req.user.id && friend.user_id !== req.user.id){
            await transaction.rollback();

            return res.status(401).json({
                status: 401,
                message: 'No puedes realizar esta acción',
            });
        }

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

export const respondFriendrequest = async (req: Request, res: Response) => {
    const transaction = await db.transaction();
    try{
        const { id } = req.params;
        const {
            friendrequest_id
        } = req.body;

        //Se busca si el amigo que existe
        const friend = await Friend.findByPk(id);
        
        if (!friend) throw new Error('No existe este amigo');

        //Si el usuario que responde no es el mismo al que fue
        //enviada la solcitud, regresa este mensaje.
        if(friend.friend_id !== req.user.id){
            await transaction.rollback();

            return res.status(401).json({
                status: 401,
                message: 'No puedes realizar esta acción',
            });
        }

        //Si la solicitud ya fue aceptada, regresa este mensaje
        if(friend.friendrequest_id === 1){
            await transaction.rollback();

            return res.status(401).json({
                status: 401,
                message: 'Esta solicitud ya fue aceptada',
            });
        }

        if(friendrequest_id === 1){
            //La solicitud aceptada es actualizada
            const success = await friend.update(
                {
                    friendrequest_id,
                    activated: true
                }, 
            { transaction });
    
            if(!success) throw new Error('No se pudo actualizar este amigo');
        }else if(friendrequest_id === 3){
            //La solicitud rechazada es borrada
            await friend.destroy({transaction});

            await transaction.commit();
    
            return res.json({
                status: 200,
                data: [],
                message: 'Solicitud rechazada con éxito.'
            })
        }

        await transaction.commit();

        return res.json({
            status: 200,
            data: [],
            message: 'Solicitud aceptada con éxito'
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