const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Order = require('../models/orders.model.js');

const order = new Order();

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


router.post('/get_orders', verifyJwt, order.getOrders)
router.post('/add_order', verifyJwt, order.addOrder)
router.post('/delete_order', verifyJwt, order.deleteOrder)
//router.post('/update_order', verifyJwt, order.updateOrder)
//router.post('/update_order_status', verifyJwt, order.updateOrderStatus)

module.exports = router