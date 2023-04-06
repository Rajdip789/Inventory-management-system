import React, { useEffect, useState, useContext } from "react";
import { OverlayTrigger, Popover } from 'react-bootstrap';

import { DarkModeContext } from "../../context/darkModeContext";
import "./Header.scss";

import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import FullscreenExitOutlinedIcon from "@mui/icons-material/FullscreenExitOutlined";
import LightModeOutlined from "@mui/icons-material/LightModeOutlined";
import Fullscreen from "@mui/icons-material/Fullscreen";
import { Link } from "react-router-dom";

const Header = () => {
	const { dispatch } = useContext(DarkModeContext);
	const [userName, setUserName] = useState('')
	const [userImage, setUserImage] = useState(null)
	const [userEmail, setUserEmail] = useState('')
	const [fullscreen, setFullscreen] = useState(false)
	const [darkMode, setDarkMode] = useState(false)

	const getProfile = async () => {
		let result = await fetch(`${process.env.REACT_APP_BACKEND_ORIGIN}/get_profile`, {
			method: 'POST',
			credentials: 'include'
		})

		let body = await result.json()
		setUserName(body.info.profile[0].user_name)
		setUserImage(body.info.profile[0].image)
		setUserEmail(body.info.profile[0].email)
	}

	useEffect(() => {
		getProfile();
	}, [])

	return (
		<div className="header">
			<div className="wrapper">
				<div className="items">
					<div className="item" >
						<LanguageOutlinedIcon className="icon mx-1" />
						English
					</div>
					<div className="item" onClick={() => { dispatch({ type: "TOGGLE" }); setDarkMode(!darkMode) }}>
						{
							darkMode ?
							<LightModeOutlined className="icon" /> :
							<DarkModeOutlinedIcon className="icon" /> 
						}
					</div>
					<div className="item item_responsive" title="Full screen" onClick={() => {document.fullscreenElement ? document.exitFullscreen() : document.body.requestFullscreen(); setFullscreen(!fullscreen);}}>
						{
							fullscreen ? 
							<FullscreenExitOutlinedIcon className="icon" /> :
							<Fullscreen className="icon" />
						}		
					</div>

					<OverlayTrigger
						trigger="click"
						placement="bottom"
						overlay={
							(<Popover id="popover-basic" style={{ backgroundColor : "#ebf4ee", boxShadow: "rgb(0 0 0 / 75%) 0px 0px 16px -5px" }}>
								<Popover.Body style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "3px" }}>
									{
										userImage === null ?
											<div style={{ width: "60px" ,height: "60px", borderRadius: "50%", backgroundColor: "lightgreen", fontSize: "larger", textAlign: "center", color: "#2b572d", fontWeight: "bold", lineHeight: "60px", textTransform: "uppercase" }}>{userName[0]}</div> :
											<img src={`${process.env.REACT_APP_BACKEND_ORIGIN}/profile_images/${userImage}`} alt="" style={{ width: "60px" ,height: "60px", borderRadius: "50%" }} />
									}
									<div style={{ fontSize: "normal", textTransform: "uppercase" }} >{userName}</div>
									<div style={{ fontSize: "smaller" }} >{userEmail}</div>

									<Link to="/profile" className="header-pencil">
										<svg width="16px" height="16px" viewBox="0 0 528.899 528.899">
											<g><path d="M328.883,89.125l107.59,107.589l-272.34,272.34L56.604,361.465L328.883,89.125z M518.113,63.177l-47.981-47.981   c-18.543-18.543-48.653-18.543-67.259,0l-45.961,45.961l107.59,107.59l53.611-53.611   C532.495,100.753,532.495,77.559,518.113,63.177z M0.3,512.69c-1.958,8.812,5.998,16.708,14.811,14.565l119.891-29.069   L27.473,390.597L0.3,512.69z"/></g>
										</svg>
									</Link>
								</Popover.Body>
							</Popover>)
						}
					>
						<div className="item" title="Profile">
							{
								userImage === null ?
									<div className="avatar avatar-textIcon" >{userName[0]}</div> :
									<img src={`${process.env.REACT_APP_BACKEND_ORIGIN}/profile_images/${userImage}`} alt="" className="avatar" />
							}
						</div>
					</OverlayTrigger>
				</div>
			</div>
		</div>
	);
};

export default Header;