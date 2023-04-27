import { Router } from "express";
import { 
    name, 
    gametypesExist,
    name_unique
} from '../middlewares/validations/gametypes-validations';
import { getAll, getOne, post, put } from "../controllers/gametypes-controllers";
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
        gametypesExist,
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
        gametypesExist,
        validateError
    ],
    put
);

export default router;