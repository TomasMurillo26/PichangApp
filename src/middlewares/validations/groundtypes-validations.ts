import Validations from "./base-validations";
import GroundType from "../../models/groundtypes-model";
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
        const exist = await GroundType.findOne({ where: { name: value } });
        if (exist) {
        throw Error('Un tipo de cancha con este nombre ya está registrado');
        }
    });

const name_unique = Validations.string('name', 'Este campo es requerido', true).trim()
    .notEmpty()
    .isLength({ max: 50 })
    .bail()
    .custom(async (value: string, { req }) => {
        const id = req.params?.id;
        const groundtype = await GroundType.findOne({
        where: {
            ...(id && { id: { [Op.ne]: id } }),
            name: { [Op.like]: value },
        },
    });
    if (groundtype) throw new Error('Ya existe un tipo de cancha con este nombre');
});

const groundtypesExist = Validations.existInDB(GroundType);


export { groundtypesExist, name, name_unique }


