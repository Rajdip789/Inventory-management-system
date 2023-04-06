const express = require("express");
const router = express.Router();

const upload = require("../middlewares/upload.js");
const verifyJwt = require("../middlewares/verifyJwt.js");
const User = require('../models/user.model.js');

const user = new User();

router.post('/login', user.login)
router.post('/refresh_token', verifyJwt , user.refreshToken)
router.post('/verifiy_token', user.verifyToken)
router.post('/get_permission', verifyJwt, user.getPermission)
router.get('/logout', user.logout)

router.post('/get_employees', verifyJwt, user.getEmployees)
router.post('/add_employee', verifyJwt, user.addEmployee)
router.post('/delete_employee', verifyJwt, user.deleteEmployee)
router.post('/update_employee', verifyJwt, user.updateEmployee)

router.post('/get_profile', verifyJwt, user.getProfile)
router.post('/update_profile', verifyJwt, upload("/profile_images").single("file"), user.updateProfile)
router.post('/update_profile_password', verifyJwt, user.updateProfilePassword)

module.exports = router