import { Router } from "express";
import { 
    name, 
    gamestatusExist,
    name_unique
} from '../middlewares/validations/gamestatuses-validations';
import { getAll, getOne, post, put } from "../controllers/gamestatuses-controllers";
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
        gamestatusExist,
        validateError
    ],
    getOne
);

router.post(
    '/', 
    [
        verifyToken,
        checkRole(['Super Administrador']),
        //Validaciones
        name,
        validateError
    ],
    post
);

router.put(
    '/:id',
    [
        verifyToken,
        checkRole(['Super Administrador']),
        //Validaciones
        name_unique,
        gamestatusExist,
        validateError
    ],
    put
);

export default router;