import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import biblegramReducer from './biblegramSlice'

export const store = configureStore({
  reducer: {
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