import React from 'react'
import './States.scss'

const Loader = () => {
	return (
		<div className="card">
			<div className="container">
				<div className='content' style={{ backgroundColor: '#cef0cb' }}>
					<span className="loader"></span>
				</div>
			</div>
		</div>
	)
}

export default Loader