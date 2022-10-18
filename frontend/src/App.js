import React from 'react'
import {BrowserRouter, Route, Routes } from "react-router-dom";

import Login from './components/Login/Login'
import AsideNavbar from './components/Asidenavbar/AsideNavbar';
import Header from './components/Header/Header';
import Dashboard from './components/Dashboard/Dashboard';
import Employee from './components/Employee/Employees';
import Product from './components/Product/Products';
import Supplier from './components/Supplier/Suppliers';
import Expense from './components/Expense/Expenses';
import Customer from './components/Customer/Customer';
import Order from './components/Order/Orders';
import Profile from './components/Profile/Profile';
import Settings from './components/Settings/Settings';


function App() {
	return (
		<div>
			<BrowserRouter>
				<Routes>
					<Route path='/login' element={<Login />}/>
					<Route path='/dashboard' element={<div style={{display:"flex"}}><AsideNavbar/><div style={{flexGrow:"1"}}><Header/><Dashboard /></div></div>}/>
					<Route path='/employees' element={<div style={{display:"flex"}}><AsideNavbar/><div style={{flexGrow:"1"}}><Header/><Employee /></div></div>}/>
					<Route path='/products' element={<div style={{display:"flex"}}><AsideNavbar/><div style={{flexGrow:"1"}}><Header/><Product /></div></div>}/>
					<Route path='/suppliers' element={<div style={{display:"flex"}}><AsideNavbar/><div style={{flexGrow:"1"}}><Header/><Supplier /></div></div>}/>
					<Route path='/expenses' element={<div style={{display:"flex"}}><AsideNavbar/><div style={{flexGrow:"1"}}><Header/><Expense /></div></div>}/>
					<Route path='/customers' element={<div style={{display:"flex"}}><AsideNavbar/><div style={{flexGrow:"1"}}><Header/><Customer /></div></div>}/>
					<Route path='/orders' element={<div style={{display:"flex"}}><AsideNavbar/><div style={{flexGrow:"1"}}><Header/> <Order/></div></div>}/>
					<Route path='/profile' element={<div style={{display:"flex"}}><AsideNavbar/><div style={{flexGrow:"1"}}><Header/><Profile/> </div></div>}/>
					<Route path='/settings' element={<div style={{display:"flex"}}><AsideNavbar/><div style={{flexGrow:"1"}}><Header/><Settings/></div></div>}/>
					
					{/* <DefaultContainer/> */}
				</Routes>
			</BrowserRouter>
		</div>
	)
}

function DefaultContainer() {
	return (
		<div>
			<AsideNavbar/>

			<Header/>
			<Routes>
				<Route path='/dashboard' element={<Dashboard />}/>
				<Route path='/customers' element={<Customer />}/>
			</Routes>
		</div>
	)
}

export default App