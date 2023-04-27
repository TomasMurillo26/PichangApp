import { Router } from "express";
import { 
    address,
    latitude,
    longitude,
    sport_id,
    ground_id,
    gametype_id,
    date,
    num_players,
    start_hour,
    end_hour,
    gameExist,
} from '../middlewares/validations/games-validations';
import { getAll, getOne, post, put  } from "../controllers/games-controllers";
import validateError from '../middlewares/validations/error-handler';
import { checkJwt } from '../middlewares/session';

const router = Router();

router.get(
    '/',
    [],
    getAll
);

router.get(
    '/:id', 
    [
        gameExist,
        validateError
    ],
    getOne
);

router.post(
    '/', 
    [
        checkJwt,
        //Validaciones
        address,
        latitude,
        longitude,
        sport_id,
        ground_id,
        gametype_id,
        date,
        num_players,
        start_hour,
        end_hour,
        validateError
    ],
    post
);

router.put(
    '/:id',
    [
        checkJwt,
        //Validaciones
        start_hour,
        end_hour,
        date,
        num_players,
        gameExist,
        validateError
    ],
    put
);

export default router;