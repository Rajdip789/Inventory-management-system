const db = require('../db/conn.js');
const jwt = require('jsonwebtoken');

class Dashboard {
	constructor() {
		//console.log('Dashboard object initialized');
	}

	getReportStats = (req, res) => {
		try {
			new Promise((resolve, reject) => {
				let p1 = new Promise((rs, rj) => {
					let q = 'SELECT (SELECT COUNT(*) FROM user WHERE user_role="employee") AS employee_count, (SELECT COUNT(*) FROM customers) AS customer_count, (SELECT COUNT(*) FROM suppliers) AS supplier_count FROM dual'
					db.query(q, (err, result) => {
						if (err) {
							rj(err);
						}
						rs(result[0])
					})
				})

				let p2 = new Promise((rs, rj) => {
					let q = 'SELECT (SELECT SUM(grand_total) FROM orders WHERE MONTH(timeStamp) = MONTH(CURDATE()) AND YEAR(timeStamp) = YEAR(CURDATE())) AS "current_month", (SELECT SUM(grand_total) FROM orders WHERE MONTH(timeStamp) = MONTH(CURRENT_DATE - INTERVAL 1 MONTH) AND YEAR(timeStamp) = YEAR(CURRENT_DATE - INTERVAL 1 MONTH)) AS "previous_month" FROM DUAL;'
					db.query(q, (err, result) => {
						if (err) {
							rj(err);
						}
						rs(result[0])
					})
				})

				let p3 = new Promise((rs, rj) => {
					let q = 'SELECT (SELECT SUM(grand_total) FROM expenses WHERE MONTH(timeStamp) = MONTH(CURDATE()) AND YEAR(timeStamp) = YEAR(CURDATE())) AS "current_month", (SELECT SUM(grand_total) FROM expenses WHERE MONTH(timeStamp) = MONTH(CURRENT_DATE - INTERVAL 1 MONTH) AND YEAR(timeStamp) = YEAR(CURRENT_DATE - INTERVAL 1 MONTH)) AS "previous_month" FROM DUAL;'
					db.query(q, (err, result) => {
						if (err) {
							rj(err);
						}
						rs(result[0])
					})
				})

				Promise.all([p1, p2, p3])
					.then((result) => {
						resolve({ operation: "success", message: 'data for user, customers, suppliers, order report, expense report', info: result });
					})
					.catch((err) => {
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
			new Promise((resolve, reject) => {
				let p1 = new Promise((rs, rj) => {
					let q = 'SELECT COUNT(*) AS total_products FROM products'
					db.query(q, (err, result) => {
						if (err) {
							rj(err);
						}
						rs(result[0])
					})
				})

				let p2 = new Promise((rs, rj) => {
					let q = 'SELECT name, product_stock FROM products ORDER BY product_stock LIMIT 5'
					db.query(q, (err, result) => {
						if (err) {
							rj(err);
						}
						rs(result)
					})
				})

				let p3 = new Promise((rs, rj) => {
					let q = 'SELECT gender, COUNT(*) as count FROM products GROUP BY gender'
					db.query(q, (err, result) => {
						if (err) {
							rj(err);
						}
						rs(result)
					})
				})

				let p4 = new Promise((rs, rj) => {
					let q = 'SELECT * FROM orders WHERE MONTH(timeStamp) = MONTH(CURRENT_DATE) AND YEAR(timeStamp) = YEAR(CURRENT_DATE);'
					db.query(q, (err, result) => {
						if (err) {
							rj(err);
						}

						if (result.length == 0) {
							return rs([]);
						}

						let arr = {}
						result.forEach(ord => {
							let items = JSON.parse(ord.items)
							items.forEach((i) => {
								if (arr.hasOwnProperty(i.product_id)) {
									arr[i.product_id] += i.quantity
								}
								else {
									arr[i.product_id] = i.quantity
								}
							})
						});

						let temp = Object.entries(arr).sort(([, a], [, b]) => b - a).slice(0, 5).map(x => x[0])

						let q2 = 'SELECT * FROM products WHERE product_id IN (?)'
						db.query(q2, [temp], (err2, result2) => {
							if (err2) {
								rj(err2);
							}
							rs(result2)
						})
					})
				})

				Promise.all([p1, p2, p3, p4])
					.then((result) => {
						resolve({ operation: "success", message: 'data for products', info: result });
					})
					.catch((err) => {
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
			new Promise((resolve, reject) => {
				let q1 = "SELECT SUM(grand_total) as Total, DATE_FORMAT(timeStamp, '%Y-%m') as YearMonth FROM `orders` WHERE DATE_FORMAT(timeStamp, '%Y-%m') > DATE_FORMAT(DATE_SUB(CURRENT_DATE, INTERVAL 12 MONTH),'%Y-%m') GROUP BY DATE_FORMAT(timeStamp, '%Y-%m') ORDER BY timeStamp"
				db.query(q1, (err1, result1) => {
					if (err1) {
						reject(err1);
					}
					let q2 = "SELECT SUM(grand_total) as Total, DATE_FORMAT(timeStamp, '%Y-%m') as YearMonth FROM `expenses` WHERE DATE_FORMAT(timeStamp, '%Y-%m') > DATE_FORMAT(DATE_SUB(CURRENT_DATE, INTERVAL 12 MONTH),'%Y-%m') GROUP BY DATE_FORMAT(timeStamp, '%Y-%m') ORDER BY timeStamp"
					db.query(q2, (err2, result2) => {
						if (err2) {
							reject(err2);
						}

						const orders = result1
						const expenses = result2

						const res = [];

						const allYearMonths = [];
						let endYearMonth = new Date().getFullYear() + "-" + (new Date().getMonth() + 1).toString().padStart(2, '0');

						let t = new Date()
						t.setMonth(new Date(endYearMonth).getMonth() - 11);
						let startYearMonth = t.getFullYear() + "-" + (t.getMonth() + 1).toString().padStart(2, '0');

						let currentYearMonth = new Date(startYearMonth + '-01');
						let end = new Date(endYearMonth + '-01');

						while (currentYearMonth <= end) {
							allYearMonths.push(currentYearMonth.toISOString().substr(0, 7));
							currentYearMonth.setMonth(currentYearMonth.getMonth() + 1);
						}

						allYearMonths.forEach(yearMonth => {
							const order = orders.find(order => order.YearMonth === yearMonth) || { Total: 0 };
							const expense = expenses.find(expense => expense.YearMonth === yearMonth) || { Total: 0 };

							res.push({
								YearMonth: yearMonth,
								Month: new Date(yearMonth + '-01').toLocaleString('default', { month: 'long' }),
								order: order.Total,
								expense: expense.Total,
								revenue: order.Total - expense.Total
							});
						});

						resolve({ operation: "success", message: 'data for user, customers, suppliers, order report, expense report', info: res })
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

module.exports = Dashboard;