import { Request, Response } from 'express';
import { verified } from "../utils/bcrypt.handle";
import User from '../models/users-model';
import Role from '../models/roles-model';
import { sign } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'token.010101';

export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    User.scope('withPassword')
        .findOne({
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            where: { email, activated: 1 },
            include: 
            {
                model: Role,
                as: 'roles',
                attributes: { exclude: ['createdAt', 'updatedAt'] },
            },
        })
        .then(async (userDB) => {
            const isCorrect = await verified(password, userDB?.password ?? '');
            if (!userDB) {
                return res.status(401).json({
                    status: 401,
                    data: {},
                    message: 'Usuario o contraseña incorrectos',
                });
            }
            if (!isCorrect) {
                return res.status(401).json({
                    status: 401,
                    data: {},
                    message: 'Usuario o contraseña incorrectos',
                });
            }
            
            const token = sign(
                {
                    user: userDB
                }, 
                    JWT_SECRET, {
                    expiresIn: '2h',
            });

            return res.status(200).json({
                    status: 200,
                    data: {userDB, token},
                    message: 'Usuario Logueado con Éxito',
                });
            })
        .catch((error) => {
            console.log(error);
            if (error) {
                return res.status(500).json({
                    status: 500,
                    data: {},
                    message: 'Error General',
                });
            }

            return res.status(500).json({
                status: 500,
                data: {},
                message: 'Error General',
            });
        });
};

