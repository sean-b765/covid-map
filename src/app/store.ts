import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import modal from '../slices/modalSlice'
import data from '../slices/data'

export function makeStore() {
	return configureStore({
		reducer: {
			modal,
			data,
		},
	})
}

const store = makeStore()

export type AppState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export type AppThunk<ReturnType = void> = ThunkAction<
	ReturnType,
	AppState,
	unknown,
	Action<string>
>

export default store
