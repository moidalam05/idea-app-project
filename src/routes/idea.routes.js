import { Router } from 'express';
import {
	createIdea,
	deleteIdea,
	updateIdea,
	getAllIdeas,
	getIdeasByUser,
	getSingleIdea,
} from '../controllers/idea.controllers.js';
import isLoggedIn from '../middlewares/auth.middlewares.js';
const router = Router();

router.post('/', isLoggedIn, createIdea);
router.put('/:id', isLoggedIn, updateIdea);
router.delete('/:id', isLoggedIn, deleteIdea);
router.get('/all', getAllIdeas);
router.get('/user/:id', getIdeasByUser);
router.get('/:id', getSingleIdea);

export default router;
