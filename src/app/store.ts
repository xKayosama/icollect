import { combineSlices, configureStore } from '@reduxjs/toolkit'

// Add feature slices here when shared application state is needed.
const rootReducer = combineSlices()

export const store = configureStore({
  reducer: rootReducer,
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
