const express = require("express");
const router = express.Router();
const verifyJwt = require("../middlewares/verifyJwt.js");
const Order = require('../models/orders.model.js');

const order = new Order();

router.post('/get_orders', verifyJwt, order.getOrders)
router.post('/add_order', verifyJwt, order.addOrder)
router.post('/delete_order', verifyJwt, order.deleteOrder)

module.exports = router