import { useAppSelector, useAppDispatch } from '../hooks/hooks'
import {
    setCharacter,
    verifyGuessWithAnswer,
    getLevel,
    getAnswer,
    getActualHints,
    getStringHints,
    getCurrentGuess,
    getIsSolved
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

function BiblegramBoard() {

    const hiddenAnswer = "THIS IS ME, I AM ME"; // T H I S M E A 
    const hiddenClues = ["M", "E"]; // T H I S A will be ciphered


    const [ciphers, setCiphers] = useState<string[]>([]);
    const [letters, setLetters] = useState<string[]>([]);

    const [variableIndices, setVariableIndices] = useState<number[]>([]);

    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const letterRefs = useRef<(HTMLDivElement | null)[]>([]);
    
    const handleKeyPress = useCallback((index: number, value: string) => {
        setLetters((prevLetters) => {
            const newLetters = [...prevLetters];
            if (value === 'BACKSPACE') {
                newLetters[index] = '!'; // we will use ! to mark non-filled characters
            } else {
                newLetters[index] = value;
            }
            if (value !== 'BACKSPACE' && index < letters.length) {
                let nextIndex = index + 1;
                while (!(/^[A-Za-z!]+$/.test(hiddenAnswer[nextIndex])) || variableIndices.indexOf(nextIndex) === -1) {
                    nextIndex += 1;
                    if (nextIndex >= letters.length) {
                        break
                    }
                }
                letterRefs.current[nextIndex]?.focus();
            }
            if (value === 'BACKSPACE') {
                let nextIndex = index-1;
                while (!(/^[A-Za-z!]+$/.test(hiddenAnswer[nextIndex])) || variableIndices.indexOf(nextIndex) === -1) {
                    nextIndex -= 1;
                    if (nextIndex < 0) {
                        break
                    }
                }
                letterRefs.current[nextIndex]?.focus();
            }
            return newLetters;
        });
    }, [letters.length]);

    const handleLetterClick = (index: number) => {
        setSelectedIndex(index);
    };

    const handleBoardClick = () => {
        setSelectedIndex(null);
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
        // console.log(ciphers)
        // console.log(uniqueChars)
        // console.log(hiddenClues)
        let tempVariableIndices = []
        for (let al = 0; al < answerLetters.length ; al += 1) {
            if (hiddenClues.indexOf(answerLetters[al]) === -1 && (/^[A-Za-z!@]+$/.test(answerLetters[al]))) {
                tempVariableIndices.push(al)
            }
        }
        setVariableIndices(tempVariableIndices)
        setLetters(answerLetters);
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
                            isSelected={index === selectedIndex}
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
