import { Router } from 'express';
import { 
    getAll,
    getOne, 
    post, 
    put, 
    toggleActivated 
} from '../controllers/users-controllers';
import { 
    email,
    nickname, 
    password, 
    role_id, 
    userExist, 
    name, 
    birthday,
    nickname_unique
} from '../middlewares/validations/users-validations';
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
        userExist,
        validateError
    ],
    getOne);
router.post('/',
    [
        checkJwt,
        // checkRole(['Super Administrador']),
        // Validaciones
        email,
        role_id,
        password,
        name,
        nickname,
        birthday,
        validateError
    ],
    post);

router.put('/:id',
    [
        checkJwt,
        // checkRole(['Jugador']),
        // Validaciones
        nickname_unique,
        birthday,
        validateError
    ],
    put);

router.put('/toggle/:id',
    [
        checkJwt,
        // checkRole(['Super Administrador']),
        // Validaciones
        userExist,
        validateError
    ],
    toggleActivated);

export default router;