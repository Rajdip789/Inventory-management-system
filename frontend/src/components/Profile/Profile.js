import React, { useEffect, useRef, useState } from 'react'
import './Profile.scss'
import swal from 'sweetalert';
import CryptoJS from 'crypto-js';

import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { getCookie } from '../../cookie';

function Profile() {
    const [pageState, setPageState] = useState(1)
	const [permission, setPermission] = useState(null)

	const [profileData, setProfileData] = useState(null)
    const [editMode, setEditMode] = useState(false)

    const [name, setName] = useState('')
    const [address, setAddress] = useState('')
	const [profileImage, setProfileImage] = useState("")
    const [file, setFile] = useState(null)
	const fileInputRef = useRef(null)
	const [submitButtonState, setSubmitButtonState] = useState(false)

    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
	const [submitButtonState2, setSubmitButtonState2] = useState(false)

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
						let p = JSON.parse(body.info).find(x => x.page == 'profile')
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


	const getProfile = async () => {
		let result = await fetch(`${process.env.REACT_APP_BACKEND_ORIGIN}/get_profile`, {
			method: 'POST',
			headers: {
				'Content-type': 'application/json; charset=UTF-8',
				'access_token': getCookie('accessToken'),
			},
		})

		let body = await result.json()
		setProfileData(body.info.profile[0])
	}

	useEffect(() => {
		if (permission != null) {
			let p1 = getProfile();
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
		if((profileData) && (!editMode)){
			setName(profileData.user_name)
			setAddress(profileData.address)
			setProfileImage(profileData.image)
		}
	}, [profileData, editMode])
    
	const updateProfile = async () => {
		if (name == "") {
			swal("Oops!", "Name can't be empty", "error")
			return;
		}

		let f = new FormData();
		f.append('name', name)
		f.append('address', address)
		f.append('file', file)

		console.log(Array.from(f.values()).map(x=>x).join(", "))
		setSubmitButtonState(true)

		let response = await fetch(`${process.env.REACT_APP_BACKEND_ORIGIN}/update_profile`, {
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
			console.log('Profile updated successfully')
			swal("Success!", "Profile updated successfully", "success")
			setEditMode(false) 
			setFile(null)
			getProfile()
		} else {
			swal("Oops!", body.message, "error")
		}
	}

	const updateProfilePassword = async () => {
		if (oldPassword == "") {
			swal("Oops!", "Old Password can't be empty", "error")
			return;
		}
		if (newPassword == "") {
			swal("Oops!", "New Password can't be empty", "error")
			return;
		}
		if (confirmPassword != newPassword) {
			swal("Oops!", "Confirm Password can't be different", "error")
			return;
		}

		let obj = {}
		obj.old_password = CryptoJS.AES.encrypt(oldPassword, process.env.REACT_APP_CRYPTOJS_SEED).toString()
		obj.new_password = CryptoJS.AES.encrypt(newPassword, process.env.REACT_APP_CRYPTOJS_SEED).toString();
		setSubmitButtonState2(true)

		let response = await fetch(`${process.env.REACT_APP_BACKEND_ORIGIN}/update_profile_password`, {
			method: 'POST',
			headers: {
				'Content-type': 'application/json; charset=UTF-8',
				'access_token': getCookie('accessToken')
			},
			body: JSON.stringify(obj)
		})
		let body = await response.json()

		setSubmitButtonState2(false)
		console.log(body)

		if (body.operation == 'success') {
			console.log('Password updated successfully')
			swal("Success!", "Password updated successfully", "success")

			setOldPassword('')
			setNewPassword('')
			setConfirmPassword('')
		}
		else {
			swal("Oops!", body.message, "error")
		}
	}

    return (
		<div className='profile'>
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
				<>
					<div className="bottom">
						<div className="left">
							<img src={(editMode && file)? URL.createObjectURL(file):(profileImage != "" ?`${process.env.REACT_APP_BACKEND_ORIGIN}/profile_images/${profileImage}`:"https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg")} alt="" />
							{
								editMode &&
								<>
									<DriveFolderUploadOutlinedIcon className='uploadButton' onClick={()=>{fileInputRef.current.click()}} />
									<input ref={fileInputRef} type="file" style={{display: 'none'}} 
										onChange={(e) => {
											if(e.target.files[0].type == "image/jpeg" || e.target.files[0].type == "image/png"){
												setFile(e.target.files[0])
											}
											else{
												swal("Oops!!","Unsupported File type, Please upload either .jpg,.jpeg,.png","warning")
											}
										}}
									/>
								</>
							}
						</div>
						<div className="right">
							
							<div style={{display:"flex",margin:"0.5rem 0"}}>
								<div className="formInput">
									<label>Name</label>
									<input type='text' value={name} onChange={(e)=>{setName(e.target.value)}} placeholder="Name" readOnly={!editMode} />
								</div>
							</div>

							<div style={{display:"flex",margin:"0.5rem 0"}}>
								<div className="formInput">
									<label>Address</label>
									<textarea rows={3} value={address} onChange={(e)=>{setAddress(e.target.value)}} placeholder="Address" readOnly={!editMode}></textarea>
								</div>
							</div>

							{
								!editMode ? 
								<button style={{ margin: "0 2rem" }} onClick={(e) => {setEditMode(true)}}>Edit</button>
								:
								<div>
									<button style={{ margin: "0 2rem" }} onClick={(e) => {setEditMode(false); setFile(null);}}>Back</button>
									<button style={{ margin: "0 2rem" }} onClick={(e) => {updateProfile()}}>Submit</button>
								</div>
							}
							
						</div>
					</div>
					<div className="bottom" style={{flexDirection:"column"}}>
						<div className='right'>
							<div style={{display:"flex",margin:"0.5rem 0"}}>
								<div className="formInput">
									<label>Old Password</label>
									<input type='password' value={oldPassword} onChange={(e)=>{setOldPassword(e.target.value)}} placeholder="Old Password" />
								</div>
								<div className="formInput">
									<label>New Password</label>
									<input type='password' value={newPassword} onChange={(e)=>{setNewPassword(e.target.value)}} placeholder="New Password" />
								</div>
								<div className="formInput">
									<label>Confirm Password</label>
									<input type='text' value={confirmPassword} onChange={(e)=>{setConfirmPassword(e.target.value)}} placeholder="Confirm Password" />
								</div>
							</div>	
							
							<button style={{ margin: "0 2rem" }} 
								onClick={(e) => {
									swal({
										title: "Are you sure?",
										icon: "warning",
										buttons: true,
										dangerMode: true,
									})
									.then((willDelete) => {
										if (willDelete) {
											updateProfilePassword()
										}
									});
								}}
							>Update</button>
						</div>
					</div>
				</>
				:
				<div className="card">
					<div className="container">
						<div style={{ display: "flex", height: "10rem", backgroundColor: "#e6bfbf", border: "2px red dotted", borderRadius: "2rem", alignItems: "center", justifyContent: "center", margin: "1rem"}}>
							<div>
								{/* error svg */}
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

export default Profile
