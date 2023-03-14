import React from 'react'
import "./chart.scss"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';


export default function Chart({graphStats}) {

	return (
		<div className="chart">
			<div className="chartTitle">SALES ANALYTICS</div>
			<div className='chartContent' >
				<ResponsiveContainer width="100%" aspect={4 / 1}>
					<AreaChart width={730} height={250} data={graphStats}
						margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
						<defs>
							<linearGradient id="colorOrder" x1="0" y1="0" x2="0" y2="1">
								<stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
								<stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
							</linearGradient>
							<linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
								<stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
								<stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
							</linearGradient>
							<linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
								<stop offset="5%" stopColor="#de7b7b" stopOpacity={0.8} />
								<stop offset="95%" stopColor="#de7b7b" stopOpacity={0} />
							</linearGradient>
						</defs>
						<XAxis dataKey="Month" />
						<YAxis />
						<CartesianGrid strokeDasharray="3 3" />
						<Tooltip />
						<Area type="monotone" dataKey="order" stroke="#8884d8" fillOpacity={1} fill="url(#colorOrder)" />
						<Area type="monotone" dataKey="expense" stroke="#82ca9d" fillOpacity={1} fill="url(#colorExpense)" />
						<Area type="monotone" dataKey="revenue" stroke="#de7b7b" fillOpacity={1} fill="url(#colorRevenue)" />
					</AreaChart>
				</ResponsiveContainer>
			</div>
		</div>


	);
}