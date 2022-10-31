import "./feature.scss"
import { ArrowDownward, ArrowUpward } from "@mui/icons-material";

export default function Feature() {
	return (
		<div className="featured">
			<div className="featuredItem">
				<span className="featuredTitle">Users</span>
				<div className="featuredMoneyContainer">
					<span className="featuredMoney">415</span>
					<span className="featuredMoneyRate">
						+5.6%
					</span>
					<ArrowUpward />
				</div>
				<span className="featuredSub">Compared to last month</span>
			</div>
			<div className="featuredItem">
				<span className="featuredTitle">Orders</span>
				<div className="featuredMoneyContainer">
					<span className="featuredMoney">4,415</span>
					<span className="featuredMoneyRate">
						+14%
					</span>
					<ArrowUpward />
				</div>
				<span className="featuredSub">Compared to last month</span>
			</div>
			<div className="featuredItem">
				<span className="featuredTitle">Expense</span>
				<div className="featuredMoneyContainer">
					<span className="featuredMoney">$2,225</span>
					<span className="featuredMoneyRate">
						+2.4%
					</span>
					<ArrowUpward />
				</div>
				<span className="featuredSub">Compared to last month</span>
			</div>
			<div className="featuredItem">
				<span className="featuredTitle">Revanue</span>
				<div className="featuredMoneyContainer">
					<span className="featuredMoney">$4,415</span>
					<span className="featuredMoneyRate">
						+51.4%
					</span>
					<ArrowUpward />
				</div>
				<span className="featuredSub">Compared to last month</span>
			</div>

		</div>
	);
}