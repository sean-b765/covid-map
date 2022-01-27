import { motion } from 'framer-motion'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import ReactMapGl, { MapEvent, Layer, Source } from 'react-map-gl'
import { useAppSelector } from '../app/hooks'
import { Country, Province } from '../interfaces'

const Map = ({
	countryCodes,
	max,
}: {
	countryCodes?: Country[]
	max?: number
}) => {
	const [viewport, setViewport] = useState({
		width: '100vw',
		height: '100vh',
		latitude: 40.78343,
		longitude: -73.96625,
		zoom: 1,
	})
	const [box, setBox] = useState({ width: 0, height: 0 })
	const [xy, setXy] = useState({ x: 0, y: 0, active: false })
	const [countries, setCountries] = useState<any>({
		type: 'FeatureCollection',
		features: [],
	})
	const [provinces, setProvinces] = useState<any>({
		type: 'FeatureCollection',
		features: [],
	})
	const [hoverItem, setHoverItem] = useState({
		cumulative: '',
		deaths: '',
		location: '',
		city: '',
		state: '',
	})

	const mapRef = useRef()

	const { data, pending } = useAppSelector((state) => state.data)

	const handleWindowResize = () =>
		setBox({ width: window.innerWidth, height: window.innerHeight })

	useEffect(() => {
		setBox({ width: window.innerWidth, height: window.innerHeight })
		window.addEventListener('resize', handleWindowResize)

		data.map((item, id) => {
			setCountries((state) => {
				return {
					...state,
					features: [
						...state.features,
						{
							type: 'Feature',
							geometry: { type: 'Point', coordinates: [item.lng, item.lat] },
							properties: {
								location: item.location,
								cumulative: item.cumulative,
								deaths: item.deaths,
								radius: Math.min(
									Math.max((parseInt(item.cumulative) / max) * 200, 7),
									45
								),
							},
							id,
						},
					],
				}
			})

			if (!item.provinces.length) return

			item.provinces.map((province, id) => {
				setProvinces((state) => {
					return {
						...state,
						features: [
							...state.features,
							{
								type: 'Feature',
								geometry: {
									type: 'Point',
									coordinates: [province.lng, province.lat],
								},
								properties: {
									location: item.location,
									state: province.state,
									city: province.county,
									cumulative: province.cumulative,
									deaths: province.deaths,
								},
								id,
							},
						],
					}
				})
			})
		})

		return () => window.removeEventListener('resize', handleWindowResize)
	}, [])

	return (
		<div className="map">
			{xy.active && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					className="popup"
					style={{
						zIndex: 999999999,
						left: `${xy.x + 10}px`,
						top: `${xy.y + 3}px`,
						// Transform the popup if it's too close to edges
						transform: `translate(${xy.x > box.width * 0.85 ? -120 : 0}%, ${
							xy.y > box.height * 0.7 ? -120 : 0
						}%)`,
						position: 'fixed',
						background: 'white',
						padding: '1rem',
						borderRadius: '0.5rem',
					}}
				>
					{hoverItem.state ? (
						<p style={{ whiteSpace: 'nowrap' }}>
							{hoverItem.state}, {hoverItem.location}
						</p>
					) : (
						<p style={{ whiteSpace: 'nowrap' }}>{hoverItem.location}</p>
					)}

					{hoverItem.city && <p>{hoverItem.city}</p>}
					<p>{Number(hoverItem.cumulative).toLocaleString()} cases</p>
					<p>{Number(hoverItem.deaths).toLocaleString()} deaths</p>
				</motion.div>
			)}
			<ReactMapGl
				mapOptions={{ trackResize: true }}
				onMouseMove={(e) => {
					setXy({ ...xy, x: e.center.x, y: e.center.y })
				}}
				ref={mapRef}
				{...viewport}
				maxZoom={8}
				onClick={(e: MapEvent) => {
					// console.log(e)
				}}
				onHover={(e) => {
					if (!e?.features[0]?.properties?.cumulative) {
						setXy({ ...xy, active: false })
						return
					}

					setHoverItem({
						city: e?.features[0]?.properties?.city,
						state: e?.features[0]?.properties?.state,
						location: e?.features[0]?.properties?.location,
						cumulative: e?.features[0]?.properties?.cumulative,
						deaths: e?.features[0]?.properties?.deaths,
					})
					setXy({ ...xy, active: true })
				}}
				onViewportChange={(_v) => setViewport(_v)}
				mapboxApiAccessToken={
					'pk.eyJ1Ijoic2IxMjM2NTQzIiwiYSI6ImNreThuYTh0dTFmd2kydXFlM240bTAybjUifQ.qxZPbtYAf4xqlws1K9dIbg'
				}
				mapStyle="mapbox://styles/mapbox/light-v10"
			>
				<Source id="countries" type="geojson" data={countries} />
				<Source id="provinces" type="geojson" data={provinces} />
				<Layer
					id="point2"
					source="provinces"
					type="circle"
					paint={{
						'circle-color': '#f85a5a',
						'circle-stroke-color': '#f85a5a',
						'circle-radius': 5,
						'circle-opacity': 0.3,
						'circle-stroke-width': 1,
						'circle-stroke-opacity': 1,
					}}
					minzoom={2}
				></Layer>
				<Layer
					id="point"
					source="countries"
					type="circle"
					paint={{
						'circle-color': '#22a8f0',
						'circle-radius': ['number', ['get', 'radius']],
						'circle-stroke-color': '#22a8f0',
						'circle-stroke-width': 1,
						'circle-opacity': 0.2,
						'circle-stroke-opacity': 1,
					}}
					maxzoom={4}
				></Layer>
			</ReactMapGl>
		</div>
	)
}

export default Map
