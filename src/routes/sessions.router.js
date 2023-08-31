import { Router } from "express";

import passport from "passport";

import {
		login,
		register,
		logout,
		github,
		githubCallback,
} from '../controllers/sessions.controller.js';

const router = Router();




router.post('/login', passport.authenticate('login'), login);
router.post('/register', passport.authenticate('register'), register);
router.get('/github', passport.authenticate('github'), github);
router.get('/githubCallback', passport.authenticate('github'), githubCallback);
router.post('/logout', logout);

export default router;