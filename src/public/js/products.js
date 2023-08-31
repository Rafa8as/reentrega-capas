const productsForm = document.querySelectorAll('.product-form');

productsForm.forEach((productForm) => {
	productForm.addEventListener('submit', (e) => {
		e.preventDefault();
		const cart = productForm.getAttribute('cart');
		const product = productForm.getAttribute('product');
		fetch(`/api/carts/${cart}/product/${product}`, {
			method: 'POST',
		})
			.then((res) => console.log(res))
			.catch((err) => console.log(err))
			.finally(alert('Added'));
	});
});