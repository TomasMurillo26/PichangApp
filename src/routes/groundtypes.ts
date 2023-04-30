import { Router } from "express";
import { 
    name, 
    groundtypesExist,
    name_unique
} from '../middlewares/validations/groundtypes-validations';
import { getAll, getOne, post, put } from "../controllers/groundtypes-controllers";
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
        groundtypesExist,
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
        groundtypesExist,
        validateError
    ],
    put
);

export default router;