import { Request, Response } from 'express';
import { generateToken } from "../utils/jwt.handle";
import { verified } from "../utils/bcrypt.handle";
import User from '../models/users-model';
import Role from '../models/roles-model';

export const loginUser = async (req: Request, res: Response) => {
    try{
        const { password, email } = req.body as User;
        let userDB:any = [];

        const user = await User.findOne({
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            where: { email },
            include: [{
                model: Role,
                as: 'roles',
                through: {attributes: []},
                attributes: { exclude: ['createdAt', 'updatedAt'] },
            }]
        });

        if (!user) {
            return res.status(401).json({
                status: 401,
                data: {},
                message: 'Usuario o contraseña incorrectos',
            });
        }

        const passwordHash = user.password;

        const isCorrect = await verified(password, passwordHash);

        // Incorrect Password
        if (!isCorrect) {
            return res.status(401).json({
            status: 401,
            data: {},
            message: 'Usuario o contraseña incorrectos',
            });
        }

        userDB.push(user);

        const token = await generateToken(userDB);
        const data = {
            token,
            user:user
        };

        return res.json({
            status: 200,
            data: data,
            message: 'Usuario Logueado con éxito',
        })
    }catch{

        return res.status(500).json({
            status: 500,
            data: {},
            message: 'Error General',
        });
    }
};

