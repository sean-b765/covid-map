import { motion } from 'framer-motion'
import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import {
	addToHistoricalData,
	close,
	getHistoricalData,
	setSelectedCountry,
} from '../slices/modalSlice'
import Chart from './Chart'

const Modal = () => {
	const dispatch = useAppDispatch()
	const { selectedCountry: country } = useAppSelector((state) => state.modal)

	const initial = { opacity: 0 }

	useEffect(() => {
		dispatch(getHistoricalData(country?.location))
	}, [])

	return (
		country && (
			<motion.div
				className="modal"
				initial={initial}
				exit={initial}
				animate={{ opacity: 1 }}
			>
				<button
					className="btn btn--close"
					onClick={() => {
						dispatch(close())
					}}
					aria-label="Close modal"
				>
					<svg
						stroke="currentColor"
						fill="currentColor"
						strokeWidth="0"
						viewBox="0 0 512 512"
						height="1em"
						width="1em"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path d="M278.6 256l68.2-68.2c6.2-6.2 6.2-16.4 0-22.6-6.2-6.2-16.4-6.2-22.6 0L256 233.4l-68.2-68.2c-6.2-6.2-16.4-6.2-22.6 0-3.1 3.1-4.7 7.2-4.7 11.3 0 4.1 1.6 8.2 4.7 11.3l68.2 68.2-68.2 68.2c-3.1 3.1-4.7 7.2-4.7 11.3 0 4.1 1.6 8.2 4.7 11.3 6.2 6.2 16.4 6.2 22.6 0l68.2-68.2 68.2 68.2c6.2 6.2 16.4 6.2 22.6 0 6.2-6.2 6.2-16.4 0-22.6L278.6 256z"></path>
					</svg>
				</button>
				<header>
					<h1>{country.location}</h1>
					<div className="stats">
						{country.deaths && (
							<p>{Number(country.deaths).toLocaleString()} deaths</p>
						)}
						{country.cumulative && (
							<p>
								{Number(country.cumulative).toLocaleString()} confirmed cases
							</p>
						)}
					</div>
				</header>
				<Chart selectedLocation={country.location} />
			</motion.div>
		)
	)
}

export default Modal
