import Validations from "./base-validations";
import User from "../../models/users-model";
import { Op } from "sequelize";
import Role from "../../models/roles-model";

const name = Validations.string('name', 'Este campo es requerido', true)
    .trim()
    .isAlpha("es-ES", { ignore: " " })
    .withMessage("El campo solo puede contener letras")
    .notEmpty()
    .isLength({ min: 3, max: 25 })
    .bail()
    .withMessage("Al menos 3 letras son requeridas y máximo 25 caracteres");

const nickname_unique = Validations.string("nickname", "Este campo es requerido", true)
    .trim()
    .notEmpty()
    .isLength({ min: 3, max: 25 })
    .bail()
    .withMessage("Al menos 3 letras son requeridas y máximo 25 caracteres")
    .bail()
    .custom(async (value: string, { req }) => {
        const id = req.params?.id;
        const nickname = await User.findOne({
        where: {
            ...(id && { id: { [Op.ne]: id } }),
            nickname: { [Op.like]: value },
        },
    });
    if (nickname) throw new Error('Ya existe un usuario con este nickname');
});

const nickname = Validations.string("nickname", "Este campo es requerido", true)
    .trim()
    .notEmpty()
    .isLength({ min: 3, max: 25 })
    .bail()
    .withMessage("Al menos 3 letras son requeridas y máximo 25 caracteres")
    .bail()
    .custom(async (value: string) => {
        const exist = await User.findOne({ where: { nickname: value } });
        if (exist) {
        throw Error('Ya existe un usuario con este nickname');
        }
    });

const email = Validations.string("email", "Un Email es requerido.", true)
    .isEmail()
    .bail()
    .custom(async (value: string) => {
        const te = await User.findOne({ where: { email: value } });
        if (te) {
            throw Error("Un usuario con este email ya está registrado");
        }
    });

const birthday = Validations.string(
    "birthday", 
    "La fecha de nacimiento es requerida.",
    true)

const email_unique = Validations.string("email", "Un Email es requerido.", true)
    .isEmail()
    .bail()
    .custom(async (value: string, { req }) => {
        const id  = req.params?.id;
        const item = await User.findOne({
            where: {
                ...(id && { id: { [Op.ne]: id } }),
                email: { [Op.like]: value },
            },
        });
        if (item) throw new Error("Un usuario con este correo ya está registrado");
    });

// Auto generated
const password = Validations.string(
    "password",
    "El password requiere: minimo 6 caracteres, al menos 1 letra mayuscula, 1 minuscula y 1 número",
    true
).isStrongPassword({
    minLength: 6,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 0,
});

const userExist = Validations.existInDB(User);


const role_id = Validations.relationExist(
    "role_id", 
    "Es necesario un rol", 
    true, 
    Role
);

// const notAdmin = isNumeric("role_id.*")
//     .not()
//     .equals("1")
//     .withMessage("No se puede crear una cuenta de administrador")
//     .bail();

export {
    userExist, 
    role_id, 
    password, 
    email, 
    email_unique, 
    name, 
    nickname, 
    nickname_unique, 
    birthday }


