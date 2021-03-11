import React from 'react';
import cn from './progress-circle.module.css';

const ProgressIndicator = ({
  running,
  percentRemaining,
  size,
}) => {
  const circleRadius = (size / 2) - 1;

  const getProgress = () => {
    const circumference = Math.PI * (circleRadius * 2);

    if (percentRemaining < 0) { percentRemaining = 0;}
    if (percentRemaining > 100) { percentRemaining = 100;}
    
    return ((100 - percentRemaining) / 100) * circumference;
  }

  return (
    <svg
      className={cn.progress}
      width={size}
      height={size}
      viewport={`0 0 ${size} ${size}`}
    >
      <circle
        r={circleRadius}
        cx={size / 2}
        cy={size / 2}
        fill="transparent"
      />
      {running && (
        <circle
          className={cn.progress__bar}
          r={circleRadius}
          cx={size / 2}
          cy={size / 2}
          fill="transparent"
          strokeDasharray={Math.PI * (circleRadius * 2)}
          style={{
            strokeDashoffset: getProgress() * -1 || 0
          }}
        />
      )}
    </svg>
  )
};

export default ProgressIndicator;
