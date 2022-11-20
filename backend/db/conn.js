const mysql = require('mysql')
const dotenv = require("dotenv");

dotenv.config();

const conn = mysql.createConnection({
	host: process.env.HOST,
	user: process.env.USER,
	password: process.env.PASSWORD,
	database: process.env.DATABASE,
});
  
// conn.connect((err) => {
// 	if(err) console.log('Error : ---------------------' + err);
// 	else {
// 		console.log("Connection successful!")
// 	}
// })

module.exports = conn;