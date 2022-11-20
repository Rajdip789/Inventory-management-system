import React, { useEffect, useState, useRef } from 'react'
import './EmployeeAddNew.scss'

import moment from 'moment'
import swal from 'sweetalert';
import CryptoJS from 'crypto-js';
import { setCookie, getCookie } from '../../cookie';

function EmployeeAddNew() {
	const [pageState, setPageState] = useState(1)
	const [permission, setPermission] = useState(null)

	const [name, setName] = useState('')
	const [address, setAddress] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	const [submitButtonState, setSubmitButtonState] = useState(false)

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
						if (p.view && p.create) {
							setPermission(p)
						} else {
							window.location.href = '/unauthorized';
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

	useEffect(() => {
		if (permission != null) {
			setPageState(2);
		}
	}, [permission])

	const insertEmployee = async () => {
		if (name == "") {
			swal("Oops!", "Name can't be empty", "error")
			return;
		}

		if (email == "") {
			swal("Oops!", "Email can't be empty", "error")
			return;
		}

		let regex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-z]+)$/;
		if (!regex.test(email)) {
			swal("Oops!", "Please enter valid email", "error")
			return;
		}

		if (password == "") {
			swal("Oops!", "Password can't be empty", "error")
			return;
		}

		let obj = {}
		obj.name = name;
		obj.address = address;
		obj.email = email;
		obj.password = CryptoJS.AES.encrypt(password, process.env.REACT_APP_CRYPTOJS_SEED).toString();

		setSubmitButtonState(true)

		let response = await fetch(`${process.env.REACT_APP_BACKEND_ORIGIN}/add_employee`, {
			method: 'POST',
			headers: {
				'Content-type': 'application/json; charset=UTF-8',
				'access_token': getCookie('accessToken')
			},
			body: JSON.stringify(obj)
		})
		let body = await response.json()

		setSubmitButtonState(false)
		console.log(body)

		if (body.operation == 'success') {
			console.log('Employee added successfully')
			swal("Success!", "Employee added successfully", "success")

			setName('')
			setAddress('')
			setEmail('')
			setPassword('')
		} else {
			swal("Oops!", body.message, "error")
		}
	}
	
	return (
		<div className='employeeaddnew'>
			<div className='employee-header'>
				<div className='title'>Add New Employee</div>
				{/* breadcrumb */}
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
					<div className="container" style={{display:"flex",flexDirection:"column"}}>

						<div style={{display:"flex", justifyContent: "space-evenly"}}>
							<div className="right" >									
								<div className="row" style={{display : 'flex', marginTop: "0.5rem"}}>
									<div className='col'>
										<label>Name</label>
										<input className='my_input' type='text' value={name} onChange={(e)=>{setName(e.target.value)}} />
									</div>
									<div className='col'>
										<label>Address</label>
										<input className='my_input' type='text' value={address} onChange={(e)=>{setAddress(e.target.value)}} />
									</div>
								</div>	
								<div className="row" style={{display : 'flex', marginTop: "0.5rem"}}>
									<div className='col'>
										<label>Email</label>
										<input className='my_input' type='email' value={email} onChange={(e)=>{setEmail(e.target.value)}} />
									</div>
									<div className='col'>
										<label>Password</label>
										<input className='my_input' type='password' value={password} onChange={(e)=>{setPassword(e.target.value)}} />
									</div>
								</div>								
							</div>
						</div>

						{ 
							permission.create && 
							<button className='btn success' style={{alignSelf:"center", marginTop: "1rem"}} disabled={submitButtonState} onClick={() => {insertEmployee()}} >
								{!submitButtonState ? <span>Submit</span>:<span><div className="button-loader"></div></span>}
							</button>
						}	
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

export default EmployeeAddNew