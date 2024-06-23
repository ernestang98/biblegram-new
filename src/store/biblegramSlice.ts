import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState, AppThunk } from './store'

export interface BiblegramState {
  level: number
  answers: Array<string>
  actualHints: Array<Array<string>> // ciphered hints will be any hints which are not actual hints as per https://xiaoburner.github.io/biblegram/
  stringHints: Array<string>
  currentGuess: Array<string>
  isSolved: Boolean
  currentIndexRef: number
}

const initialState: BiblegramState = {
  level: 0,
  answers: [
    "For God so loved the world that He gave His one and only Son, that whoever believes in Him shall not perish but have eternal life".toUpperCase(),
    "The Lord is my shepherd; I shall not want",
    "I can do all things through Christ who strengthens me"
  ],
  actualHints: [
    ["F", "G", "L", "B", "R", "E"],
    ["T", "O"],
    ["I", "C", "D"]
  ],
  stringHints: [
    "God's immense love",
    "Guidance and provision",
    "Empowered by Christ"
  ],
  currentGuess: [

  ],
  isSolved: false,
  currentIndexRef: 0
}

export const biblegramSlice = createSlice({
  name: 'biblegram',
  initialState,
  reducers: {
    /*
    When we run this reducer, our action should give us 2 things:
    - character we are setting
    - indices we need to set to that character
    */
    setCharacter: (state, action) => {
      for (let i = 0; i < action.payload.indices.length; i++) {
          state.currentGuess[action.payload.indices[i]] = action.payload.character
      }
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
    }
  },
  extraReducers: builder => {
  }
})

export const { 
  setCharacter,
  verifyGuessWithAnswer,
  setCurrentIndexRef
} = biblegramSlice.actions

export const getLevel = (state: RootState) => state.biblegram.level
export const getAnswer = (state: RootState) => state.biblegram.answers[state.biblegram.level]
export const getActualHints = (state: RootState) => state.biblegram.actualHints[state.biblegram.level]
export const getStringHints = (state: RootState) => state.biblegram.stringHints[state.biblegram.level]
export const getCurrentGuess = (state: RootState) => state.biblegram.currentGuess
export const getIsSolved = (state: RootState) => state.biblegram.isSolved
export const getCurrentIndexRef = (state: RootState) => state.biblegram.currentIndexRef

export default biblegramSlice.reducer