import React, { useEffect, useState } from 'react'
import {Link} from "react-router-dom"
import './Orders.scss'
import Table from '../Table/Table'

import moment from 'moment'
import swal from 'sweetalert';
import { setCookie, getCookie } from '../../cookie';

function Orders() {
	const [pageState, setPageState] = useState(1)
	const [permission, setPermission] = useState(null)

	const [orders, setOrders] = useState([])
	const [orderCount, setOrderCount] = useState(0)

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
						let p = JSON.parse(body.info).find(x => x.page == 'orders')
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


	const getOrders = async (value) => {
		let result = await fetch(`${process.env.REACT_APP_BACKEND_ORIGIN}/get_orders`, {
			method: 'POST',
			headers: {
				'Content-type': 'application/json; charset=UTF-8',
				'access_token': getCookie('accessToken'),
			},
			body : JSON.stringify({start_value : value})
		})

		let body = await result.json()
		setOrders(body.info.orders)
		setOrderCount(body.info.count)
	}

	useEffect(() => {
		if (permission != null) {
			let p1 = getOrders((tablePage-1)*10);
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
			getOrders((tablePage-1)*10);
	}, [tablePage])
	


	const deleteOrder = async(id) => {
		let result = await fetch(`${process.env.REACT_APP_BACKEND_ORIGIN}/delete_order`, {
			method: 'POST',
			headers: {
				'Content-type': 'application/json; charset=UTF-8',
				'access_token': getCookie('accessToken'),
			},
			body : JSON.stringify({order_id : id})
		})

		let body = await result.json()
		if(body.operation == 'success') {
			getOrders((tablePage-1)*10);
			swal('Success', body.message, 'success')
		} else {
			swal('Oops!', 'Something went wrong', 'error')
		}
	}

	useEffect(() => {
		if(orders.length != 0) {
			let tArray = orders.map((obj, i) => {
				let tObj = {}
				tObj.sl = i + 1;
				tObj.order_ref = obj.order_ref;
				tObj.customer_name = obj.customer_name;	
				tObj.due_date = moment(obj.due_date).format('MMMM Do, YYYY');
				tObj.grand_total = obj.grand_total;
				tObj.addedon = moment(obj.timeStamp).format('MMMM Do, YYYY');
				tObj.action = 
				<>
					<button className='btn warning' style={{marginRight: '0.5rem'}}>View</button>				
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
										deleteOrder(obj.order_id)
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
	}, [orders])
	
	return (
		<div className='orders'>
			<div className='order-header'>
				<div className='title'>Orders</div>
				<Link to={"/orders/addnew"} className='btn success' style={{ margin: "0 0.5rem",textDecoration:"none" }}>Add New</Link> 
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
									headers={['Sl.', 'Order Ref.', 'Customer Name', 'Due date', 'Grand Total', 'Added on', 'Action']}
									data={data}
									current_page={tablePage}
									data_count={orderCount}
									custom_styles = {["3rem", "5rem", "5rem", "8rem", "5rem", "8rem", "10rem"]}
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

export default Orders