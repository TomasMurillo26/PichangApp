import Validations from "./base-validations";
import Sport from "../../models/sports-model";
import { Op } from "sequelize";

const name = Validations.string('name', 'Este campo es requerido', true)
    .trim()
    .isAlpha("es-ES", { ignore: " " })
    .withMessage("El campo solo puede contener letras")
    .notEmpty()
    .isLength({ max: 50 })
    .bail()
    .withMessage("Al menos 3 letras son requeridas y máximo 50 caracteres")
    .custom(async (value: string) => {
        const exist = await Sport.findOne({ where: { name: value } });
        if (exist) {
        throw Error('Un deporte con este nombre ya está registrado');
        }
    });

const name_unique = Validations.string('name', 'Este campo es requerido', true).trim()
    .notEmpty()
    .isLength({ max: 50 })
    .bail()
    .custom(async (value: string, { req }) => {
        const id = req.params?.id;
        const sport = await Sport.findOne({
        where: {
            ...(id && { id: { [Op.ne]: id } }),
            name: { [Op.like]: value },
        },
    });
    if (sport) throw new Error('Ya existe un deporte con este nombre');
});

const sportExist = Validations.existInDB(Sport);

const min_players = Validations.isPositiveNumeric(
    'min_players', 
    'Es necesario ingresar un mínimo de jugadores', 
    true
);

const max_players = Validations.isPositiveNumeric(
    'max_players', 
    'Es necesario ingresar un maximo de jugadores', 
    true
);

export { sportExist, name, min_players, max_players, name_unique }


