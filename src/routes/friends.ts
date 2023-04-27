import { Router } from "express";
import { 
    friend_id,
    user_id,
    friendExist
} from '../middlewares/validations/friends-validations';
import { getAll, getOne, post, put, toggleActivated  } from "../controllers/friends-controllers";
import validateError from '../middlewares/validations/error-handler';
import { checkJwt } from '../middlewares/session';

const router = Router();

router.get(
    '/',
    [],
    getAll
);

router.get(
    '/:id', 
    [
        friendExist,
        validateError
    ],
    getOne
);

router.post(
    '/', 
    [
        checkJwt,
        //Validaciones
        user_id,
        friend_id,
        validateError
    ],
    post
);

router.put(
    '/:id',
    [
        checkJwt,
        //Validaciones
        user_id,
        friend_id,
        friendExist,
        validateError
    ],
    put
);

router.put(
    '/toggle/:id',
    [
        checkJwt,
        friendExist,
        validateError
    ], 
    toggleActivated
);

export default router;