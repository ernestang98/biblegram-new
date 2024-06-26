import React, { forwardRef } from 'react';
import './BiblegramBoard.css'

interface BiblegramBoardNonLetterProps {
    letter: string;
    letterRef: any;
}

const BiblegramBoardNonLetter: React.FC<BiblegramBoardNonLetterProps> = ({ letter, letterRef }) => {

    return (
        <div
            ref={letterRef}
            className={`non-letter-component ${letter === " " ? 'non-letter-component-space': 'non-letter-component-non-space'}`}
        >
            {letter}
        </div>
    );
};

export default BiblegramBoardNonLetter;