import React, { useEffect, useState } from 'react'
import {Link} from "react-router-dom"
import './Suppliers.scss'
import Table from '../Table/Table'

import moment from 'moment'
import swal from 'sweetalert';
import { setCookie, getCookie } from '../../cookie';

function Suppliers() {
	const [pageState, setPageState] = useState(1)
	const [permission, setPermission] = useState(null)

	const [suppliers, setSuppliers] = useState([])
	const [supplierCount, setSupplierCount] = useState(0)

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
						let p = JSON.parse(body.info).find(x => x.page == 'suppliers')
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


	const getSuppliers = async (value) => {
		let result = await fetch(`${process.env.REACT_APP_BACKEND_ORIGIN}/get_suppliers`, {
			method: 'POST',
			headers: {
				'Content-type': 'application/json; charset=UTF-8',
				'access_token': getCookie('accessToken'),
			},
			body : JSON.stringify({start_value : value})
		})

		//await new Promise(r => setTimeout(r, 10000))
		

		let body = await result.json()
		setSuppliers(body.info.suppliers)
		setSupplierCount(body.info.count)
	}

	useEffect(() => {
		if (permission != null) {
			let p1 = getSuppliers((tablePage-1)*10);
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
			getSuppliers((tablePage-1)*10);
	}, [tablePage])
	


	const deleteSupplier = async(id) => {
		let result = await fetch(`${process.env.REACT_APP_BACKEND_ORIGIN}/delete_supplier`, {
			method: 'POST',
			headers: {
				'Content-type': 'application/json; charset=UTF-8',
				'access_token': getCookie('accessToken'),
			},
			body : JSON.stringify({supplier_id : id})
		})

		let body = await result.json()
		if(body.operation == 'success') {
			getSuppliers((tablePage-1)*10);
			swal('Success', body.message, 'success')
		} else {
			swal('Oops!', 'Something went wrong', 'error')
		}
	}

	useEffect(() => {
		if(suppliers.length != 0) {
			//console.log(suppliers)
			let tArray = suppliers.map((obj, i) => {
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
										deleteSupplier(obj.supplier_id)
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
	}, [suppliers])
	
	return (
		<div className='suppliers'>
			<div className='supplier-header'>
				<div className='title'>Suppliers</div>
				<Link to={"/suppliers/addnew"} className='btn success' style={{ margin: "0 0.5rem",textDecoration:"none" }}>Add New</Link>
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
									data_count={supplierCount}
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

export default Suppliers