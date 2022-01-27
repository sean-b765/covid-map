/**
 * A slice includes reducer/action logic for a specific area (slice) of the store
 */

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { CountryStatistic, DBRecord, History } from '../interfaces/index'
import moment from 'moment'

export interface InitialModalState {
	open: boolean
	pending: boolean
	selectedCountry: CountryStatistic
	historicalList: { [key: string]: Array<History> }
}

const initialState: InitialModalState = {
	open: false,
	selectedCountry: null,
	historicalList: {},
	pending: false,
}

export const getHistoricalData = createAsyncThunk(
	'modal/getHistorical',
	async (location: string) => {
		const response = await fetch(
			`https://covid-history.herokuapp.com/history/${location}`
		)
		const result = await response.json()

		return result
	}
)

export const modalSlice = createSlice({
	name: 'modal',
	initialState,
	reducers: {
		open: (state) => {
			state.open = true
		},
		close: (state) => {
			state.open = false
		},
		setSelectedCountry: (state, action: PayloadAction<CountryStatistic>) => {
			state.selectedCountry = action.payload
		},
		setHistoricalData: (state, action: PayloadAction<any>) => {
			console.log(action.payload.length)
		},
		addToHistoricalData: (state, action: PayloadAction<DBRecord[]>) => {},
	},
	extraReducers: (builder) => {
		builder
			.addCase(getHistoricalData.pending, (state) => {
				state.pending = true
			})
			.addCase(getHistoricalData.fulfilled, (state, action) => {
				state.pending = false

				if (action.payload.message) return

				if (action.payload.length === 0) return

				const location = action.payload.location

				const isAlreadyAdded = Object.keys(state.historicalList).includes(
					location
				)

				if (isAlreadyAdded) return

				state.historicalList[location] = [...action.payload.data]
			})
	},
})

export const {
	open,
	close,
	setSelectedCountry,
	setHistoricalData,
	addToHistoricalData,
} = modalSlice.actions

export default modalSlice.reducer
