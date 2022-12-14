import React, { useEffect, useState } from 'react';
import './Login.scss';
import { setCookie, getCookie } from '../../cookie';

import swal from 'sweetalert';
import CryptoJS from 'crypto-js';

function Login() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [submitButtonState, setSubmitButtonState] = useState(false);

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
				console.log(body)
				if (body.operation == 'success') {
					window.location.href = '/dashboard'
				}
			})
			.catch((error) => {
				console.log(error)
			})	
		}
	}, [])


	const login = async () => {
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
		obj.email = email;
		obj.password = CryptoJS.AES.encrypt(password, process.env.REACT_APP_CRYPTOJS_SEED).toString();
		
		setSubmitButtonState(true)

		let response = await fetch(`${process.env.REACT_APP_BACKEND_ORIGIN}/login`, {
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

		if (body.operation == 'success') {
			console.log('Login successfull')
			setCookie('accessToken', body.info.accessToken, process.env.REACT_APP_JWT_EXPIRY)
			window.location.href = '/dashboard'
		} else {
			swal("Oops!", body.message, "error")
		}
	}

	return (
		<div className='login'>
			<img className="wave" src="./images/wave.png" />
			<div className="container">
				<div className="img">
					<img src="./images/bg.svg" />
				</div>

				<div className="login-content">
					<div className='myform'>
						<img src="./images/avatar.svg" />
						<h2 className="title">Welcome</h2>
						<div className="input-div one">
							<div className="i">
								<i className="fas fa-user"></i>
							</div>
							<div className="div">
								<input type="email" placeholder='Email Id' name="email" value={email} onChange={e => setEmail(e.target.value.trim())} />
							</div>
						</div>
						<div className="input-div pass">
							<div className="i">
								<i className="fas fa-lock"></i>
							</div>
							<div className="div">
								<input type="password" placeholder='Password' name="Password" value={password} onChange={e => setPassword(e.target.value.trim())} />
							</div>
						</div>
						<a href="#">Forgot Password?</a>
						<button className="btn" disabled={submitButtonState} onClick={() => { login() }}>
							{
								!submitButtonState ?
									<span>Login</span> :
									<span style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Please wait<div className="loader"></div></span>
							}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Login
