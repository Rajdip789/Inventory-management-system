import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../Header/Header'
import AsideNavbar from '../Asidenavbar/AsideNavbar'

const Layout = () => {
  return (
	<div style={{display:"flex"}}>
		<AsideNavbar/>
		<div style={{ flexGrow: "1", display: "flex", flexDirection: "column" }}>
			<Header/>
			<Outlet/>
		</div>
	</div>
  )
}

export default Layout