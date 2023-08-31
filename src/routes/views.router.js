import {Router} from "express";

import {
	home,
	login,
	register,
	products,
	product,
	cart,
} from '../controllers/views.controller.js';

const router = Router ();

router.get ('/', home);
router.get ('/login', login);
router.get ('/register', register);
router.get ('/products', products);
router.get ('/product/:id', product);
router.get ('/cart/:id', cart);

export default router;
