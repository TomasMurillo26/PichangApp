import Validations from "./base-validations";
import Position from "../../models/positions-model";
import { Op } from "sequelize";
import Sport from "../../models/sports-model";

const name = Validations.string('name', 'Este campo es requerido', true)
    .trim()
    .isAlpha("es-ES", { ignore: " " })
    .withMessage("El campo solo puede contener letras")
    .notEmpty()
    .isLength({ max: 50 })
    .bail()
    .withMessage("Al menos 3 letras son requeridas y máximo 50 caracteres")
    .custom(async (value: string) => {
        const exist = await Position.findOne({ where: { name: value } });
        if (exist) {
            throw Error('Una posición con este nombre ya está registrada');
        }
    });

const name_unique = Validations.string('name', 'Este campo es requerido', true).trim()
    .notEmpty()
    .isLength({ max: 50 })
    .bail()
    .custom(async (value: string, { req }) => {
        const id = req.params?.id;
        const sport = await Position.findOne({
        where: {
            ...(id && { id: { [Op.ne]: id } }),
            name: { [Op.like]: value },
        },
    });
    if (sport) throw new Error('Ya existe una posición con este nombre');
});

const positionExist = Validations.existInDB(Position);

const sport_id = Validations.relationExist(
    'sport_id', 
    'Es requerido un deporte', 
    true,
    Sport
);

export { positionExist, name, sport_id, name_unique }


