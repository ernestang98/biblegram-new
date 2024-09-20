import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState, AppThunk } from './store'
import { giveMeBibleVerse } from '../apis/request'
import { BibleVerseApiResponse } from '../apis/models'

function countAndSortOccurrences(str: string) {
  // Step 1: Count occurrences of each character using a Map
  const charCount = new Map();
  for (let char of str) {
      if (/[a-zA-Z]/.test(char)) { // Only count alphabets
          char = char.toLowerCase(); // Optional: ignore case sensitivity
          charCount.set(char, (charCount.get(char) || 0) + 1);
      }
  }

  // Step 2: Sort characters by their count in descending order
  const sortedCharCount = new Map(
      // @ts-ignore
      [...charCount.entries()].sort((a, b) => b[1] - a[1])
  );

  return sortedCharCount;
}

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
  ciphers: Array<string>
  letters: Array<string>
}

const initialState: BiblegramState = {
  level: 0,
  answers: [],      // do not change this
  actualHints: [],  // do not change this
  stringHints: [],  // do not change this
  currentGuess: [], 
  currentVariableIndices: [],
  isSolved: false,
  currentIndexRef: 0,
  duplicateCharIndices: [],
  ciphers: [],
  letters: [],
}

export const executeApiAndGiveMeSomeBibleVerses = createAsyncThunk(
  'Return 1 Random Bible Verse',
  async () => {
      const response = await giveMeBibleVerse()
      if (response) {
        return {
            response: response.data.body
        }
      }
      return null
  }
)

export const biblegramSlice = createSlice({
  name: 'biblegram',
  initialState,
  reducers: {

    nextLevel: (state, action) => {
      if (state.level !== state.answers.length-1) {
        state.level = state.level+1
        state.currentGuess = []
        state.currentVariableIndices = []
        state.isSolved = false
        state.currentIndexRef = 0
        state.duplicateCharIndices = []
        state.ciphers = []
        state.letters = []
      }
    },

    changeLevel: (state, action) => {
      if (state.level !== action.payload.level) {
        state.level = action.payload.level
        state.currentGuess = []
        state.currentVariableIndices = []
        state.isSolved = false
        state.currentIndexRef = 0
        state.duplicateCharIndices = []
        state.ciphers = []
        state.letters = []
      }
    },

    setCurrentGuess: (state, action) => {
      state.currentGuess = action.payload.currentGuess
    },

    setCurrentVariableIndices: (state, action) => {
      state.currentVariableIndices = action.payload.currentVariableIndices
    },

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
    },

    setCiphers: (state, action) => {
      state.ciphers = action.payload.ciphers
    },

    setLetters: (state, action) => {
      state.letters = action.payload.letters
    },

  },
  extraReducers: builders => {
    builders.addCase(executeApiAndGiveMeSomeBibleVerses.pending, (state) => {
      // state.loading = true
    })
    builders.addCase(executeApiAndGiveMeSomeBibleVerses.rejected, (state) => {
      state.answers =  [
        "The Lord is my shepherd, I shall not want".toUpperCase(),
        "For God so loved the world that He gave His one and only Son, that whoever believes in Him shall not perish but have eternal life".toUpperCase(),
        "I can do all things through Christ who strengthens me".toUpperCase(),
      ]
      state.actualHints = [
        ["T", "L", "O", "E", "I", "S"],
        ["A", "D", "G", "L", "B", "R", "E"],
        ["I", "C", "D"]
      ]
      state.stringHints = [
        "Guidance and provision",
        "God's immense love",
        "Empowered by Christ"
      ]
    })
    builders.addCase(executeApiAndGiveMeSomeBibleVerses.fulfilled, (state, action) => {
      // let response: BibleVerseApiResponse = action.payload?.response
      // let text = response.text.toUpperCase()
      // let hint = response.reference.toUpperCase()
      // let tempAnswers = [...state.answers]
      // let tempActualhints = [...state.actualHints]
      // let temphints = [...state.stringHints]
      // tempAnswers.push(text)
      // temphints.push(hint)
      // state.answers = tempAnswers
      // state.actualHints = tempActualhints
      // state.stringHints = temphints
    })
  }
})

export const { 
  setCurrentGuess,
  verifyGuessWithAnswer,
  setCurrentIndexRef,
  clearDuplicateCharIndices,
  setDuplicateCharIndices,
  setCurrentVariableIndices,
  setCiphers,
  setLetters,
  changeLevel,
  nextLevel,
} = biblegramSlice.actions

export const getLevel = (state: RootState) => state.biblegram.level
export const getLevels = (state: RootState) => state.biblegram.answers.length
export const getAnswer = (state: RootState) => state.biblegram.answers[state.biblegram.level]
export const getActualHints = (state: RootState) => state.biblegram.actualHints[state.biblegram.level]
export const getStringHints = (state: RootState) => state.biblegram.stringHints[state.biblegram.level]
export const getCurrentGuess = (state: RootState) => state.biblegram.currentGuess
export const getIsSolved = (state: RootState) => state.biblegram.isSolved
export const getCurrentIndexRef = (state: RootState) => state.biblegram.currentIndexRef
export const getDuplicateCharIndices = (state: RootState) => state.biblegram.duplicateCharIndices
export const getCurrentVariableIndices = (state: RootState) => state.biblegram.currentVariableIndices
export const getCiphers = (state: RootState) => state.biblegram.ciphers
export const getLetters = (state: RootState) => state.biblegram.letters

export default biblegramSlice.reducer