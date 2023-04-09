import { Router } from "express";
import { getAll, getOne, post, update, deleteOne } from "../controllers/party-controllers";

const router = Router();

// Get allpartys
router.get('/', getAll);

// Get one party
router.get('/:id', getOne);

// Post party
router.post('/', post);

// Update party
router.put('/:id', update);

// Delete party
router.delete('/:id', deleteOne);


export { router };