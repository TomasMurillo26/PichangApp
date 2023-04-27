import { Router } from "express";
import { 
    name, 
    min_players,
    max_players,
    sportExist,
    name_unique
} from '../middlewares/validations/sports-validations';
import { getAll, getOne, post, put, toggleActivated  } from "../controllers/sports-controllers";
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
        sportExist,
        validateError
    ],
    getOne
);

router.post(
    '/', 
    [
        checkJwt,
        //Validaciones
        name,
        min_players,
        max_players,
        validateError
    ],
    post
);

router.put(
    '/:id',
    [
        checkJwt,
        //Validaciones
        name_unique,
        min_players,
        max_players,
        sportExist,
        validateError
    ],
    put
);

router.put(
    '/toggle/:id',
    [
        checkJwt,
        sportExist,
        validateError
    ], 
    toggleActivated
);

export default router;