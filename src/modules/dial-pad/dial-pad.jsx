import React from 'react';
import cn from './dial-pad.module.css';
import DigitInput from '../../components/digit-input';

const DialPad = ({
  onDialClick,
}) => {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

  return (
    <div className={cn.container}>
      {numbers.map((number) => (
        <DigitInput
          key={number}
          value={number}
          onClick={onDialClick}
        />
      ))}
    </div>
  );
};

export default DialPad;
