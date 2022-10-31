import React from 'react'
import './Dashboard.scss'
import Feature from './Features/Feature'
import Chart from './chart/Chart'


function Dashboard() {
	return (
		<div className='dashboard'>
			<Feature />
			<Chart />
		</div>
	)
}

export default Dashboard