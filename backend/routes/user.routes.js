const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require('../models/user.model.js');

const user = new User();

const verifyJwt = (req, res, next) => {
	const token = req.headers.access_token;
	jwt.verify(token, process.env.JWT_SEC, (err, payload) => {
		if(err){
			console.log("jwt token failed");
			return res.status(403).send({operation : "error", message : 'Token expired or failed'});
		}

		console.log("token verified")
		next();
	})
}

router.post('/login', user.login)
router.post('/refresh_token', verifyJwt ,user.refreshToken)

module.exports = router