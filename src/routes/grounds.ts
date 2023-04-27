import { Router } from "express";
import { 
    name, 
    name_unique,
    groundtype_id,
    commune_id,
    groundExist
} from '../middlewares/validations/grounds-validations';
import { getAll, getOne, post, put } from "../controllers/grounds-controllers";
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
        groundExist,
        validateError
    ],
    getOne
);

router.post(
    '/', 
    [
        checkJwt,
        //Validaciones
        name,
        groundtype_id,
        commune_id,
        validateError
    ],
    post
);

router.put(
    '/:id',
    [
        checkJwt,
        //Validaciones
        name_unique,
        groundtype_id,
        commune_id,
        groundExist,
        validateError
    ],
    put
);

export default router;