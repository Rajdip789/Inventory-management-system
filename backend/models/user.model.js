const db = require('../db/conn.js');
const jwt = require('jsonwebtoken');
const CryptoJS = require("crypto-js");
const uniqid = require("uniqid")
const fs = require("fs")
const path = require('path');

class User {
	constructor () {
	}
	
	login = (req, res) => {
		console.log('Login');
		try {
			new Promise((resolve, reject) => {
				let q = "SELECT * FROM `user` WHERE email=?" 
				db.query(q, [req.body.email], (err, result) => {
					if(err) {
						reject(err); 
						return;
					}

					if(result.length == 1) {
						let d_password = CryptoJS.AES.decrypt(result[0].password, process.env.CRYPTOJS_SEED).toString(CryptoJS.enc.Utf8);
						let t_password = CryptoJS.AES.decrypt(req.body.password, process.env.CRYPTOJS_SEED).toString(CryptoJS.enc.Utf8);
						if(d_password == t_password) {

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
				//console.log(err);
				res.send(err);
			})
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
				let q = "SELECT `user_id`, `user_name`, `address`, `email`, `permissions`, `timeStamp` FROM `user` WHERE user_role != 'admin' ORDER BY user_name LIMIT ?, 10"
				db.query(q, [req.body.start_value], (err, result) => {
					if (err) {
						return reject(err);
					}
					let q = "SELECT COUNT(*) AS val FROM `user` WHERE user_role != 'admin'"
					db.query(q, (err, result2) => {
						if (err) {
							return reject(err);							
						}
						// console.log(result2)
						resolve({ operation: "success", message: '10 employees got', info: {employees: result, count: result2[0].val} });
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
					db.query(q, [uniqid(), req.body.name, req.body.address, req.body.email, req.body.password, result[0].user_role_permissions, result[0].user_role_name], (err, result2) => {
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

	getProfile = (req, res) => {
		try {
			let d = jwt.decode(req.headers.access_token, { complete: true });
			let email = d.payload.email;
			let role = d.payload.role;

			new Promise((resolve, reject) => {
				let q = "SELECT `user_id`, `user_name`, `address`, `email`, `image` FROM `user` WHERE email = ?"
				db.query(q, [email], (err, result) => {
					if (err) {
						return reject(err);
					}

					resolve({ operation: "success", message: 'Employee profile got successfully', info: {profile: result} });
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

	updateProfile = (req, res) => {
		try {
			let d = jwt.decode(req.headers.access_token, { complete: true });
			let email = d.payload.email;
			let role = d.payload.role;

			new Promise(async(resolve, reject) => {

				let ts = ""
				if(req.file){
					ts = `,image='${req.body.f_name}'`

					await new Promise((res, rej)=>{
						let qs = "SELECT `image` FROM `user` WHERE email = ?"
						db.query(qs, [email], (erra, resulta) => {
							if (erra) {
								console.log(erra)
								rej();
							}
							
							if(resulta[0].image != '') {
								fs.unlink(path.resolve("./") + `\\public\\profile_images\\${resulta[0].image}` ,(errb)=>{
									if(errb){
										console.log(errb)
										rej()
									}
									res()
								})
							} else {
								res()
							}
						})
					})
				}
				let q = "UPDATE `user` SET `user_name`=?,`address`=?"+ts+" WHERE email = ?"
				db.query(q, [req.body.name, req.body.address, email], (err, result) => {
					if (err) {
						return reject(err);
					}
					resolve({ operation: "success", message: 'Profile updated successfully' });
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

	updateProfilePassword = (req, res) => {
		try {
			let d = jwt.decode(req.headers.access_token, { complete: true });
			let email = d.payload.email;
			let role = d.payload.role;

			new Promise(async(resolve, reject) => {
				let q = "SELECT password FROM `user` WHERE email=?" 
				db.query(q, [email], (err, result) => {
					if(err) {
						reject(err); 
						return;
					}
					
					let d_password = CryptoJS.AES.decrypt(result[0].password, process.env.CRYPTOJS_SEED).toString(CryptoJS.enc.Utf8);
					let t_password = CryptoJS.AES.decrypt(req.body.old_password, process.env.CRYPTOJS_SEED).toString(CryptoJS.enc.Utf8);
					console.log(d_password,t_password)
					if(d_password == t_password) {
						console.log("here",email)
						let q = "UPDATE `user` SET `password`=? WHERE email = ?"
						db.query(q, [req.body.new_password, email], (erra, result) => {
							if (erra) {
								return reject(erra);
							}
							resolve({ operation: "success", message: 'Profile password updated successfully' });
						})
					} else {
						reject({operation: "error", message: 'Old password wrong'});
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