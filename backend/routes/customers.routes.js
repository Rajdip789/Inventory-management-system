const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Customer = require('../models/customers.model.js');

const customer = new Customer();

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


router.post('/get_customers', verifyJwt, customer.getCustomers)
router.post('/add_customer', verifyJwt, customer.addCustomer)
router.post('/delete_customer', verifyJwt, customer.deleteCustomer)
router.post('/update_customer', verifyJwt, customer.updateCustomer)
router.post('/get_customers_search', verifyJwt, customer.getCustomersSearch)

module.exports = router