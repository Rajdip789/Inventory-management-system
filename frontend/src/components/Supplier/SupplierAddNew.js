import React, { useEffect, useState, useRef } from 'react'
import './SupplierAddNew.scss'

import moment from 'moment'
import swal from 'sweetalert';
import { setCookie, getCookie } from '../../cookie';

function SupplierAddNew() {
	const [pageState, setPageState] = useState(1)
	const [permission, setPermission] = useState(null)

	const [name, setName] = useState('')
	const [address, setAddress] = useState('')
	const [email, setEmail] = useState('')

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
						let p = JSON.parse(body.info).find(x => x.page == 'suppliers')
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

	const insertSupplier = async () => {
		if (name == "") {
			swal("Oops!", "Name can't be empty", "error")
			return;
		}

		if (address == "") {
			swal("Oops!", "Address can't be empty", "error")
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

		let obj = {}
		obj.name = name;
		obj.address = address;
		obj.email = email;

		setSubmitButtonState(true)

		let response = await fetch(`${process.env.REACT_APP_BACKEND_ORIGIN}/add_supplier`, {
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
			console.log('Supplier added successfully')
			swal("Success!", "Supplier added successfully", "success")

			setName('')
			setAddress('')
			setEmail('')
		} else {
			swal("Oops!", body.message, "error")
		}
	}
	
	return (
		<div className='supplieraddnew'>
			<div className='supplier-header'>
				<div className='title'>Add New Supplier</div>
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
								</div>								
							</div>
						</div>

						{ 
							permission.create && 
							<button className='btn success' style={{alignSelf:"center", marginTop: "1rem"}} disabled={submitButtonState} onClick={() => {insertSupplier()}} >
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

export default SupplierAddNew