import { useAppSelector, useAppDispatch } from '../store/hooks'
import {
    setCharacter,
    verifyGuessWithAnswer,
    getLevel,
    getAnswer,
    getActualHints,
    getStringHints,
    getCurrentGuess,
    getIsSolved
} from '../store/reducers/biblegramSlice'
import React, { useState, useRef } from 'react';

import './BiblegramBoard.css'

import BiblegramBoardLetter from './BiblegramBoardLetter';

function BiblegramBoard() {

    const [letters, setLetters] = useState<string[]>(Array(10).fill(''));
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const letterRefs = useRef<(HTMLDivElement | null)[]>([]);

    const handleKeyPress = (index: number, value: string) => {
        const newLetters = [...letters];
        if (value === 'BACKSPACE') {
            newLetters[index] = '';
        } else {
            newLetters[index] = value;
        }
        setLetters(newLetters);
    };

    const handleLetterClick = (index: number) => {
        setSelectedIndex(index);
    };

    const handleBoardClick = () => {
        setSelectedIndex(null);
    };

    const dispatch = useAppDispatch()
    return (
        <div className="biblegram-board" onClick={handleBoardClick}>
            {
                letters.map((letter, index) => (
                    <BiblegramBoardLetter 
                        key={index}
                        letter={letter}
                        index={index}
                        handleOnKeyDown={handleKeyPress}
                        handleOnClick={handleLetterClick}
                        isSelected={index === selectedIndex}
                    />
                ))
            }
        </div>
    )
}

export default BiblegramBoard
