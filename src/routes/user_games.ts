import { Router } from 'express';
import { 
    getAll, 
    getOne, 
    post } from '../controllers/user-games-controllers';
import { 
    usergameExist
} from '../middlewares/validations/user_games-validations';
import validateError from '../middlewares/validations/error-handler';
import { checkJwt, checkRole } from '../middlewares/session';

const router = Router();

router.get(
    '/',
    [], 
    getAll);

router.get(
    '/:id', 
    [
        usergameExist,
        validateError
    ],
    getOne);

router.post('/',
    [
        checkJwt,
        checkRole(['Jugador']),
        validateError
    ],
    post);

export default router;