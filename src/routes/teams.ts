import { Router } from 'express';
import { 
    getAll, 
    getOne, 
    post, 
    put, 
    toggleActivated } from '../controllers/teams-controllers';
import { 
    name,
    name_unique,
    sport_id,
    teamExist
} from '../middlewares/validations/teams-validations';
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
        teamExist,
        validateError
    ],
    getOne);

router.post('/',
    [
        verifyToken,
        checkRole(['Jugador']),
        name,
        sport_id,
        validateError
    ],
    post);

router.put('/:id',
    [
        verifyToken,
        checkRole(['Jugador']),
        name_unique,
        teamExist,
        validateError
    ],
    put);

router.put('/toggle/:id',
    [
        verifyToken,
        checkRole(['Jugador']),
        teamExist,
        validateError
    ],
    toggleActivated);

export default router;