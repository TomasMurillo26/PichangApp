import { Router } from "express";
import { getAll } from "../controllers/order-controllers";
import { checkJwt } from "../middlewares/session";

const router = Router();

router.get('/', checkJwt, getAll)

export { router };