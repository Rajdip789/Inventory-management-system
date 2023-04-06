const db = require('../db/conn.js');
const jwt = require('jsonwebtoken');
const uniqid = require("uniqid")

class Expense {
	constructor() {
		//console.log('Expense object initialized');
	}

	getExpenses = (req, res) => {
		try {
			let d = jwt.decode(req.cookies.accessToken, { complete: true });
			let email = d.payload.email;
			let role = d.payload.role;

			new Promise((resolve, reject) => {

				let tsa = ""
				if(req.body.search_value!="")
				{
					tsa = `WHERE s.name LIKE "%${req.body.search_value}%" OR e.expense_ref LIKE "%${req.body.search_value}%"` 
				}
 
				let tso = ""
				if((req.body.sort_column!="") && (req.body.sort_order!=""))
				{
					tso = `ORDER BY ${req.body.sort_column} ${req.body.sort_order}` 
				}

				let q = "SELECT e.*, s.name as supplier_name FROM expenses e LEFT JOIN suppliers s ON e.supplier_id=s.supplier_id " + tsa + tso + " LIMIT ?, 10"
				db.query(q, [req.body.start_value], (err, result) => {
					if (err) {
						return reject(err);
					}

					if(req.body.search_value!=""){
						return resolve({ operation: "success", message: 'search expenses got', info: {expenses: result, count: result.length} });
					}
					let q = "SELECT COUNT(*) AS val FROM `expenses`"
					db.query(q, (err, result2) => {
						if (err) {
							return reject(err);							
						}
						// console.log(result2)
						resolve({ operation: "success", message: '10 expenses got', info: {expenses: result, count: result2[0].val} });
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

	addExpense = (req, res) => {
		try {
			let d = jwt.decode(req.cookies.accessToken, { complete: true });
			let email = d.payload.email;
			let role = d.payload.role;

			new Promise((resolve, reject) => {
				let q = "INSERT INTO `expenses`(`expense_id`, `expense_ref`, `supplier_id`, `due_date`, `items`, `tax`, `grand_total`) VALUES (?,?,?,?,?,?,?)"
				db.query(q, [uniqid(), req.body.expense_reference, req.body.supplier_id, req.body.due_date, JSON.stringify(req.body.item_array), req.body.tax, req.body.grand_total], (err, result) => {
					if(err) {
						return reject(err);
					}

					let parr = req.body.item_array.map((prod) => {
						return new Promise((res, rej) => {
							let q = "UPDATE `products` SET product_stock = product_stock + ? WHERE `product_id`= ?"
							db.query(q, [prod.quantity, prod.product_id], (err2, result2) => {
								if(err2) {
									console.log(err2)
									rej();
								}
								res();
							})
						})
					})

					Promise.all(parr)
					.then(() => {
						resolve({ operation: "success", message: 'Expense added successfully' });
					})
					.catch((error) => {
						console.log(error)
						reject();
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

	deleteExpense = (req, res) => {
		try {
			let d = jwt.decode(req.cookies.accessToken, { complete: true });
			let email = d.payload.email;
			let role = d.payload.role;

			new Promise((resolve, reject) => {
				let q = "DELETE FROM `expenses` WHERE expense_id = ?"
				db.query(q, [req.body.expense_id], (err, result) => {
					if (err) {
						return reject(err);
					}
					resolve({ operation: "success", message: 'expense deleted successfully'});
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

module.exports = Expense;