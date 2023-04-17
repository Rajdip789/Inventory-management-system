const mysql = require('mysql')
const dotenv = require("dotenv");

dotenv.config();

// const conn = mysql.createConnection({
// 	host: process.env.HOST,
// 	user: process.env.USER,
// 	password: process.env.PASSWORD,
// 	database: process.env.DATABASE,
// });

const conn = mysql.createConnection(process.env.DATABASE_URL);

let q = "SET sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''))"
conn.query(q, (err, res) => {});

module.exports = conn;