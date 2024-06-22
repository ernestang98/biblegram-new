import React from 'react';
import './BiblegramBoard.css'


interface BiblegramBoardLetterProps {
    letter: string;
    index: number;
    isSelected: boolean;
    handleOnKeyDown: (index: number, value: string) => void;
    handleOnClick: (index: number) => void;
}

const BiblegramBoardLetter: React.FC<BiblegramBoardLetterProps> = ({ letter, index, isSelected, handleOnKeyDown, handleOnClick }) => {

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        const value = event.key.toUpperCase();
        if (value.length === 1 && /^[A-Z]$/.test(value)) {
            handleOnKeyDown(index, value);
        } else if (event.key === 'Backspace') {
            handleOnKeyDown(index, 'BACKSPACE');
        }
    };

    const handleClick = () => {
        handleOnClick(index);
    };

    return (
        <div
            className={`letter-component ${isSelected ? 'selected' : ''}`}
            tabIndex={0}
            onKeyDown={handleKeyDown}
            onClick={handleClick}

        >
            {letter}
        </div>
    );
};

export default BiblegramBoardLetter;