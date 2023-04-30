import { Request, Response, NextFunction } from "express";
import { TokenExpiredError, verify } from 'jsonwebtoken';
import User from "../models/users-model";

const JWT_SECRET = process.env.JWT_SECRET || 'token.010101';

// Verificar el token del usuario
const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            status: 401,
            message: 'No se ha proporcionado un token de autenticación',
        });
    }else{
        verify(token, JWT_SECRET, async (err, decoded?: any) => {
        if (err) {
            if (err instanceof TokenExpiredError) {
            return res.status(403).json({
                status: 403,
                message: 'Token Expirado',
            });
            }

            return res.status(401).json({
            status: 401,
            message: 'Token no valido',
            });
        }
        req.user = decoded.user;

        const user = await User.findOne({
            where: { id: decoded.user.id, activated: true },
        });

        if (!user) {
            return res.status(403).json({
            status: 403,
            message: 'El usuario no se encuentra activo',
            });
        }

        return next();
        });
        return;
    }
};


// Verificar roles de usuario
function checkRole(role: any) {
        return function (req: any, res: Response, next: NextFunction) {
        const { user } = req;
        
        for (let i = 0; i < user.roles.length; i++) {
            if (role.includes(user.roles[i].name)) {
                return next();
            }
        }
        return res.status(401).json({
            status: 401,
            message: 'El usuario no tiene el rol necesario',
        });
    };
}

export { verifyToken, checkRole };