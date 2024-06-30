import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../hooks/hooks'
import {
  setCurrentGuess,
  setCurrentIndexRef,
  verifyGuessWithAnswer,
  getLevel,
  getAnswer,
  getActualHints,
  getStringHints,
  getCurrentGuess,
  getIsSolved,
  getCurrentIndexRef,
  getDuplicateCharIndices,
  setDuplicateCharIndices,
  clearDuplicateCharIndices,
  setCurrentVariableIndices,
  getCurrentVariableIndices
} from '../store/biblegramSlice'
import './BiblegramKeyboard.css';

interface OnScreenKeyboardProps {
  // Define any props you might need here
}

const keys: string[][] = [
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Enter'],
];

function caesarCipher(text: String, shift: number = 3) {
  shift = shift % 26;
  // Handle negative shifts
  if (shift < 0) {
      shift += 26;
  }

  let result = '';

  for (let i = 0; i < text.length; i++) {
      let char = text[i];

      if (char.match(/[a-z]/i)) {
          let code = text.charCodeAt(i);

          // Uppercase letters (A-Z)
          if (code >= 65 && code <= 90) {
              char = String.fromCharCode(((code - 65 + shift) % 26) + 65);
          }
          // Lowercase letters (a-z)
          else if (code >= 97 && code <= 122) {
              char = String.fromCharCode(((code - 97 + shift) % 26) + 97);
          }
      }
      // Append non-alphabetic characters as-is
      result += char;
  }

  return result;
}

function findUniqueChars(text: string) {
  // Using a Set to store unique characters
  const uniqueChars = new Set();

  // Iterate through each character in the string
  for (let char of text) {
      // Add character to Set if it's not already present
      if (!uniqueChars.has(char.toUpperCase()) && /^[A-Za-z!@]+$/.test(char)) {
          uniqueChars.add(char.toUpperCase());
      }
  }

  // Convert Set back to array (if needed) or return Set itself
  return Array.from(uniqueChars); // Convert Set to Array
}

function findAllIndices(str: string, char: string) {
  if (typeof str !== 'string' || typeof char !== 'string') {
    throw new TypeError('Both arguments must be strings');
  }
  if (char.length !== 1) {
    throw new Error('Character to find must be a single character');
  }

  const indices = [];
  for (let i = 0; i < str.length; i++) {
    if (str[i] === char) {
      indices.push(i);
    }
  }
  return indices;
}

const BiblegramKeyboard: React.FC<OnScreenKeyboardProps> = () => {
  const hiddenAnswer = useAppSelector(getAnswer);
  const hiddenClues = useAppSelector(getActualHints);
  const currentIndexRef = useAppSelector(getCurrentIndexRef);
  const duplicateCharIndices = useAppSelector(getDuplicateCharIndices);
  const variableIndices = useAppSelector(getCurrentVariableIndices);
  const currentGuess = useAppSelector(getCurrentGuess);

  const letterRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [ciphers, setCiphers] = useState<string[]>([]);
  const [letters, setLetters] = useState<string[]>([]); // dont migrate to redux yet fk it
  
  // const handleKeyPress = useCallback((index: number, value: string, currentIndexRef: number, duplicateCharIndices: Array<number>, currentGuess: Array<string>) => {
  //     setLetters((prevLetters) => {
  //         const newLetters = [...prevLetters];
  //         if (value === 'BACKSPACE') {
  //             for (let duplicate_index in duplicateCharIndices) {
  //                 newLetters[duplicateCharIndices[duplicate_index]] = ' '
  //             }
  //             let nextIndex = index-1;
  //             while (!(/^[A-Za-z!]+$/.test(hiddenAnswer[nextIndex])) || variableIndices.indexOf(nextIndex) === -1) {
  //                 if (nextIndex < 0) {
  //                     nextIndex = 0
  //                     break
  //                 }
  //                 nextIndex -= 1;
  //             }
  //             // edge case: if the nextIndex is a fixedIndex, then dont update it
  //             if (variableIndices.indexOf(nextIndex) !== -1) {
  //                 const payload = {
  //                     currentIndexRef: nextIndex
  //                 }
  //                 dispatch(setCurrentIndexRef(payload))
  //                 let updatedDuplicateCharIndices = findAllIndices(hiddenAnswer, hiddenAnswer[nextIndex])
  //                 let payload2 = {
  //                     duplicateCharIndices: updatedDuplicateCharIndices
  //                 }
  //                 dispatch(setDuplicateCharIndices(payload2))
  //                 letterRefs.current[nextIndex]?.focus();
  //             }
  //         } 
  //         else {
  //             // set all letters with similar cipher
  //             for (let duplicate_index in duplicateCharIndices) {
  //                 newLetters[duplicateCharIndices[duplicate_index]] = value
  //             }
  //             // find nextIndex to focus on
  //             let nextIndex = index + 1;
  //             while (!(/^[A-Za-z!]+$/.test(hiddenAnswer[nextIndex])) || variableIndices.indexOf(nextIndex) === -1) {
  //                 if (nextIndex >= letters.length) {
  //                     nextIndex = letters.length-1
  //                     break
  //                 }
  //                 nextIndex += 1;
  //             }
  //             // need to find next variableIndex
  //             let tempIndices = findAllIndices(hiddenAnswer, hiddenAnswer[index])
  //             let tempGuessToFigureOutNextIndex = [...currentGuess]
  //             for (let tempIndex in tempIndices) {
  //                 tempGuessToFigureOutNextIndex[tempIndices[tempIndex]] = value
  //             }
  //             while (true) {
  //                 if (tempGuessToFigureOutNextIndex[nextIndex] === " " && variableIndices.indexOf(nextIndex) !== -1) {
  //                     break
  //                 }
  //                 if (nextIndex >= letters.length) {
  //                     nextIndex = letters.length-1
  //                     break
  //                 }
  //                 nextIndex += 1
  //             }

  //             // edge case: if the nextIndex is a fixedIndex, then dont update it
  //             if (variableIndices.indexOf(nextIndex) !== -1) {
  //                 // update currentIndexRef
  //                 const payload = {
  //                     currentIndexRef: nextIndex
  //                 }
  //                 dispatch(setCurrentIndexRef(payload))
  //                 // update duplicateIndices relative to currentIndexRef
  //                 let updatedDuplicateCharIndices = findAllIndices(hiddenAnswer, hiddenAnswer[nextIndex])
  //                 let payload2 = {
  //                     duplicateCharIndices: updatedDuplicateCharIndices
  //                 }
  //                 dispatch(setDuplicateCharIndices(payload2))
  //                 letterRefs.current[nextIndex]?.focus();
  //             }
  //         }
  //         dispatch(setCurrentGuess({ currentGuess: newLetters }))
  //         if (newLetters.join("") === hiddenAnswer) {
  //             alert("You have won!")
  //         }
  //         return newLetters;
  //     });
  // }, [letters.length]);

  const dispatch = useAppDispatch()
  return (
    <div className="keyboard">
      {keys.map((row, rowIndex) => (
        <div key={rowIndex} className="keyboard-row">
          {row.map((key) => (
            <button key={key} className={key === "Enter" ? `keyboard-key-enter` : `keyboard-key`} onClick={()=>{console.log(key)}} >
              {key}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default BiblegramKeyboard;