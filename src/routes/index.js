import { Router } from 'express';
import authRouter from './auth.routes.js';
import ideaRouter from './idea.routes.js';
const router = Router();

router.post('auth', authRouter);
router.post('idea', ideaRouter);

export default router;
