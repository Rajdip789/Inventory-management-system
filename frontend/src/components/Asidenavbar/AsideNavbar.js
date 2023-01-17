import React, { useEffect, useState, useContext } from 'react'
import { Link } from "react-router-dom";
import "./AsideNavbar.scss";

import swal from 'sweetalert';
import { setCookie, getCookie } from '../../cookie';
import { DarkModeContext } from "../../context/darkModeContext";

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
import CloseOutlined from "@mui/icons-material/CloseOutlined";
import Menu from "@mui/icons-material/Menu";

function AsideNavbar() {
	const { dispatch } = useContext(DarkModeContext);
	const [permission, setPermission] = useState([])
	const [toggel, setToggel] = useState(false)

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
					// console.log(body)
					if (body.operation === 'success') {
						fetch(`${process.env.REACT_APP_BACKEND_ORIGIN}/get_permission`, {
							method: 'POST',
							headers: {
								'Content-type': 'application/json; charset=UTF-8',
								'access_token': getCookie('accessToken'),
							},
						})
							.then(async (response) => {
								let body = await response.json()

								{/*console.log(JSON.parse(body.info));*/ }
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
		<div>
			<div className='toggelDiv'><Menu onClick={() => setToggel(true)} /></div>
			<div className="asideNavbar__panel">
				<div className="top border-bottom">
					<Link to="/" style={{ textDecoration: "none" }}>
						<span className="logo">Admin</span>
					</Link>
				</div>
				<div className="center">
					<ul>
						{
							permission.length > 0 && permission.find(x => x.page === 'dashboard').view === true &&
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
							permission.length > 0 && (permission.find(x => x.page === 'employees').view === true || permission.find(x => x.page === 'products').view === true) &&
							<p className="title">LISTS</p>
						}
						{
							permission.length > 0 && permission.find(x => x.page === 'employees').view === true &&
							<Link to="/employees" style={{ textDecoration: "none" }}>
								<li>
									<PersonOutlineIcon className="icon" />
									<span>Employees</span>
								</li>
							</Link>
						}
						{
							permission.length > 0 && permission.find(x => x.page === 'products').view === true &&
							<Link to="/products" style={{ textDecoration: "none" }}>
								<li>
									<StoreIcon className="icon" />
									<span>Products</span>
								</li>
							</Link>
						}

						{
							permission.length > 0 && (permission.find(x => x.page === 'suppliers').view === true || permission.find(x => x.page === 'expenses').view === true) &&
							<p className="title">PURCHASE</p>
						}
						{
							permission.length > 0 && permission.find(x => x.page === 'suppliers').view === true &&
							<Link to="/suppliers" style={{ textDecoration: "none" }}>
								<li>
									<StoreIcon className="icon" />
									<span>Suppliers</span>
								</li>
							</Link>
						}
						{
							permission.length > 0 && permission.find(x => x.page === 'expenses').view === true &&
							<Link to="/expenses" style={{ textDecoration: "none" }}>
								<li>
									<NotificationsNoneIcon className="icon" />
									<span>Expenses</span>
								</li>
							</Link>
						}

						{
							permission.length > 0 && (permission.find(x => x.page === 'customers').view === true || permission.find(x => x.page === 'orders').view === true) &&
							<p className="title">SELLS</p>
						}
						{
							permission.length > 0 && permission.find(x => x.page === 'customers').view === true &&
							<Link to="/customers" style={{ textDecoration: "none" }}>
								<li>
									<SettingsSystemDaydreamOutlinedIcon className="icon" />
									<span>Customers</span>
								</li>
							</Link>
						}
						{
							permission.length > 0 && permission.find(x => x.page === 'orders').view === true &&
							<Link to="/orders" style={{ textDecoration: "none" }}>
								<li>
									<PsychologyOutlinedIcon className="icon" />
									<span>Orders</span>
								</li>
							</Link>
						}

						<p className="title">USER</p>
						{
							permission.length > 0 && permission.find(x => x.page === 'profile').view === true &&
							<Link to="/profile" style={{ textDecoration: "none" }}>
								<li>
									<AccountCircleOutlinedIcon className="icon" />
									<span>Profile</span>
								</li>
							</Link>
						}
						{
							permission.length > 0 && permission.find(x => x.page === 'settings').view === true &&
							<Link to="/settings" style={{ textDecoration: "none" }}>
								<li>
									<SettingsApplicationsIcon className="icon" />
									<span>Settings</span>
								</li>
							</Link>
						}
						<li onClick={() => { logout() }}>
							<ExitToAppIcon className="icon" />
							<span>Logout</span>
						</li>
					</ul>
				</div>

				<div className="bottom">
					<div
						className="colorOption"
						onClick={() => dispatch({ type: "LIGHT" })}
					></div>
					<div
						className="colorOption"
						onClick={() => dispatch({ type: "DARK" })}
					></div>
				</div>
			</div>

			<div className='asideNavbar__menu' style={toggel ? {left : "0px" } : {}}>
				<div className="top">
					<div className='toggelDiv'><CloseOutlined onClick={() => setToggel(false)} /></div>
				</div>
				<div className="center">
					<ul>
						{
							permission.length > 0 && permission.find(x => x.page === 'dashboard').view === true &&
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
							permission.length > 0 && (permission.find(x => x.page === 'employees').view === true || permission.find(x => x.page === 'products').view === true) &&
							<p className="title">LISTS</p>
						}
						{
							permission.length > 0 && permission.find(x => x.page === 'employees').view === true &&
							<Link to="/employees" style={{ textDecoration: "none" }}>
								<li>
									<PersonOutlineIcon className="icon" />
									<span>Employees</span>
								</li>
							</Link>
						}
						{
							permission.length > 0 && permission.find(x => x.page === 'products').view === true &&
							<Link to="/products" style={{ textDecoration: "none" }}>
								<li>
									<StoreIcon className="icon" />
									<span>Products</span>
								</li>
							</Link>
						}

						{
							permission.length > 0 && (permission.find(x => x.page === 'suppliers').view === true || permission.find(x => x.page === 'expenses').view === true) &&
							<p className="title">PURCHASE</p>
						}
						{
							permission.length > 0 && permission.find(x => x.page === 'suppliers').view === true &&
							<Link to="/suppliers" style={{ textDecoration: "none" }}>
								<li>
									<StoreIcon className="icon" />
									<span>Suppliers</span>
								</li>
							</Link>
						}
						{
							permission.length > 0 && permission.find(x => x.page === 'expenses').view === true &&
							<Link to="/expenses" style={{ textDecoration: "none" }}>
								<li>
									<NotificationsNoneIcon className="icon" />
									<span>Expenses</span>
								</li>
							</Link>
						}

						{
							permission.length > 0 && (permission.find(x => x.page === 'customers').view === true || permission.find(x => x.page === 'orders').view === true) &&
							<p className="title">SELLS</p>
						}
						{
							permission.length > 0 && permission.find(x => x.page === 'customers').view === true &&
							<Link to="/customers" style={{ textDecoration: "none" }}>
								<li>
									<SettingsSystemDaydreamOutlinedIcon className="icon" />
									<span>Customers</span>
								</li>
							</Link>
						}
						{
							permission.length > 0 && permission.find(x => x.page === 'orders').view === true &&
							<Link to="/orders" style={{ textDecoration: "none" }}>
								<li>
									<PsychologyOutlinedIcon className="icon" />
									<span>Orders</span>
								</li>
							</Link>
						}

						<p className="title">USER</p>
						{
							permission.length > 0 && permission.find(x => x.page === 'profile').view === true &&
							<Link to="/profile" style={{ textDecoration: "none" }}>
								<li>
									<AccountCircleOutlinedIcon className="icon" />
									<span>Profile</span>
								</li>
							</Link>
						}
						{
							permission.length > 0 && permission.find(x => x.page === 'settings').view === true &&
							<Link to="/settings" style={{ textDecoration: "none" }}>
								<li>
									<SettingsApplicationsIcon className="icon" />
									<span>Settings</span>
								</li>
							</Link>
						}
						<li onClick={() => { logout() }}>
							<ExitToAppIcon className="icon" />
							<span>Logout</span>
						</li>
					</ul>
				</div>

				<div className="bottom">
					<div
						className="colorOption"
						onClick={() => dispatch({ type: "LIGHT" })}
					></div>
					<div
						className="colorOption"
						onClick={() => dispatch({ type: "DARK" })}
					></div>
				</div>
			</div>
		</div>
	);
};

export default AsideNavbar;