import React, { useEffect, useState, useContext } from 'react'
import { Link } from "react-router-dom";
import "./AsideNavbar.scss";

import swal from 'sweetalert';
import { setCookie, getCookie } from '../../cookie';
// import { DarkModeContext } from "../../context/darkModeContext";

import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import StoreIcon from "@mui/icons-material/Store";
import InsertChartIcon from "@mui/icons-material/InsertChart";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import SettingsSystemDaydreamOutlinedIcon from "@mui/icons-material/SettingsSystemDaydreamOutlined";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";

function AsideNavbar() {
	//   const { dispatch } = useContext(DarkModeContext);
	const [permission, setPermission] = useState([])

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

						{/*console.log(JSON.parse(body.info));*/}
						let p = JSON.parse(body.info)
						setPermission(p)
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

	const logout = () => {
		swal({
			title: "Are you sure?",
			text: "Are you sure, you want to logout!",
			icon: "warning",
			buttons: true,
			dangerMode: true,
		})
		.then((willDelete) => {
			if (willDelete) {
				setCookie('accessToken', '', -1); 
				window.location.href = '/login';
			}
		});
	}

	return (
		<div className="asideNavbar">
			<div className="top">
				<Link to="/" style={{ textDecoration: "none" }}>
					<span className="logo">Admin</span>
				</Link>
			</div>
			<hr />
			<div className="center">
				<ul>
					{
						permission.length > 0 && permission.find(x => x.page == 'dashboard').view == true && 
						<>
							<p className="title">MAIN</p>
							<Link to="/dashboard" style={{ textDecoration: "none" }}>
								<li>
									<DashboardIcon className="icon" />
									<span>Dashboard</span>
								</li>
							</Link>
						</>
					}

					{
						permission.length > 0 && (permission.find(x => x.page == 'employees').view == true || permission.find(x => x.page == 'products').view == true) &&					
						<p className="title">LISTS</p>
					}
					{
						permission.length > 0 && permission.find(x => x.page == 'employees').view == true &&
						<Link to="/employees" style={{ textDecoration: "none" }}>
							<li>
								<PersonOutlineIcon className="icon" />
								<span>Employees</span>
							</li>
						</Link>
					}
					{
						permission.length > 0 && permission.find(x => x.page == 'products').view == true &&
						<Link to="/products" style={{ textDecoration: "none" }}>
							<li>
								<StoreIcon className="icon" />
								{/* <svg xmlns="http://www.w3.org/2000/svg" version="1.0" width="20" height="20" viewBox="0 0 256.000000 256.000000" preserveAspectRatio="xMidYMid meet">
									<g transform="translate(0.000000,256.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none">
										<path d="M937 2422 c-48 -49 -72 -80 -72 -97 -1 -13 3 -21 7 -19 4 3 8 2 8 -3 0 -8 -240 -115 -240 -107 0 2 17 12 38 23 20 11 33 20 29 21 -14 0 -63 -28 -78 -46 -9 -11 -9 -15 -1 -10 19 11 14 -2 -16 -47 -16 -23 -41 -63 -56 -90 -23 -38 -25 -46 -10 -40 11 4 15 3 10 -5 -3 -6 -1 -14 5 -18 8 -5 9 -3 4 6 -5 8 -3 11 6 8 8 -3 14 -10 14 -16 0 -5 4 -14 9 -19 6 -5 6 -2 1 6 -6 10 -4 13 6 9 10 -4 30 18 63 71 l48 76 121 51 122 51 26 -21 c78 -62 209 -176 202 -176 -4 0 -49 35 -99 78 -116 99 -124 105 -124 100 0 -3 47 -45 105 -94 117 -99 142 -108 188 -66 l27 26 28 -26 c45 -42 70 -33 187 66 58 49 105 91 105 94 0 5 -8 -1 -124 -100 -50 -43 -95 -78 -99 -78 -7 0 124 114 202 176 l26 21 121 -51 122 -51 126 -199 c70 -109 126 -199 124 -200 -2 -1 -51 -44 -110 -94 l-107 -92 -50 84 c-28 46 -51 88 -51 92 0 5 12 -10 26 -33 14 -24 27 -43 30 -43 8 0 -45 85 -53 86 -5 0 -16 4 -25 8 -14 6 -36 -3 -77 -30 -2 -2 12 -27 30 -56 l34 -53 5 -422 5 -423 -158 -70 c-132 -59 -166 -70 -212 -70 l-54 0 -3 118 -3 117 -45 0 -45 0 -3 -117 -3 -118 -54 0 c-46 0 -80 11 -212 70 l-158 70 5 423 5 422 34 53 c18 29 32 54 30 56 -41 27 -63 36 -77 30 -9 -4 -20 -7 -24 -6 -3 1 -25 -31 -48 -71 -24 -40 -49 -77 -57 -84 -8 -6 -10 -14 -5 -17 4 -2 31 33 58 79 27 46 51 82 53 80 1 -2 -20 -42 -49 -89 l-51 -86 -107 92 c-59 50 -108 93 -110 94 -4 2 99 164 105 164 2 0 -5 -17 -17 -37 -12 -21 -14 -29 -5 -18 31 37 35 52 20 65 -8 7 -12 16 -10 21 3 4 -5 13 -17 19 -22 11 -22 10 -4 -4 23 -18 14 -21 -15 -5 -11 5 -17 15 -13 22 4 7 0 5 -9 -3 -8 -8 -45 -62 -81 -119 -36 -58 -66 -100 -66 -95 0 5 6 18 13 29 33 48 49 75 44 75 -13 0 -60 -88 -63 -117 -2 -34 23 -59 298 -290 14 -13 21 -12 48 2 18 9 30 12 26 7 -3 -5 -6 -177 -7 -383 l-1 -374 32 -23 c18 -12 38 -22 44 -22 6 0 -7 10 -28 23 -22 12 -41 29 -43 37 -3 12 -2 12 6 -1 6 -9 96 -53 200 -100 104 -46 186 -86 181 -89 -4 -3 77 -5 180 -5 103 0 184 2 180 5 -5 3 77 43 181 89 104 47 194 91 200 100 8 13 9 13 6 1 -2 -8 -21 -25 -43 -37 -21 -13 -34 -23 -28 -23 6 0 26 10 44 23 l32 22 -1 374 c-1 206 -4 378 -7 383 -4 5 8 2 26 -7 27 -14 34 -15 48 -2 275 231 300 256 298 290 -3 29 -50 117 -63 117 -5 0 11 -27 44 -75 7 -11 13 -24 13 -29 0 -5 -65 93 -145 218 -80 125 -145 230 -145 232 0 3 6 2 13 -2 7 -5 7 -1 -2 10 -15 18 -64 46 -78 46 -4 -1 9 -10 30 -21 20 -11 37 -21 37 -23 0 -8 -240 99 -240 107 0 5 3 6 8 4 4 -3 8 5 8 18 1 16 -20 44 -70 94 l-72 72 -272 2 -272 2 -73 -73z m462 -52 c-10 -14 -41 -50 -69 -80 l-50 -55 -50 55 c-28 30 -59 66 -69 80 l-19 25 138 0 138 0 -19 -25z" />
										<path d="M1434 1756 c-3 -8 -4 -29 -2 -48 l3 -33 85 0 85 0 0 45 0 45 -83 3 c-64 2 -84 0 -88 -12z" />
										<path d="M218 1572 c11 -7 10 -10 -3 -16 -24 -9 -27 -8 -19 7 4 6 -5 1 -19 -12 -28 -26 -35 -37 -15 -25 8 5 9 2 5 -10 -4 -10 -7 -21 -7 -24 0 -4 -4 -2 -8 5 -4 6 -6 -246 -4 -559 l2 -571 -29 6 c-49 10 -59 -13 -50 -118 4 -50 5 -93 2 -98 -2 -4 1 -6 8 -5 6 2 14 -3 17 -11 3 -9 0 -11 -9 -6 -8 5 -1 -6 15 -23 30 -33 43 -41 30 -21 -4 7 -1 10 7 7 8 -3 13 -10 12 -16 -2 -8 275 -11 965 -9 l967 2 0 45 0 45 -944 3 c-677 1 -948 5 -958 13 -7 6 -13 29 -13 50 l0 39 358 0 c332 -1 359 -2 392 -20 19 -11 31 -19 25 -19 -5 0 -21 6 -35 14 -14 8 -29 14 -35 14 -5 0 2 -7 18 -15 41 -22 733 -22 774 0 16 8 24 15 18 15 -5 0 -21 -6 -35 -14 -14 -8 -29 -14 -35 -14 -5 0 6 8 25 19 33 18 60 19 393 20 l357 0 0 -39 c0 -21 -6 -43 -13 -49 -7 -6 -60 -13 -118 -14 l-104 -3 0 -45 0 -45 127 0 c71 -1 126 3 125 8 -1 5 4 12 12 15 8 3 11 0 7 -7 -13 -20 0 -12 30 21 16 17 23 28 15 23 -9 -5 -12 -3 -9 6 3 8 11 13 17 11 7 -1 10 1 8 5 -3 5 -2 48 2 98 9 105 -1 128 -50 118 l-29 -6 2 571 c2 313 0 566 -3 560 -3 -5 -9 -2 -13 7 -9 24 -8 27 7 19 6 -4 1 5 -12 19 -26 28 -37 35 -25 15 5 -8 2 -9 -10 -5 -10 4 -21 7 -24 7 -4 0 0 5 8 10 11 8 7 9 -15 4 -53 -10 -55 -12 -55 -55 0 -32 4 -42 20 -46 20 -5 20 -14 20 -555 l0 -549 -334 1 c-283 1 -339 -1 -363 -14 -15 -8 -23 -15 -18 -15 6 0 21 6 35 14 14 8 30 14 35 14 6 0 -6 -8 -25 -19 -32 -18 -59 -19 -360 -19 -301 0 -328 1 -360 19 -19 11 -30 19 -25 19 6 0 21 -6 35 -14 14 -8 30 -14 35 -14 6 0 -3 7 -18 15 -24 13 -80 15 -363 14 l-334 -1 0 549 c0 541 0 550 20 555 16 4 20 14 20 46 0 43 -2 45 -55 55 -19 4 -25 3 -17 -2z" />
										<path d="M435 1160 c-67 -67 -90 -97 -91 -118 -1 -21 18 -46 90 -119 50 -51 93 -93 97 -93 3 0 -36 41 -87 92 -52 50 -94 95 -94 98 0 4 40 -34 90 -84 l89 -91 33 32 33 33 -65 65 -64 65 64 65 65 65 -33 33 -33 32 -89 -91 c-50 -50 -90 -88 -90 -84 0 3 42 48 94 98 51 51 90 92 87 92 -4 0 -47 -41 -96 -90z" />
										<path d="M2116 1158 c52 -50 94 -95 94 -98 0 -4 -40 34 -90 84 l-89 91 -33 -32 -33 -33 65 -65 64 -65 -64 -65 -65 -65 33 -33 33 -32 89 91 c50 50 90 88 90 84 0 -3 -42 -48 -94 -98 -51 -51 -90 -92 -87 -92 4 0 47 42 97 93 72 73 91 98 90 119 -1 21 -24 51 -91 118 -49 49 -92 90 -96 90 -3 0 36 -41 87 -92z" />
									</g>
								</svg> */}
								<span>Products</span>
							</li>
						</Link>
					}

					{
						permission.length > 0 && (permission.find(x => x.page == 'suppliers').view == true || permission.find(x => x.page == 'expenses').view == true) &&					
						<p className="title">PURCHASE</p>
					}				
					{
						permission.length > 0 && permission.find(x => x.page == 'suppliers').view == true &&
						<Link to="/suppliers" style={{ textDecoration: "none" }}>
							<li>
								<StoreIcon className="icon" />
								<span>Suppliers</span>
							</li>
						</Link>
					}
					{
						permission.length > 0 && permission.find(x => x.page == 'expenses').view == true &&
						<Link to="/expenses" style={{ textDecoration: "none" }}>
							<li>
								<NotificationsNoneIcon className="icon" />
								<span>Expenses</span>
							</li>
						</Link>
					}

					{
						permission.length > 0 && (permission.find(x => x.page == 'customers').view == true || permission.find(x => x.page == 'orders').view == true) &&					
						<p className="title">SELLS</p>
					}		
					{
						permission.length > 0 && permission.find(x => x.page == 'customers').view == true &&
						<Link to="/customers" style={{ textDecoration: "none" }}>
							<li>
								<SettingsSystemDaydreamOutlinedIcon className="icon" />
								<span>Customers</span>
							</li>
						</Link>
					}
					{
						permission.length > 0 && permission.find(x => x.page == 'orders').view == true &&
						<Link to="/orders" style={{ textDecoration: "none" }}>
							<li>
								<PsychologyOutlinedIcon className="icon" />
								<span>Orders</span>
							</li>
						</Link>
					}

					<p className="title">USER</p>
					{
						permission.length > 0 && permission.find(x => x.page == 'profile').view == true &&
						<Link to="/profile" style={{ textDecoration: "none" }}>
							<li>
								<AccountCircleOutlinedIcon className="icon" />
								<span>Profile</span>
							</li>
						</Link>
					}
					{
						permission.length > 0 && permission.find(x => x.page == 'settings').view == true &&
						<Link to="/settings" style={{ textDecoration: "none" }}>
							<li>
								<SettingsApplicationsIcon className="icon" />
								<span>Settings</span>
							</li>
						</Link>
					}
					<li onClick={() => {logout()}}>
						<ExitToAppIcon className="icon" />
						<span>Logout</span>
					</li>
				</ul>
			</div>

			<div className="bottom">
				<div
					className="colorOption"
				//   onClick={() => dispatch({ type: "LIGHT" })}
				></div>
				<div
					className="colorOption"
				//   onClick={() => dispatch({ type: "DARK" })}
				></div>
			</div>
		</div>
	);
};

export default AsideNavbar;