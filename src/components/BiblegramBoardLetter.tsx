import { useAppSelector, useAppDispatch } from '../hooks/hooks'
import {
    setCharacter,
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
    setDuplicateCharIndices
} from '../store/biblegramSlice'
import React, { forwardRef } from 'react';
import './BiblegramBoard.css'


interface BiblegramBoardLetterProps {
    letter: string;
    index: number;
    isSelected: boolean;
    letterRef: any;
    handleOnKeyDown: (index: number, value: string, currentIndexRef: number, duplicateCharIndices: Array<number>) => void;
    handleOnClick: (index: number) => void;
    cipherHint: string;
}

const BiblegramBoardLetter: React.FC<BiblegramBoardLetterProps> = ({ letter, index, isSelected, letterRef, handleOnKeyDown, handleOnClick, cipherHint }) => {
    
    const currentIndexRef = useAppSelector(getCurrentIndexRef);
    const duplicateCharIndices = useAppSelector(getDuplicateCharIndices);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        const value = event.key.toUpperCase();
        if (value.length === 1 && /^[A-Z]$/.test(value)) {
            handleOnKeyDown(index, value, currentIndexRef, duplicateCharIndices);
        } else if (event.key === 'Backspace') {
            handleOnKeyDown(index, 'BACKSPACE', currentIndexRef, duplicateCharIndices);
        }
    };

    const handleClick = () => {
        handleOnClick(index);
    };

    return (
        <div className={`letter-container`}>
            <div
                ref={letterRef}
                className={`letter-component ${isSelected ? 'selected' : ''}`}
                tabIndex={0}
                onKeyDown={handleKeyDown}
                onClick={handleClick}
            >
                {
                    letter === "!" ? " " : letter
                }
            </div>
            {
                <div className="small-r">{cipherHint}</div>
            }
        </div>
    );
};

export default BiblegramBoardLetter;