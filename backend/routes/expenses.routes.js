const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Expense = require('../models/expenses.model.js');

const expense = new Expense();

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


router.post('/get_expenses', verifyJwt, expense.getExpenses)
router.post('/add_expense', verifyJwt, expense.addExpense)
router.post('/delete_expense', verifyJwt, expense.deleteExpense)

module.exports = router