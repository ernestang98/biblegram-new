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
import React, { useState, useRef, useCallback, useEffect } from 'react';

import './BiblegramBoard.css'

import BiblegramBoardLetter from './BiblegramBoardLetter';
import BiblegramBoardNonLetter from './BiblegramBoardNonLetter';

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

function BiblegramBoard() {

    const hiddenAnswer = useAppSelector(getAnswer);
    const hiddenClues = useAppSelector(getActualHints);
    const currentIndexRef = useAppSelector(getCurrentIndexRef);
    const duplicateCharIndices = useAppSelector(getDuplicateCharIndices);
    const variableIndices = useAppSelector(getCurrentVariableIndices);
    const currentGuess = useAppSelector(getCurrentGuess);

    const letterRefs = useRef<(HTMLDivElement | null)[]>([]);

    const [ciphers, setCiphers] = useState<string[]>([]);
    const [letters, setLetters] = useState<string[]>([]); // dont migrate to redux yet fk it
    
    const handleKeyPress = useCallback((index: number, value: string, currentIndexRef: number, duplicateCharIndices: Array<number>, currentGuess: Array<string>) => {
        setLetters((prevLetters) => {
            const newLetters = [...prevLetters];
            if (value === 'BACKSPACE') {
                for (let duplicate_index in duplicateCharIndices) {
                    newLetters[duplicateCharIndices[duplicate_index]] = ' '
                }
                let nextIndex = index-1;
                while (!(/^[A-Za-z!]+$/.test(hiddenAnswer[nextIndex])) || variableIndices.indexOf(nextIndex) === -1) {
                    if (nextIndex < 0) {
                        nextIndex = 0
                        break
                    }
                    nextIndex -= 1;
                }
                const payload = {
                    currentIndexRef: nextIndex
                }
                dispatch(setCurrentIndexRef(payload))
                let updatedDuplicateCharIndices = findAllIndices(hiddenAnswer, hiddenAnswer[nextIndex])
                let payload2 = {
                    duplicateCharIndices: updatedDuplicateCharIndices
                }
                dispatch(setDuplicateCharIndices(payload2))
                letterRefs.current[nextIndex]?.focus();
            } 
            else {
                // set all letters with similar cipher
                for (let duplicate_index in duplicateCharIndices) {
                    newLetters[duplicateCharIndices[duplicate_index]] = value
                }
                // find nextIndex to focus on
                let nextIndex = index + 1;
                while (!(/^[A-Za-z!]+$/.test(hiddenAnswer[nextIndex])) || variableIndices.indexOf(nextIndex) === -1) {
                    if (nextIndex >= letters.length) {
                        nextIndex = letters.length-1
                        break
                    }
                    nextIndex += 1;
                }
                // need to find next variableIndex
                let tempIndices = findAllIndices(hiddenAnswer, hiddenAnswer[index])
                let tempGuessToFigureOutNextIndex = [...currentGuess]
                for (let tempIndex in tempIndices) {
                    tempGuessToFigureOutNextIndex[tempIndices[tempIndex]] = value
                }
                while (true) {
                    if (tempGuessToFigureOutNextIndex[nextIndex] === " " && variableIndices.indexOf(nextIndex) !== -1) {
                        break
                    }
                    if (nextIndex >= letters.length) {
                        nextIndex = letters.length-1
                        break
                    }
                    nextIndex += 1
                }

                // edge case: if the nextIndex is a fixedIndex, then dont update it
                if (variableIndices.indexOf(nextIndex) !== -1) {
                    // update currentIndexRef
                    const payload = {
                        currentIndexRef: nextIndex
                    }
                    dispatch(setCurrentIndexRef(payload))
                    // update duplicateIndices relative to currentIndexRef
                    let updatedDuplicateCharIndices = findAllIndices(hiddenAnswer, hiddenAnswer[nextIndex])
                    let payload2 = {
                        duplicateCharIndices: updatedDuplicateCharIndices
                    }
                    dispatch(setDuplicateCharIndices(payload2))
                    letterRefs.current[nextIndex]?.focus();
                }
            }
            dispatch(setCurrentGuess({ currentGuess: newLetters }))
            if (newLetters.join("") === hiddenAnswer) {
                alert("You have won!")
            }
            return newLetters;
        });
    }, [letters.length]);

    const handleLetterClick = (index: number) => {
        // update currentIndexRef
        const payload = {
            currentIndexRef: index
        }
        dispatch(setCurrentIndexRef(payload))
        // update duplicateIndices relative to currentIndexRef
        let updatedDuplicateCharIndices = findAllIndices(hiddenAnswer, hiddenAnswer[index])
        let payload2 = {
            duplicateCharIndices: updatedDuplicateCharIndices
        }
        dispatch(setDuplicateCharIndices(payload2))
        letterRefs.current[index]?.focus();
    };

    const handleBoardClick = () => {
        // dispatch(setCurrentIndexRef({ currentIndexRef: -1 }))
        // dispatch(clearDuplicateCharIndices())
    };

    useEffect(() => {
        let answerLetters = hiddenAnswer.split('');
        let uniqueChars: Array<any> = findUniqueChars(hiddenAnswer)
        for (let ul = 0 ; ul < uniqueChars.length ; ul += 1) {
            if (hiddenClues.indexOf(uniqueChars[ul]) === -1 && /^[A-Za-z]+$/.test(uniqueChars[ul]) && ciphers.indexOf(uniqueChars[ul]) === -1) {
                ciphers.push(uniqueChars[ul].toUpperCase())
                setCiphers(ciphers)
            }
        }
        // console.log(uniqueChars)
        // console.log(ciphers)
        // console.log(hiddenClues)
        let tempVariableIndices = []
        for (let al = 0; al < answerLetters.length ; al += 1) {
            if (hiddenClues.indexOf(answerLetters[al]) === -1 && (/^[A-Za-z!@]+$/.test(answerLetters[al]))) {
                tempVariableIndices.push(al)
                answerLetters[al] = " "
            }
        }
        setLetters(answerLetters);
        dispatch(setCurrentGuess({ currentGuess: answerLetters }))
        dispatch(setCurrentVariableIndices({ currentVariableIndices: tempVariableIndices }))

        let firstSelectedValueIndex = tempVariableIndices[0]
        let firstSelectedValue = hiddenAnswer[tempVariableIndices[0]]
        let payload1 = {
            currentIndexRef: firstSelectedValueIndex
        }
        dispatch(setCurrentIndexRef(payload1))
        
        let duplicateCharIndices = findAllIndices(hiddenAnswer, firstSelectedValue)
        let payload2 = {
            duplicateCharIndices: duplicateCharIndices
        }
        dispatch(setDuplicateCharIndices(payload2))
    }, [hiddenAnswer]);

    const dispatch = useAppDispatch()
    return (
        <div className="biblegram-board" onClick={handleBoardClick}>
            {
                letters.map((letter, index) => ( 
                    variableIndices.indexOf(index) !== -1 ?
                        <BiblegramBoardLetter 
                            key={index}
                            letter={letter}
                            index={index}
                            handleOnKeyDown={handleKeyPress}
                            handleOnClick={handleLetterClick}
                            isSelected={index === currentIndexRef || duplicateCharIndices.indexOf(index) !== -1}
                            letterRef={(el: HTMLDivElement | null) => (letterRefs.current[index] = el)}
                            cipherHint={caesarCipher(hiddenAnswer[index])}
                        />
                        :
                        <BiblegramBoardNonLetter 
                            key={index}
                            letter={letter}
                            letterRef={(el: HTMLDivElement | null) => (letterRefs.current[index] = el)}
                        />
                ))
            }
        </div>
    )
}

export default BiblegramBoard
