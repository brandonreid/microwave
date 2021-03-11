import React, { useState, useEffect } from "react";
import { useHotkeys } from 'react-hotkeys-hook';
import './normalize.css';
import './global.css';
import './tokens/tokens.css';
import './themes.css';
import type from './tokens/typography.module.css';
import cn from './app.module.css';

import TimerScreen from './modules/timer-screen';
import DialPad from './modules/dial-pad';
import ThemePicker from './modules/theme-picker';

const App = () => {
  let countdownInterval;
  // @TODO: Hoist `running` to a redux store to avoid prop drilling into circle spinner
  const [running, setRunning] = useState(false);
  const [totalStartSeconds, setTotalStartSeconds] = useState(0);
  const [ariaAnnouncement, setAriaAnnouncement] = useState(null);

  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [numbersPressed, setNumbersPressed] = useState([]);
  const [finishedNotice, setFinishedNotice] = useState(false);

  const [activeTheme, setActiveTheme] = useState('solid-black');
  // defined in themes.css
  const themeOptions = [
    'solid-black',
    'pearl-white',
    'midnight-silver',
    'deep-blue',
    'red-glossy',
  ];

  const updateTotalStartSeconds = (newSecs, newMins) => {
    setTotalStartSeconds((newMins * 60) + newSecs);
  };

  const handleStart = (newSecs, newMins) => {
    updateTotalStartSeconds(newSecs, newMins);
    updateAriaAnnouncement('Cooking, press escape to stop.');
    setRunning(true);
  };

  const handleStop = (timerFinished) => {
    clearInterval(countdownInterval);
    setRunning(false);

    if (timerFinished) {
      handleClear();
      setFinishedNotice(true);
      updateAriaAnnouncement('Cooking finished!');
      setTimeout(() => {
        setFinishedNotice(false);
      }, 5000);
    } else {
      updateNumbersPressed();
      updateAriaAnnouncement('Microwave stopped.');
    }
  };

  const handleFinishNotice = () => {
    setFinishedNotice(true);

    setTimeout(() => {
      setFinishedNotice(false)
    }, 3000);
  };

  const handleClear = (announce) => {
    setSeconds(0);
    setMinutes(0);
    setNumbersPressed([]);
    if (announce) {
      updateAriaAnnouncement('Microwave time cleared.');
    }
  };

  const handleAdd30 = (thenStart) => {
    let newSecs = seconds;
    let newMins = minutes;
    if (seconds < 30) {
      newSecs = seconds + 30;
      setSeconds(newSecs);
    } else {
      newSecs = 30 - (60 - seconds);
      newMins = minutes + 1;
      setSeconds(newSecs);
      setMinutes(newMins);
    }
    if (thenStart) {
      handleStart(newSecs, newMins);
    } else {
      updateTotalStartSeconds(newSecs, newMins);
      updateAriaAnnouncement('30 seconds added.');
    }
  };

  const updateAriaAnnouncement = (announcement) => {
    setAriaAnnouncement(announcement);
    setTimeout(() => {
      if (announcement) {
        setAriaAnnouncement(null);
      }
    }, 3000);
  };

  const getAriaCountdown = () => {
    const tenSecIncrement = seconds % 10 === 0;
    if (minutes < 1 && seconds < 1) return;
    return minutes > 0
      ? `${tenSecIncrement ? `${minutes} minute${minutes > 1 ? 's' : ''} ` : ''}
         ${seconds}
         ${tenSecIncrement ? 'seconds' : ''}`
      : seconds;
  }

  const handleDialPress = (val) => {
    const getTimeMsg = (m, s) => `current setting is ${m || 0} minutes and ${s || 0} seconds.`;
    const backspace = val === undefined;
    let newNumbersPressed = backspace
      ? [...numbersPressed]
      : [...numbersPressed, val];
    if (backspace) { newNumbersPressed.pop(); }

    if (newNumbersPressed.length < 5) {
      let newMins = minutes;
      setNumbersPressed(newNumbersPressed);
      const newSecs = newNumbersPressed.length > 1
        ? `${newNumbersPressed.slice(newNumbersPressed.length - 2).join('')}`
        : newNumbersPressed[newNumbersPressed.length - 1];
      setSeconds(Number(newSecs));

      if (newNumbersPressed.length > 2) {
        newMins = newNumbersPressed[newNumbersPressed.length - 4]
        ? `${newNumbersPressed.slice(0, 2).join('')}`
        : newNumbersPressed[newNumbersPressed.length - 3];
      } else {
        newMins = 0;
      }

      setMinutes(Number(newMins));
      updateAriaAnnouncement(`${backspace ? 'Backspace' : val}, ${getTimeMsg(newMins, newSecs)}`);
    } else {
      updateAriaAnnouncement(`No more space for additional digits, ${getTimeMsg(minutes, seconds)}`);
    }
  };

  const updateNumbersPressed = () => {
    let newNumbersPressed = [];
    const getDigit = (num, char) => num.toString().charAt(char);
    if (minutes !== 0) {
      if (minutes > 9) {
        newNumbersPressed.push(getDigit(minutes, 0));
      }
      newNumbersPressed.push(getDigit(minutes, 1));
    }
    if (minutes !== 0 && seconds < 10) {
      newNumbersPressed.push(0);
    }
    if (seconds !== 0) {
      newNumbersPressed.push(getDigit(seconds, 0));
    }
    if (seconds > 9) {
      newNumbersPressed.push(getDigit(seconds, 1));
    }
    setNumbersPressed(newNumbersPressed);
  }

  useEffect(() => {
    if (running) {
      countdownInterval = setInterval(() => {
        if (minutes === 0 && seconds === 1) {
          handleFinishNotice();
        }
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (seconds === 0) {
          if (minutes === 0) {
            handleStop(true);
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        }
      }, 1000)
        return ()=> {
        clearInterval(countdownInterval);
      };
    };
  }, [
    running,
    seconds,
    minutes,
    handleFinishNotice,
    handleStop,
    setSeconds,
    setMinutes
  ]);

  const handleStopOrClearPress = () => {
    return running ? handleStop() : handleClear(true);
  }

  const handleStartOrAddPress = () => {
    if (running) {
      handleAdd30();
    } else {
      if (seconds < 1 && minutes < 1) {
        handleAdd30(true);
      } else {
        handleStart(seconds, minutes);
      }
    }
  };

  // Keyboard Shortcuts
  useHotkeys('esc', handleStopOrClearPress, {}, [running, handleStop, handleClear]);
  useHotkeys('enter', handleStartOrAddPress, {}, [running, handleAdd30, handleStart]);
  useHotkeys('backspace', () => handleDialPress(), {}, [handleDialPress]);

  return (
    <div>
      <div id={cn.accessibleUi}>
        <h1>Welcome to the all electric microwave, P one hundred delicious.</h1>
        <p>
          Enter the minutes and seconds you would like to cook your food using your keyboard digits.
          Press enter to start or add 30 seconds, press escape to stop or clear the timer.
        </p>
        {ariaAnnouncement && (
          <span role="alert" aria-live="assertive">{ ariaAnnouncement }</span>
        )}
        {running && (
          <span role="timer" aria-live="polite">
            {getAriaCountdown()}
          </span>
        )}
      </div>

      <div id={cn.visibleUi} className={`ui ${activeTheme}`} aria-hidden="true">
        <ThemePicker
          activeTheme={activeTheme}
          onThemeSelection={(themeName) => setActiveTheme(themeName)}
          themeOptions={themeOptions}
        />
        <div className={cn.interface}>
          <TimerScreen
            running={running}
            totalSeconds={totalStartSeconds}
            minutes={minutes}
            seconds={seconds}
            finishedNotice={finishedNotice}
          />
          <DialPad
            onDialClick={handleDialPress}
          />
          <div className={cn.operators}>
            <button
              type="button"
              className={cn.operatorButton}
              onClick={handleStopOrClearPress}
            >
              <span className={type.medium}>Stop</span>
              <span className={type.default}>Clear</span>
            </button>
            <button
              type="button"
              className={cn.operatorButton}
              onClick={handleStartOrAddPress}
            >
              <span className={type.medium}>Start</span>
              <span className={type.default}>+30</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
