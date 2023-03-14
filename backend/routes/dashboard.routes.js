const express = require("express");
const router = express.Router();
const verifyJwt = require("../middlewares/verifyJwt.js");
const Dashboard = require('../models/dashboard.model.js');

const dashboard = new Dashboard();

router.post('/get_report_stats', verifyJwt, dashboard.getReportStats)
router.post('/get_product_stats', verifyJwt, dashboard.getProductStats)
router.post('/get_graph_stats', verifyJwt, dashboard.getGraphStats)

module.exports = router