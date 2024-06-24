import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState, AppThunk } from './store'

export interface BiblegramState {
  level: number
  answers: Array<string>
  actualHints: Array<Array<string>> // ciphered hints will be any hints which are not actual hints as per https://xiaoburner.github.io/biblegram/
  stringHints: Array<string>
  currentGuess: Array<string>
  currentVariableIndices: Array<number>
  isSolved: Boolean
  currentIndexRef: number
  duplicateCharIndices: Array<number>
}

const initialState: BiblegramState = {
  level: 0,
  answers: [
    "For God so loved the world that He gave His one and only Son, that whoever believes in Him shall not perish but have eternal life".toUpperCase(),
    "The Lord is my shepherd, I shall not want".toUpperCase(),
    "I can do all things through Christ who strengthens me"
  ],
  actualHints: [
    ["A", "D", "G", "L", "B", "R", "E"],
    ["T", "O", "A", "E"],
    ["I", "C", "D"]
  ],
  stringHints: [
    "God's immense love",
    "Guidance and provision",
    "Empowered by Christ"
  ],
  currentGuess: [],
  currentVariableIndices: [],
  isSolved: false,
  currentIndexRef: 0,
  duplicateCharIndices: []
}

export const biblegramSlice = createSlice({
  name: 'biblegram',
  initialState,
  reducers: {
    setCurrentGuess: (state, action) => {
      state.currentGuess = action.payload.currentGuess
    },

    setCurrentVariableIndices: (state, action) => {
      state.currentVariableIndices = action.payload.currentVariableIndices
    },

    /*
    */
    verifyGuessWithAnswer: (state, action) => {
      if (state.currentGuess.join("") === state.answers[state.level]) {
        state.isSolved = true
      } else {
        state.isSolved = false
      }
    },

    setCurrentIndexRef: (state, action) => {
      state.currentIndexRef = action.payload.currentIndexRef
    },

    clearDuplicateCharIndices: (state) => {
      state.duplicateCharIndices = []
    },

    setDuplicateCharIndices: (state, action) => {
      state.duplicateCharIndices = action.payload.duplicateCharIndices
    }

  },
  extraReducers: builder => {
  }
})

export const { 
  setCurrentGuess,
  verifyGuessWithAnswer,
  setCurrentIndexRef,
  clearDuplicateCharIndices,
  setDuplicateCharIndices,
  setCurrentVariableIndices
} = biblegramSlice.actions

export const getLevel = (state: RootState) => state.biblegram.level
export const getAnswer = (state: RootState) => state.biblegram.answers[state.biblegram.level]
export const getActualHints = (state: RootState) => state.biblegram.actualHints[state.biblegram.level]
export const getStringHints = (state: RootState) => state.biblegram.stringHints[state.biblegram.level]
export const getCurrentGuess = (state: RootState) => state.biblegram.currentGuess
export const getIsSolved = (state: RootState) => state.biblegram.isSolved
export const getCurrentIndexRef = (state: RootState) => state.biblegram.currentIndexRef
export const getDuplicateCharIndices = (state: RootState) => state.biblegram.duplicateCharIndices
export const getCurrentVariableIndices = (state: RootState) => state.biblegram.currentVariableIndices

export default biblegramSlice.reducer