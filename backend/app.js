const express = require('express');
const app = express();
const dotenv = require("dotenv");

const port = process.env.PORT || 5000

dotenv.config();

app.use(express.json());

app.use('/', require('./routes/user.routes.js'));

app.listen(port, () => {
	console.log(`App listening on port ${port}!`)
})