import { Router } from "express";
import { 
    name, 
    gametypesExist,
    name_unique
} from '../middlewares/validations/gametypes-validations';
import { 
    getAll, 
    getOne, 
    post, 
    put 
} from "../controllers/gametypes-controllers";
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
        gametypesExist,
        validateError
    ],
    getOne
);

router.post(
    '/', 
    [
        verifyToken,
        checkRole(['Super Administrador']),
        // Validaciones
        name,
        validateError
    ],
    post
);

router.put(
    '/:id',
    [
        verifyToken,
        //Validaciones
        name_unique,
        gametypesExist,
        validateError
    ],
    put
);

export default router;