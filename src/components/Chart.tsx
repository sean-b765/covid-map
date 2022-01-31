import { motion } from 'framer-motion'
import moment from 'moment'
import React, { useState } from 'react'
import {
	AreaChart,
	Area,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from 'recharts'
import { useAppSelector } from '../app/hooks'

const Chart = ({ selectedLocation }) => {
	const [time, setTime] = useState(999)
	const _data = useAppSelector(
		(state) => state.modal.historicalList[selectedLocation]
	)

	const max = useAppSelector((state) => state.modal.selectedCountry.cases)
	const leftMargin = Number(max) >= 10_000_000 ? 40 : 20

	const data = _data
		?.map((datum) => {
			return Number(datum.new_cases) < 0
				? {
						...datum,
						xAxis: moment(datum.date).format('D MMM YY'),
						new_cases: '0',
				  }
				: { ...datum, xAxis: moment(datum.date).format('D MMM YY') }
		})
		.filter((datum) =>
			moment(datum.date).isAfter(moment().subtract(time, 'months'))
		)

	const pending = useAppSelector((state) => state.modal.pending)

	return pending ? (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			Loading...
			{/* 
				SVG loading animation by:
				https://samherbert.net/svg-loaders/
			*/}
			<span>
				<svg
					width="30"
					height="20"
					viewBox="0 0 55 80"
					xmlns="http://www.w3.org/2000/svg"
					fill="#000e8b"
				>
					<g transform="matrix(1 0 0 -1 0 80)">
						<rect width="10" height="20" rx="3">
							<animate
								attributeName="height"
								begin="0s"
								dur="4.3s"
								values="20;45;57;80;64;32;66;45;64;23;66;13;64;56;34;34;2;23;76;79;20"
								calcMode="linear"
								repeatCount="indefinite"
							/>
						</rect>
						<rect x="15" width="10" height="80" rx="3">
							<animate
								attributeName="height"
								begin="0s"
								dur="2s"
								values="80;55;33;5;75;23;73;33;12;14;60;80"
								calcMode="linear"
								repeatCount="indefinite"
							/>
						</rect>
						<rect x="30" width="10" height="50" rx="3">
							<animate
								attributeName="height"
								begin="0s"
								dur="1.4s"
								values="50;34;78;23;56;23;34;76;80;54;21;50"
								calcMode="linear"
								repeatCount="indefinite"
							/>
						</rect>
						<rect x="45" width="10" height="30" rx="3">
							<animate
								attributeName="height"
								begin="0s"
								dur="2s"
								values="30;45;13;80;56;72;45;76;34;23;67;30"
								calcMode="linear"
								repeatCount="indefinite"
							/>
						</rect>
					</g>
				</svg>
			</span>
		</div>
	) : data?.length ? (
		<>
			<select>
				<option onClick={() => setTime(999)}>All time</option>
				<option onClick={() => setTime(24)}>2 years</option>
				<option onClick={() => setTime(12)}>1 year</option>
				<option onClick={() => setTime(6)}>6 months</option>
				<option onClick={() => setTime(3)}>3 months</option>
				<option onClick={() => setTime(1)}>1 month</option>
			</select>
			<motion.div
				initial={{ opacity: 0 }}
				exit={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.4 }}
				className="charts"
			>
				<ResponsiveContainer>
					<AreaChart
						width={500}
						height={400}
						data={data}
						margin={{
							top: 10,
							right: 10,
							left: leftMargin,
							bottom: 100,
						}}
					>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis
							dataKey="xAxis"
							label="Total Cases"
							angle={90}
							dy={50}
							dx={0}
							fontSize={'0.8rem'}
						/>
						<YAxis
							tickFormatter={(tick) => tick.toLocaleString()}
							fontSize={'0.8rem'}
						/>
						<Tooltip />
						<Area
							type="monotone"
							dataKey="total_cases"
							name="Total cases"
							stackId="1"
							stroke="#8884d8"
							fill="#8884d868"
						/>
						<Area
							type="monotone"
							dataKey="total_deaths"
							name="Total deaths"
							stackId="1"
							stroke="#82ca9d"
							fill="#82ca9e6e"
						/>
					</AreaChart>
				</ResponsiveContainer>

				<ResponsiveContainer>
					<AreaChart
						width={500}
						height={400}
						data={data}
						margin={{
							top: 10,
							right: 10,
							left: leftMargin,
							bottom: 100,
						}}
					>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis
							dataKey="xAxis"
							fontSize={'0.8rem'}
							angle={90}
							dy={50}
							dx={0}
							label="New Cases"
						/>
						<YAxis
							tickFormatter={(tick) => tick.toLocaleString()}
							fontSize={'0.8rem'}
						/>
						<Tooltip />
						<Area
							type="monotone"
							dataKey="new_cases"
							name="New cases"
							stackId="1"
							stroke="#8884d8"
							fill="#8884d868"
						/>
						<Area
							type="monotone"
							dataKey="new_deaths"
							name="New deaths"
							stackId="1"
							stroke="#82ca9d"
							fill="#82ca9e6e"
						/>
					</AreaChart>
				</ResponsiveContainer>
			</motion.div>
		</>
	) : (
		<div>No historical data.</div>
	)
}

export default Chart
