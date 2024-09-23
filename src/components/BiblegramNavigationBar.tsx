import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../hooks/hooks'
import {
    getLevels,
    changeLevel,
} from '../store/biblegramSlice'

import './BiblegramNavigationBar.css'; 

const BiblegramNavigationBar: React.FC = () => {
    const [isPanelOpen, setPanelOpen] = useState(false);
    const numberOfLevels = useAppSelector(getLevels);
    const dispatch = useAppDispatch()

    const handleMouseEnter = () => {
      setPanelOpen(true);
    };
  
    const handleMouseLeave = () => {
      setPanelOpen(false);
    };

    const handleChangeLevel = (level: number) => {
        dispatch(changeLevel({
            level
        }));
      };
  
    return (
      <div className="navbar-container">
        <div
          className="hamburger-icon"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          Levels
        </div>
        <div className={isPanelOpen ? 'side-panel open' : 'side-panel'}>
          <ul className="side-panel-menu">
            {
                Array.from({ length: numberOfLevels }, (_, index) => [
                    <li className="side-panel-item" onClick={()=>{handleChangeLevel(index)}}><a href="#">Level {index+1}</a></li>
                ])
            }
          </ul>
        </div>
      </div>
    );
};

export default BiblegramNavigationBar