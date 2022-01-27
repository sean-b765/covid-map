import type { NextPage } from 'next'
import Head from 'next/head'
import Map from '../components/Map'
import { Statistic } from '../interfaces'
import countryCodes from '../consts/country-codes'
import Modal from '../components/Modal'
import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { AnimatePresence, motion } from 'framer-motion'
import { getCurrentData } from '../slices/data'

const IndexPage: NextPage<{}> = ({}) => {
	const modalOpen = useAppSelector((state) => state.modal.open)
	const dispatch = useAppDispatch()

	const { data, pending } = useAppSelector((state) => state.data)

	useEffect(() => {
		dispatch(getCurrentData())
	}, [])

	let entries = []
	let max = 0

	// merge countryCodes with the matching data from rapid API
	data.map((value) => {
		const country = countryCodes.filter((item) =>
			item.db_name.toLowerCase() === value.location.toLowerCase() ? item : null
		)
		if (country.length === 0) return

		entries.push({ ...country[0], ...value })

		if (parseInt(value.cumulative) > max) max = parseInt(value.cumulative)
	})

	return (
		<>
			<Head>
				<title>COVID Map</title>
				<link rel="icon" href="/favicon.ico" />
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
				/>
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link
					rel="preconnect"
					href="https://fonts.gstatic.com"
					crossOrigin="true"
				/>
				<link
					href="https://fonts.googleapis.com/css2?family=Poppins&display=swap"
					rel="stylesheet"
				/>
			</Head>
			<main>
				<AnimatePresence exitBeforeEnter>
					{!pending ? (
						<motion.div
							initial={{ opacity: 0 }}
							exit={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 0.5, delay: 0.3 }}
						>
							<Map max={max} />
						</motion.div>
					) : (
						<motion.svg
							initial={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 0.5 }}
							className="spinner"
							width="80"
							height="80"
							viewBox="0 0 44 44"
							xmlns="http://www.w3.org/2000/svg"
							stroke="#2c3bc4"
						>
							<g fill="none" fill-rule="evenodd" stroke-width="2">
								<circle cx="22" cy="22" r="1">
									<animate
										attributeName="r"
										begin="0s"
										dur="1.8s"
										values="1; 20"
										calcMode="spline"
										keyTimes="0; 1"
										keySplines="0.165, 0.84, 0.44, 1"
										repeatCount="indefinite"
									/>
									<animate
										attributeName="stroke-opacity"
										begin="0s"
										dur="1.8s"
										values="1; 0"
										calcMode="spline"
										keyTimes="0; 1"
										keySplines="0.3, 0.61, 0.355, 1"
										repeatCount="indefinite"
									/>
								</circle>
								<circle cx="22" cy="22" r="1">
									<animate
										attributeName="r"
										begin="-0.9s"
										dur="1.8s"
										values="1; 20"
										calcMode="spline"
										keyTimes="0; 1"
										keySplines="0.165, 0.84, 0.44, 1"
										repeatCount="indefinite"
									/>
									<animate
										attributeName="stroke-opacity"
										begin="-0.9s"
										dur="1.8s"
										values="1; 0"
										calcMode="spline"
										keyTimes="0; 1"
										keySplines="0.3, 0.61, 0.355, 1"
										repeatCount="indefinite"
									/>
								</circle>
							</g>
						</motion.svg>
					)}
				</AnimatePresence>
				<AnimatePresence>{modalOpen && <Modal />}</AnimatePresence>
			</main>
		</>
	)
}

export default IndexPage
