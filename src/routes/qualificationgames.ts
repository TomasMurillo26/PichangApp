import { Router } from 'express';
import { 
    getAll, 
    getOne, 
    post } from '../controllers/qualificationgames-controllers';
import { 
    qualificationgameExist,
    game_id
} from '../middlewares/validations/qualificationgames-validations';
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
        qualificationgameExist,
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