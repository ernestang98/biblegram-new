import React from 'react';
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

const BiblegramKeyboard: React.FC<OnScreenKeyboardProps> = () => {
  return (
    <div className="keyboard">
      {keys.map((row, rowIndex) => (
        <div key={rowIndex} className="keyboard-row">
          {row.map((key) => (
            <button key={key} className="keyboard-key">
              {key}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default BiblegramKeyboard;