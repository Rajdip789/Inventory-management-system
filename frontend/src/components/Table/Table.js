import React, { useState } from 'react'
import './Table.scss'

import { OverlayTrigger, Popover } from 'react-bootstrap';

import SearchOutlined from "@mui/icons-material/SearchOutlined";
import ViewColumn from "@mui/icons-material/ViewColumn";
import Close from "@mui/icons-material/Close";
import ArrowDownward from "@mui/icons-material/ArrowDownward";
import ArrowUpward from "@mui/icons-material/ArrowUpward";

function Table(props) {

	const [searchBar, setSearchBar] = useState(false)
	const [unsetColumns, setUnsetColumns] = useState([])

	return (
		<div className='dataTable'>
			<div className='tableToolbar'>
				<div className="flex-grow-1 d-flex align-items-center">
					<div className='my__icon' onClick={()=>{setSearchBar(true)}} ><SearchOutlined/></div>
					<input className="search__text" style={{width: searchBar? "20rem":"0"}} maxLength="200" value={props.searchInput} onChange={(e)=>{props.setSearchInput(e.target.value)}} />
					<Close style={{transition:"all 0.3s ease-in-out", cursor:"pointer", visibility: searchBar? "visible":"hidden", opacity: searchBar? "1":"0"}} onClick={()=>{setSearchBar(false);props.setSearchInput("")}} />
				</div>
				<OverlayTrigger
					trigger="click"
					placement="bottom-end"
					overlay={
						(
							<Popover id="popover-basic" style={{ backgroundColor : "#e4ffe5", boxShadow: "rgb(0 0 0 / 75%) 0px 0px 16px -5px" }}>
								<Popover.Body>
									<div className='px-2'>
									{
										props.headers.map((val,i)=>{
											return(
												<div key={i} className="d-flex align-items-center gap-3" >
													<div className="showColumnHover" style={{width:"1rem",height:"1rem",backgroundColor:"darkslategrey",borderRadius:"50%",position:"relative",cursor:"pointer"}}
														onClick={()=>{
															if(unsetColumns.includes(val)){
																let t = [...unsetColumns]
																t.splice(t.findIndex(x=> x === val),1)
																setUnsetColumns(t)
															}
															else{
																setUnsetColumns([...unsetColumns,val])
															}
														}}
													>
														{
															!unsetColumns.includes(val) &&
															<div style={{position:"absolute",bottom:"2px",left:"4px"}}>
																<svg width={15} height={15/1.06} viewBox="0 0 1201.000000 1131.000000">
																	<g transform="translate(0.000000,1131.000000) scale(0.100000,-0.100000)" fill="#2cd498" stroke="none">
																		<path d="M11975 11291 c-6 -5 -48 -29 -95 -53 -108 -57 -243 -129 -344 -185 -43 -23 -80 -43 -82 -43 -2 0 -43 -22 -91 -48 -97 -54 -231 -126 -338 -182 -61 -32 -191 -101 -250 -134 -11 -6 -22 -14 -25 -17 -3 -4 -15 -9 -27 -13 -13 -4 -23 -12 -23 -17 0 -5 -4 -9 -10 -9 -11 0 -194 -123 -210 -141 -3 -3 -26 -20 -52 -37 -25 -18 -52 -38 -60 -45 -7 -7 -29 -24 -48 -37 -19 -13 -37 -27 -40 -30 -3 -3 -36 -30 -75 -60 -38 -30 -79 -62 -90 -72 -11 -9 -81 -67 -155 -128 -121 -101 -223 -187 -254 -215 -6 -5 -47 -41 -91 -80 -87 -76 -149 -132 -175 -155 -9 -8 -36 -33 -60 -54 -73 -64 -222 -199 -255 -231 -18 -16 -56 -52 -86 -79 -624 -569 -1773 -1719 -2410 -2410 -30 -33 -67 -73 -84 -91 -31 -32 -205 -221 -285 -309 -25 -27 -56 -61 -70 -76 -14 -15 -65 -71 -115 -126 -49 -54 -112 -123 -140 -153 -27 -30 -57 -62 -65 -71 -64 -70 -204 -224 -241 -264 -24 -27 -55 -62 -69 -76 -14 -15 -65 -71 -115 -126 -49 -54 -112 -123 -140 -153 -27 -30 -57 -62 -65 -71 -63 -69 -204 -224 -241 -264 -24 -27 -57 -64 -74 -81 -16 -17 -70 -76 -120 -130 -127 -140 -176 -194 -205 -225 -14 -15 -65 -71 -115 -126 -49 -54 -112 -123 -140 -153 -27 -30 -57 -62 -65 -71 -64 -70 -204 -224 -241 -264 -24 -27 -55 -62 -69 -76 -14 -15 -65 -71 -115 -126 -49 -54 -112 -123 -140 -153 -27 -30 -57 -62 -65 -71 -63 -69 -204 -224 -241 -264 -24 -27 -57 -64 -74 -81 -16 -17 -73 -77 -125 -134 -79 -86 -95 -100 -101 -85 -4 11 -24 73 -44 139 -20 66 -47 152 -60 190 -12 39 -39 124 -60 190 -20 66 -41 129 -45 140 -5 11 -23 67 -40 125 -18 58 -45 143 -60 190 -15 47 -44 139 -65 205 -20 66 -47 152 -60 190 -37 114 -126 396 -142 450 -8 28 -19 59 -23 70 -5 11 -23 67 -40 125 -18 58 -47 150 -65 205 -17 55 -45 142 -61 192 l-29 93 -420 0 c-410 0 -634 -9 -745 -31 -106 -20 -196 -40 -250 -56 -95 -27 -185 -56 -195 -63 -5 -4 -21 -11 -35 -15 -44 -13 -153 -67 -210 -103 -65 -41 -450 -419 -450 -441 0 -17 3 -23 62 -131 19 -36 50 -92 68 -125 18 -33 45 -82 60 -110 15 -27 45 -81 65 -120 21 -38 63 -117 95 -175 32 -58 77 -141 100 -185 24 -44 51 -93 60 -110 9 -17 37 -66 60 -110 24 -44 56 -105 73 -135 16 -30 46 -84 65 -120 19 -36 44 -80 54 -98 10 -19 39 -73 65 -120 25 -48 53 -100 63 -117 10 -16 35 -64 57 -105 47 -87 94 -174 133 -245 15 -27 45 -81 65 -120 21 -38 48 -88 60 -110 12 -22 45 -85 75 -140 29 -55 56 -104 60 -110 4 -5 23 -39 42 -75 80 -148 101 -185 108 -195 4 -5 23 -39 42 -75 55 -102 88 -161 123 -220 18 -30 43 -73 55 -95 13 -22 34 -60 47 -84 29 -51 299 -497 398 -656 88 -143 391 -597 420 -631 6 -6 17 -22 25 -34 20 -30 82 -112 95 -126 5 -7 28 -35 50 -63 l40 -51 236 0 237 0 48 53 c63 70 90 101 139 162 22 28 42 52 45 55 3 3 37 46 75 95 38 50 72 92 75 95 3 3 17 21 30 40 13 19 29 40 35 47 20 24 31 38 55 73 13 19 29 40 35 46 5 6 17 22 25 34 8 12 42 59 76 104 33 44 81 110 106 146 25 36 86 124 136 195 50 72 95 135 99 140 4 6 26 37 48 70 22 33 42 62 46 65 3 3 110 163 237 355 128 193 236 355 240 360 4 6 25 39 47 75 21 36 41 67 44 70 7 6 96 146 159 250 25 41 49 77 52 80 3 3 17 23 30 45 40 67 497 752 510 765 3 3 23 32 45 65 22 33 44 64 48 70 4 5 29 40 55 77 134 192 212 301 267 378 34 47 101 139 148 205 48 66 92 128 99 137 7 9 20 26 28 38 22 32 375 510 402 544 13 16 34 45 48 65 14 20 33 44 42 55 10 11 30 38 45 60 15 23 30 43 34 46 3 3 90 118 194 255 104 138 192 252 195 255 3 3 57 73 120 155 63 83 117 152 120 155 3 3 44 55 90 115 46 61 86 112 90 115 3 3 37 46 75 95 38 50 72 92 75 95 3 3 30 37 60 75 30 39 57 72 60 75 3 3 30 37 60 75 30 39 57 72 60 75 3 3 30 37 60 75 30 39 57 72 60 75 3 3 50 61 105 130 122 152 124 154 171 210 22 25 75 90 119 145 44 55 87 106 95 115 18 20 43 49 95 115 22 28 45 55 51 60 9 8 102 119 189 224 11 14 27 32 35 41 8 9 51 58 94 110 44 52 84 100 90 105 6 6 26 28 45 50 46 54 143 165 161 185 8 8 40 45 70 80 30 35 62 72 70 80 25 28 176 198 246 279 32 37 31 36 89 101 22 25 69 79 105 119 36 41 72 82 80 91 8 8 40 45 70 80 30 35 62 72 70 80 25 28 176 198 246 279 32 37 31 36 89 101 22 25 69 79 105 119 36 41 72 82 80 91 8 8 40 45 70 80 30 35 62 72 70 80 20 22 69 77 155 175 38 44 72 82 75 85 3 3 50 57 105 120 55 63 107 122 115 130 16 17 105 119 161 185 19 21 41 46 49 55 19 21 67 75 155 175 39 44 84 96 101 115 139 155 144 163 144 212 0 47 -13 61 -35 39z"/>
																	</g>
																</svg>
															</div>
														}
													</div>
													<div>{val}</div>
												</div>
											)
										})
									}
									</div>
								</Popover.Body>
							</Popover>
						)
					}
				>
					<div className='my__icon'><ViewColumn/></div>
				</OverlayTrigger>
			</div>
			<table className='mytable'>
				<thead>
					<tr>
						{
							props.headers.filter(x=>!unsetColumns.includes(x)).map((col, i) => {
								return (
									<th key={i} style={{width:props.custom_styles[i]}} >
										<div className='d-flex justify-content-center'>
											<p style={{cursor:"pointer"}}
												onClick={()=>{
													if((i !== 0) && (i !== props.headers.length-1)){
														props.setSortColumn(props.columnOriginalNames[i-1])
														props.setSortOrder("ASC")
													}
												}}
											>{col}</p>
											{
												props.sortColumn !== "" && props.columnOriginalNames.findIndex(x => x === props.sortColumn)+1 === i &&
												<>
													{
														props.sortOrder === "ASC" ?
														<ArrowDownward style={{cursor:"pointer", width:"1.2rem", color:"rgba(0,0,0,0.5)"}} onClick={()=>{props.setSortOrder("DESC")}} /> :
														<ArrowUpward style={{cursor:"pointer", width:"1.2rem", color:"rgba(0,0,0,0.5)"}} onClick={()=>{props.setSortOrder("ASC")}} />
													}
													<Close style={{cursor:"pointer", width:"1rem", color:"rgba(0,0,0,0.5)"}} onClick={()=>{ props.setSortColumn(""); console.log("here"); props.setSortOrder("")}} />
												</>
											}
										</div>
									</th>
								)
							})
						}
					</tr>
				</thead>
				<tbody>
					{
						props.data.length === 0 ? <tr><td colSpan={props.headers.length}>No data found!</td></tr> 
						:
						props.data.map((obj, i) => {
							let fobj = {...obj}
							let arr = unsetColumns.map(a=>props.headers.findIndex(b=>b===a))
							
							arr.map(x=>Object.keys(fobj)[x]).forEach(x=>{
								delete fobj[x]
							})

							return (
								<tr key={i}>
									{
										Object.keys(fobj).map((key, j) => {
											return (
												<td key={j} style={{width:props.custom_styles[j]}}>{fobj[key]}</td>
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
								<button className='btn default' disabled={props.current_page===1} onClick={()=>{props.tablePageChangeFunc(props.current_page-1)}} style={{paddingTop:"0.6rem",paddingBottom:"0.6rem",color:"dimgray",marginLeft:"1rem"}}>Previous</button>
								<button className='btn default' disabled={props.current_page*10 >= props.data_count} onClick={()=>{props.tablePageChangeFunc(props.current_page+1)}} style={{padding:"0.6rem 1.6rem",color:"dimgray",marginRight:"1rem"}}>Next</button>
							</div>
						</td>
					</tr>
				</tfoot>

			</table>
		</div>
	)
}

export default Table