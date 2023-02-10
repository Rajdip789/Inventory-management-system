const express = require("express");
const router = express.Router();
const verifyJwt = require("../middlewares/verifyJwt.js");
const Customer = require('../models/customers.model.js');

const customer = new Customer();

router.post('/get_customers', verifyJwt, customer.getCustomers)
router.post('/add_customer', verifyJwt, customer.addCustomer)
router.post('/delete_customer', verifyJwt, customer.deleteCustomer)
router.post('/update_customer', verifyJwt, customer.updateCustomer)
router.post('/get_customers_search', verifyJwt, customer.getCustomersSearch)

module.exports = router