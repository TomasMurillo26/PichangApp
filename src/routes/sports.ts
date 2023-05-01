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
        sportExist,
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
        min_players,
        max_players,
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
        verifyToken,
        checkRole(['Super Administrador']),
        // Validaciones
        sportExist,
        validateError
    ], 
    toggleActivated
);

export default router;