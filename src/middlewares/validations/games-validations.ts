import Validations from './base-validations';
// import { Op } from 'sequelize';
import moment from 'moment';

import Sport from '../../models/sports-model';
import Game from '../../models/games-model';
import Ground from '../../models/grounds-model';
import GameType from '../../models/gametypes-model';
// import User from '../../models/users-model';

const address = Validations.string('address', 'Este campo es requerido', true)
    .trim()
    .notEmpty()
    .isLength({ max: 150 })
    .bail()
    .withMessage("Al menos 3 letras son requeridas y máximo 150 caracteres");

const num_players = Validations.isPositiveNumeric(
    'num_players', 
    'Es requerido un número de jugadores',
    true
);

const latitude = Validations.isNumeric('latitude', 'Es necesaria la latitud', true);
const longitude = Validations.isNumeric('longitude', 'Es necesaria la longitud', true);

const date = Validations.string('date', 'Es requerida una fecha', true)
    .isDate({ format: 'YYYY-MM-DD', strictMode: true, delimiters: ['-'] })
    .withMessage('La fecha no tiene el formato adecuado.')
    .custom((value) => {
    const now = moment(moment().format('YYYY-MM-DD'));
    const expDate = moment(value);
    if (now >= expDate) throw new Error('La fecha del partido debe ser igual o superior a la actual.');
    return true;
});

const start_hour = Validations.string('start_hour', 'Es necesario ingresar una hora de inicio', true)
    .custom((value) => {
        const now = moment();
        const expTime = moment(value, "HH:mm");
        if (!expTime.isValid()) {
            throw new Error('La hora no tiene el formato adecuado.');
        }
        if (now.isAfter(expTime)) {
            throw new Error('La hora debe ser igual o posterior a la actual.');
        }
        return true;
});

const end_hour = Validations.string('end_hour', 'Es necesario ingresar una hora de fin', true)
    .custom((value: string, { req }) => {
    const start = moment(req.body.start_hour, "HH:mm");
    const end = moment(value, "HH:mm");
    if (!end.isValid()) {
        throw new Error('La hora de término no tiene el formato adecuado.');
    }
    if (end.isBefore(start)) {
        throw new Error('La hora de término debe ser posterior a la hora de inicio.');
    }
    return true;
});

const gameExist = Validations.existInDB(Game);

const sport_id = Validations.relationExist(
    'sport_id',
    'Es requerido un deporte',
    true,
    Sport
);

const ground_id = Validations.relationExist(
    'ground_id',
    'Es requerida una cancha',
    true,
    Ground
);

const gametype_id = Validations.relationExist(
    'gametype_id',
    'Es requerido un tipo de partido',
    true,
    GameType
);

//FALTA VALIDAR LA CANTIDAD DE PARTIDOS QUE UN JUGADOR PUEDE CREAR.

export { 
    gameExist,
    start_hour,
    end_hour,
    date,
    num_players,
    latitude,
    longitude,
    sport_id,
    ground_id,
    gametype_id,
    address,
}


