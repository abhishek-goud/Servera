import {Router} from 'express';
import * as userController from '../controllers/user.controller.js';
import * as authMiddleWare from "../middlewares/auth.middleware.js"
import { body } from 'express-validator';

const router = Router();

router.post('/register',
    body('email').isEmail().withMessage("Email must be a valid email address"),
    body('password').isLength({min: 3}).withMessage("Password must be atleast 6 characters long"),
    userController.createUserController
);

router.post('/login', 
    body('email').isEmail().withMessage("Email must be a valid email address"),
    body('password').isLength({min: 3}).withMessage("Password must be atleast 6 characters long"),
    userController.loginController
)

router.get('/profile', authMiddleWare.authUser, userController.profileController)

router.get('/logout', authMiddleWare.authUser, userController.logoutController)

router.get('/all', authMiddleWare.authUser, userController.getAllUsersController)

export default router;