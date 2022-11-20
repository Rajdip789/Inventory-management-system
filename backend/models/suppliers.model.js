const db = require('../db/conn.js');
const jwt = require('jsonwebtoken');
const uniqid = require("uniqid")

class Supplier {
	constructor() {
		//console.log('Customer object initialized');
	}

	getSuppliers = (req, res) => {
		try {
			let d = jwt.decode(req.headers.access_token, { complete: true });
			let email = d.payload.email;
			let role = d.payload.role;

			new Promise((resolve, reject) => {
				let q = "SELECT * FROM `suppliers` ORDER BY name LIMIT ?, 10"
				db.query(q, [req.body.start_value], (err, result) => {
					if (err) {
						return reject(err);
					}
					let q = "SELECT COUNT(*) AS val FROM `suppliers`"
					db.query(q, (err, result2) => {
						if (err) {
							return reject(err);							
						}
						// console.log(result2)
						resolve({ operation: "success", message: '10 suppliers got', info: {suppliers: result, count: result2[0].val} });
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

	addSupplier = (req, res) => {
		try {
			let d = jwt.decode(req.headers.access_token, { complete: true });
			let email = d.payload.email;
			let role = d.payload.role;

			new Promise((resolve, reject) => {
				let q = "INSERT INTO `suppliers`(`supplier_id`, `name`, `address`, `email`) VALUES (?, ?, ?, ?)"
				db.query(q, [uniqid(), req.body.name, req.body.address, req.body.email], (err, result) => {
					if(err) {
						return reject(err);
					}

					resolve({ operation: "success", message: 'Supplier added successfully' });
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

	getSuppiersSearch = (req, res) => {
		try {
			let d = jwt.decode(req.headers.access_token, { complete: true });
			let email = d.payload.email;
			let role = d.payload.role;

			new Promise((resolve, reject) => {
				let q = `SELECT * FROM suppliers WHERE name LIKE '${req.body.search_value}%' LIMIT 10`
				db.query(q, (err, result) => {
					if (err) {
						return reject(err);
					}
					// console.log(result)
					resolve({ operation: "success", message: '10 suppliers got', info: {suppliers: result} });
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

	deleteSupplier = (req, res) => {
		try {
			let d = jwt.decode(req.headers.access_token, { complete: true });
			let email = d.payload.email;
			let role = d.payload.role;

			new Promise((resolve, reject) => {
				let q = "DELETE FROM `suppliers` WHERE supplier_id = ?"
				db.query(q, [req.body.supplier_id], (err, result) => {
					if (err) {
						return reject(err);
					}
					resolve({ operation: "success", message: 'supplier deleted successfully'});
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

module.exports = Supplier;