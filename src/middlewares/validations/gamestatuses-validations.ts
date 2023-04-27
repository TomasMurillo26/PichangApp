import Validations from "./base-validations";
import GameStatus from "../../models/gamestatuses-model";
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
        const exist = await GameStatus.findOne({ where: { name: value } });
        if (exist) {
        throw Error('Un status con este nombre ya está registrado');
        }
    });

const name_unique = Validations.string('name', 'Este campo es requerido', true).trim()
    .notEmpty()
    .isLength({ max: 50 })
    .bail()
    .custom(async (value: string, { req }) => {
        const id = req.params?.id;
        const gamestatus = await GameStatus.findOne({
        where: {
            ...(id && { id: { [Op.ne]: id } }),
            name: { [Op.like]: value },
        },
    });
    if (gamestatus) throw new Error('Ya existe un status con este nombre');
});

const gamestatusExist = Validations.existInDB(GameStatus);


export { gamestatusExist, name, name_unique }


