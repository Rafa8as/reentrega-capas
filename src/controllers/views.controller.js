import { productModel } from "../dao/mongo/models/product.model.js";
import { cartModel } from "../dao/mongo/models/cart.model.js";
import userCart from "../utils/cart.utils.js";

export const home = async (req,res) =>{
    try {
		if (!req.session.user) {
			return res.redirect('/login');
		}

		const cart = await userCart(req, res);

		return res.status(200).render('home', {
			header: true,
			user: req.session.user,
			cart,
			style: 'home.css',
			documentTitle: 'Home',
		});
	} catch (err) {
		return res.status(500).json({ error: err.message });
	}
};

export const login = async (req, res) => {
	try {
		if (req.session.user) {
			return res.redirect('/');
		}

		return res.status(200).render('login', {
			header: false,
			style: 'login.css',
			documentTitle: 'Login',
		});
	} catch (err) {
		return res.status(500).json({ error: err.message });
	}
};

export const register = async (req, res) => {
	try {
		if (req.session.user) {
			return res.redirect('/');
		}

		return res.status(200).render('register', {
			header: false,
			style: 'register.css',
			documentTitle: 'Register',
		});
	} catch (err) {
		return res.status(500).json({ error: err.message });
	}
};

export const products = async (req, res) => {
	try {
		if (!req.session.user) {
			return res.redirect('/login');
		}

		const cart = await userCart(req, res);
		let { limit, page, query, sort } = req.query;

		if (page == undefined || page == '' || page < 1 || isNaN(page)) {
			page = 1;
		}

		if (limit == undefined || limit == '' || limit <= 1 || isNaN(limit)) {
			limit = 10;
		}

		if (
			sort == undefined ||
			(sort !== 'asc' && sort !== 'desc') ||
			!isNaN(sort)
		) {
			sort = 'asc';
		}

		const filter = { category: query };
		const options = {
			page,
			limit,
			customLabels: {
				totalPages: 'totalPages',
				hasPrevPage: 'hasPrevPage',
				hasNextPage: 'hasNextPage',
				prevPage: 'prevPage',
				nextPage: 'nextPage',
				docs: 'data',
			},
			lean: true,
		};

		const products = await productModel.paginate({}, options);
		const filteredProducts = await productModel.paginate(filter, options);

		if (sort === 'asc') {
			filteredProducts.data.sort((a, b) => a.price - b.price);
			products.data.sort((a, b) => a.price - b.price);
		} else {
			filteredProducts.data.sort((a, b) => b.price - a.price);
			products.data.sort((a, b) => b.price - a.price);
		}

		if (products.data.length <= 0) {
			return res.status(400).send(`There's no products for this search`);
		}

		if (filteredProducts.data.length > 0) {
			return res.status(200).render('products', {
				status: 'success',
				header: true,
				payload: filteredProducts.data,
				user: req.session.user,
				page,
				limit,
				query,
				sort,
				cart,
				totalPages: filteredProducts.totalPages,
				hasPrevPage: filteredProducts.hasPrevPage,
				hasNextPage: filteredProducts.hasNextPage,
				prevPage: filteredProducts.prevPage,
				nextPage: filteredProducts.nextPage,
				documentTitle: 'Products',
				style: 'products.css',
			});
		}

		return res.status(200).render('products', {
			status: 'success',
			header: true,
			payload: products.data,
			user: req.session.user,
			page,
			limit,
			query,
			sort,
			cart,
			totalPages: products.totalPages,
			hasPrevPage: products.hasPrevPage,
			hasNextPage: products.hasNextPage,
			prevPage: products.prevPage,
			nextPage: products.nextPage,
			documentTitle: 'Products',
			style: 'products.css',
		});
	} catch (err) {
		return res.status(500).json({ error: err.message });
	}
};

export const product = async (req, res) => {
	try {
		if (!req.session.user) {
			return res.redirect('/login');
		}

		const cart = await userCart(req, res);
		const { id } = req.params;
		const product = await productModel.findById(id).lean();

		if (!product) {
			return res.status(400).send(`There's no products for this search`);
		}

		return res.status(200).render('product', {
			header: true,
			product,
			cart,
			style: 'product.css',
			documentTitle: 'Product',
		});
	} catch (err) {
		return res.status(500).json({ error: err.message });
	}
};

export const cart = async (req, res) => {
	try {
		if (!req.session.user) {
			return res.redirect('/login');
		}

		const { id } = req.params;
		const cart = await cartModel.findById(id).populate('products._id').lean();

		if (!cart) {
			return res.status(400).send(`Invalid cart ID ${id}`);
		}

		return res.status(200).render('cart', {
			header: true,
			cart: id,
			style: 'cart.css',
			documentTitle: 'Cart',
			helpers: {
				multiply(a, b) {
					return a * b;
				},
				total(items) {
					let total = 0;
					for (const item of items) {
						total += item._id.price * item.quantity;
					}
					return total;
				},
			},
			payload: cart.products,
		});
	} catch (err) {
		return res.status(500).json({ error: err.message });
	}
};

