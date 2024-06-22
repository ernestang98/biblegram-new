import React, { forwardRef } from 'react';
import './BiblegramBoard.css'


interface BiblegramBoardLetterProps {
    letter: string;
    index: number;
    isSelected: boolean;
    letterRef: any;
    handleOnKeyDown: (index: number, value: string) => void;
    handleOnClick: (index: number) => void;
    cipherHint: string;
}

const BiblegramBoardLetter: React.FC<BiblegramBoardLetterProps> = ({ letter, index, isSelected, letterRef, handleOnKeyDown, handleOnClick, cipherHint }) => {

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