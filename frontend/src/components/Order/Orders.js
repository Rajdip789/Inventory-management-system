import React, { useEffect, useState } from 'react'
import { Link } from "react-router-dom"
import { Modal, OverlayTrigger, Popover } from 'react-bootstrap';
import './Orders.scss'
import Table from '../Table/Table'

import moment from 'moment'
import swal from 'sweetalert';
import Loader from '../PageStates/Loader';
import Error from '../PageStates/Error';

function Orders() {
	const [pageState, setPageState] = useState(1)
	const [permission, setPermission] = useState(null)

	const [orders, setOrders] = useState([])
	const [orderCount, setOrderCount] = useState(0)

	const [searchInput, setSearchInput] = useState("")
	const [sortColumn, setSortColumn] = useState("")
	const [sortOrder, setSortOrder] = useState("")
	const [tablePage, setTablePage] = useState(1)
	const [data, setData] = useState([])

	// Modal related state variables
	const [viewModalShow, setViewModalShow] = useState(false)
	const [viewOrderDetails, setViewOrderDetails] = useState(null)
	const [productDetails, setProductDetails] = useState([])

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
							let p = JSON.parse(body.info).find(x => x.page === 'orders')
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


	const getOrders = async (sv, sc, so, scv) => {
		let result = await fetch(`${process.env.REACT_APP_BACKEND_ORIGIN}/get_orders`, {
			method: 'POST',
			headers: {
				'Content-type': 'application/json; charset=UTF-8'
			},
			body: JSON.stringify({ start_value: sv, sort_column: sc, sort_order: so, search_value: scv }),
			credentials: 'include'
		})

		let body = await result.json()
		setOrders(body.info.orders)
		setOrderCount(body.info.count)
	}

	const getProductsDetailsById = async (value) => {
		let result = await fetch(`${process.env.REACT_APP_BACKEND_ORIGIN}/get_products_details_by_id`, {
			method: 'POST',
			headers: {
				'Content-type': 'application/json; charset=UTF-8'
			},
			body: JSON.stringify({ product_id_list: value }),
			credentials: 'include'
		})

		let body = await result.json()
		setProductDetails(body.info.products);
	}

	useEffect(() => {
		if (permission !== null) {
			let p1 = getOrders((tablePage - 1) * 10, sortColumn, sortOrder, searchInput);
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
			getOrders((tablePage - 1) * 10, sortColumn, sortOrder, searchInput);
	}, [tablePage, sortColumn, sortOrder, searchInput])



	const deleteOrder = async (id) => {
		let result = await fetch(`${process.env.REACT_APP_BACKEND_ORIGIN}/delete_order`, {
			method: 'POST',
			headers: {
				'Content-type': 'application/json; charset=UTF-8'
			},
			body: JSON.stringify({ order_id: id }),
			credentials: 'include'
		})

		let body = await result.json()
		if (body.operation === 'success') {
			getOrders((tablePage - 1) * 10, sortColumn, sortOrder, searchInput);
			swal('Success', body.message, 'success')
		} else {
			swal('Oops!', 'Something went wrong', 'error')
		}
	}

	useEffect(() => {
		if (orders.length !== 0) {
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
						<button className='btn warning' style={{ marginRight: '0.5rem' }} onClick={() => { viewModalInit(obj.order_id) }}>View</button>
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

	const viewModalInit = (id) => {
		let p = orders.find(x => x.order_id === id)
		setViewOrderDetails(p)
		setViewModalShow(true);

		getProductsDetailsById(JSON.parse(p.items).map(x => x.product_id))
	}

	const handleViewModalClose = () => {
		setViewModalShow(false);
		setViewOrderDetails(null)
		setProductDetails([])
	}

	return (
		<div className='orders'>
			<div style={{ overflow: "scroll", height: "100%" }} >
				<div className='order-header'>
					<div className='title'>Orders</div>
					<Link to={"/orders/addnew"} className='btn success' style={{ margin: "0 0.5rem", textDecoration: "none" }}>Add New</Link>
				</div>

				{
					pageState === 1 ?
						<Loader />
						: pageState === 2 ?
							<div className="card">
								<div className="container">
									<Table
										headers={['Sl.', 'Order Ref.', 'Customer Name', 'Due date', 'Grand Total', 'Added on', 'Action']}
										columnOriginalNames={["order_ref", "name", "due_date", "grand_total", "timeStamp"]}
										sortColumn={sortColumn}
										setSortColumn={setSortColumn}
										sortOrder={sortOrder}
										setSortOrder={setSortOrder}
										data={data}
										data_count={orderCount}
										searchInput={searchInput}
										setSearchInput={setSearchInput}
										custom_styles={["3rem", "5rem", "5rem", "8rem", "5rem", "8rem", "10rem"]}
										current_page={tablePage}
										tablePageChangeFunc={setTablePage}
									/>
								</div>
							</div>
							:
							<Error />
				}

				<Modal show={viewModalShow} onHide={() => { handleViewModalClose() }} size="lg" centered >
					<Modal.Header closeButton>
						<Modal.Title className='fs-4 fw-bold' style={{ color: "#2cd498" }}>View Order</Modal.Title>
					</Modal.Header>
					<Modal.Body style={{ backgroundColor: "#fafafa" }} >
						<div className='container d-flex gap-2'>
							<div className='card my_card' style={{ flex: 1 }}>
								<div className='card-body'>
									{
										viewOrderDetails !== null &&
										<>
											<div className='form-group mb-2'>
												<label className='fst-italic fw-bold'>Order Reference</label>
												<input className='my_form_control' type='text' value={viewOrderDetails.order_ref} readOnly />
											</div>
											<div className='form-group mb-2'>
												<label className='fst-italic fw-bold'>Customer Name</label>
												<input className='my_form_control' type='text' value={viewOrderDetails.customer_name} readOnly />
											</div>
											<div className='form-group mb-2'>
												<label className='fst-italic fw-bold'>Due Date</label>
												<input className='my_form_control' type='text' value={moment(viewOrderDetails.due_date).format('MMMM Do, YYYY')} readOnly />
											</div>
											<div className='form-group mb-2'>
												<label className='fst-italic fw-bold'>Tax</label>
												<input className='my_form_control' type='text' value={`${viewOrderDetails.tax}%`} readOnly />
											</div>
											<div className='form-group mb-2'>
												<label className='fst-italic fw-bold'>Grand Total</label>
												<input className='my_form_control' type='text' value={viewOrderDetails.grand_total} readOnly />
											</div>
											<div className='form-group mb-2'>
												<label className='fst-italic fw-bold mb-2'>Item Details:</label>
												<div className='p-2 border rounded'>
													<div className='mb-2 row gx-0'>
														<div className='fw-bold text-secondary col-2 d-flex align-items-center text-uppercase justify-content-center' style={{ fontSize: "smaller" }}>Image</div>
														<div className='fw-bold text-secondary col-4 d-flex align-items-center text-uppercase justify-content-start' style={{ fontSize: "smaller" }}>Product Name</div>
														<div className='fw-bold text-secondary col-2 d-flex align-items-center text-uppercase justify-content-center' style={{ fontSize: "smaller" }}>Quantity</div>
														<div className='fw-bold text-secondary col-2 d-flex align-items-center text-uppercase justify-content-center' style={{ fontSize: "smaller" }}>Rate</div>
														<div className='fw-bold text-secondary col-2 d-flex align-items-center text-uppercase justify-content-center' style={{ fontSize: "smaller" }}>Total</div>
													</div>
													{
														productDetails.length > 0 && JSON.parse(viewOrderDetails.items).map((viewItem, ind) => {
															let img = productDetails.find(x => x.product_id === viewItem.product_id).image
															return (
																<div key={ind} className='py-2 row gx-0' style={{ borderBottom: "1px dashed lightgray" }}>
																	<div className='col-2 d-flex align-items-center justify-content-center'>
																		<OverlayTrigger
																			trigger={['hover', 'focus']}
																			placement="left"
																			overlay={
																				(<Popover id="popover-basic" style={{ backgroundColor: "#ebf4ee", boxShadow: "rgb(0 0 0 / 75%) 0px 0px 16px -5px" }}>
																					<Popover.Body style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "3px" }}>
																						{
																							img === null ?
																								<div className='d-flex align-items-center text-dark fs-5 text-center' style={{ width: "10rem", height: "10rem" }}>No image available</div> :
																								<img style={{ "width": "14rem", "borderRadius": "5px" }} src={`${process.env.REACT_APP_BACKEND_ORIGIN}/uploads/${img}`} alt="product" />
																						}
																					</Popover.Body>
																				</Popover>)
																			}
																		>
																			<img style={{ "width": "60px", "height": "60px", "borderRadius": "5px", "objectFit": "cover", cursor: "pointer" }} src={img === null ? "https://lh3.googleusercontent.com/SMKEdK_g-LuC3ero8vP9d4lPJBKyzc4t91-GYLQ1vEkhv87KyaxFmWFeEb6ZcyRNet0" : `${process.env.REACT_APP_BACKEND_ORIGIN}/uploads/${img}`} alt="product" />
																		</OverlayTrigger>
																	</div>
																	<div className='col-4 d-flex align-items-center justify-content-start'>{viewItem.product_name}</div>
																	<div className='col-2 d-flex align-items-center justify-content-center'>{viewItem.quantity}</div>
																	<div className='col-2 d-flex align-items-center justify-content-center'>{viewItem.rate}</div>
																	<div className='col-2 d-flex align-items-center justify-content-center'>{viewItem.rate * viewItem.quantity}</div>
																</div>
															)
														})
													}
												</div>
											</div>
										</>
									}
								</div>
							</div>
						</div>
					</Modal.Body>
					<Modal.Footer>
						<button className='btn btn-outline-danger' style={{ transition: "color 0.4s, background-color 0.4s" }} onClick={() => { handleViewModalClose() }}>Cancel</button>
					</Modal.Footer>
				</Modal>
			</div>
		</div>
	)
}

export default Orders