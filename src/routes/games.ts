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
} from '../middlewares/validations/games-validations';
import { enterGame, getAll, getOne, leaveGame, post, put  } from "../controllers/games-controllers";
import validateError from '../middlewares/validations/error-handler';
import { verifyToken, checkRole } from '../middlewares/session';

const router = Router();

router.get(
    '/',
    [],
    getAll
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

export default router;