const db = require('../db/conn.js');
const jwt = require('jsonwebtoken');
const uniqid = require("uniqid")


class Dashboard {
	constructor() {
		//console.log('Dashboard object initialized');
	}

	getReportStats = (req, res) => {
		try {
			let d = jwt.decode(req.headers.access_token, { complete: true });
			let email = d.payload.email;
			let role = d.payload.role;

			new Promise((resolve, reject) => {
				let p1 = new Promise((rs,rj)=>{
					let q = 'SELECT (SELECT COUNT(*) FROM user WHERE user_role="employee") AS employee_count, (SELECT COUNT(*) FROM customers) AS customer_count, (SELECT COUNT(*) FROM suppliers) AS supplier_count FROM dual'
					db.query(q, (err, result) => {
						if (err) {
							rj(err);
						}
						rs(result[0])
					})
				})

				let p2 = new Promise((rs,rj)=>{
					let q = 'SELECT (SELECT SUM(grand_total) FROM orders WHERE MONTH(timeStamp) = MONTH(CURDATE()) AND YEAR(timeStamp) = YEAR(CURDATE())) AS "current_month", (SELECT SUM(grand_total) FROM orders WHERE MONTH(timeStamp) = MONTH(CURRENT_DATE - INTERVAL 1 MONTH) AND YEAR(timeStamp) = YEAR(CURRENT_DATE - INTERVAL 1 MONTH)) AS "previous_month" FROM DUAL;'
					db.query(q, (err, result) => {
						if (err) {
							rj(err);
						}
						rs(result[0])
					})
				})

				let p3 = new Promise((rs,rj)=>{
					let q = 'SELECT (SELECT SUM(grand_total) FROM expenses WHERE MONTH(timeStamp) = MONTH(CURDATE()) AND YEAR(timeStamp) = YEAR(CURDATE())) AS "current_month", (SELECT SUM(grand_total) FROM expenses WHERE MONTH(timeStamp) = MONTH(CURRENT_DATE - INTERVAL 1 MONTH) AND YEAR(timeStamp) = YEAR(CURRENT_DATE - INTERVAL 1 MONTH)) AS "previous_month" FROM DUAL;'
					db.query(q, (err, result) => {
						if (err) {
							rj(err);
						}
						rs(result[0])
					})
				})

				Promise.all([p1,p2,p3])
				.then((result)=>{
					resolve({ operation: "success", message: 'data for user, customers, suppliers, order report, expense report', info: result });
				})
				.catch((err)=>{
					reject(err)
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

	getProductStats = (req, res) => {
		try {
			let d = jwt.decode(req.headers.access_token, { complete: true });
			let email = d.payload.email;
			let role = d.payload.role;

			new Promise((resolve, reject) => {
				let p1 = new Promise((rs,rj)=>{
					let q = 'SELECT COUNT(*) AS total_products FROM products'
					db.query(q, (err, result) => {
						if (err) {
							rj(err);
						}
						rs(result[0])
					})
				})

				let p2 = new Promise((rs,rj)=>{
					let q = 'SELECT name FROM products ORDER BY product_stock LIMIT 5'
					db.query(q, (err, result) => {
						if (err) {
							rj(err);
						}
						rs(result)
					})
				})

				let p3 = new Promise((rs,rj)=>{
					let q = 'SELECT gender, COUNT(*) as count FROM products GROUP BY gender'
					db.query(q, (err, result) => {
						if (err) {
							rj(err);
						}
						rs(result)
					})
				})

				let p4 = new Promise((rs,rj)=>{
					let q = 'SELECT * FROM orders WHERE MONTH(timeStamp) = MONTH(CURRENT_DATE) AND YEAR(timeStamp) = YEAR(CURRENT_DATE);'
					db.query(q, (err, result) => {
						if (err) {
							rj(err);
						}

						let arr = {}
						result.forEach(ord => {
							let items = JSON.parse(ord.items)
							items.forEach((i)=>{
								if(arr.hasOwnProperty(i.product_id)){
									arr[i.product_id] += i.quantity
								}
								else{
									arr[i.product_id] = i.quantity
								}
							})
						});

						let temp = Object.entries(arr).sort(([,a],[,b]) => b-a).slice(0,5).map(x=>x[0])

						let q2 = 'SELECT * FROM products WHERE product_id IN (?)'
						db.query(q2, [temp], (err2, result2) => {
							if (err2) {
								rj(err2);
							}
							rs(result2)
						})
					})
				})

				Promise.all([p1,p2,p3,p4])
				.then((result)=>{
					resolve({ operation: "success", message: 'data for products', info: result });
				})
				.catch((err)=>{
					reject(err)
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

	getGraphStats = (req, res) => {
		try {
			let d = jwt.decode(req.headers.access_token, { complete: true });
			let email = d.payload.email;
			let role = d.payload.role;

			new Promise((resolve, reject) => {
				let p1 = new Promise((rs,rj)=>{
					let q = 'SELECT (SELECT COUNT(*) FROM user WHERE user_role="employee") AS count1, (SELECT COUNT(*) FROM customers) AS count2, (SELECT COUNT(*) FROM suppliers) AS count3 FROM dual'
					db.query(q, (err, result) => {
						if (err) {
							rj(err);
						}
						rs(result)
					})
				})

				let p2 = new Promise((rs,rj)=>{
					let q = 'SELECT (SELECT SUM(grand_total) FROM orders WHERE MONTH(timeStamp) = MONTH(CURDATE()) AND YEAR(timeStamp) = YEAR(CURDATE())) AS "current_month", (SELECT SUM(grand_total) FROM orders WHERE MONTH(timeStamp) = MONTH(CURRENT_DATE - INTERVAL 1 MONTH) AND YEAR(timeStamp) = YEAR(CURRENT_DATE - INTERVAL 1 MONTH)) AS "previous_month" FROM DUAL;'
					db.query(q, (err, result) => {
						if (err) {
							rj(err);
						}
						rs(result)
					})
				})

				let p3 = new Promise((rs,rj)=>{
					let q = 'SELECT (SELECT SUM(grand_total) FROM expenses WHERE MONTH(timeStamp) = MONTH(CURDATE()) AND YEAR(timeStamp) = YEAR(CURDATE())) AS "current_month", (SELECT SUM(grand_total) FROM expenses WHERE MONTH(timeStamp) = MONTH(CURRENT_DATE - INTERVAL 1 MONTH) AND YEAR(timeStamp) = YEAR(CURRENT_DATE - INTERVAL 1 MONTH)) AS "previous_month" FROM DUAL;'
					db.query(q, (err, result) => {
						if (err) {
							rj(err);
						}
						rs(result)
					})
				})

				Promise.all([p1,p2,p3])
				.then((result)=>{
					resolve({ operation: "success", message: 'data for user, customers, suppliers, order report, expense report', info: result });
				})
				.catch((err)=>{
					reject(err)
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

module.exports = Dashboard;