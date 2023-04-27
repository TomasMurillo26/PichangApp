import { Router } from "express";
import { getAll, getOne, post, put } from "../controllers/roles-controllers";

const router = Router();

router.get('/', getAll);
router.get('/:id', getOne);
router.post('/', post);
router.put('/:id', put);

export default router;