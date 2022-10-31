import React, { useEffect, useState } from 'react'
import {Link} from "react-router-dom"
import './Employees.scss'
import Table from '../Table/Table'

import moment from 'moment'
import swal from 'sweetalert';
import { setCookie, getCookie } from '../../cookie';

function Employees() {
	const [pageState, setPageState] = useState(1)
	const [permission, setPermission] = useState(null)

	const [employees, setEmployees] = useState([])
	const [empCount, setEmpCount] = useState(0)

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
						let p = JSON.parse(body.info).find(x => x.page == 'employees')
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


	const getEmployees = async (value) => {
		let result = await fetch(`${process.env.REACT_APP_BACKEND_ORIGIN}/get_employees`, {
			method: 'POST',
			headers: {
				'Content-type': 'application/json; charset=UTF-8',
				'access_token': getCookie('accessToken'),
			},
			body : JSON.stringify({start_value : value})
		})

		let body = await result.json()
		setEmployees(body.info.employees)
		setEmpCount(body.info.count)
	}

	useEffect(() => {
		if (permission != null) {
			let p1 = getEmployees((tablePage-1)*10);
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
			getEmployees((tablePage-1)*10);
	}, [tablePage])
	


	const deleteEmployee = async(id) => {
		let result = await fetch(`${process.env.REACT_APP_BACKEND_ORIGIN}/delete_employee`, {
			method: 'POST',
			headers: {
				'Content-type': 'application/json; charset=UTF-8',
				'access_token': getCookie('accessToken'),
			},
			body : JSON.stringify({employee_id : id})
		})

		let body = await result.json()
		if(body.operation == 'success') {
			getEmployees((tablePage-1)*10);
			swal('Success', body.message, 'success')
		} else {
			swal('Oops!', 'Something went wrong', 'error')
		}
	}

	useEffect(() => {
		if(employees.length != 0) {
			//console.log(employees)
			let tArray = employees.map((obj, i) => {
				let tObj = {}
				tObj.sl = i + 1;
				tObj.name = obj.user_name;
				tObj.address = obj.address;
				tObj.email = obj.email;
				tObj.addedon = moment(obj.timeStamp).format('MMMM Do, YYYY');
				tObj.action = 
				<>
					{/* <button className='btn warning' style={{marginRight: '0.5rem'}}>View/Edit</button> */}
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
										deleteEmployee(obj.user_id)
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
	}, [employees])
	
	return (
		<div className='employees'>
			<div className='employee-header'>
				<div className='title'>Employees</div>
				<Link to={"/employees/addnew"} className='btn success' style={{ margin: "0 0.5rem",textDecoration:"none" }}>Add New</Link>
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
									data_count={empCount}
									custom_styles = {["3rem", "5rem", "6rem", "rem", "8rem", "8rem"]}
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

export default Employees