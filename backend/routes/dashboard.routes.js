const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Dashboard = require('../models/dashboard.model.js');

const dashboard = new Dashboard();

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


router.post('/get_report_stats', verifyJwt, dashboard.getReportStats)
router.post('/get_product_stats', verifyJwt, dashboard.getProductStats)
router.post('/get_graph_stats', verifyJwt, dashboard.getGraphStats)

module.exports = router