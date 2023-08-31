import { cartModel } from "../dao/mongo/models/cart.model.js";
import { productModel } from "../dao/mongo/models/product.model.js";

export const carts = async (req, res) =>{
    try{
        let result = await cartModel.find();
        return res.status(200).json ({status: 'success', payload: result});

    } catch (err) {
        return res.status(500).json ({error: err.message});
    }
};

export const cart = async (req, res) => {
    try{
        const {id} = req.params;
        let result = await cartModel.findById(id).populate('products._id');
        if (!result){
            return res.status(400).send(`no hay un carrito con el ID ${id}`);
        }
        return res.status(200).json ({status: 'success', payload: result})
    } catch (err) {
        return res.status(500).json ({error: err.message});
    }
};
export const createCart = async (req, res) => {
	try {
		const result = await cartModel.create({
			products: [],
		});

		return res.status(200).json({ status: 'success', payload: result });
	} catch (err) {
		return res.status(500).json({ error: err.message });
	}
};

export const addProduct = async (req, res) => {
	try {
		const { cid, pid } = req.params;
		const newProduct = await productModel.findById(pid);
		const cart = await cartModel.findById(cid);

		const productInCart = cart.products.find(
			(product) => product._id.toString() === newProduct.id
		);

		if (!productInCart) {
			const create = {
				$push: { products: { _id: newProduct.id, quantity: 1 } },
			};
			await cartModel.findByIdAndUpdate({ _id: cid }, create);

			const result = await cartModel.findById(cid);
			return res.status(200).json({ status: 'success', payload: result });
		}

		await cartModel.findByIdAndUpdate(
			{ _id: cid },
			{ $inc: { 'products.$[elem].quantity': 1 } },
			{ arrayFilters: [{ 'elem._id': newProduct.id }] }
		);

		const result = await cartModel.findById(cid);
		return res.status(200).json({ status: 'success', payload: result });
	} catch (err) {
		return res.status(500).json({ error: err.message });
	}
};

export const updateCart = async (req, res) => {
	try {
		const { cid } = req.params;
		let newCart = req.body;
		const cart = await cartModel.findById(cid);

		newCart.forEach(async (product) => {
			if (product.quantity < 1) {
				console.log(
					`Invalid value ${product.quantity} for quantity, new value was setted on 1`
				);
				product.quantity = 1;
			}

			const existProduct = await productModel.findById(product._id);
			if (existProduct && existProduct.stock > product.quantity) {
				const productInCart = cart.products.find(
					(productInCart) => productInCart.id === existProduct.id
				);

				if (!productInCart) {
					const create = {
						$push: {
							products: { _id: existProduct.id, quantity: product.quantity },
						},
					};
					await cartModel.findByIdAndUpdate({ _id: cid }, create);
				}

				await cartModel.findByIdAndUpdate(
					{ _id: cid },
					{ $set: { 'products.$[elem].quantity': product.quantity } },
					{ arrayFilters: [{ 'elem._id': existProduct.id }] }
				);
			}
		});

		const result = await cartModel.findById(cid);
		return res.status(200).json({ status: 'success', payload: result });
	} catch (err) {
		return res.status(500).json({ error: err.message });
	}
};

export const updateProduct = async (req, res) => {
	try {
		const { cid, pid } = req.params;
		let newQuantity = req.body.quantity;
		const product = await productModel.findById(pid);

		if (newQuantity > product.stock) {
			console.log(
				`Insufficient stock ${newQuantity} for product ${product._id}, max ${product.stock}`
			);
			newQuantity = product.stock;
		}

		await cartModel.findByIdAndUpdate(
			{ _id: cid },
			{ $set: { 'products.$[elem].quantity': newQuantity } },
			{ arrayFilters: [{ 'elem._id': pid }] }
		);

		const result = await cartModel.findById(cid);
		return res.status(200).json({ status: 'success', payload: result });
	} catch (err) {
		return res.status(500).json({ error: err.message });
	}
};

export const deleteCart = async (req, res) => {
	try {
		const { id } = req.params;
		await cartModel.findByIdAndUpdate(id, { products: [] });

		const result = await cartModel.find();
		return res.status(200).json({ status: 'success', payload: result });
	} catch (err) {
		return res.status(500).json({ error: err.message });
	}
};

export const deleteProduct = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        await cartModel.findByIdAndUpdate(cid, {
            $pull: { products: { _id: pid } },
        });

        const result = await cartModel.find();
        return res.status(200).json({ status: 'success', payload: result });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};