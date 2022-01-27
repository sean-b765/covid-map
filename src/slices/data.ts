/**
 * A slice includes reducer/action logic for a specific area (slice) of the store
 */

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
	CountryStatistic,
	DBRecord,
	History,
	Location,
} from '../interfaces/index'
import moment from 'moment'

export interface InitialDataState {
	pending: boolean
	data: Array<Location>
	selectedLocation: Location
}

const initialState: InitialDataState = {
	pending: false,
	data: [],
	selectedLocation: null,
}

export const getCurrentData = createAsyncThunk('data/fetch', async () => {
	const response = await fetch(`https://covid-history.herokuapp.com/current`)
	const result = await response.json()

	return result
})

export const dataSlice = createSlice({
	name: 'data',
	initialState,
	reducers: {
		setSelectedLocation: (state, action: PayloadAction<Location>) => {
			state.selectedLocation = action.payload
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(getCurrentData.pending, (state) => {
				state.pending = true
			})
			.addCase(getCurrentData.fulfilled, (state, action) => {
				state.pending = false

				if (action.payload.message) return

				state.data = action.payload
			})
	},
})

export const { setSelectedLocation } = dataSlice.actions

export default dataSlice.reducer
