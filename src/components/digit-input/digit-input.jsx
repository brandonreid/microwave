import React, { useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import cn from './digit-input.module.css';
import type from '../../tokens/typography.module.css';


const DigitInput = ({
  value,
  onClick,
}) => {
  const [active, setActive] = useState(false);
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(true);
    onClick(value);

    setTimeout(() => {
      setClicked(false);
    }, 400);
  }

  useHotkeys(
    value.toString(),
    handleClick,
    {},
    [handleClick]
  );

  return (
    <button
      type="button"
      onClick={handleClick}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      onMouseLeave={() => setActive(false)}
      className={
        `${cn.digitButton}
        ${active ? cn.digitButtonActive : ''}
        ${clicked ? cn.digitButtonClicked : ''}`
      }
    >
      <div className={cn.clickWave}></div>
      <span className={type.large}>{ value }</span>
    </button>
  );
};

export default DigitInput;
