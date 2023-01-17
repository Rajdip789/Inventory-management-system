const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Product = require('../models/products.model.js');

const uniqid = require("uniqid")
const multer = require("multer")
const path = require('path');

const product = new Product();

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

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
	  	cb(null, path.resolve("./") + '/public/uploads')
	},
	filename: function (req, file, cb) {
		let f_name = uniqid()+ '_' +file.originalname
		req.body["f_name"] = f_name
		cb(null, f_name)
	}
})
  
const upload = multer({ storage: storage })

router.post('/add_product', verifyJwt, upload.single("image"), product.addProduct)
router.post('/delete_product', verifyJwt, product.deleteProduct)
router.post('/get_products', verifyJwt, product.getProducts)
router.post('/get_products_search', verifyJwt, product.getProductsSearch)
router.post('/get_products_details_by_id', verifyJwt, product.getProductsDetailsById)
router.post('/update_product', verifyJwt, upload.single("image"), product.updateProduct)
router.post('/delete_product_image', verifyJwt, product.deleteProductImage)

module.exports = router