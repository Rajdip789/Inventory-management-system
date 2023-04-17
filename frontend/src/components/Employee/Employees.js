import React, { useEffect, useState } from 'react'
import { Link } from "react-router-dom"
import Modal from 'react-bootstrap/Modal';
import './Employees.scss'
import Table from '../Table/Table'

import moment from 'moment'
import swal from 'sweetalert';
import Loader from '../PageStates/Loader';
import Error from '../PageStates/Error';

function Employees() {
	const [pageState, setPageState] = useState(1)
	const [permission, setPermission] = useState(null)

	const [employees, setEmployees] = useState([])
	const [empCount, setEmpCount] = useState(0)

	const [searchInput, setSearchInput] = useState("")
	const [sortColumn, setSortColumn] = useState("")
	const [sortOrder, setSortOrder] = useState("")
	const [tablePage, setTablePage] = useState(1)
	const [data, setData] = useState([])

	// Modal related state variables
	const [editModalShow, setEditModalShow] = useState(false)

	const [editEmployeeId, setEditEmployeeId] = useState(null)
	const [editName, setEditName] = useState('')
	const [editAddress, setEditAddress] = useState('')
	const [editEmail, setEditEmail] = useState('')

	const [editModalSubmitButton, setEditModalSubmitButton] = useState(false)

	useEffect(() => {

		fetch(`${process.env.REACT_APP_BACKEND_ORIGIN}/verifiy_token`, {
			method: 'POST',
			credentials: 'include'
		})
			.then(async (response) => {
				let body = await response.json()
				
				if (body.operation === 'success') {

					fetch(`${process.env.REACT_APP_BACKEND_ORIGIN}/get_permission`, {
						method: 'POST',
						credentials: 'include'
					})
						.then(async (response) => {
							let body = await response.json()

							//console.log(JSON.parse(body.info));
							let p = JSON.parse(body.info).find(x => x.page === 'employees')
							if (p.view !== true) {
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
	}, [])


	const getEmployees = async (sv, sc, so, scv) => {
		let result = await fetch(`${process.env.REACT_APP_BACKEND_ORIGIN}/get_employees`, {
			method: 'POST',
			headers: {
				'Content-type': 'application/json; charset=UTF-8'
			},
			body: JSON.stringify({ start_value: sv, sort_column: sc, sort_order: so, search_value: scv }),
			credentials: 'include',
		})

		let body = await result.json()
		setEmployees(body.info.employees)
		setEmpCount(body.info.count)
	}

	useEffect(() => {
		if (permission !== null) {
			let p1 = getEmployees((tablePage - 1) * 10, sortColumn, sortOrder, searchInput);
			Promise.all([p1])
				.then(() => {
					//console.log('All apis done')
					setPageState(2);
				})
				.catch((err) => {
					console.log(err)
					setPageState(3)
				})
		}
	}, [permission])

	useEffect(() => {
		if (permission !== null)
			getEmployees((tablePage - 1) * 10, sortColumn, sortOrder, searchInput);
	}, [tablePage, sortColumn, sortOrder, searchInput])



	const deleteEmployee = async (id) => {
		let result = await fetch(`${process.env.REACT_APP_BACKEND_ORIGIN}/delete_employee`, {
			method: 'POST',
			headers: {
				'Content-type': 'application/json; charset=UTF-8'
			},
			body: JSON.stringify({ user_id: id }),			
			credentials: 'include',
		})

		let body = await result.json()
		if (body.operation === 'success') {
			getEmployees((tablePage - 1) * 10, sortColumn, sortOrder, searchInput);
			swal('Success', body.message, 'success')
		} else {
			swal('Oops!', 'Something went wrong', 'error')
		}
	}

	useEffect(() => {
		if (employees.length !== 0) {
			let tArray = employees.map((obj, i) => {

				let tObj = {}
				tObj.sl = i + 1;
				tObj.name = obj.user_name;
				tObj.address = obj.address;
				tObj.email = obj.email;
				tObj.addedon = moment(obj.timeStamp).format('MMMM Do, YYYY');
				tObj.action =
					<>
						<button className='btn warning' style={{ marginRight: '0.5rem' }} onClick={() => { editModalInit(obj.user_id) }}>View/Edit</button>
						{
							permission.delete &&
							<button className='btn danger' style={{ marginLeft: '0.5rem' }}
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
			setData(tArray)
		}
	}, [employees])

	const editModalInit = (id) => {
		let p = employees.find(x => x.user_id === id)
		setEditEmployeeId(p.user_id)

		setEditName(p.user_name)
		setEditEmail(p.email)
		setEditAddress(p.address)

		setEditModalShow(true);
	}

	const updateEmployee = async () => {
		if (editName === "") {
			swal("Oops!", "Name can't be empty", "error")
			return;
		}

		if (editEmail === "") {
			swal("Oops!", "Email can't be empty", "error")
			return;
		}

		let regex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-z]+)$/;
		if (!regex.test(editEmail)) {
			swal("Oops!", "Please enter valid email", "error")
			return;
		}

		let obj = {}
		obj.user_id = editEmployeeId;
		obj.name = editName;
		obj.address = editAddress;
		obj.email = editEmail;

		//console.log(Array.from(f.values()).map(x => x).join(", "))
		//console.log(obj)
		setEditModalSubmitButton(true);

		let response = await fetch(`${process.env.REACT_APP_BACKEND_ORIGIN}/update_employee`, {
			method: 'POST',
			headers: {
				'Content-type': 'application/json; charset=UTF-8'
			},
			body: JSON.stringify(obj),			
			credentials: 'include',
		})
		let body = await response.json()

		setEditModalSubmitButton(false)
		//console.log(body)

		if (body.operation === 'success') {
			console.log('Employee updated successfully')
			swal("Success!", "Employee updated successfully", "success")
			handleEditModalClose()
			getEmployees((tablePage - 1) * 10, sortColumn, sortOrder, searchInput)
		} else {
			swal("Oops!", body.message, "error")
		}
	}

	const handleEditModalClose = () => {
		setEditModalShow(false);

		setEditEmployeeId(null)
		setEditName('')
		setEditAddress('')
		setEditEmail('')
	}

	return (
		<div className='employees'>
			<div style={{ overflow: "scroll", height: "100%" }}>
				<div className='employee-header'>
					<div className='title'>Employees</div>
					<Link to={"/employees/addnew"} className='btn success' style={{ margin: "0 0.5rem", textDecoration: "none" }}>Add New</Link>
				</div>

				{
					pageState === 1 ?
						<Loader />
						: pageState === 2 ?
							<div className="card">
								<div className="container">
									<Table
										headers={['Sl.', 'Name', 'Address', 'Email', 'Added on', 'Action']}
										columnOriginalNames={["user_name", "address", "email", "timeStamp"]}
										sortColumn={sortColumn}
										setSortColumn={setSortColumn}
										sortOrder={sortOrder}
										setSortOrder={setSortOrder}
										data={data}
										data_count={empCount}
										searchInput={searchInput}
										setSearchInput={setSearchInput}
										custom_styles={["3rem", "5rem", "6rem", "rem", "8rem", "8rem"]}
										current_page={tablePage}
										tablePageChangeFunc={setTablePage}
									/>
								</div>
							</div>
							:
							<Error />
				}

				<Modal show={editModalShow} onHide={() => { handleEditModalClose() }} size="l" centered >
					<Modal.Header closeButton>
						<Modal.Title className='fs-4 fw-bold' style={{ color: "#2cd498" }}>View / Edit Employee</Modal.Title>
					</Modal.Header>
					<Modal.Body style={{ backgroundColor: "#fafafa" }} >
						<div className='container d-flex gap-2'>
							<div className='card my_card' style={{ flex: 1 }}>
								<div className='card-body'>
									<div className='form-group mb-2'>
										<label className='fst-italic fw-bold'>Name</label>
										<input className='my_form_control' type='text' value={editName} onChange={(e) => { setEditName(e.target.value) }} />
									</div>
									<div className='form-group mb-2'>
										<label className='fst-italic fw-bold'>Address</label>
										<input className='my_form_control' type='text' value={editAddress} onChange={(e) => { setEditAddress(e.target.value) }} />
									</div>
									<div className='form-group mb-2'>
										<label className='fst-italic fw-bold'>Email</label>
										<input className='my_form_control' type='text' value={editEmail} onChange={(e) => { setEditEmail(e.target.value) }} />
									</div>
								</div>
							</div>
						</div>
					</Modal.Body>
					<Modal.Footer>
						<button className='btn btn-outline-danger' style={{ transition: "color 0.4s, background-color 0.4s" }} onClick={() => { handleEditModalClose() }}>Cancel</button>
						<button className='btn btn-outline-success' style={{ transition: "color 0.4s, background-color 0.4s" }}
							onClick={(e) => {
								swal({
									title: "Are you sure?",
									icon: "warning",
									buttons: true,
									dangerMode: true,
								})
									.then((willDelete) => {
										if (willDelete) {
											updateEmployee()
										}
									});
							}}
						>Update
						</button>
					</Modal.Footer>
				</Modal>
			</div>
		</div>
	)
}

export default Employees