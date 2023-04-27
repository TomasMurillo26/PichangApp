import { Request, Response } from 'express';
import db from '../config/database';
import { Op } from 'sequelize';

import Ground from '../models/grounds-model';
import GroundType from '../models/groundtypes-model';
import Commune from '../models/communes-model';
import Region from '../models/regions-model';

export const getAll = async (req: Request, res: Response) => {
    try{
        const { name, commune_id, groundtype_id, region_id } = req.query;

        const elementList = await Ground.findAll({
            attributes: { exclude: ['updatedAt', 'createdAt',
            'groundtype_id', 'commune_id'] },
            include: 
            [
                {
                    model: GroundType,
                    attributes: { exclude: ['updatedAt', 'createdAt'] },
                    where: {
                        ...(groundtype_id && { id: groundtype_id }),
                    },
                },
                {
                    model: Commune,
                    attributes: { exclude: ['updatedAt', 'createdAt',
                    'region_id'] },
                    where: {
                        ...(commune_id && { id: commune_id }),
                    },
                    include: 
                    [
                        {
                            model: Region,
                            attributes: { exclude: ['updatedAt', 'createdAt'] },
                            where: {
                                ...(region_id && { id: region_id }),
                            }
                        }
                    ]
                }
            ],
            where:{
                ...(name && { name: {[Op.like]: name} }),
            }
        });

        return elementList.length > 0
        ? res.json({
            status: 200,
            data: elementList,
            message: 'Get all Grounds'
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

        const element = await Ground.findOne({
            attributes: { exclude: ['updatedAt', 'createdAt',
            'groundtype_id', 'commune_id'] },
            include: 
            [
                {
                    model: GroundType,
                    attributes: { exclude: ['updatedAt', 'createdAt'] },
                },
                {
                    model: Commune,
                    attributes: { exclude: ['updatedAt', 'createdAt',
                    'region_id'] },
                    include: 
                    [
                        {
                            model: Region,
                            attributes: { exclude: ['updatedAt', 'createdAt'] },
                        }
                    ]
                }
            ],
            where: { id }
        });

        return res.json({
            status: 200,
            data: element,
            message: 'Get one ground'
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
            latitude,
            longitude,
            address,
            groundtype_id,
            commune_id,
            // tariff,
        } = req.body as Ground;
        
        const element = await Ground.create({
            name,
            address,
            latitude,
            longitude,
            groundtype_id,
            commune_id,
            // tariff
        }, 
        { transaction }
        );

        if(!element) throw new Error('No se pudo crear esta cancha');

        await transaction.commit();

        return res.json({
            status: 200,
            data: element,
            message: 'Cancha creada con éxito'
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
            address,
            latitude,
            longitude,
            commune_id,
            groundtype_id,
            // tariff
        } = req.body as Ground;

        const ground = await Ground.findByPk(id);
        
        if (!ground) throw new Error('No existe esta cancha');

        const success = await ground.update(
            {
                name,
                address,
                latitude,
                longitude,
                commune_id,
                groundtype_id,
                // tariff
            }, 
        { transaction });

        if(!success) throw new Error('No se pudo actualizar esta cancha');

        await transaction.commit();

        return res.json({
            status: 200,
            data: [],
            message: 'Cancha actualizada con éxito'
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
