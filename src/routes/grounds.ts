import { Router } from "express";
import { 
    name, 
    name_unique,
    groundtype_id,
    commune_id,
    groundExist
} from '../middlewares/validations/grounds-validations';
import { getAll, getOne, post, put } from "../controllers/grounds-controllers";
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
        groundExist,
        validateError
    ],
    getOne
);

router.post(
    '/', 
    [
        verifyToken,
        checkRole(['Super Administrador', 'Jugador']),
        // Validaciones
        name,
        groundtype_id,
        commune_id,
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
        groundtype_id,
        commune_id,
        groundExist,
        validateError
    ],
    put
);

export default router;