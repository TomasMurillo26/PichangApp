import Validations from "./base-validations";
import Team from "../../models/teams-model";
import { Op } from "sequelize";
import Sport from "../../models/sports-model";
import UserTeam from "../../models/user_teams-model";
import User from "../../models/users-model";
import UserteamRequest from "../../models/userteamrequests-model";
import Position from "../../models/positions-model";

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
).custom(async (value: number, { req }) => {
        const team = await Team.findOne({
        where: {
            [Op.and]: [{sport_id: value},{createduser_id: req.user.id}]
        },
    });
    if (team) throw new Error('Ya tienes un equipo para este deporte');
});

const team_id = Validations.relationExist(
    'team_id', 
    'Es requerido un equipo', 
    true, 
    Team
);

const position_id = Validations.relationExist(
    'position_id',
    'Es requerida una posición',
    true,
    Position
    ).bail()
    .custom(async (value: number, { req }) => {
        const userteam_id  = req.body?.userteam_id;
        const userteam = await UserTeam.findByPk(userteam_id);

        const positionExist = await UserTeam.findOne({
            where: {[Op.and]:[
                {team_id: userteam?.team_id},
                {position_id: value}]
            }
        })

        if (positionExist) throw new Error("Un jugador del equipo tiene ocupada esta posición");
    });

const position_unique = Validations.isNumeric('position_id', "Una posición es requerida.", true)
    .isEmail()
    .bail()
    .custom(async (value: string, { req }) => {
        const id  = req.body?.userteam_id;
        const item = await UserTeam.findOne({
            where: {
                ...(id && { id: { [Op.ne]: id } }),
                position_id: { value },
            },
        });
        if (item) throw new Error("Un usuario con esta posición ya está registrado en el equipo");
    });


const user_id = Validations.relationExist(
    'user_id',
    'Un usuario es requerido.',
    true,
    User
);

const userteamrequest_id = Validations.relationExist(
    'userteamrequest_id',
    'Este campo es requerido',
    true,
    UserteamRequest
);

const userteam_id = Validations.relationExist(
    'userteam_id', 
    'Es requerido este campo.', 
    true, 
    UserTeam
);



export { 
    teamExist, 
    name, 
    name_unique, 
    sport_id,
    userteamrequest_id,
    userteam_id,
    user_id,
    team_id,
    position_unique,
    position_id
}


