import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import "./Header.scss";

import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import FullscreenExitOutlinedIcon from "@mui/icons-material/FullscreenExitOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";

// import { DarkModeContext } from "../../context/darkModeContext";
import { getCookie } from '../../cookie';

const Header = () => {
	// const { dispatch } = useContext(DarkModeContext);
	const [userName, setUserName] = useState('')

	// const getProfile = async () => {
	// 	let result = await fetch(`${process.env.REACT_APP_BACKEND_ORIGIN}/get_profile`, {
	// 		method: 'POST',
	// 		headers: {
	// 			'Content-type': 'application/json; charset=UTF-8',
	// 			'access_token': getCookie('accessToken'),
	// 		},
	// 	})

	// 	let body = await result.json()
	// 	setUserName(body.info.profile.user_name)
	// 	console.log(userName)
	// }

	// useEffect(() => {
	//   getProfile();
	// }, [userName])

	return (
		<div className="header">
			{/* <div className="top">
          <Link to="/dashboard" style={{ textDecoration: "none" }}>
            <span className="logo">Admin</span>
          </Link>
			</div> */}
			<div className="wrapper">
				<div className="search">
					<input type="text" placeholder="Search..." />
					<SearchOutlinedIcon />
				</div>
				<div className="items">
					<div className="item" >
						<LanguageOutlinedIcon className="icon" />
						English
					</div>
					<div className="item">
						<DarkModeOutlinedIcon
							className="icon"
						// onClick={() => dispatch({ type: "TOGGLE" })}
						/>
					</div>
					<div className="item">
						<FullscreenExitOutlinedIcon className="icon" />
					</div>
					<div className="item">
						<NotificationsNoneOutlinedIcon className="icon" />
						<div className="counter">1</div>
					</div>
					<div className="item">
						<ChatBubbleOutlineOutlinedIcon className="icon" />
						<div className="counter">2</div>
					</div>
					{/* <div className="item">
							<ListOutlinedIcon className="icon" />
						</div> */}
					<div className="item">
						<img
							src="https://images.pexels.com/photos/941693/pexels-photo-941693.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
							alt=""
							className="avatar"
						/>
					</div>
					<div className="item">
						<h4 className="icon">{userName}</h4>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Header;