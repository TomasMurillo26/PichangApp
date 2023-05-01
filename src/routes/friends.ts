import { Router } from "express";
import { 
    friend_id,
    friendExist
} from '../middlewares/validations/friends-validations';
import { getAll, getOne, post, put, toggleActivated  } from "../controllers/friends-controllers";
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
        friend_id,
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
        friend_id,
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