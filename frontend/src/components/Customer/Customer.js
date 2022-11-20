import React, { useEffect, useState } from 'react'
import {Link} from "react-router-dom"
import './Customer.scss'
import Table from '../Table/Table'

import moment from 'moment'
import swal from 'sweetalert';
import { setCookie, getCookie } from '../../cookie';

function Customer() {
	const [pageState, setPageState] = useState(1)
	const [permission, setPermission] = useState(null)

	const [customers, setCustomers] = useState([])
	const [customerCount, setCustomerCount] = useState(0)

	const [tablePage, setTablePage] = useState(1)
	const [data, setData] = useState([])


	useEffect(() => {
		if (getCookie('accessToken') != '') {
			let obj = {}
			obj.access_token = getCookie('accessToken');

			fetch(`${process.env.REACT_APP_BACKEND_ORIGIN}/verifiy_token`, {
				method: 'POST',
				headers: {
					'Content-type': 'application/json; charset=UTF-8',
				},
				body: JSON.stringify(obj)
			})
			.then(async (response) => {
				let body = await response.json()
				// console.log(body)
				if (body.operation == 'success') {

					fetch(`${process.env.REACT_APP_BACKEND_ORIGIN}/get_permission`, {
						method: 'POST',
						headers: {
							'Content-type': 'application/json; charset=UTF-8',
							'access_token': getCookie('accessToken'),
						},
					})
					.then(async (response) => {
						let body = await response.json()

						//console.log(JSON.parse(body.info));
						let p = JSON.parse(body.info).find(x => x.page == 'customers')
						if (p.view != true) {
							window.location.href = '/unauthorized';
						} else {
							setPermission(p)
						}
					})
					.catch((error) => {
						console.log(error)
					})
				} else {
					window.location.href = '/login'
				}
			})
			.catch((error) => {
				console.log(error)
			})
		} else {
			window.location.href = '/login'
		}
	}, [])


	const getCustomers = async (value) => {
		let result = await fetch(`${process.env.REACT_APP_BACKEND_ORIGIN}/get_customers`, {
			method: 'POST',
			headers: {
				'Content-type': 'application/json; charset=UTF-8',
				'access_token': getCookie('accessToken'),
			},
			body : JSON.stringify({start_value : value})
		})

		let body = await result.json()
		setCustomers(body.info.customers)
		setCustomerCount(body.info.count)
	}

	useEffect(() => {
		if (permission != null) {
			let p1 = getCustomers((tablePage-1)*10);
			Promise.all([p1])
			.then(() => {
				console.log('All apis done')
				setPageState(2);
			})
			.catch((err) => {
				console.log(err)
				setPageState(3)
			})
		}
	}, [permission])

	useEffect(() => {
		if(permission!=null)
			getCustomers((tablePage-1)*10);
	}, [tablePage])
	


	const deleteCustomer = async(id) => {
		let result = await fetch(`${process.env.REACT_APP_BACKEND_ORIGIN}/delete_customer`, {
			method: 'POST',
			headers: {
				'Content-type': 'application/json; charset=UTF-8',
				'access_token': getCookie('accessToken'),
			},
			body : JSON.stringify({customer_id : id})
		})

		let body = await result.json()
		if(body.operation == 'success') {
			getCustomers((tablePage-1)*10);
			swal('Success', body.message, 'success')
		} else {
			swal('Oops!', 'Something went wrong', 'error')
		}
	}

	useEffect(() => {
		if(customers.length != 0) {
			//console.log(customers)
			let tArray = customers.map((obj, i) => {
				let tObj = {}
				tObj.sl = i + 1;
				tObj.name = obj.name;
				tObj.address = obj.address;
				tObj.email = obj.email;
				tObj.addedon = moment(obj.timeStamp).format('MMMM Do, YYYY');
				tObj.action = 
				<>
					<button className='btn warning' style={{marginRight: '0.5rem'}}>View/Edit</button>
					{
						permission.delete && 
						<button className='btn danger' style={{marginLeft: '0.5rem'}}
							onClick={() => {
								swal({
									title: "Are you sure?",
									text: "Once deleted, you will not be able to recover this entry!",
									icon: "warning",
									buttons: true,
									dangerMode: true,
								})
								.then((willDelete) => {
									if (willDelete) {
										deleteCustomer(obj.customer_id)
									}
								});
							}}
						>Delete
						</button>
					}
				</>
				return tObj;
			})
			//console.log(tArray)
			setData(tArray)
		}
	}, [customers])
	
	return (
		<div className='customers'>
			<div className='customer-header'>
				<div className='title'>Customers</div>
				<Link to={"/customers/addnew"} className='btn success' style={{ margin: "0 0.5rem",textDecoration:"none" }}>Add New</Link>
			</div>

			{
				pageState == 1 ?
				<div className="card">
					<div className="container">
						<div style={{ height: '20rem', backgroundColor: '#cef0cb', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '2rem', margin: '1rem' }}>
							<span className="loader"></span>
						</div>
					</div>
				</div>
				: pageState == 2 ?
				<div className="card">
					<div className="container">
						<Table
							headers={['Sl.', 'Name', 'Address', 'Email', 'Added on', 'Action']}
							data={data}
							current_page={tablePage}
							data_count={customerCount}
							custom_styles = {["3rem", "5rem", "8rem", "5rem", "8rem", "10rem"]}
							tablePageChangeFunc = {setTablePage}
						/>
					</div>
				</div>
				:
				<div className="card">
					<div className="container">
						<div style={{ display: "flex", height: "10rem", backgroundColor: "#e6bfbf", border: "2px red dotted", borderRadius: "2rem", alignItems: "center", justifyContent: "center", margin: "1rem"}}>
							<div>
								
							</div>
							<div style={{ fontSize: 'x-large', fontWeight: 'bold', color: 'white', fontFamily: 'cursive'}}>
								Something went wrong!
							</div>
						</div>
					</div>
				</div>
			}
		</div>
	)
}

export default Customer