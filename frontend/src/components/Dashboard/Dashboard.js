import React, { useEffect, useState } from 'react'
import './Dashboard.scss'
import Feature from './Features/Feature'
import Chart from './chart/Chart'
import { getCookie } from '../../cookie'


function Dashboard() {
	const [pageState, setPageState] = useState(1)
	const [permission, setPermission] = useState(null)

	const [reportStats, setReportStats] = useState(null)
	const [productStats, setProductStats] = useState(null)
	const [graphStats, setGraphStats] = useState(null)

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

								//console.log(JSON.parse(body.info));
								let p = JSON.parse(body.info).find(x => x.page === 'dashboard')
								if (p.view && p.create) {
									setPermission(p)
								} else {
									window.location.href = '/unauthorized';
								}
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

	const getReportStats = async () => {
		let result = await fetch(`${process.env.REACT_APP_BACKEND_ORIGIN}/get_report_stats`, {
			method: 'POST',
			headers: {
				'Content-type': 'application/json; charset=UTF-8',
				'access_token': getCookie('accessToken'),
			}
		})

		let body = await result.json()
		setReportStats(body.info)
	}

	const getProductStats = async () => {
		let result = await fetch(`${process.env.REACT_APP_BACKEND_ORIGIN}/get_product_stats`, {
			method: 'POST',
			headers: {
				'Content-type': 'application/json; charset=UTF-8',
				'access_token': getCookie('accessToken'),
			}
		})

		let body = await result.json()
		setProductStats(body.info)
	}

	const getGraphStats = async () => {
		let result = await fetch(`${process.env.REACT_APP_BACKEND_ORIGIN}/get_graph_stats`, {
			method: 'POST',
			headers: {
				'Content-type': 'application/json; charset=UTF-8',
				'access_token': getCookie('accessToken'),
			}
		})

		let body = await result.json()
		setGraphStats(body.info)
	}

	useEffect(() => {
		if (permission !== null) {
			let p1 = getReportStats()
			let p2 = getProductStats()
			let p3 = getGraphStats()

			Promise.all([p1,p2,p3])
			.then(()=>{
				setPageState(2)
			})
			.catch((err)=>{
				console.log(err)
				setPageState(3)
			})
		}
	}, [permission])

	return (
		<div className='dashboard'>
			<div style={{ overflow: "scroll", height: "100%" }} >
				{
					pageState === 1 ?
					<div className="card">
						<div className="container">
							<div style={{ height: '20rem', backgroundColor: '#cef0cb', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '2rem', margin: '1rem' }}>
								<span className="loader"></span>
							</div>
						</div>
					</div>
					: pageState === 2 ?	
					<>
						<Feature reportStats={reportStats} />
						<div className='second_panel'>
							<div className='second_panel_left'>hello</div>
							<div className='second_panel_right'>hi</div>
						</div>
						<Chart />
					</>
					:
					<div className="card">
						<div className="container">
							<div style={{ display: "flex", height: "10rem", backgroundColor: "#e6bfbf", border: "2px red dotted", borderRadius: "2rem", alignItems: "center", justifyContent: "center", margin: "1rem" }}>
								<div style={{ fontSize: 'x-large', fontWeight: 'bold', color: 'white', fontFamily: 'cursive' }}>
									Something went wrong!
								</div>
							</div>
						</div>
					</div>
				}
			</div>
		</div>
	)
}

export default Dashboard