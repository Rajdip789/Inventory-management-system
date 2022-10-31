const db = require('../db/conn.js');
const jwt = require('jsonwebtoken');
const Cryptr = require('cryptr');
const cryptr = new Cryptr(process.env.CRYPTER_SEED);
const uniqid = require("uniqid")
const fs = require("fs")
const path = require("path")

class Product {
	constructor() {
		//console.log('Product object initialized');
	}

	getProducts = (req, res) => {
		try {
			let d = jwt.decode(req.headers.access_token, { complete: true });
			let email = d.payload.email;
			let role = d.payload.role;

			new Promise((resolve, reject) => {
				let q = "SELECT * FROM `products` ORDER BY name LIMIT ?, 10"
				db.query(q, [req.body.start_value], (err, result) => {
					if (err) {
						return reject(err);
					}
					let q = "SELECT COUNT(*) AS val FROM `products`"
					db.query(q, (err, result2) => {
						if (err) {
							return reject(err);							
						}
						// console.log(result2)
						resolve({ operation: "success", message: '10 products got', info: {products: result, count: result2[0].val} });
					})
				})
			})
			.then((value) => {
				res.send(value);
			})
			.catch((err) => {
				console.log(err);
				res.send({ operation: "error", message: 'Something went wrong' });
			})
		} catch (error) {
			console.log(error);
			res.send({ operation: "error", message: 'Something went wrong' });
		}
	}

	addProduct = (req, res) => {
		try {
			let d = jwt.decode(req.headers.access_token, { complete: true });
			let email = d.payload.email;
			let role = d.payload.role;

			new Promise((resolve, reject) => {
				let q = "INSERT INTO `products`(`product_id`, `name`, `gender`, `size`, `material`, `category`, `description`, `image`, `selling_price`, `purchase_price`) VALUES (?,?,?,?,?,?,?,?,?,?)"
				db.query(q, [uniqid(), req.body.name, req.body.gender, req.body.size, req.body.material, req.body.category, req.body.description, req.body.f_name, req.body.selling_price, req.body.purchase_price], (err, result) => {
					if (err) {
						return reject(err);
					}
					resolve({ operation: "success", message: 'Product added successfully' });
				})
			})
			.then((value) => {
				res.send(value);
			})
			.catch((err) => {
				console.log(err);
				res.send({ operation: "error", message: 'Something went wrong' });
			})
		} catch (error) {
			console.log(error);
			res.send({ operation: "error", message: 'Something went wrong' });
		}
	}

	deleteProduct = (req, res) => {
		try {
			let d = jwt.decode(req.headers.access_token, { complete: true });
			let email = d.payload.email;
			let role = d.payload.role;

			new Promise((resolve, reject) => {
				let q = "SELECT * FROM `products` WHERE product_id = ?"
				db.query(q, [req.body.product_id], (err, result) => {
					if (err) {
						return reject(err);
					}

					let pathToFile = path.resolve("./")+"/uploads/"+result[0].image
					// console.log(pathToFile)

					fs.unlink(pathToFile, function(err) {
						if (err) {
							return reject(err);
						}

						let q2 = "DELETE FROM `products` WHERE product_id = ?"
						db.query(q2, [req.body.product_id], (err, result2) => {
							if (err) {
								return reject(err);
							}
							resolve({ operation: "success", message: 'product deleted successfully'});
						})
					})
				})
			})
			.then((value) => {
				res.send(value);
			})
			.catch((err) => {
				console.log(err);
				res.send({ operation: "error", message: 'Something went wrong' });
			})
		} catch (error) {
			console.log(error);
			res.send({ operation: "error", message: 'Something went wrong' });
		}
	}
}

module.exports = Product;