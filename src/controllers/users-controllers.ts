import { Request, Response } from 'express';
import { encrypt } from '../utils/bcrypt.handle';
import { Op } from 'sequelize';
import db from '../config/database';

import Role from '../models/roles-model';
import User from '../models/users-model';

export const getAll = async (req: Request, res: Response) => {
    try{
        const { activated, nickname, name, role_id } = req.query;

        const elementList = await User.findAll({
            attributes: { exclude: ['updatedAt', 'createdAt', 'password'] },
            include: 
            [
                {
                    model: Role,
                    as: 'roles',
                    through: {attributes: []},
                    attributes: { exclude: ['updatedAt', 'createdAt'] },
                    where:{
                        ...( role_id && { id: role_id }),
                    }
                }
            ],
            where:{
                ...(activated && { activated }),
                ...(nickname && { nickname }),
                ...(name && {name: {[Op.like]: name }})
            }
        });

        return elementList.length > 0
        ? res.json({
            status: 200,
            data: elementList,
            message: 'Get all Users'
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

        const element = await User.findOne({
            attributes: { exclude: ['updatedAt', 'createdAt', 'password'] },
            include: 
            [
                {
                    model: Role,
                    as: 'roles',
                    through: {attributes: []},
                    attributes: { exclude: ['updatedAt', 'createdAt'] },
                }
            ],
            where: { id }
        });

        return res.json({
            status: 200,
            data: element,
            message: 'Get one User'
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
            nickname,
            password,
            email,
            birthday,
            role_id,
            //profile_image
        } = req.body as User;
        
        const passwordHash = await encrypt(password);
        const element = await User.create({
            name,
            nickname,
            password: passwordHash,
            email,
            birthday,
            //profile_image
        }, 
        { transaction }
        );

        if(!element) throw new Error('No se pudo crear este usuario');

        await element.setRoles([role_id], { transaction });

        await transaction.commit();

        return res.json({
            status: 200,
            data: element,
            message: 'Usuario creado con éxito'
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
            nickname,
            birthday,
            //profile_image
        } = req.body as User;

        const user = await User.findByPk(id);
        
        if (!user) throw new Error('No existe este usuario');

        if(user.id !== req.user.id){
            return res.status(401).json({
                status: 401,
                message: 'No puedes editar el perfil de otro usuario.',
            });
        }

        const success = await user.update(
            {
                name,
                nickname,
                birthday,
                //profile_image
            }, 
        { transaction });

        if(!success) throw new Error('No se pudo actualizar este usuario');

        await transaction.commit();

        return res.json({
            status: 200,
            data: [],
            message: 'Tu información ha sido actualizada con éxito'
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

        const user = await User.findByPk(id);
        
        if (!user) throw new Error('No existe este usuario');

        if(user.activated){
            await user.update({activated: false}, { transaction });
        }else{
            await user.update({activated: true}, { transaction });
        }

        await transaction.commit();

        await user.reload();

        return res.json({
            status: 200,
            data: [],
            message: 'Estado de usuario actualizado'
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