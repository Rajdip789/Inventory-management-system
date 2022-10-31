import React from 'react'
import './Table.scss'

function Table(props) {
	return (
		<table className='mytable'>

			<thead>
				<tr>
					{
						props.headers.map((col, i) => {
							return (
								<th key={i} style={{width:props.custom_styles[i]}}>{col}</th>
							)
						})
					}
				</tr>
			</thead>
			<tbody>
				{
					props.data.length == 0 ? <tr><td colSpan={props.headers.length}>No data found!</td></tr> 
					:
					props.data.map((obj, i) => {
						return (
							<tr key={i}>
								{
									Object.keys(obj).map((key, j) => {
										return (
											<td key={j} style={{width:props.custom_styles[j]}}>{obj[key]}</td>
										)
									})
								}				
							</tr>
						)
					})
				}
			</tbody>
			<tfoot>
				<tr>
					<td colSpan={props.headers.length}>
						<div style={{display:"flex", justifyContent:"space-between"}}>
							<button className='btn default' disabled={props.current_page==1} onClick={()=>{props.tablePageChangeFunc(props.current_page-1)}} style={{paddingTop:"0.6rem",paddingBottom:"0.6rem",color:"dimgray",marginLeft:"1rem"}}>Previous</button>
							<button className='btn default' disabled={props.current_page*10 >= props.data_count} onClick={()=>{props.tablePageChangeFunc(props.current_page+1)}} style={{padding:"0.6rem 1.6rem",color:"dimgray",marginRight:"1rem"}}>Next</button>
						</div>
					</td>
				</tr>
			</tfoot>

		</table>
	)
}

export default Table