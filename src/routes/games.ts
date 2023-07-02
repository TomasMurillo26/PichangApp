import { Router } from "express";
import { 
    // address,
    // latitude,
    // longitude,
    sport_id,
    ground_id,
    gametype_id,
    date,
    num_players,
    start_hour,
    end_hour,
    gameExist,
    createduser_id,
    numplayers_required,
} from '../middlewares/validations/games-validations';
import { enterGame, getAll, getOne, getUserGame, leaveGame, post, put, finishGame  } from "../controllers/games-controllers";
import validateError from '../middlewares/validations/error-handler';
import { verifyToken, checkRole } from '../middlewares/session';

const router = Router();

router.get(
    '/',
    [],
    getAll
);

router.get(
    '/user', 
    [
        verifyToken,
        checkRole(['Jugador']),
    ],
    getUserGame
);

router.get(
    '/:id', 
    [
        // Validaciones 
        gameExist,
        validateError
    ],
    getOne
);

router.post(
    '/', 
    [
        verifyToken,
        checkRole(['Jugador']),
        // Validaciones
        // address,
        // latitude,
        // longitude,
        sport_id,
        ground_id,
        gametype_id,
        date,
        num_players,
        numplayers_required,
        start_hour,
        end_hour,
        createduser_id,
        validateError
    ],
    post
);

router.post(
    '/:id', 
    [
        verifyToken,
        checkRole(['Jugador']),
        // Validaciones
        gameExist,
        validateError
    ],
    enterGame
);

router.put(
    '/:id',
    [
        verifyToken,
        checkRole(['Jugador']),
        // Validaciones
        start_hour,
        end_hour,
        gameExist,
        validateError
    ],
    put
);

router.delete(
    '/:id', 
    [
        verifyToken,
        checkRole(['Jugador']),
        // Validaciones
        gameExist,
        validateError
    ],
    leaveGame
);

router.put(
    '/finish/:id',
    [
        verifyToken,
        checkRole(['Jugador', 'Super Administrador']),
        // Validaciones
        gameExist,
        validateError
    ],
    finishGame
);

export default router;