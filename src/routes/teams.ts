import { Router } from 'express';
import { 
    changeCaptain,
    selectPosition,
    getAll, 
    getOne, 
    post, 
    put, 
    respondRequest, 
    sendTeamrequest, 
    toggleActivated
} from '../controllers/teams-controllers';
import { 
    teamExist, 
    name, 
    name_unique, 
    sport_id,
    userteamrequest_id,
    userteam_id,
    user_id,
    position_id
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

router.put('/toggle/:id',
    [
        verifyToken,
        checkRole(['Jugador']),
        teamExist,
        validateError
    ],
    toggleActivated);

router.put('/changecaptain/:id',
    [
        verifyToken,
        checkRole(['Jugador']),
        teamExist,
        userteam_id,
        validateError
    ],
    changeCaptain);

router.put('/respondrequest',
    [
        verifyToken,
        checkRole(['Jugador']),
        userteam_id,
        userteamrequest_id,
        validateError
    ],
    respondRequest);

router.post('/teamrequest/:id',
    [
        verifyToken,
        checkRole(['Jugador']),
        teamExist,
        user_id,
        validateError
    ],
    sendTeamrequest);

router.put('/selectposition',
    [
        verifyToken,
        checkRole(['Jugador']),
        position_id,
        userteam_id,
        validateError
    ],
    selectPosition);

router.put('/:id',
    [
        verifyToken,
        checkRole(['Jugador']),
        name_unique,
        teamExist,
        validateError
    ],
    put);

export default router;