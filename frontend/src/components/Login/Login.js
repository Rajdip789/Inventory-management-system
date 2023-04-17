import React, { useEffect, useState } from 'react';
import './Login.scss';

import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import swal from 'sweetalert';
import CryptoJS from 'crypto-js';
import { Link } from 'react-router-dom';
import { EmailOutlined, SecurityOutlined } from "@mui/icons-material";

function Login() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [submitButtonState, setSubmitButtonState] = useState(false);
	let msg = 'Admin: email- testadmin@gmail.com, password- testadmin@12345\nEmployee: email- testemp@gmail.com, password- testemp@12345'

	useEffect(() => {

			fetch(`${process.env.REACT_APP_BACKEND_ORIGIN}/verifiy_token`, {
				method: 'POST',
				credentials: 'include'
			})
			.then(async (response) => {
				let body = await response.json()
				//console.log(body)
				if (body.operation === 'success') {
					window.location.href = '/dashboard'
				}
			})
			.catch((error) => {
				console.log(error)
			})	
	}, [])


	const login = async () => {
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

		let response = await fetch(`${process.env.REACT_APP_BACKEND_ORIGIN}/login`, {
			method: 'POST',
			headers: {
				'Content-type': 'application/json; charset=UTF-8',
			},
			body: JSON.stringify(obj),
			credentials: 'include'
		})
		let body = await response.json()

		//await new Promise(r => setTimeout(r, 10000))
		setSubmitButtonState(false)

		if (body.operation === 'success') {
			window.location.href = '/dashboard'
		} else {
			swal("Oops!", body.message, "error")
		}
	}

	return (
		<div className='login'>
			<img className="wave" alt='wave bg' src="./images/wave.png" />
			<div className="login-container">
				<div className="img">
					<img alt='background' src="./images/bg.svg" />
				</div>

				<div className="login-content">
					<SnackbarProvider 
						maxSnack={1}
						autoHideDuration={10000}
						variant='success'
						anchorOrigin={{
							vertical: 'top',
							horizontal: 'left',
						}}
						dense='true'
					/>
					<div className='myform'>
						<img alt='profile' src="./images/avatar.svg" />
						<h1 className="title">Welcome Back!</h1>
						<div className="input-div one">
							<div className="i">
								<EmailOutlined/>
							</div>
							<div className="div">
								<input type="email" placeholder='Email Id' name="email" value={email} onClick={() => enqueueSnackbar(msg, {style: {variant: 'error', whiteSpace: 'pre-line' }})} onChange={e => setEmail(e.target.value.trim())} />
							</div>
						</div>
						<div className="input-div pass">
							<div className="i">
								<SecurityOutlined/>
							</div>
							<div className="div">
								<input type="password" placeholder='Password' name="Password" value={password} onChange={e => setPassword(e.target.value.trim())} />
							</div>
						</div>
						<div className="d-flex justify-content-between">
							<Link></Link>
							<Link to="/forgetpassword">Forgot Password?</Link>
						</div>
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
