import { Router } from "express";
import { 
    name, 
    groundtypesExist,
    name_unique
} from '../middlewares/validations/groundtypes-validations';
import { getAll, getOne, post, put } from "../controllers/groundtypes-controllers";
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
        groundtypesExist,
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
        groundtypesExist,
        validateError
    ],
    put
);

export default router;