import { Request, Response, NextFunction } from 'express';
import { validationResult, Result } from 'express-validator';

const validateError = async (req: Request, res: Response, next: NextFunction) => {
    const result: Result = validationResult(req);

    if (result.isEmpty()) {
        return next();
    }else{

        const extractedErrors: { [key: string]: string} = {};
        let message: string = '';
        
        result.array().forEach((err) => {
            const key = err.path;

            extractedErrors[key] = err.msg;

            if (err.location === 'params') {
                message += err.msg;
            }
        })

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