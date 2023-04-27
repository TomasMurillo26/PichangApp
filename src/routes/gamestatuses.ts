import { Router } from "express";
import { 
    name, 
    gamestatusExist,
    name_unique
} from '../middlewares/validations/gamestatuses-validations';
import { getAll, getOne, post, put } from "../controllers/gamestatuses-controllers";
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
        gamestatusExist,
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
        gamestatusExist,
        validateError
    ],
    put
);

export default router;