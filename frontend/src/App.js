import React, { useState } from 'react'
import {BrowserRouter, Route, Routes } from "react-router-dom";

import NotFound from './components/NotFoundPage/NotFound';
import Unauthorized from './components/UnauthorizedPage/Unauthorized';

import Login from './components/Login/Login'
import AsideNavbar from './components/Asidenavbar/AsideNavbar';
import Header from './components/Header/Header';
import Dashboard from './components/Dashboard/Dashboard';
import Employee from './components/Employee/Employees';
import EmployeeAddNew from './components/Employee/EmployeeAddNew';
import Product from './components/Product/Products';
import ProductAddNew from './components/Product/ProductAddNew';
import Supplier from './components/Supplier/Suppliers';
import SupplierAddNew from './components/Supplier/SupplierAddNew';
import Expense from './components/Expense/Expenses';
import ExpenseAddNew from './components/Expense/ExpenseAddNew';
import Customer from './components/Customer/Customer';
import CustomerAddNew from './components/Customer/CustomerAddNew';
import Order from './components/Order/Orders';
import OrderAddNew from './components/Order/OrderAddNew';
import Profile from './components/Profile/Profile';
import Settings from './components/Settings/Settings';

import "./style/dark.scss"



let styleObj = {
	flexGrow: "1",
	display: "flex",
	flexDirection: "column"
}

function App() {

	return (
		<div
			className=""
		> 
			<BrowserRouter>
				<Routes>
					<Route path='*' element={<NotFound />}/>
					<Route path='/unauthorized' element={<Unauthorized />}/>
					<Route path='/' element={<Login />}/>
					<Route path='/login' element={<Login />}/>
					<Route path='/dashboard' element={<div style={{display:"flex"}}><AsideNavbar/><div style={styleObj}><Header/><Dashboard /></div></div>}/>
					<Route path='/employees' element={<div style={{display:"flex"}}><AsideNavbar/><div style={styleObj}><Header/><Employee /></div></div>}/>
					<Route path='/employees/addnew' element={<div style={{display:"flex"}}><AsideNavbar/><div style={styleObj}><Header/><EmployeeAddNew /></div></div>}/>
					<Route path='/products' element={<div style={{display:"flex"}}><AsideNavbar/><div style={styleObj}><Header/><Product /></div></div>}/>
					<Route path='/products/addnew' element={<div style={{display:"flex"}}><AsideNavbar/><div style={styleObj}><Header/><ProductAddNew /></div></div>}/>
					<Route path='/suppliers' element={<div style={{display:"flex"}}><AsideNavbar/><div style={styleObj}><Header/><Supplier/></div></div>}/>
					<Route path='/suppliers/addnew' element={<div style={{display:"flex"}}><AsideNavbar/><div style={styleObj}><Header/><SupplierAddNew /></div></div>}/>
					<Route path='/expenses' element={<div style={{display:"flex"}}><AsideNavbar/><div style={styleObj}><Header/><Expense /></div></div>}/>
					<Route path='/expenses/addnew' element={<div style={{display:"flex"}}><AsideNavbar/><div style={styleObj}><Header/><ExpenseAddNew /></div></div>}/>
					<Route path='/customers' element={<div style={{display:"flex"}}><AsideNavbar/><div style={styleObj}><Header/><Customer /></div></div>}/>
					<Route path='/customers/addnew' element={<div style={{display:"flex"}}><AsideNavbar/><div style={styleObj}><Header/><CustomerAddNew /></div></div>}/>
					<Route path='/orders' element={<div style={{display:"flex"}}><AsideNavbar/><div style={styleObj}><Header/> <Order/></div></div>}/>
					<Route path='/orders/addnew' element={<div style={{display:"flex"}}><AsideNavbar/><div style={styleObj}><Header/> <OrderAddNew/></div></div>}/>
					<Route path='/profile' element={<div style={{display:"flex"}}><AsideNavbar/><div style={styleObj}><Header/><Profile/> </div></div>}/>
					<Route path='/settings' element={<div style={{display:"flex"}}><AsideNavbar/><div style={styleObj}><Header/><Settings/></div></div>}/>
				</Routes>
			</BrowserRouter>
		</div>
	)
}

// function DefaultContainer() {
// 	return (
// 		<div>
// 			<AsideNavbar/>

// 			<Header/>
// 			<Routes>
// 				<Route path='/dashboard' element={<Dashboard />}/>
// 				<Route path='/customers' element={<Customer />}/>
// 			</Routes>
// 		</div>
// 	)
// }

export default App