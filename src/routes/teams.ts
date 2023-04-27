import { Router } from 'express';
import { getAll, getOne, post, put, toggleActivated } from '../controllers/teams-controllers';
import { 
    name,
    name_unique,
    sport_id,
    createduser_id,
    teamExist
} from '../middlewares/validations/teams-validations';
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
        teamExist,
        validateError
    ],
    getOne);

router.post('/',
    [
        checkJwt,
        // checkRole(['Jugador']),
        name,
        sport_id,
        createduser_id,
        validateError
    ],
    post);

router.put('/:id',
    [
        checkJwt,
        // checkRole(['Jugador']),
        name_unique,
        teamExist,
        validateError
    ],
    put);

router.put('/toggle/:id',
    [
        checkJwt,
        // checkRole(['Jugador']),
        teamExist,
        validateError
    ],
    toggleActivated);

export default router;