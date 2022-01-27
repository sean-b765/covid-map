import React, { useState } from 'react'
import { Marker } from 'react-map-gl'
import { CountryStatistic, Location } from '../interfaces'
import { AnimatePresence, motion } from 'framer-motion'
import { setSelectedCountry, open } from '../slices/modalSlice'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { setSelectedLocation } from '../slices/data'
import countryCodes from '../consts/country-codes'

const Bubble = ({ max, item }: { max: number; item: Location }) => {
	const dispatch = useAppDispatch()

	const [mouseOver, setMouseOver] = useState(false)
	const [xy, setXy] = useState({ x: 0, y: 0 })

	const diameter = Math.min(
		Math.max((parseInt(item.cumulative) / max) * 200, 7),
		70
	)

	const selectedCountry = useAppSelector((state) => state.modal)

	const { latitude, longitude } = countryCodes.filter(
		(value) => value.db_name === item.location
	)[0]

	return (
		<>
			<Marker
				onPointerMove={(e) => setXy(e.center)}
				latitude={latitude}
				longitude={longitude}
			>
				<div
					style={{
						marginLeft: `-${diameter / 2 + 16}px`,
						marginTop: `-${diameter / 2 + 16}px`,
						padding: '16px',
						cursor: 'pointer',
					}}
					onMouseEnter={() => setMouseOver(true)}
					onMouseLeave={() => setMouseOver(false)}
					onClick={() => {
						dispatch(open())
						dispatch(setSelectedLocation(item))
					}}
				>
					<div
						style={{
							background: '#3967ff53',
							border: 'thin solid #003cff',
							borderRadius: '50%',
							width: `${diameter}px`,
							height: `${diameter}px`,
						}}
					></div>
				</div>
			</Marker>
			<AnimatePresence>
				{mouseOver && (
					<motion.div
						style={{
							zIndex: '999',
							position: 'absolute',
							background: 'white',
							borderRadius: '0.4rem',
							padding: '0.2rem 1rem',
							left: `${xy.x + 10}px`,
							top: `${xy.y + 5}px`,
							boxShadow: '0px 5px 5px #0000006c',
						}}
						initial={{
							opacity: 0,
							y: 50,
						}}
						exit={{ opacity: 0 }}
						animate={{ opacity: 1, y: -10 }}
						transition={{ duration: 0.2, ease: [0.42, 0, 0.58, 1] }}
						onClick={() => {
							open()
							dispatch(setSelectedLocation(item))
						}}
					>
						<p style={{ whiteSpace: 'nowrap' }}>{item.location}</p>
						<p>{parseInt(item.cumulative).toLocaleString()}</p>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	)
}

export default Bubble
