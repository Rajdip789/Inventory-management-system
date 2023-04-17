import React, { useEffect, useRef, useState } from 'react'
import { Link } from "react-router-dom"
import Modal from 'react-bootstrap/Modal';
import './Products.scss'
import Table from '../Table/Table'

import moment from 'moment'
import swal from 'sweetalert';

import DeleteOutline from '@mui/icons-material/DeleteOutline';
import Loader from '../PageStates/Loader';
import Error from '../PageStates/Error';

function Products() {
	const [pageState, setPageState] = useState(1)
	const [permission, setPermission] = useState(null)

	const [products, setProducts] = useState([])
	const [prodCount, setProdCount] = useState(0)

	const [searchInput, setSearchInput] = useState("")
	const [sortColumn, setSortColumn] = useState("")
	const [sortOrder, setSortOrder] = useState("")
	const [tablePage, setTablePage] = useState(1)
	const [data, setData] = useState([])

	// Modal related state variables
	const [editModalShow, setEditModalShow] = useState(false)

	const [editProductId, setEditProductId] = useState(null)
	const [editName, setEditName] = useState('')
	const [editGender, setEditGender] = useState("male")
	const [editSize, setEditSize] = useState('')
	const [editMaterial, setEditMaterial] = useState('')
	const [editCategory, setEditCategory] = useState('')
	const [editDescription, setEditDescription] = useState('')
	const [editStock, setEditStock] = useState('0')
	const [editSellingPrice, setEditSellingPrice] = useState('0')
	const [editPurchasePrice, setEditPurchasePrice] = useState('0')

	const [editOldImage, setEditOldImage] = useState(null)

	const [editImage, setEditImage] = useState('')
	const editFileInputRef = useRef(null)
	const [editImageData, setEditImageData] = useState(null)

	const [editModalSubmitButton, setEditModalSubmitButton] = useState(false)


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
							let p = JSON.parse(body.info).find(x => x.page === 'products')
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


	const getProducts = async (sv, sc, so, scv) => {
		let result = await fetch(`${process.env.REACT_APP_BACKEND_ORIGIN}/get_products`, {
			method: 'POST',
			headers: {
				'Content-type': 'application/json; charset=UTF-8'
			},
			body: JSON.stringify({ start_value: sv, sort_column: sc, sort_order: so, search_value: scv }),
			credentials: 'include'
		})

		let body = await result.json()
		setProducts(body.info.products)
		setProdCount(body.info.count)
	}

	useEffect(() => {
		if (permission !== null) {
			let p1 = getProducts((tablePage - 1) * 10, sortColumn, sortOrder, searchInput);
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
			getProducts((tablePage - 1) * 10, sortColumn, sortOrder, searchInput);
	}, [tablePage, sortColumn, sortOrder, searchInput])



	const deleteProduct = async (id) => {
		let result = await fetch(`${process.env.REACT_APP_BACKEND_ORIGIN}/delete_product`, {
			method: 'POST',
			headers: {
				'Content-type': 'application/json; charset=UTF-8'
			},
			body: JSON.stringify({ product_id: id }),
			credentials: 'include'
		})

		let body = await result.json()
		if (body.operation === 'success') {
			getProducts((tablePage - 1) * 10, sortColumn, sortOrder, searchInput);
			swal('Success', body.message, 'success')
		} else {
			swal('Oops!', 'Something went wrong', 'error')
		}
	}

	useEffect(() => {
		if (products.length !== 0) {
			let tArray = products.map((obj, i) => {
				let tObj = {}
				tObj.sl = i + 1;
				tObj.name = obj.name;
				tObj.gender = obj.gender;
				tObj.size = obj.size;
				tObj.stock = obj.product_stock;
				tObj.addedon = moment(obj.timeStamp).format('MMMM Do, YYYY');
				tObj.action =
					<>
						<button className='btn warning' style={{ marginRight: '0.5rem' }} onClick={() => { editModalInit(obj.product_id) }}>View/Edit</button>
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
												deleteProduct(obj.product_id)
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
	}, [products])

	const editModalInit = (id) => {
		let p = products.find(x => x.product_id === id)
		setEditProductId(id);

		setEditName(p.name)
		setEditGender(p.gender)
		setEditSize(p.size)
		setEditMaterial(p.material)
		setEditCategory(p.category)
		setEditDescription(p.description)
		setEditStock(p.product_stock.toString())
		setEditOldImage(p.image)
		setEditSellingPrice(p.selling_price.toString())
		setEditPurchasePrice(p.purchase_price.toString())

		setEditModalShow(true);
	}

	const deleteImage = async (id) => {
		let result = await fetch(`${process.env.REACT_APP_BACKEND_ORIGIN}/delete_product_image`, {
			method: 'POST',
			headers: {
				'Content-type': 'application/json; charset=UTF-8'
			},
			body: JSON.stringify({ product_id: id }),
			credentials: 'include'
		})

		let body = await result.json()
		if (body.operation === 'success') {
			getProducts((tablePage - 1) * 10, sortColumn, sortOrder, searchInput)
			setEditOldImage(null)
			swal('Success', body.message, 'success')
		} else {
			swal('Oops!', 'Something went wrong', 'error')
		}
	}

	useEffect(() => {
		if (editImage !== "") {
			let f = new FileReader()
			f.onload = (e) => {
				setEditImageData(e.target.result)
			}
			f.readAsDataURL(editImage)
		}
	}, [editImage])

	const updateProduct = async () => {
		if (editName === "") {
			swal("Oops!", "Name can't be empty", "error")
			return;
		}
		if ((editSellingPrice === "") || (parseFloat(editSellingPrice) <= 0)) {
			swal("Oops!", "Selling Price can't be empty", "error")
			return;
		}
		if ((editPurchasePrice === "") || (parseFloat(editPurchasePrice) <= 0)) {
			swal("Oops!", "Purchase Price can't be empty", "error")
			return;
		}
		if ((editStock < 0) || (parseInt(editStock) < 0)) {
			swal("Oops!", "Product stock can't be negative", "error")
			return;
		}

		let f = new FormData();
		f.append('product_id', editProductId)
		f.append('name', editName)
		f.append('gender', editGender)
		f.append('size', editSize)
		f.append('material', editMaterial)
		f.append('category', editCategory)
		f.append('description', editDescription)
		f.append('product_stock', parseInt(editStock))
		f.append('image', editImage)
		f.append('selling_price', parseFloat(editSellingPrice))
		f.append('purchase_price', parseFloat(editPurchasePrice))

		//console.log(Array.from(f.values()).map(x => x).join(", "))
		setEditModalSubmitButton(true);

		let response = await fetch(`${process.env.REACT_APP_BACKEND_ORIGIN}/update_product`, {
			method: 'POST',
			body: f,
			credentials: 'include'
		})
		let body = await response.json()

		setEditModalSubmitButton(false)
		//console.log(body)

		if (body.operation === 'success') {
			console.log('Product updated successfully')
			swal("Success!", "Product updated successfully", "success")
			handleEditModalClose()
			getProducts((tablePage - 1) * 10, sortColumn, sortOrder, searchInput)
		} else {
			swal("Oops!", body.message, "error")
		}
	}

	const handleEditModalClose = () => {
		setEditModalShow(false);

		setEditProductId(null);
		setEditName('')
		setEditGender("male")
		setEditSize('')
		setEditMaterial('')
		setEditCategory('')
		setEditDescription('')
		setEditStock('0')
		setEditSellingPrice('0')
		setEditPurchasePrice('0')

		setEditOldImage(null)

		setEditImage('')
		setEditImageData(null)
	}

	return (
		<div className='products'>
			<div className='products-scroll' >
				<div className='product-header'>
					<div className='title'>Products</div>
					{permission !== null && permission.create && <Link to={"/products/addnew"} className='btn success' style={{ margin: "0 0.5rem", textDecoration: "none" }}>Add New</Link>}
				</div>

				{
					pageState === 1 ?
						<Loader />
						: pageState === 2 ?
							<div className="card">
								<div className="container">
									<Table
										headers={['Sl.', 'Name', 'Gender', 'Size', 'Current Stock', 'Added on', 'Action']}
										columnOriginalNames={["name", "gender", "size", "product_stock", "timeStamp"]}
										sortColumn={sortColumn}
										setSortColumn={setSortColumn}
										sortOrder={sortOrder}
										setSortOrder={setSortOrder}
										data={data}
										data_count={prodCount}
										searchInput={searchInput}
										setSearchInput={setSearchInput}
										custom_styles={["3rem", "8rem", "5rem", "5rem", "6rem", "8rem", "10rem"]}
										current_page={tablePage}
										tablePageChangeFunc={setTablePage}
									/>
								</div>
							</div>
							:
							<Error />
				}

				<Modal show={editModalShow} onHide={() => { handleEditModalClose() }} size="lg" centered >
					<Modal.Header closeButton>
						<Modal.Title className='fs-4 fw-bold' style={{ color: "#2cd498" }}>View / Edit Product</Modal.Title>
					</Modal.Header>
					<Modal.Body style={{ backgroundColor: "#fafafa" }} >
						<div className='container d-flex gap-2 my_modal_container'>
							<div className='card my_card' style={{ flex: 1 }}>
								<div className='card-body'>
									<div className='form-group mb-2'>
										<label className='fst-italic fw-bold'>Name</label>
										<input className='my_form_control' type='text' value={editName} onChange={(e) => { setEditName(e.target.value) }} />
									</div>
									<div className='form-group mb-2'>
										<label className='fst-italic fw-bold'>Gender</label>
										<div className='d-flex gap-2'>
											<div className="rounded-pill px-2 py-1" style={{ cursor: "pointer", backgroundColor: editGender === "male" ? "#a6eda6" : "" }} onClick={() => { setEditGender("male") }} >Male</div>
											<div className="rounded-pill px-2 py-1" style={{ cursor: "pointer", backgroundColor: editGender === "female" ? "#a6eda6" : "" }} onClick={() => { setEditGender("female") }} >Female</div>
											<div className="rounded-pill px-2 py-1" style={{ cursor: "pointer", backgroundColor: editGender === "others" ? "#a6eda6" : "" }} onClick={() => { setEditGender("others") }} >Others</div>
										</div>
									</div>
									<div className='form-group mb-2'>
										<label className='fst-italic fw-bold'>Size</label>
										<input className='my_form_control' type='text' value={editSize} onChange={(e) => { setEditSize(e.target.value) }} />
									</div>
									<div className='form-group mb-2'>
										<label className='fst-italic fw-bold'>Material</label>
										<input className='my_form_control' type='text' value={editMaterial} onChange={(e) => { setEditMaterial(e.target.value) }} />
									</div>
									<div className='form-group mb-2'>
										<label className='fst-italic fw-bold'>Category</label>
										<input className='my_form_control' type='text' value={editCategory} onChange={(e) => { setEditCategory(e.target.value) }} />
									</div>
									<div className='form-group mb-2'>
										<label className='fst-italic fw-bold'>Description</label>
										<input className='my_form_control' type='text' value={editDescription} onChange={(e) => { setEditDescription(e.target.value) }} />
									</div>
									<div className='form-group mb-2'>
										<label className='fst-italic fw-bold'>Selling Price</label>
										<input className='my_form_control' type='number' value={editSellingPrice} onChange={(e) => { setEditSellingPrice(e.target.value) }} />
									</div>
									<div className='form-group mb-2'>
										<label className='fst-italic fw-bold'>Purchase Price</label>
										<input className='my_form_control' type='number' value={editPurchasePrice} onChange={(e) => { setEditPurchasePrice(e.target.value) }} />
									</div>
									<div className='form-group mb-2'>
										<label className='fst-italic fw-bold'>Stock</label>
										<input className='my_form_control' type='number' value={editStock} onChange={(e) => { setEditStock(e.target.value) }} />
									</div>
								</div>
							</div>
							<div className='card my_card' style={{ flex: 1 }}>
								<div className='card-body d-flex flex-column align-items-center'>
									{
										editOldImage !== null ?
											<>
												<img src={`${process.env.REACT_APP_BACKEND_ORIGIN}/uploads/${editOldImage}`} alt="product_image" className='rounded' style={{ width: "90%", margin: "15px", border: "1px #89c878 solid" }} />
												<button className='btn my_btn'
													onClick={() => {
														swal({
															title: "Are you sure?",
															text: "Once deleted, you will not be able to recover this image!",
															icon: "warning",
															buttons: true,
															dangerMode: true,
														})
															.then((willDelete) => {
																if (willDelete) {
																	deleteImage(editProductId)
																}
															});
													}}
												><DeleteOutline className='' />
												</button>
											</> :
											<>
												<img src={!editImageData ? '/images/default_image.jpg' : editImageData} alt="product_image" className='rounded' style={{ width: "90%", margin: "15px", border: "1px #89c878 solid" }} />
												<button className='btn my_btn' onClick={() => { editFileInputRef.current.click() }} >
													<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 528.899 528.899" >
														<g><path d="M328.883,89.125l107.59,107.589l-272.34,272.34L56.604,361.465L328.883,89.125z M518.113,63.177l-47.981-47.981   c-18.543-18.543-48.653-18.543-67.259,0l-45.961,45.961l107.59,107.59l53.611-53.611   C532.495,100.753,532.495,77.559,518.113,63.177z M0.3,512.69c-1.958,8.812,5.998,16.708,14.811,14.565l119.891-29.069   L27.473,390.597L0.3,512.69z" /></g>
													</svg>
												</button>

												<input ref={editFileInputRef} type="file" style={{ display: 'none' }}
													onChange={(e) => {
														if (e.target.files[0].type === "image/jpeg" || e.target.files[0].type === "image/png") {
															setEditImage(e.target.files[0])
														}
														else {
															swal("Oops!!", "Unsupported File type, Please upload either .jpg,.jpeg,.png", "warning")
														}
													}}
												/>
											</>
									}
								</div>
							</div>
						</div>
					</Modal.Body>
					<Modal.Footer>
						<button className='btn btn-outline-danger' style={{ transition: "color 0.4s, background-color 0.4s" }} onClick={() => { handleEditModalClose() }}>Cancel</button>
						{
							permission !== null && permission.edit &&
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
												updateProduct()
											}
										});
								}}
							>Update
							</button>
						}
					</Modal.Footer>
				</Modal>
			</div>
		</div>
	)
}

export default Products