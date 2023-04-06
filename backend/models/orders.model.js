const db = require('../db/conn.js');
const jwt = require('jsonwebtoken');
const uniqid = require("uniqid")

class Order {
	constructor() {
		//console.log('Order object initialized');
	}

	getOrders = (req, res) => {
		try {
			let d = jwt.decode(req.cookies.accessToken, { complete: true });
			let email = d.payload.email;
			let role = d.payload.role;

			new Promise((resolve, reject) => {
				let tsa = ""
				if(req.body.search_value!="")
				{
					tsa = `WHERE c.name LIKE "%${req.body.search_value}%" OR o.order_ref LIKE "%${req.body.search_value}%"` 
				}
 
				let tso = ""
				if((req.body.sort_column!="") && (req.body.sort_order!=""))
				{
					tso = `ORDER BY ${req.body.sort_column} ${req.body.sort_order}` 
				}

				let q = "SELECT o.*, c.name as customer_name FROM orders o INNER JOIN customers c ON o.customer_id=c.customer_id " + tsa + tso + " LIMIT ?, 10"
				db.query(q, [req.body.start_value], (err, result) => {
					if (err) {
						return reject(err);
					}

					if(req.body.search_value!=""){
						return resolve({ operation: "success", message: 'search orders got', info: {orders: result, count: result.length} });
					}
					let q = "SELECT COUNT(*) AS val FROM `orders`"
					db.query(q, (err, result2) => {
						if (err) {
							return reject(err);							
						}
						// console.log(result2)
						resolve({ operation: "success", message: '10 orders got', info: {orders: result, count: result2[0].val} });
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

	addOrder = (req, res) => {
		try {
			let d = jwt.decode(req.cookies.accessToken, { complete: true });
			let email = d.payload.email;
			let role = d.payload.role;

			new Promise((resolve, reject) => {
				let q = "INSERT INTO `orders`(`order_id`, `order_ref`, `customer_id`, `due_date`, `items`, `tax`, `grand_total`) VALUES (?,?,?,?,?,?,?)"
				db.query(q, [uniqid(), req.body.order_reference, req.body.customer_id, req.body.due_date, JSON.stringify(req.body.item_array), req.body.tax, req.body.grand_total], (err, result) => {
					if(err) {
						return reject(err);
					}

					let parr = req.body.item_array.map((prod) => {
						return new Promise((res, rej) => {
							let q = "UPDATE `products` SET product_stock = product_stock - ? WHERE `product_id`= ?"
							db.query(q, [prod.quantity, prod.product_id], (err2, result) => {
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
						resolve({ operation: "success", message: 'Order added successfully' });
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

	deleteOrder = (req, res) => {
		try {
			let d = jwt.decode(req.cookies.accessToken, { complete: true });
			let email = d.payload.email;
			let role = d.payload.role;

			new Promise((resolve, reject) => {
				let q = "DELETE FROM `orders` WHERE order_id = ?"
				db.query(q, [req.body.order_id], (err, result) => {
					if (err) {
						return reject(err);
					}
					resolve({ operation: "success", message: 'order deleted successfully'});
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

module.exports = Order;