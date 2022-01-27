import React, { useCallback, useRef, useState } from 'react'
import ReactMapGl, { MapEvent, Marker as Point } from 'react-map-gl'
import { useAppSelector } from '../app/hooks'
import { Country, Statistic, CountryStatistic } from '../interfaces'
import Bubble from './Bubble'

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

	const mapRef = useRef()

	const handleViewportChange = useCallback(
		(newViewport) => setViewport(newViewport),
		[]
	)

	const { data, pending } = useAppSelector((state) => state.data)

	return (
		<div className="map">
			<ReactMapGl
				ref={mapRef}
				{...viewport}
				maxZoom={4.5}
				onClick={(e: MapEvent) => {}}
				onViewportChange={(_v) => setViewport(_v)}
				mapboxApiAccessToken={
					'pk.eyJ1Ijoic2IxMjM2NTQzIiwiYSI6ImNreThuYTh0dTFmd2kydXFlM240bTAybjUifQ.qxZPbtYAf4xqlws1K9dIbg'
				}
				mapStyle="mapbox://styles/mapbox/light-v10"
			>
				{!pending &&
					data.map((item, idx) => {
						return <Bubble key={idx} item={item} max={max} />
					})}
				{!pending &&
					data.map((item, idx) => {
						if (!item.provinces.length) return
						item.provinces.map((province) => {
							// return <Bubble key={idx} item={province} max={max} />
						})
					})}
			</ReactMapGl>
		</div>
	)
}

export default Map
