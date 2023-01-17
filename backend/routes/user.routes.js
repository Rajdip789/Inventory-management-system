const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require('../models/user.model.js');

const multer = require("multer")
const uniqid = require("uniqid")
const path = require('path');

const user = new User();

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
	  	cb(null, path.resolve("./") + '/public/profile_images')
	},
	filename: function (req, file, cb) {
		let f_name = uniqid()+ '_' +file.originalname
		req.body["f_name"] = f_name
		cb(null, f_name)
	}
})

const upload = multer({ storage: storage })

router.post('/login', user.login)
router.post('/refresh_token', verifyJwt , user.refreshToken)
router.post('/verifiy_token', user.verifyToken)
router.post('/get_permission', verifyJwt, user.getPermission)

router.post('/get_employees', verifyJwt, user.getEmployees)
router.post('/add_employee', verifyJwt, user.addEmployee)
router.post('/delete_employee', verifyJwt, user.deleteEmployee)
router.post('/update_employee', verifyJwt, user.updateEmployee)

router.post('/get_profile', verifyJwt, user.getProfile)
router.post('/update_profile', verifyJwt, upload.single("file"), user.updateProfile)
router.post('/update_profile_password', verifyJwt, user.updateProfilePassword)


module.exports = router