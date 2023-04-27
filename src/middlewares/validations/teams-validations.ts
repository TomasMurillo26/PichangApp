import Validations from "./base-validations";
import Team from "../../models/teams-model";
import { Op } from "sequelize";
import Sport from "../../models/sports-model";
import User from "../../models/users-model";

const name = Validations.string('name', 'Este campo es requerido', true)
    .trim()
    .isAlpha("es-ES", { ignore: " " })
    .withMessage("El campo solo puede contener letras")
    .notEmpty()
    .isLength({ max: 50 })
    .bail()
    .withMessage("Al menos 3 letras son requeridas y máximo 50 caracteres")
    .custom(async (value) => {
        const exist = await Team.findOne({ where: { name: value } });
        if (exist) {
        throw Error('Ya existe un equipo con este nombre');
        }
    });

const name_unique = Validations.string('name', 'Este campo es requerido', true)
    .trim()
    .isAlpha("es-ES", { ignore: " " })
    .withMessage("El campo solo puede contener letras")
    .notEmpty()
    .isLength({ max: 50 })
    .bail()
    .withMessage("Al menos 3 letras son requeridas y máximo 50 caracteres")
    .custom(async (value: string, { req }) => {
        const id = req.params?.id;
        const team = await Team.findOne({
        where: {
            ...(id && { id: { [Op.ne]: id } }),
            name: { [Op.like]: value },
        },
    });
    if (team) throw new Error('Ya existe un equipo con este nombre');
});

const teamExist = Validations.existInDB(Team);

const sport_id = Validations.relationExist(
    'sport_id',
    'Es requerido un deporte',
    true,
    Sport
);

const createduser_id = Validations.relationExist(
    'createduser_id',
    'Es requerido un usuario',
    true,
    User
    ).custom(async (value: number, { req }) => {
        const sport_id = req.body?.sport_id;
        const team = await Team.findOne({
        where: {
            ...(sport_id && { sport_id }),
            createduser_id: { value },
        },
    });
    if (team) throw new Error('Ya tienes un equipo para este deporte');
});

export { teamExist, name, name_unique, sport_id, createduser_id }


