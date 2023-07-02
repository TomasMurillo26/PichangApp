import Validations from './base-validations';
import { buildCheckFunction } from 'express-validator';
import { Op } from 'sequelize';
import moment from 'moment';

import Sport from '../../models/sports-model';
import Game from '../../models/games-model';
import Ground from '../../models/grounds-model';
import GameType from '../../models/gametypes-model';
// import User from '../../models/users-model';

const paramAndQuery = buildCheckFunction(['query', 'body', 'params']);

const address = Validations.string('address', 'Este campo es requerido', true)
    .trim()
    .notEmpty()
    .isLength({ max: 150 })
    .bail()
    .withMessage("Al menos 3 letras son requeridas y máximo 150 caracteres");

const num_players = Validations.isPositiveNumeric(
    'num_players', 
    'Es requerido un número de jugadores',
    false
).custom(async(value: number, {req}) => {
    const { sport_id, gametype_id } = req.body;
    const sport = await Sport.findByPk(sport_id);

    if(!sport) throw new Error(`No existe este deporte`);

    if(gametype_id === 2){
        if(value < sport.min_players) throw new Error(`La cantidad de jugadores debe ser mayor que ${sport.min_players}`);

        if(value > sport.max_players) throw new Error(`La cantidad de jugadores debe ser menor que ${sport.max_players}`);
    
        return true;
    }else{
        return true;
    }
});

//-------------------------------------------------
const requiredByGametype = async (
    field: string,
    value: any,
    gametype_id: any,
) => {
    if (!gametype_id) throw new Error('Es necesario ingresar el tipo de partido primero');

    let body = await GameType.findByPk(gametype_id, {
        raw: true,
    });

    if (!body) throw new Error('El tipo de partido no existe');

    const gametype = body.id;

    type RequiredParams = {
        [key: number]: string[];
    }

    const requiredParams: RequiredParams = {
        // Formal
        1: [],
        // Informal
        2: ['num_players'],
    };

    const required = requiredParams[gametype].includes(field);

    if (!required) return;

    if (required && !value) {
        throw new Error('Este campo es requerido para este tipo de partido');
    }
};

const numplayers_required = paramAndQuery('num_players')
.custom(async (value, { req }) => requiredByGametype(
'num_players',
value,
req.body.gametype_id,
));


//-------------------------------------------------

const latitude = Validations.isNumeric('latitude', 'Es necesaria la latitud', true);
const longitude = Validations.isNumeric('longitude', 'Es necesaria la longitud', true);

const date = Validations.string('date', 'Es requerida una fecha', true)
    .isDate({ format: 'YYYY-MM-DD', strictMode: true, delimiters: ['-'] })
    .withMessage('La fecha no tiene el formato adecuado.')
    .custom((value) => {
    const now = moment(moment().format('YYYY-MM-DD'));

    const expDate = moment(value);

    if (now > expDate) throw new Error('La fecha del partido debe ser igual o superior a la actual.');
    return true;
});

const start_hour = Validations.string('start_hour', 'Es necesario ingresar una hora de inicio', true)
    .custom((value) => {
        const now = moment();
        const expTime = moment(value, "YYYY-MM-DD HH:mm");
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
    const start = moment(req.body.start_hour, "YYYY-MM-DD HH:mm");
    const end = moment(value, "YYYY-MM-DD HH:mm");
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

const createduser_id = paramAndQuery('createduser_id')
    .custom(async (value: number, { req }) => {
        const game = await Game.findOne({
            where: { 
                [Op.and]: [{ createduser_id: req.user.id },
                { [Op.or]: [{ gamestatus_id: 2 }, { gamestatus_id: 1 }]}],
            }
        });
        if (game && !value) {
            throw new Error('Ya tienes un partido creado');
        } else {
            return;
        }
});

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
    createduser_id,
    numplayers_required
}


