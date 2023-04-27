import { Router } from "express";
import { loginUser } from "../controllers/auth-controllers";

const router = Router();

// Login
router.post('/', loginUser);

export default router;