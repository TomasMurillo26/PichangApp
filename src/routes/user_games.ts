import { Router } from 'express';
import { 
    getAll, 
    getOne, 
    post } from '../controllers/user-games-controllers';
import { 
    game_id,
    usergameExist
} from '../middlewares/validations/user_games-validations';
import validateError from '../middlewares/validations/error-handler';
import { verifyToken, checkRole } from '../middlewares/session';

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
        verifyToken,
        checkRole(['Jugador']),
        game_id,
        validateError
    ],
    post);

export default router;