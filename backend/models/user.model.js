const db = require('../db/conn.js');
const jwt = require('jsonwebtoken');
const Cryptr = require('cryptr');
const cryptr = new Cryptr(process.env.CRYPTER_SEED);

class User {
	constructor () {
		console.log('User object initialized');
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
			.catch((value) => {
				console.log(value);
				res.send(value);
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
}

module.exports = User;