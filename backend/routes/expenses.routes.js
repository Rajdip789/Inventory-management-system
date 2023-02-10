const express = require("express");
const router = express.Router();
const verifyJwt = require("../middlewares/verifyJwt.js");
const Expense = require('../models/expenses.model.js');

const expense = new Expense();

router.post('/get_expenses', verifyJwt, expense.getExpenses)
router.post('/add_expense', verifyJwt, expense.addExpense)
router.post('/delete_expense', verifyJwt, expense.deleteExpense)

module.exports = router