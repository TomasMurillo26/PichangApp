import { param, buildCheckFunction, ValidationChain } from 'express-validator';

const paramAndQuery = buildCheckFunction(["query", "body", "params"]);

const validations = {
    requiredField: (field: any, errorMsg: string, required = true): ValidationChain => {
        return required
            ? paramAndQuery(field, errorMsg).exists({ checkFalsy: true }).bail()
            : paramAndQuery(field, errorMsg).optional({
                nullable: true,
                checkFalsy: true,
            });
    },

    string: function(field: any, errorMsg: string, required?: boolean): ValidationChain {
        return this.requiredField(field, errorMsg, required)
            .isString()
            .bail()
            .trim()
            .isLength({ min: 2 })
            .withMessage("Se necesitan al menos 2 carácteres")
            .bail();
    },

    isAlphaString: function(field: any, errorMsg: string, required: boolean): ValidationChain {
        return this.string(field, errorMsg, required)
            .isAlpha("es-ES")
            .withMessage("El campo solo puede contener letras")
            .bail()
            .trim();
    },

    isNumeric: function(field: any, errorMsg: string, required: boolean): ValidationChain {
        return this.requiredField(field, errorMsg, required)
            .isNumeric()
            .withMessage("El valor debe ser numérico")
            .bail();
    },

    isPositiveNumeric: function(field: any, errorMsg: string, required: boolean): ValidationChain {
        return this.isNumeric(field, errorMsg, required)
            .withMessage("El valor debe ser numérico")
            .bail()
            .custom((value: number) => value > 0)
            .withMessage("El valor debe ser igual o mayor a 1");
    },

    existInDB: function(Model: any): ValidationChain {
        return param("id", "Se debe proveer un id")
            .isNumeric()
            .withMessage("El id debe ser un número")
            .bail()
            .custom(async (value) => {
                const query = await Model.findByPk(value);
                if (!query) throw new Error("El elemento solicitado no existe");
            })
            .bail();
    },

    existDBBody: function(Model: any, field: any): ValidationChain {
        return paramAndQuery(field, "Se debe proveer un id")
            .isNumeric()
            .withMessage("El id debe ser un número")
            .bail()
            .custom(async (value) => {
                const query = await Model.findByPk(value);
                if (!query) throw new Error("El elemento solicitado no existe");
            })
            .bail();
    },

    relationExist: function(field: any, errorMsg: string, required: boolean, Model: any): ValidationChain {
        return this.isNumeric(field, errorMsg, required)
            .custom(async (value: number) => {
                const query = await Model.findByPk(value);
                if (!query) throw new Error("El elemento solicitado no existe");
            })
            .bail();
    },

    array: function(field: any, errorMsg: string, required: boolean): ValidationChain {
        return this.requiredField(field, errorMsg, required)
            .isArray({ min: 1 })
            .withMessage("Se debe ingresar al menos 1 elemento")
            .bail();
        }
}

export default validations;
