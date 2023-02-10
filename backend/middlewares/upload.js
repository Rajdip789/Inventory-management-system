const multer = require("multer")
const uniqid = require("uniqid")
const path = require('path');


const upload = (dir) => multer({
	storage: multer.diskStorage({
		destination: function (req, file, cb) {
			cb(null, path.resolve("./") + '/public' + dir)
		},
		filename: function (req, file, cb) {
			let f_name = uniqid() + '_' + file.originalname
			req.body["f_name"] = f_name
			cb(null, f_name)
		}
	})
})

module.exports = upload