import { Request, Response, NextFunction } from 'express';
import { validationResult, Result } from 'express-validator';

const validateError = async (req: Request, res: Response, next: NextFunction) => {
    const result: Result = validationResult(req);
    const errors = result.array();
    const extractedErrors: { [key: string]: string} = {};
    let message: string = '';

    if (errors.length <= 0) {
        return next();
    }else{

        for(const err of errors){

            const key = err.path;

            extractedErrors[key] = err.msg;

            if (err.location === 'body') {
                message += err.msg;
            }
        }

        if (!message) {
            message =
                'Revisar los campos en color rojo e ingresarlos correctamente.';
        }

        return res.status(422).json({
            status: 422,
            data: extractedErrors,
            message: 'Error en la validación de datos.',
        });
    }
};

export default validateError;