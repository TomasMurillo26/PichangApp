import { Router } from "express";
import { 
    nickname,
    friendExist
} from '../middlewares/validations/friends-validations';
import { getAll, getOne, post, put, toggleActivated  
} from "../controllers/friends-controllers";
import validateError from '../middlewares/validations/error-handler';
import { verifyToken, checkRole } from '../middlewares/session';

const router = Router();

router.get(
    '/',
    [verifyToken],
    getAll
);

router.get(
    '/:id', 
    [
        // Validaciones
        friendExist,
        validateError
    ],
    getOne
);

router.post(
    '/', 
    [
        verifyToken,
        checkRole(['Jugador']),
        // Validaciones
        nickname,
        validateError
    ],
    post
);

router.put(
    '/:id',
    [
        verifyToken,
        checkRole(['Jugador']),
        // Validaciones
        nickname,
        friendExist,
        validateError
    ],
    put
);

router.put(
    '/toggle/:id',
    [
        verifyToken,
        checkRole(['Jugador']),
        // Validaciones
        friendExist,
        validateError
    ], 
    toggleActivated
);

export default router;