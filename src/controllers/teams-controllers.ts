import { Request, Response } from 'express';
import db from '../config/database';
import { Op } from 'sequelize';

import Team from '../models/teams-model';
import Sport from '../models/sports-model';
import User from '../models/users-model';
import UserTeam from '../models/user_teams-model';

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
            name
        } = req.body as Team;


        const user = await UserTeam.findOne({
            where: { [Op.and]: [
                {team_id: id},
                {user_id: req.user.id}
            ]}
        });

        /*Solo un jugador que pertenezca al equipo puede actualizar 
        la información del equipo*/
        if(!user){
            return res.status(401).json({
                status: 401,
                message: 'No puedes editar un equipo al que no perteneces.',
            });
        }

        const team = await Team.findByPk(id);
        
        if (!team) throw new Error('No existe este equipo');

        //Solo se puede actualizar el nombre del equipo
        const success = await team.update(
            {
                name
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

export const changeCaptain = async (req: Request, res: Response) => {
    const transaction = await db.transaction();
    try{
        const { id } = req.params;
        const {
            userteam_id
        } = req.body;

        //Se verifica si es el usuario logeado es capitán del equipo
        const user = await UserTeam.findOne({
            where: { [Op.and]: [
                {team_id: id},
                {user_id: req.user.id}
            ]}
        });

        /* Si isCaptain es falso (es decir, el jugador no es capitán), 
        rechaza la petición*/
        if(user?.isCaptain === false){
            return res.status(401).json({
                status: 401,
                message: 'Solo el capitán puede realizar esta acción',
            });
        }

        /*Si el usuario es capitan, se actualiza el campo isCaptain a false
        ya que deja de ser capitán*/
        await user?.update({isCaptain: false}, { transaction});

        //Se busca al usuario que el ya retirado capitán eligió como nuevo capitán
        const userTeam = await UserTeam.findByPk(userteam_id);
        
        if (!userTeam) throw new Error('No existe este jugador');

        const team = await Team.findByPk(userTeam.team_id);

        if (!team) throw new Error('No existe este equipo');

        //Se actualiza el capitan en el Team también
        await team.update({captain_id: userTeam.user_id}, {transaction});

        //Al encontrarlo, actualiza el campo isCaptain a true
        await userTeam.update({isCaptain: true}, { transaction });

        await transaction.commit();

        await userTeam.reload();

        return res.json({
            status: 200,
            data: [],
            message: `Capitán actualizado con éxito`
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

export const sendTeamrequest = async (req: Request, res: Response) => {
    const transaction = await db.transaction();
    try{
        const {
            team_id,
            user_id
        } = req.body;

        const userteamExist = await UserTeam.findOne({
            where: {[Op.and]: [
                {user_id},
                {team_id},
            ]}
        });

        if(userteamExist){
            return res.status(401).json({
                status: 401,
                message: 'Ya enviaste una solicitud a este usuario.',
            });
        }

        const request = UserTeam.create(
            {
                team_id,
                user_id,
                userteamrequest_id: 1
            },{ transaction }
        );

        if (!request) throw new Error('Error al enviar solicitud');

        await transaction.commit();

        return res.json({
            status: 200,
            data: [],
            message: `Solicitud enviada con éxito`
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


export const respondRequest = async (req: Request, res: Response) => {
    const transaction = await db.transaction();
    try{
        const {
            userteam_id,
            userteamrequest_id
        } = req.body;

        const userteam = await UserTeam.findByPk(userteam_id)

        if (!userteam) throw new Error('No existe esta solicitud');

        const success = await userteam.update({
            userteamrequest_id
        },{transaction});

        if (!success) throw new Error('Error al responder la solicitud');

        await transaction.commit();

        await success.reload();

        return res.json({
            status: 200,
            data: [],
            message: `Solicitud respondida con éxito`
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