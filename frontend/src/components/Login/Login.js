import React from 'react';
import './Login.scss';

function Login() {
  return (
	<div className='login'>
		<img className="wave" src="./images/wave.png"/>
		<div className="container">
			<div className="img">
			<img src="./images/bg.svg"/>
			</div>

			<div className="login-content">
				<form method='post'>
					<img src="./images/avatar.svg"/>
					<h2 className="title">Welcome</h2>
					<div className="input-div one">
					<div className="i">
							<i className="fas fa-user"></i>
					</div>
					<div className="div">
						<input type="email" placeholder='Email Id' name="Email_ID" className=""/>
					</div>
					</div>
					<div className="input-div pass">
					<div className="i"> 
						<i className="fas fa-lock"></i>
					</div>
					<div className="div">
						<input type="password" placeholder='Password' name="Password" className=""/>
					</div>
					</div>
					<a href="#">Forgot Password?</a>
					<input type="submit" className="btn" value="Login"/>
				</form>
		
			</div>
		</div>
	</div>
  );
}

export default Login
