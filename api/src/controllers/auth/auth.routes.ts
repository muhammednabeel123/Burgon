import { Router } from 'express';
import { Container } from 'typedi';
import { AuthController } from './auth.controller';

let router = Router();
let authController = Container.get(AuthController);

router.post('/login',    authController.login);
router.post('/register', authController.register);

export default router;
