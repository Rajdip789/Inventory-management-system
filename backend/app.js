const express = require('express');
const app = express();
const dotenv = require("dotenv");
const cors = require('cors');
const cookieParser = require('cookie-parser')

const port = process.env.PORT || 5000

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser())


const corsOption = {
    origin: ['https://stockmerch.vercel.app'],
	methods: ['GET', 'POST', 'DELETE'], 
	credentials: true,
};
app.use(cors(corsOption));
app.use(express.static('public'));

app.use('/', require('./routes/user.routes.js'));
app.use('/', require('./routes/dashboard.routes.js'));
app.use('/', require('./routes/products.routes.js'));
app.use('/', require('./routes/customers.routes.js'));
app.use('/', require('./routes/suppliers.routes.js'));
app.use('/', require('./routes/orders.routes.js'));
app.use('/', require('./routes/expenses.routes.js'));

app.listen(port, () => {
	console.log(`App listening on port ${port}!`)
})
