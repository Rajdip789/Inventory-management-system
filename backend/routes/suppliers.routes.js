const express = require("express");
const router = express.Router();
const verifyJwt = require("../middlewares/verifyJwt.js");
const Supplier = require('../models/suppliers.model.js');

const supplier = new Supplier();

router.post('/get_suppliers', verifyJwt, supplier.getSuppliers)
router.post('/add_supplier', verifyJwt, supplier.addSupplier)
router.post('/delete_supplier', verifyJwt, supplier.deleteSupplier)
router.post('/update_supplier', verifyJwt, supplier.updateSupplier)
router.post('/get_suppiers_search', verifyJwt, supplier.getSuppiersSearch)

module.exports = router