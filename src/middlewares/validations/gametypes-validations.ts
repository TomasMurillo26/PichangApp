import Validations from "./base-validations";
import GameType from "../../models/gametypes-model";
import { Op } from "sequelize";

const name = Validations.string('name', 'Este campo es requerido', true)
    .trim()
    .isAlpha("es-ES", { ignore: " " })
    .withMessage("El campo solo puede contener letras")
    .notEmpty()
    .isLength({ max: 50 })
    .bail()
    .withMessage("Al menos 3 letras son requeridas y máximo 50 caracteres")
    .custom(async (value) => {
        const exist = await GameType.findOne({ where: { name: value } });
        if (exist) {
        throw Error('Un tipo de partido con este nombre ya está registrado');
        }
    });

const name_unique = Validations.string('name', 'Este campo es requerido', true).trim()
    .notEmpty()
    .isLength({ max: 50 })
    .bail()
    .custom(async (value: string, { req }) => {
        const id = req.params?.id;
        const gametype = await GameType.findOne({
        where: {
            ...(id && { id: { [Op.ne]: id } }),
            name: { [Op.like]: value },
        },
    });
    if (gametype) throw new Error('Ya existe un tipo de partido con este nombre');
});

const gametypesExist = Validations.existInDB(GameType);


export { gametypesExist, name, name_unique }


