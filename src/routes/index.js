import { Router } from 'express';
import authRoutes from './auth.routes.js';
import ideaRoutes from './idea.routes.js';
const router = Router();

router.use('/auth', authRoutes);
router.use('/idea', ideaRoutes);

export default router;
