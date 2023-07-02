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
    toggleActivated,
    deleteUserteam,
    getUserteamRequest
} from '../controllers/teams-controllers';
import { 
    teamExist, 
    name, 
    name_unique, 
    sport_id,
    userteamrequest_id,
    user_id,
    userteamExist,
    position_id
} from '../middlewares/validations/teams-validations';
import validateError from '../middlewares/validations/error-handler';
import { verifyToken, checkRole } from '../middlewares/session';

const router = Router();

router.get(
    '/',
    [verifyToken], 
    getAll);

router.get(
    '/getrequests',
    [verifyToken], 
    getUserteamRequest);

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

router.put('/changecaptain/:userteam_id',
    [
        verifyToken,
        checkRole(['Jugador']),
        userteamExist,
        validateError
    ],
    changeCaptain);

router.delete('/deleteuserteam/:userteam_id',
    [
        verifyToken,
        checkRole(['Jugador']),
        userteamExist,
        validateError
    ],
    deleteUserteam);

router.put('/respondrequest/:userteam_id',
    [
        verifyToken,
        checkRole(['Jugador']),
        userteamExist,
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

router.put('/selectposition/:userteam_id',
    [
        verifyToken,
        checkRole(['Jugador']),
        position_id,
        userteamExist,
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