import { Router } from "express";
import { 
    name, 
    positionExist,
    sport_id,
    name_unique
} from '../middlewares/validations/positions-validations';
import { getAll, getOne, post, put } from "../controllers/positions-controllers";
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
        positionExist,
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
        sport_id,
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
        positionExist,
        sport_id,
        validateError
    ],
    put
);

export default router;