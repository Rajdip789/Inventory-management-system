import React, { useContext } from 'react'
import {BrowserRouter, Route, Routes } from "react-router-dom";
import { NotFound, Unauthorized, Login, Forgetpassword, Dashboard, Employee, EmployeeAddNew, Product, ProductAddNew, Supplier, SupplierAddNew, Expense, ExpenseAddNew, Customer, CustomerAddNew, Order, OrderAddNew, Profile, Settings, Layout } from './components'
import "./style/dark.scss"
import { DarkModeContext } from './context/darkModeContext';

function App() {
	const {darkMode} = useContext(DarkModeContext)
	
	return (
		<div className={darkMode ? "dark" : ""} > 
			<BrowserRouter>
				<Routes>
					<Route path='*' element={<NotFound />}/>
					<Route path='/unauthorized' element={<Unauthorized />}/>
					{/* <Route path='/' element={<Registration />}/> */}
					<Route path='/login' element={<Login />}/>
					<Route path='/forgetpassword' element={<Forgetpassword />}/>
					<Route path='/' element={<Layout/>}>
						<Route path='/dashboard' element={<Dashboard/>}/>
						<Route path='/employees' element={<Employee />}/>
						<Route path='/employees/addnew' element={<EmployeeAddNew />}/>
						<Route path='/products' element={<Product />}/>
						<Route path='/products/addnew' element={<ProductAddNew />}/>
						<Route path='/suppliers' element={<Supplier/>}/>
						<Route path='/suppliers/addnew' element={<SupplierAddNew />}/>
						<Route path='/expenses' element={<Expense />}/>
						<Route path='/expenses/addnew' element={<ExpenseAddNew />}/>
						<Route path='/customers' element={<Customer />}/>
						<Route path='/customers/addnew' element={<CustomerAddNew />}/>
						<Route path='/orders' element={ <Order/>}/>
						<Route path='/orders/addnew' element={ <OrderAddNew/>}/>
						<Route path='/profile' element={<Profile/> }/>
						<Route path='/settings' element={<Settings/>}/>
					</Route>
				</Routes>
			</BrowserRouter>
		</div>
	)
}

export default App