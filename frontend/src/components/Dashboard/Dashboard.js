import React from 'react'
import './Dashboard.scss'
import Feature from './Features/Feature'
import Chart from './chart/Chart'


function Dashboard() {
	return (
		<div className='dashboard'>
			<div style={{ overflow: "scroll", height: "100%" }} >
				<Feature />
				<Chart />
				<Chart />
			</div>
		</div>
	)
}

export default Dashboard