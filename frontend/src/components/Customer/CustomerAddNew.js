import React, { useEffect, useState } from 'react'
import './CustomerAddNew.scss'

import swal from 'sweetalert';
import Loader from '../PageStates/Loader';
import Error from '../PageStates/Error';

function CustomerAddNew() {
	const [pageState, setPageState] = useState(1)
	const [permission, setPermission] = useState(null)

	const [name, setName] = useState('')
	const [address, setAddress] = useState('')
	const [email, setEmail] = useState('')

	const [submitButtonState, setSubmitButtonState] = useState(false)

	useEffect(() => {

		fetch(`${process.env.REACT_APP_BACKEND_ORIGIN}/verifiy_token`, {
			method: 'POST',
			credentials: 'include'
		})
			.then(async (response) => {
				let body = await response.json()
				// console.log(body)
				if (body.operation === 'success') {

					fetch(`${process.env.REACT_APP_BACKEND_ORIGIN}/get_permission`, {
						method: 'POST',
						credentials: 'include'
					})
						.then(async (response) => {
							let body = await response.json()

							//console.log(JSON.parse(body.info));
							let p = JSON.parse(body.info).find(x => x.page === 'customers')
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
	}, [])

	useEffect(() => {
		if (permission !== null) {
			setPageState(2);
		}
	}, [permission])

	const insertCustomer = async () => {
		if (name === "") {
			swal("Oops!", "Name can't be empty", "error")
			return;
		}

		if (address === "") {
			swal("Oops!", "Address can't be empty", "error")
			return;
		}

		if (email === "") {
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

		let response = await fetch(`${process.env.REACT_APP_BACKEND_ORIGIN}/add_customer`, {
			method: 'POST',
			headers: {
				'Content-type': 'application/json; charset=UTF-8'
			},
			body: JSON.stringify(obj),
			credentials: 'include'
		})
		let body = await response.json()

		setSubmitButtonState(false)
		//console.log(body)

		if (body.operation === 'success') {
			console.log('Customer added successfully')
			swal("Success!", "Customer added successfully", "success")

			setName('')
			setAddress('')
			setEmail('')
		} else {
			swal("Oops!", body.message, "error")
		}
	}

	return (
		<div className='customeraddnew'>
			<div className='customer-header'>
				<div className='title'>Add New Customer</div>
				{/* breadcrumb */}
			</div>

			{
				pageState === 1 ?
					<Loader />
					: pageState === 2 ?
						<div className="card">
							<div className="container" style={{ display: "flex", flexDirection: "column" }}>

								<div style={{ display: "flex", justifyContent: "space-evenly" }}>
									<div className="right" >
										<div className="row" style={{ display: 'flex', marginTop: "0.5rem" }}>
											<div className='col'>
												<label>Name</label>
												<input className='my_input' type='text' value={name} onChange={(e) => { setName(e.target.value) }} />
											</div>
											<div className='col'>
												<label>Email</label>
												<input className='my_input' type='email' value={email} onChange={(e) => { setEmail(e.target.value) }} />
											</div>
										</div>
										<div className="row" style={{ display: 'flex', marginTop: "0.5rem" }}>
											<div className='col'>
												<label>Address</label>
												<input className='my_input' type='text' value={address} onChange={(e) => { setAddress(e.target.value) }} />
											</div>
										</div>
									</div>
								</div>

								{
									permission.create &&
									<button className='btn success' style={{ alignSelf: "center", marginTop: "1rem" }} disabled={submitButtonState} onClick={() => { insertCustomer() }} >
										{!submitButtonState ? <span>Submit</span> : <span><div className="button-loader"></div></span>}
									</button>
								}
							</div>
						</div>
						:
						<Error />
			}
		</div>
	)
}

export default CustomerAddNew