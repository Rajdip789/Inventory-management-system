import "./Feature.scss"
import { ArrowDownward, ArrowUpward, PersonOutlined, ShoppingCartOutlined, PaidOutlined, AccountBalanceWalletOutlined } from "@mui/icons-material";
import { Link } from 'react-router-dom';

export default function Feature({reportStats}) {
	let porder = ((reportStats[1].current_month - reportStats[1].previous_month) * 100) / reportStats[1].previous_month
	let pexpense = ((reportStats[2].current_month - reportStats[2].previous_month) * 100) / reportStats[2].previous_month
    let curr_rev = (reportStats[1].current_month - reportStats[2].current_month)
    let pre_rev = (reportStats[1].previous_month - reportStats[2].previous_month)
	let prevenue = ((curr_rev - pre_rev) * 100) / pre_rev;

	return (
		<div className="featured">
			<div className="featuredItem">
				<span className="featuredTitle">Users</span>
				<div className="featuredMoneyContainer flex-column flex-start" style={{ margin: "0px 0px" }}>
					<div className="d-flex gap-2">
						<div className="d-flex align-items-center"><PersonOutlined style={{backgroundColor: "rgb(255,0,0,0.3)", borderRadius: "5px", color: "#540106", width:"15px", height:"15px"}} /></div>
						<Link to='/employees' className="fw-bold text-dark text-decoration-none "><span className="text-hover-primary">Employees:</span></Link>
						<span>{reportStats[0].employee_count}</span>
					</div>
					<div className="d-flex gap-1 my-1">
						<div className="d-flex align-items-center"><PersonOutlined style={{backgroundColor: "rgb(0,255,0,0.3)", borderRadius: "5px", color: "#540106", width:"15px", height:"15px"}} /></div>
						<Link to='/customers' className="fw-bold text-dark text-decoration-none "><span className="text-hover-primary">Customers:</span></Link>
						<span>{reportStats[0].customer_count}</span>
					</div>
					<div className="d-flex gap-2">
						<div className="d-flex align-items-center"><PersonOutlined style={{backgroundColor: "rgb(0,0,255,0.3)", borderRadius: "5px", color: "#540106", width:"15px", height:"15px"}} /></div>
						<Link to='/suppliers' className="fw-bold text-dark text-decoration-none "><span className="text-hover-primary">Suppliers:</span></Link>
						<span>{reportStats[0].supplier_count}</span>
					</div>
				</div>
				
				<div className="d-flex justify-content-end align-items-center">
					<div style={{ backgroundColor: "rgb(255, 102, 0, 0.3)", borderRadius: "5px", color: "#5e5708", padding:"3px" }}><PersonOutlined/></div>
				</div>
			</div>

			<div className="featuredItem">
				<span className="featuredTitle">Orders</span>
				<div className="featuredMoneyContainer">
					<span className="featuredMoney">₹{reportStats[1].current_month}</span>
					<div className="d-flex align-items-center" style={{ color: porder >= 0 ? "green" : "red" }}>					
						<span className="featuredMoneyRate">{Math.round(porder * 100)/100}%</span>
						{porder >= 0 ? <ArrowUpward/> : <ArrowDownward/>}
					</div>
				</div>
				<div className="d-flex justify-content-between align-items-center">
					<Link to='/orders' className="text-decoration-none"><span className="featuredSub">See all orders</span></Link>
					<div style={{ backgroundColor: "#e8e190", borderRadius: "5px", color: "#5e5708", padding:"3px" }}><ShoppingCartOutlined/></div>
				</div>
			</div>
			<div className="featuredItem">
				<span className="featuredTitle">Expense</span>
				<div className="featuredMoneyContainer">
					<span className="featuredMoney">₹{reportStats[2].current_month}</span>
					<div className="d-flex align-items-center" style={{ color: pexpense >= 0 ? "green" : "red" }}>
						<span className="featuredMoneyRate">{Math.round(pexpense * 100)/100}%</span>
						{pexpense >= 0 ? <ArrowUpward/> : <ArrowDownward/>}
					</div>
				</div>
				<div className="d-flex justify-content-between align-items-center">
					<Link to='/expenses' className="text-decoration-none"><span className="featuredSub">See all expenses</span></Link>
					<div style={{ backgroundColor: "#d9b6cb", borderRadius: "5px", color: "#a30b66", padding:"3px" }}><AccountBalanceWalletOutlined/></div>
				</div>
			</div>
			<div className="featuredItem">
				<span className="featuredTitle">Revenue</span>
				<div className="featuredMoneyContainer">
					<span className="featuredMoney">₹{reportStats[1].current_month - reportStats[2].current_month}</span>
					<div className="d-flex align-items-center" style={{ color: "red" }}>
						<span className="featuredMoneyRate">{Math.round(prevenue * 100)/100}%</span>
						<ArrowDownward />
					</div>
				</div>
				<div className="d-flex justify-content-between align-items-center">
					<span className="featuredSub"></span>
					<div style={{ backgroundColor: "#b3deaf", borderRadius: "5px", color: "#1db80f", padding:"3px" }}><PaidOutlined /></div>
				</div>
			</div>

		</div>
	);
}