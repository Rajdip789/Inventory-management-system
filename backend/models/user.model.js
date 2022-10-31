const db = require('../db/conn.js');
const jwt = require('jsonwebtoken');
const Cryptr = require('cryptr');
const cryptr = new Cryptr(process.env.CRYPTER_SEED);
const uniqid = require("uniqid")

class User {
	constructor () {
	}
	
	login = (req, res) => {
		try {
			new Promise((resolve, reject) => {
				let q = "SELECT * FROM `user` WHERE email=?" 
				db.query(q, [req.body.email], (err, result) => {
					if(err) {
						reject(err); 
						return;
					}

					if(result.length == 1) {
						let d_password = cryptr.decrypt(result[0].password);
						if(d_password == req.body.password) {

							const accessToken = jwt.sign(
								{
									email: result[0].email, 
									role: result[0].user_role
								},
								process.env.JWT_SEC,
								{expiresIn: process.env.JWT_EXPIRY}
							)
							resolve({operation: "success", message: 'login successfull', info: {accessToken: accessToken}});
						} else {
							reject({operation: "error", message: 'password wrong'});
						}
					} else {
						reject({operation: "error", message: 'Invalid email'});
					}
				})
			})
			.then((value) => {
				res.send(value);
			})
			.catch((err) => {
				console.log(err);
				res.send({operation : "error", message : 'Something went wrong'});
			})
			// console.log(cryptr.encrypt('rajdip@pal12345'));
			console.log('Login');
		} catch (error) {
			console.log(error);
			res.send({operation : "error", message : 'Something went wrong'});
		}
	}

	refreshToken = (req, res) => {
		try {
			let prevToken = req.headers.access_token;
			let d = jwt.decode(prevToken, {complete: true});

			let newToken = jwt.sign(
				{
					email: d.payload.email, 
					role: d.payload.role
				},
				process.env.JWT_SEC,
				{expiresIn: process.env.JWT_EXPIRY}
			); 
			res.send({operation: "success", message: 'Token refreshed', info: {accessToken: newToken}});
		} catch (error) {
			console.log(error);
			res.send({operation : "error", message : 'Something went wrong'});
		}
	}

	verifyToken = (req, res) => {
		let temptoken = req.body.access_token;
		jwt.verify(temptoken, process.env.JWT_SEC, (err, payload) => {
			if(err){
				res.send({operation : "error", message : 'Token expired'});
				console.log("jwt token failed");
			}
			res.send({operation : "success", message : 'Token verified'});
		})
	}

	getPermission = (req, res) => {
		try {
			let d = jwt.decode(req.headers.access_token, {complete: true});
			let email = d.payload.email;
			let role = d.payload.role;

			new Promise((resolve, reject) => {
				let q = "SELECT permissions FROM `user` WHERE email=? AND user_role=?" 
				db.query(q, [email, role], (err, result) => {
					if(err) {
						reject(err); 
						return;
					}

					if(result.length == 1) {
						//console.log(result[0]);
						resolve({operation: "success", message: '', info: result[0].permissions});
					} else {
						reject({operation: "error", message: 'Invalid user'});
					}
				})
			})
			.then((value) => {
				res.send(value);
			})
			.catch((err) => {
				console.log(err);
				res.send({operation : "error", message : 'Something went wrong'});
			})
			// console.log(cryptr.encrypt('rajdip@pal12345'));
		} catch (error) {
			console.log(error);
			res.send({operation : "error", message : 'Something went wrong'});
		}
	}

	getEmployees = (req, res) => {
		try {
			let d = jwt.decode(req.headers.access_token, { complete: true });
			let email = d.payload.email;
			let role = d.payload.role;

			new Promise((resolve, reject) => {
				let q = "SELECT * FROM `user` WHERE user_role != 'admin' ORDER BY user_name LIMIT ?, 10"
				db.query(q, [req.body.start_value], (err, result) => {
					if (err) {
						return reject(err);
					}
					let q = "SELECT COUNT(*) AS val FROM `user`"
					db.query(q, (err, result2) => {
						if (err) {
							return reject(err);							
						}
						// console.log(result2)
						resolve({ operation: "success", message: '10 products got', info: {employees: result, count: result2[0].val} });
					})
				})
				//console.log(cryptr.encrypt('nibedita@12345'));
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

	addEmployee = (req, res) => {
		try {
			let d = jwt.decode(req.headers.access_token, { complete: true });
			let email = d.payload.email;
			let role = d.payload.role;

			new Promise((resolve, reject) => {
				let q = "SELECT `user_role_permissions`, `user_role_name` FROM `user_roles` WHERE `user_role_name` = 'employee'"
				db.query(q, (err, result) => {
					if(err) {
						return reject(err);
					}

					let q = "INSERT INTO `user`(`user_id`, `user_name`, `address`, `email`, `password`, `permissions`, `user_role`) VALUES (?, ?, ?, ?, ?, ?, ?)"
					db.query(q, [uniqid(), req.body.name, req.body.address, req.body.email, cryptr.encrypt(req.body.password), result[0].user_role_permissions, result[0].user_role_name], (err, result2) => {
						if (err) {
							return reject(err);
						}
						resolve({ operation: "success", message: 'Employee added successfully' });
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

	deleteEmployee = (req, res) => {
		try {
			let d = jwt.decode(req.headers.access_token, { complete: true });
			let email = d.payload.email;
			let role = d.payload.role;

			new Promise((resolve, reject) => {
				let q = "DELETE FROM `user` WHERE user_id = ?"
				db.query(q, [req.body.employee_id], (err, result) => {
					if (err) {
						return reject(err);
					}
					resolve({ operation: "success", message: 'employee deleted successfully'});
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

module.exports = User;