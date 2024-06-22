import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import counterReducer from './reducers/counterSlice'
import biblegramReducer from './reducers/biblegramSlice'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    biblegram: biblegramReducer
  }
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>