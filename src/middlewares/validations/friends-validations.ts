import Validations from "./base-validations";
import { Op } from "sequelize";

import Friend from "../../models/friends-model";
import User from "../../models/users-model";

const nickname = Validations.string(
    'nickname',
    'Este campo es requerido',
    true
).custom(async (value: string, { req }) => {
    const user = await User.findOne({
        where: {
            nickname: value
        }
    });

    if (!user) {
        throw Error('No existe un jugador con este nick.');
    }

    const exist = await Friend.findOne(
        { 
            where: 
            { 
                [Op.and]: 
                [
                    { user_id: req.user.id },
                    { friend_id: user.id },
                ]
            } 
        });

    if (exist) {
    throw Error('Ya tienes agregado a este jugador');
    }
});

const friendExist = Validations.existInDB(Friend);

export { nickname, friendExist }


