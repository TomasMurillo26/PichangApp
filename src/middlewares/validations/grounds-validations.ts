import Validations from "./base-validations";
import { Op } from "sequelize";

import GroundType from "../../models/groundtypes-model";
import Ground from "../../models/grounds-model";
import Commune from "../../models/communes-model";

const name = Validations.string('name', 'Este campo es requerido', true)
    .trim()
    .isAlpha("es-ES", { ignore: " " })
    .withMessage("El campo solo puede contener letras")
    .notEmpty()
    .isLength({ max: 50 })
    .bail()
    .withMessage("Al menos 3 letras son requeridas y máximo 50 caracteres")
    .custom(async (value) => {
        const exist = await Ground.findOne({ where: { name: value } });
        if (exist) {
        throw Error('Una cancha con este nombre ya está registrada');
        }
    });

const name_unique = Validations.string('name', 'Este campo es requerido', true).trim()
    .notEmpty()
    .isLength({ max: 50 })
    .bail()
    .custom(async (value: string, { req }) => {
        const id = req.params?.id;
        const ground = await Ground.findOne({
        where: {
            ...(id && { id: { [Op.ne]: id } }),
            name: { [Op.like]: value },
        },
    });
    if (ground) throw new Error('Ya existe una cancha con este nombre');
});

const groundExist = Validations.existInDB(Ground);

const groundtype_id = Validations.relationExist(
    'groundtype_id', 
    'Se requiere un tipo de cancha', 
    true, 
    GroundType
);

const commune_id = Validations.relationExist(
    'commune_id', 
    'Se requiere una comuna', 
    true, 
    Commune
);

const latitude = Validations.isNumeric(
    'latitude', 
    'Es necesario ingresar una latitud', 
    true
);
const longitude = Validations.isNumeric(
    'longitude', 
    'Es necesario ingresar una longitud', 
    true
);

export { 
    groundExist, 
    groundtype_id, 
    commune_id, 
    name, 
    name_unique, 
    latitude, 
    longitude }


