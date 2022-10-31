const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require('../models/user.model.js');

const user = new User();

const verifyJwt = (req, res, next) => {
	const token = req.headers.access_token;
	jwt.verify(token, process.env.JWT_SEC, (err, payload) => {
		if(err){
			console.log(token)
			console.log("jwt token failed");
			return res.status(403).send({operation : "error", message : 'Token expired or failed'});
		}

		// console.log("token verified")
		next();
	})
}

router.post('/login', user.login)
router.post('/refresh_token', verifyJwt , user.refreshToken)
router.post('/verifiy_token', user.verifyToken)
router.post('/get_permission', verifyJwt, user.getPermission)
router.post('/get_employees', verifyJwt, user.getEmployees)
router.post('/add_employee', verifyJwt, user.addEmployee)
router.post('/delete_employee', verifyJwt, user.deleteEmployee)

module.exports = router