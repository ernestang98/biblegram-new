import { useAppSelector, useAppDispatch } from '../hooks/hooks'
import {
    setCurrentGuess,
    setCurrentIndexRef,
    getAnswer,
    getActualHints,
    getCurrentGuess,
    getCurrentIndexRef,
    getDuplicateCharIndices,
    setDuplicateCharIndices,
    setCurrentVariableIndices,
    getCurrentVariableIndices,
    getCiphers,
    getLetters,
    setCiphers as setCiphers_,
    setLetters as setLetters_,
} from '../store/biblegramSlice'
import { useRef, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './BiblegramBoard.css'
import BiblegramBoardLetter from './BiblegramBoardLetter';
import BiblegramBoardNonLetter from './BiblegramBoardNonLetter';
import { isMobile } from '../helpers';

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
    const ciphers_ = useAppSelector(getCiphers);
    const letters_ = useAppSelector(getLetters);

    const notify = () => toast("Wow so easy!");

    const handleKeyPress_ = (index: number, value: string) => {
        const newLetters = [...letters_];
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
            // edge case: if the nextIndex is a fixedIndex, then dont update it
            if (variableIndices.indexOf(nextIndex) !== -1) {
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
        } 
        else {
            // set all letters with similar cipher
            for (let duplicate_index in duplicateCharIndices) {
                newLetters[duplicateCharIndices[duplicate_index]] = value
            }
            // find nextIndex to focus on
            let nextIndex = index + 1;
            while (!(/^[A-Za-z!]+$/.test(hiddenAnswer[nextIndex])) || variableIndices.indexOf(nextIndex) === -1) {
                if (nextIndex >= letters_.length) {
                    nextIndex = letters_.length-1
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
                if (nextIndex >= letters_.length) {
                    nextIndex = letters_.length-1
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
        dispatch(setLetters_({ letters: newLetters }))
        if (newLetters.join("") === hiddenAnswer) {
            notify()
        }
    }

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
        let tempCiphers_ = [...ciphers_]
        for (let ul = 0 ; ul < uniqueChars.length ; ul += 1) {
            if (hiddenClues.indexOf(uniqueChars[ul]) === -1 && /^[A-Za-z]+$/.test(uniqueChars[ul]) && ciphers_.indexOf(uniqueChars[ul]) === -1) {
                tempCiphers_.push(uniqueChars[ul].toUpperCase())
            }
        }
        dispatch(setCiphers_({ ciphers: tempCiphers_ }))
        let tempVariableIndices = []
        let tempVariableIndices_ = []
        for (let al = 0; al < answerLetters.length ; al += 1) {
            if (hiddenClues.indexOf(answerLetters[al]) === -1 && (/^[A-Za-z!@]+$/.test(answerLetters[al]))) {
                tempVariableIndices.push(al)
                tempVariableIndices_.push(al)
                answerLetters[al] = " "
            }
        }
        dispatch(setLetters_({ letters: answerLetters }))
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
        <div className={`${isMobile() ? `mobile-biblegram-board`: `biblegram-board`}`} onClick={handleBoardClick}>
            <ToastContainer />
            {
                letters_.map((letter, index) => ( 
                    variableIndices.indexOf(index) !== -1 ?
                        <BiblegramBoardLetter 
                            key={index}
                            letter={letter}
                            index={index}
                            handleOnKeyDown={handleKeyPress_}
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
