import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.handle";
import { JwtPayload } from "jsonwebtoken";

interface RequestExt extends Request{
    user?: string | JwtPayload;
}

const checkJwt = (req: RequestExt, res: Response, next: NextFunction) => { 
    try {

        const jwtByUser = req.headers.authorization || "";
        const jwt = jwtByUser.split(" ").pop();
        const isUser = verifyToken(`${jwt}`);

        if(!isUser){
            return res.status(403).json({
                status: 403,
                message: 'Token Expirado',
            });
        } else {
            req.user = isUser;
            return next();
        }
    } catch(e) {
        return res.status(401).json({
            status: 401,
            message: 'Token no valido',
        });
    }
};

function checkRole(role: [string]) {
        return function (req: any, res: Response, next: NextFunction) {
        const { user } = req;
        console.log(user);
        // console.log(user.roles);
        for (let i = 0; i < user.roles.length; i++) {
            if (role.includes(user.roles[i].role)) {
                return next();
            }
        }
        return res.status(401).json({
        status: 401,
        message: 'El usuario no tiene el rol necesario',
        });
    };
}



export { checkJwt, checkRole };