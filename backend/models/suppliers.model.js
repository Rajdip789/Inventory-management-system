const db = require('../db/conn.js');
const jwt = require('jsonwebtoken');
const uniqid = require("uniqid")

class Supplier {
	constructor() {
		//console.log('Customer object initialized');
	}

	getSuppliers = (req, res) => {
		try {
			let d = jwt.decode(req.cookies.accessToken, { complete: true });
			let email = d.payload.email;
			let role = d.payload.role;

			new Promise((resolve, reject) => {

				let tsa = ""
				if(req.body.search_value!="")
				{
					tsa = `WHERE name LIKE "%${req.body.search_value}%" OR address LIKE "%${req.body.search_value}%"` 
				}

				let tso = ""
				if((req.body.sort_column!="") && (req.body.sort_order!=""))
				{
					tso = `ORDER BY ${req.body.sort_column} ${req.body.sort_order}` 
				}
				
				let q = "SELECT * FROM `suppliers` " + tsa + tso + " LIMIT ?, 10"
				db.query(q, [req.body.start_value], (err, result) => {
					if (err) {
						return reject(err);
					}

					if(req.body.search_value!=""){
						return resolve({ operation: "success", message: 'search suppliers got', info: {suppliers: result, count: result.length} });
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
			let d = jwt.decode(req.cookies.accessToken, { complete: true });
			let email = d.payload.email;
			let role = d.payload.role;

			new Promise((resolve, reject) => {
				let q1 = "SELECT * FROM `suppliers` WHERE email = ?"
				db.query(q1, [req.body.email], (err1, result1) => {
					if(err1) {
						return reject(err1);
					}

					if(result1.length>0){
						resolve({ operation: "error", message: 'Duplicate supplier email' });
					}
					else{
						let q2 = "INSERT INTO `suppliers`(`supplier_id`, `name`, `address`, `email`) VALUES (?, ?, ?, ?)"
						db.query(q2, [uniqid(), req.body.name, req.body.address, req.body.email], (err2, result2) => {
							if(err2) {
								return reject(err2);
							}

							resolve({ operation: "success", message: 'Supplier added successfully' });
						})
					}
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

	updateSupplier = (req, res) => {
		try {
			let d = jwt.decode(req.cookies.accessToken, { complete: true });
			let email = d.payload.email;
			let role = d.payload.role;

			new Promise((resolve, reject) => {
				let q1 = "SELECT * FROM `suppliers` WHERE email = ?"
				db.query(q1, [req.body.email], (err1, result1) => {
					if (err1) {
						return reject(err1);
					}

					if ((result1.length > 0) && (result1[0].supplier_id != req.body.supplier_id)) {
						resolve({ operation: "error", message: 'Duplicate supplier email' });
					}
					else {
						let q2 = "UPDATE `suppliers` SET `name`=?,`address`=?,`email`=? WHERE `supplier_id`=?"
						db.query(q2, [req.body.name, req.body.address, req.body.email, req.body.supplier_id], (err2, result2) => {
							if (err2) {
								return reject(err2);
							}
							resolve({ operation: "success", message: 'Supplier updated successfully' });
						})
					}
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
			let d = jwt.decode(req.cookies.accessToken, { complete: true });
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
			let d = jwt.decode(req.cookies.accessToken, { complete: true });
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