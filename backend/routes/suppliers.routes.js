const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Supplier = require('../models/suppliers.model.js');

const supplier = new Supplier();

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


router.post('/get_suppliers', verifyJwt, supplier.getSuppliers)
router.post('/delete_supplier', verifyJwt, supplier.deleteSupplier)

module.exports = router