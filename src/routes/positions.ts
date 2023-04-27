import { Router } from "express";
import { 
    name, 
    positionExist,
    sport_id,
    name_unique
} from '../middlewares/validations/positions-validations';
import { getAll, getOne, post, put } from "../controllers/positions-controllers";
import validateError from '../middlewares/validations/error-handler';
import { checkJwt } from '../middlewares/session';

const router = Router();

router.get(
    '/',
    [
        validateError
    ],
    getAll
);

router.get(
    '/:id', 
    [
        positionExist,
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
        sport_id,
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
        positionExist,
        sport_id,
        validateError
    ],
    put
);

export default router;