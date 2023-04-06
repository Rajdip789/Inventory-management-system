const db = require('../db/conn.js');
const jwt = require('jsonwebtoken');
const uniqid = require("uniqid")
const fs = require("fs")
const path = require("path")

class Product {
	constructor() {
		//console.log('Product object initialized');
	}

	getProducts = (req, res) => {
		try {
			let d = jwt.decode(req.cookies.accessToken, { complete: true });
			let email = d.payload.email;
			let role = d.payload.role;

			new Promise((resolve, reject) => {

				let tsa = ""
				if (req.body.search_value != "") {
					tsa = `WHERE name LIKE "%${req.body.search_value}%" OR description LIKE "%${req.body.search_value}%"`
				}

				let tso = ""
				if ((req.body.sort_column != "") && (req.body.sort_order != "")) {
					tso = `ORDER BY ${req.body.sort_column} ${req.body.sort_order}`
				}

				let q = "SELECT * FROM `products` " + tsa + tso + " LIMIT ?, 10"
				db.query(q, [req.body.start_value], (err, result) => {
					if (err) {
						return reject(err);
					}

					if (req.body.search_value != "") {
						return resolve({ operation: "success", message: 'search products got', info: { products: result, count: result.length } });
					}

					let q = "SELECT COUNT(*) AS val FROM `products`"
					db.query(q, (err, result2) => {
						if (err) {
							return reject(err);
						}
						// console.log(result2)
						resolve({ operation: "success", message: '10 products got', info: { products: result, count: result2[0].val } });
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

	getProductsSearch = (req, res) => {
		try {
			let d = jwt.decode(req.cookies.accessToken, { complete: true });
			let email = d.payload.email;
			let role = d.payload.role;

			new Promise((resolve, reject) => {
				let q = `SELECT * FROM products WHERE name LIKE '${req.body.search_value}%' LIMIT 10`
				db.query(q, (err, result) => {
					if (err) {
						return reject(err);
					}
					// console.log(result)
					resolve({ operation: "success", message: '10 products got', info: { products: result } });
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

	getProductsDetailsById = (req, res) => {
		try {
			let d = jwt.decode(req.cookies.accessToken, { complete: true });
			let email = d.payload.email;
			let role = d.payload.role;

			new Promise((resolve, reject) => {
				let q = `SELECT * FROM products WHERE product_id IN (?)`
				db.query(q, [req.body.product_id_list], (err, result) => {
					if (err) {
						return reject(err);
					}
					// console.log(result)
					resolve({ operation: "success", message: 'Success', info: { products: result } });
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
			let d = jwt.decode(req.cookies.accessToken, { complete: true });
			let email = d.payload.email;
			let role = d.payload.role;

			new Promise((resolve, reject) => {
				let q = "INSERT INTO `products`(`product_id`, `name`, `gender`, `size`, `material`, `category`, `description`, `product_stock`, `image`, `selling_price`, `purchase_price`) VALUES (?,?,?,?,?,?,?,?,?,?,?)"
				db.query(q, [uniqid(), req.body.name, req.body.gender, req.body.size, req.body.material, req.body.category, req.body.description, req.body.product_stock, req.body.f_name, req.body.selling_price, req.body.purchase_price], (err, result) => {
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

	updateProduct = (req, res) => {
		try {
			let d = jwt.decode(req.cookies.accessToken, { complete: true });
			let email = d.payload.email;
			let role = d.payload.role;

			new Promise((resolve, reject) => {
				let ts = ""
				if (req.body.f_name) {
					ts = `image="${req.body.f_name}",`
				}
				let q = "UPDATE `products` SET `name`=?,`gender`=?,`size`=?,`material`=?,`category`=?,`description`=?,`product_stock`=?," + ts + "`selling_price`=?,`purchase_price`=? WHERE product_id=?"
				db.query(q, [req.body.name, req.body.gender, req.body.size, req.body.material, req.body.category, req.body.description, req.body.product_stock, req.body.selling_price, req.body.purchase_price, req.body.product_id], (err, result) => {
					if (err) {
						return reject(err);
					}
					resolve({ operation: "success", message: 'Product updated successfully' });
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
			let d = jwt.decode(req.cookies.accessToken, { complete: true });
			let email = d.payload.email;
			let role = d.payload.role;

			new Promise((resolve, reject) => {
				let q = "SELECT * FROM `products` WHERE product_id = ?"
				db.query(q, [req.body.product_id], (err, result) => {
					if (err) {
						return reject(err);
					}

					let p
					if (result[0].image != null) {
						p = new Promise((res, rej) => {
							let pathToFile = path.resolve("./") + "/public/uploads/" + result[0].image
							//console.log(pathToFile)
							fs.unlink(pathToFile, function (ferr) {
								if (ferr) {
									rej(ferr);
								}
								res();
							})
						})
					}
					else {
						p = Promise.resolve();
					}

					p.then(() => {
						let q2 = "DELETE FROM `products` WHERE product_id = ?"
						db.query(q2, [req.body.product_id], (err2, result2) => {
							if (err2) {
								return reject(err2);
							}
							resolve({ operation: "success", message: 'product deleted successfully' });
						})
					})
						.catch((err3) => {
							reject(err3)
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

	deleteProductImage = (req, res) => {
		try {
			let d = jwt.decode(req.cookies.accessToken, { complete: true });
			let email = d.payload.email;
			let role = d.payload.role;

			new Promise((resolve, reject) => {
				let q = "SELECT * FROM `products` WHERE product_id = ?"
				db.query(q, [req.body.product_id], (err, result) => {
					if (err) {
						return reject(err);
					}

					let pathToFile = path.resolve("./") + "/public/uploads/" + result[0].image

					fs.unlink(pathToFile, function (err) {
						if (err) {
							return reject(err);
						}

						let q2 = "UPDATE `products` SET image = NULL WHERE product_id = ?"
						db.query(q2, [req.body.product_id], (err, result2) => {
							if (err) {
								return reject(err);
							}
							resolve({ operation: "success", message: 'product image deleted successfully' });
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