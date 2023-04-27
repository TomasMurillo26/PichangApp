import { Op } from "sequelize";
import Validations from "./base-validations";
import User from "../../models/users-model";
import Team from "../../models/teams-model";
import Position from "../../models/positions-model";
import UserTeam from "../../models/user_teams-model";

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
        const team_id  = req.body?.team_id;
        const item = await UserTeam.findOne({
            where: {
                [Op.and]: 
                [
                    {position_id: value}, 
                    {team_id}
                ]
            },
        });
        if (item) throw new Error("Un jugador del equipo tiene ocupada esta posición");
    });

const position_unique = Validations.isNumeric('position_id', "Una posición es requerida.", true)
    .isEmail()
    .bail()
    .custom(async (value: string, { req }) => {
        const id  = req.params?.id;
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
    'Es requerido un usuario',
    true,
    User
);

const userteamExist = Validations.existInDB(UserTeam);

export { team_id, position_id, user_id, position_unique, userteamExist }


