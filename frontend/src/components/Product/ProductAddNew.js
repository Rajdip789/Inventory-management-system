import React, { useEffect, useState, useRef } from 'react'
import './ProductAddNew.scss'

import moment from 'moment'
import swal from 'sweetalert';
import { setCookie, getCookie } from '../../cookie';

function ProductAddNew() {
	const [pageState, setPageState] = useState(1)
	const [permission, setPermission] = useState(null)

	const [name, setName] = useState('')
	const [gender, setGender] = useState("male")
	const [size, setSize] = useState('')
	const [material, setMaterial] = useState('')
	const [category, setCategory] = useState('')
	const [description, setDescription] = useState('')
	const [stock, setStock] = useState(0)
	const [image, setImage] = useState('')
	const [sellingPrice, setSellingPrice] = useState(0)
	const [purchasePrice, setPurchasePrice] = useState(0)

	const [submitButtonState, setSubmitButtonState] = useState(false)

	const fileInputRef = useRef(null)
	const [imageData, setImageData] = useState(null)

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
						let p = JSON.parse(body.info).find(x => x.page == 'products')
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

	useEffect(() => {
		if(image) {
			let f = new FileReader()
			f.onload = (e) => {
				setImageData(e.target.result)
			}
			f.readAsDataURL(image)
		}
	}, [image])

	const insertProduct = async () => {
		if (name == "") {
			swal("Oops!", "Name can't be empty", "error")
			return;
		}
		if (sellingPrice == "") {
			swal("Oops!", "Selling Price can't be empty", "error")
			return;
		}
		if (purchasePrice == "") {
			swal("Oops!", "Purchase Price can't be empty", "error")
			return;
		}
		if (stock < 0) {
			swal("Oops!", "Product stock can't be negative", "error")
			return;
		}

		let f = new FormData();
		f.append('name', name)
		f.append('gender', gender)
		f.append('size', size)
		f.append('material', material)
		f.append('category', category)
		f.append('description', description)
		f.append('product_stock', stock)
		f.append('image', image)
		f.append('selling_price', sellingPrice)
		f.append('purchase_price', purchasePrice)

		console.log(Array.from(f.values()).map(x=>x).join(", "))
		setSubmitButtonState(true)

		let response = await fetch(`${process.env.REACT_APP_BACKEND_ORIGIN}/add_product`, {
			method: 'POST',
			headers: {
				'access_token': getCookie('accessToken')
			},
			body: f
		})
		let body = await response.json()

		setSubmitButtonState(false)
		console.log(body)

		if (body.operation == 'success') {
			console.log('Product created successfully')
			swal("Success!", "Product created successfully", "success")

			setName('')
			setGender("male")
			setSize('')
			setMaterial('')
			setCategory('')
			setDescription('')
			setStock(0)
			setImage('')
			setSellingPrice(0)
			setPurchasePrice(0)
			setImageData(null)
		} else {
			swal("Oops!", body.message, "error")
		}
	}
	
	return (
		<div className='productaddnew'>
			<div className='product-header'>
				<div className='title'>Add New Product</div>
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

						<div style={{display:"flex"}}>
							<div className="left" style={{width : '15rem', height : '15rem', position:"relative"}}>
								<svg style={{position: "absolute", padding: "0.2rem", border: "1px black solid", borderRadius: "20%", bottom: "0", left: "6.5rem"}} onClick={()=>{fileInputRef.current.click()}} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 528.899 528.899" >
									<g><path d="M328.883,89.125l107.59,107.589l-272.34,272.34L56.604,361.465L328.883,89.125z M518.113,63.177l-47.981-47.981   c-18.543-18.543-48.653-18.543-67.259,0l-45.961,45.961l107.59,107.59l53.611-53.611   C532.495,100.753,532.495,77.559,518.113,63.177z M0.3,512.69c-1.958,8.812,5.998,16.708,14.811,14.565l119.891-29.069   L27.473,390.597L0.3,512.69z"/></g>
								</svg>
								<img src={!imageData?'/images/default_image.jpg': imageData}  alt="product_image" style={{borderRadius: "20%", width: "80%", height: "80%", padding: "10%", border: "1px #89c878 solid"}}/>
								<input ref={fileInputRef} type="file" style={{display: 'none'}} 
									onChange={(e) => {
										if(e.target.files[0].type == "image/jpeg" || e.target.files[0].type == "image/png"){
											setImage(e.target.files[0])
										}
										else{
											swal("Oops!!","Unsupported File type, Please upload either .jpg,.jpeg,.png","warning")
										}
									}}
								/>
							</div>
							<div className="right" style={{marginLeft: "1rem"}}>								
								<div className="row" style={{display : 'flex', marginTop: "0.5rem"}}>
									<div className='col'>
										<label>Name</label>
										<input className='my_input' type='text' value={name} onChange={(e)=>{setName(e.target.value)}} />
									</div>
									<div className='col'>
										<label>Gender:</label>
										<label><input type="radio" style={{margin:"0 1rem"}} checked={gender=="male"} onChange={()=>{setGender("male")}} />Male</label>
										<label><input type="radio" style={{margin:"0 1rem"}} checked={gender=="female"} onChange={()=>{setGender("female")}} />Female</label>
										<label><input type="radio" style={{margin:"0 1rem"}} checked={gender=="others"} onChange={()=>{setGender("others")}} />Others</label>
									</div>
								</div>	
								<div className="row" style={{display : 'flex', marginTop: "0.5rem"}}>
									<div className='col'>
										<label>Size</label>
										<input className='my_input' type='text' value={size} onChange={(e)=>{setSize(e.target.value)}} />
									</div>
									<div className='col'>
										<label>Material</label>
										<input className='my_input' type='text' value={material} onChange={(e)=>{setMaterial(e.target.value)}} />
									</div>
								</div>	
								<div className="row" style={{display : 'flex', marginTop: "0.5rem"}}>
									<div className='col'>
										<label>Category</label>
										<input className='my_input' type='text' value={category} onChange={(e)=>{setCategory(e.target.value)}} />
									</div>
									<div className='col'>
										<label>Description</label>
										<input className='my_input' type='text' value={description} onChange={(e)=>{setDescription(e.target.value)}} />
									</div>
								</div>	
								<div className="row" style={{display : 'flex', marginTop: "0.5rem"}}>
									<div className='col'>
										<label>Selling Price</label>
										<input className='my_input' type='number' value={sellingPrice} onChange={(e)=>{setSellingPrice(parseFloat(e.target.value))}} />
									</div>
									<div className='col'>
										<label>Purchase Price</label>
										<input className='my_input' type='number' value={purchasePrice} onChange={(e)=>{setPurchasePrice(parseFloat(e.target.value))}} />
									</div>
								</div>	
								<div className="row" style={{display : 'flex', marginTop: "0.5rem"}}>
									<div className='col'>
										<label>Stock</label>
										<input className='my_input' type='number' value={stock} onChange={(e)=>{setStock(parseInt(e.target.value))}} />
									</div>
								</div>							
							</div>
						</div>

						{ 
							permission.create && 
							<button className='btn success' style={{alignSelf:"center", marginTop: "1rem"}} disabled={submitButtonState} onClick={() => {insertProduct()}} >
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

export default ProductAddNew