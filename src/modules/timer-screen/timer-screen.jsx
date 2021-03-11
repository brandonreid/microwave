import React from 'react';
import cn from './timer-screen.module.css';
import type from '../../tokens/typography.module.css';
import ProgressIndicator from '../../components/progress-circle';

const TimerScreen = ({
  running,
  totalSeconds,
  minutes,
  seconds,
  finishedNotice,
}) => {
  const size = 224;

  const getTimeUnit = (time) => {
    return time > 0 || minutes > 0
      ? time > 9
        ? time
        : `0${time}`
      : '--';
  };

  return (
    <div
      className={cn.wrapper}
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
    >
      <div className={cn.progress}>
        <ProgressIndicator
          running={running}
          percentRemaining={((minutes * 60) + seconds) / totalSeconds * 100}
          size={size}
        />
      </div>
      {finishedNotice
        ? <p className={[cn.time, cn.timeComplete, type.medium].join(' ')}>Complete</p>
        : <p className={[cn.time, type.large].join(' ')}>{getTimeUnit(minutes)}:{getTimeUnit(seconds)}</p>
      }
    </div>
  );
};

export default TimerScreen;
