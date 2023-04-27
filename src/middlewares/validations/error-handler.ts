import { Request, Response, NextFunction } from 'express';
import { validationResult, Result } from 'express-validator';


const validateError = async (req: Request, res: Response, next: NextFunction) => {
    const result: Result = validationResult(req);
    const errors = result.array();

    if (errors.length <= 0) {
        return next();
    }else{
        let list = [];
        for(const err of errors){
            list.push(err.msg)
        }

        return res.status(422).json({
            status: 422,
            data: list,
            message: 'Error en la validación de datos.',
        });
    }
};

export default validateError;