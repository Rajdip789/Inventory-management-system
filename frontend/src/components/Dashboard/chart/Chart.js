import React from 'react'
import "./chart.scss"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


export default function Chart() {

	const data = [
		{ name: 'Jan', "Active User": 4000 },
		{ name: 'Fab', "Active User": 3000 },
		{ name: 'Mar', "Active User": 2000 },
		{ name: 'Apr', "Active User": 6000 },
		{ name: 'May', "Active User": 5000 },
		{ name: 'Jun', "Active User": 2000 },
		{ name: 'Jul', "Active User": 4000 },
		{ name: 'Aug', "Active User": 8000 },
		{ name: 'Sep', "Active User": 2000 },
		{ name: 'Oct', "Active User": 4000 },
		{ name: 'Nov', "Active User": 4000 },
		{ name: 'Dec', "Active User": 9000 },
	];

	return (
		<div className="chart">
			<h3 className="chartTitle">Sales Analytics</h3>
			<ResponsiveContainer width="100%" aspect={4 / 1}>
				<LineChart data={data}>
					<XAxis dataKey="name" stroke='#5550bd' />
					<Line type="monotone" dataKey="Active User" stroke='#5550bd' />
					<Tooltip />
					<CartesianGrid stroke='#e0dfdf' strokeDasharray="5 5" />
				</LineChart>
			</ResponsiveContainer>
		</div>
	);
}