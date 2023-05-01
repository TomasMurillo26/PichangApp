import Validations from "./base-validations";
import { Op } from "sequelize";

import Friend from "../../models/friends-model";
import User from "../../models/users-model";

const friend_id = Validations.relationExist(
    'friend_id',
    'Este campo es requerido',
    true,
    User
).custom(async (value: number) => {
    // const id = req.params?.id;
    const exist = await Friend.findOne(
        { 
            where: 
            { 
                [Op.and]: 
                [
                    // { user_id },
                    { friend_id: value },

                ]
            } 
        });
    if (exist) {
    throw Error('Ya tienes agregado a este amigo');
    }
});

const friendExist = Validations.existInDB(Friend);

export { friend_id, friendExist }


