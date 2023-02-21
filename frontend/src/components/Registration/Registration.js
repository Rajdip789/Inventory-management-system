import React, { useEffect, useState } from 'react';
import './Registration.scss';
import { setCookie, getCookie } from '../../cookie';

import swal from 'sweetalert';
import CryptoJS from 'crypto-js';
import { Link } from 'react-router-dom';
import { Person2Outlined, EmailOutlined, HomeOutlined, SecurityOutlined, Check, CheckCircleOutlineRounded, Google } from "@mui/icons-material";


function Registration() {
	const [name, setName] = useState('')
	const [email, setEmail] = useState('');
	const [address, setAddress] = useState('')
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('')
	const [submitButtonState, setSubmitButtonState] = useState(false);

	useEffect(() => {
		if (getCookie('accessToken') !== '') {
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
				console.log(body)
				if (body.operation === 'success') {
					window.location.href = '/dashboard'
				}
			})
			.catch((error) => {
				console.log(error)
			})	
		}
	}, [])


	const registration = async () => {
		if (email === "") {
			swal("Oops!", "Email can't be empty", "error")
			return;
		}
		let regex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-z]+)$/;
		if (!regex.test(email)) {
			swal("Oops!", "Please enter valid email", "error")
			return;
		}

		if (password === "") {
			swal("Oops!", "Password can't be empty", "error")
			return;
		}

		let obj = {}
		obj.email = email;
		obj.password = CryptoJS.AES.encrypt(password, process.env.REACT_APP_CRYPTOJS_SEED).toString();
		
		setSubmitButtonState(true)

		let response = await fetch(`${process.env.REACT_APP_BACKEND_ORIGIN}/registration`, {
			method: 'POST',
			headers: {
				'Content-type': 'application/json; charset=UTF-8',
			},
			body: JSON.stringify(obj)
		})
		let body = await response.json()

		// await new Promise(r => setTimeout(r, 5000))
		setSubmitButtonState(false)
		console.log(body)

		if (body.operation === 'success') {
			console.log('Registration successfull')
			setCookie('accessToken', body.info.accessToken, process.env.REACT_APP_JWT_EXPIRY)
			window.location.href = '/dashboard'
		} else {
			swal("Oops!", body.message, "error")
		}
	}

	return (
		<div className='registration'>
			<img className="wave" src="./images/wave.png" />
			<div className="registration-container">
				<div className="img">
					<img src="./images/bg.svg" />
				</div>

				<div className="registration-content">
					<div className='myform'>
						<img src="./images/avatar.svg" />
						<div className="input-div one">
							<div className="i">
								<Person2Outlined/>
							</div>
							<div className="div">
								<input type="text" placeholder='Full Name' value={name} onChange={e => setName(e.target.value.trim())} />
							</div>
						</div>
						<div className="input-div pass">
							<div className="i">
								<HomeOutlined/>
							</div>
							<div className="div">
								<input type="text" placeholder='Address' value={address} onChange={e => setAddress(e.target.value.trim())} />
							</div>
						</div>
						<div className="input-div pass">
							<div className="i">
								<EmailOutlined/>
							</div>
							<div className="div">
								<input type="text" placeholder='Email Id' value={email} onChange={e => setEmail(e.target.value.trim())} />
							</div>
						</div>
						<div className="input-div pass">
							<div className="i">
								<SecurityOutlined/>
							</div>
							<div className="div">
								<input type="password" placeholder='Password' value={password} onChange={e => setPassword(e.target.value.trim())} />
							</div>
						</div>
						<div className="input-div pass">
							<div className="i">
								<CheckCircleOutlineRounded/>
							</div>
							<div className="div">
								<input type="password" placeholder='Confirm Password' value={confirmPassword} onChange={e => setConfirmPassword(e.target.value.trim())} />
							</div>
						</div>
							<Link to="/login">Already have an Account?</Link>
						<button className="btn" disabled={submitButtonState} onClick={() => { registration() }}>
							{
								!submitButtonState ?
									<span>Create Account</span> :
									<span style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Please wait<div className="loader"></div></span>
							}
						</button>
						<button className="btn google" disabled={submitButtonState} onClick={() => { registration() }}>
							{
								!submitButtonState ?
									<span className='d-flex align-itmes-center justify-content-center gap-2'>
										<Google style={{ marginTop : "2px" }}/><>Sign Up with google</>
									</span> :
									<span style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Please wait<div className="loader"></div></span>
							}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Registration
