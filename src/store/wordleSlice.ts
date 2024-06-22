import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState, AppThunk } from './store'

export interface WordleGuess {
  guess: String
  correctposition: Array<number>
  wrongposition: Array<number>
}

export interface WorldleState {
  board: Array<Array<String>>
  guesses: Array<WordleGuess>
}

const initialState: WorldleState = {
  board: [[]],
  guesses: []
}

export const wordleSlice = createSlice({
  name: 'wordle',
  initialState,
  reducers: {
  },
  extraReducers: builder => {
  }
})

export const { } = wordleSlice.actions

export default wordleSlice.reducer