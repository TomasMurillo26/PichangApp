import { 
    // Request, 
    // Response, 
    Router } 
    from "express";
import { registerCtrl, loginCtrl } from "../controllers/auth-controllers";

const router = Router();

// **/auth/register
router.post('/register', registerCtrl);

// Update party
router.post('/login', loginCtrl);

export { router };