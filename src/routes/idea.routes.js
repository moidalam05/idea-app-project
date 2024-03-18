import { Router } from 'express';
import {
	createIdea,
	deleteIdea,
	getIdea,
	getIdeas,
	updateIdea,
	getAllIdeas,
	getIdeasByUser,
	getSingleIdea,
} from '../controllers/idea.controllers.js';
import isLoggedIn from '../middlewares/isLoggedIn.js';
const router = Router();

router.post('/', isLoggedIn, createIdea);
router.get('/', isLoggedIn, getIdeas);
router.get('/:id', isLoggedIn, getIdea);
router.put('/:id', isLoggedIn, updateIdea);
router.delete('/:id', isLoggedIn, deleteIdea);
router.get('/all', isLoggedIn, getAllIdeas);
router.get('/user/:id', isLoggedIn, getIdeasByUser);
router.get('/:id', isLoggedIn, getSingleIdea);

export default router;
