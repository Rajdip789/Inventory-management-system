import React from 'react'
import './States.scss'

const Error = () => {
	return (
		<div className="card">
			<div className="container">
				<div className='content' style={{ backgroundColor: "#e6bfbf", border: "2px red dotted" }}>
					<div className='error-text'>
						Something went wrong !
					</div>
				</div>
			</div>
		</div>
	)
}

export default Error