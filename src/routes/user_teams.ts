import { Router } from 'express';
import { getAll, getOne, post, put } from '../controllers/user_teams-controllers';
import { 
    team_id,
    user_id,
    position_id,
    position_unique,
    userteamExist
} from '../middlewares/validations/user_teams-validations';
import validateError from '../middlewares/validations/error-handler';
import { checkJwt } from '../middlewares/session';

const router = Router();

router.get(
    '/',
    [], 
    getAll);

router.get(
    '/:id', 
    [
        userteamExist,
        validateError
    ],
    getOne);

router.post('/',
    [
        checkJwt,
        // checkRole(['Jugador']),
        user_id,
        position_id,
        team_id,
        validateError
    ],
    post);

router.put('/:id',
    [
        checkJwt,
        // checkRole(['Jugador']),
        position_unique,
        userteamExist,
        validateError
    ],
    put);

export default router;