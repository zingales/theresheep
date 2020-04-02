import React, {useState, useEffect} from 'react';
import './DayPhase.scss';
// import Checkbox from './Checkbox';
import AppBar from '@material-ui/core/AppBar';
import {
  FormControl,
  RadioGroup,
  FormLabel,
  Radio,
  FormControlLabel,
} from '@material-ui/core';

/*
 * Emits a new number n every interval milliseconds where n is the number of
 * milliseconds elapsed since useTimer rendered.
 */
const useTimer = (interval?: number): number => {
  const [elapsedMills, setElapsed] = useState<number>(0);

  useEffect(() => {
    const startTimestamp = Date.now();
    const timer = setInterval(() => {
      if (startTimestamp === null) {
        return;
      }
      setElapsed(Math.floor(Date.now() - startTimestamp));
    }, interval || 1000);
    return () => clearInterval(timer);
  }, [interval]);

  return elapsedMills;
};

const DayPhase = () => {
  return (
    <div className="DayPhase">
      <AppBar color="primary" className="DayPhase__appbar " position="static">
        One Night Werewolf
      </AppBar>
      <DayPhaseBody />
    </div>
  );
};

const DayPhaseBody = () => {
  const elapsedMills = useTimer();
  const elapsedSeconds = Math.round(elapsedMills / 1000);
  const totalTime = 5 * 60; // 5 minutes worth of seconds
  const timeRemaining = totalTime - elapsedSeconds;
  const minutesRemaining = Math.floor(timeRemaining / 60);
  const secondsRemaining = timeRemaining % 60;

  const value = 'value';
  const handleChange = () => {};
  return (
    <div className="DayPhaseBody">
      <div className="DayPhaseBody__column DayPhaseBody__timer">
        <span>
          {minutesRemaining} : {String(secondsRemaining).padStart(2, '0')}
        </span>
      </div>
      <div className="DayPhaseBody__column">
        <div className="DayPhaseBody__vertical-gutter" />
        <div className="DayPhaseBody__kill-prompt"> Choose who to kill </div>
        <FormControl component="fieldset">
          {/* <FormLabel component="legend">Choose who to kill</FormLabel> */}
          <RadioGroup
            aria-label="people"
            name="people"
            value={value}
            onChange={handleChange}>
            <FormControlLabel
              value="person-1"
              control={<Radio />}
              label="Person 1"
            />
            <FormControlLabel
              value="person-2"
              control={<Radio />}
              label="Person 2"
            />
            <FormControlLabel
              value="person-3"
              control={<Radio />}
              label="Person 3"
            />
          </RadioGroup>
        </FormControl>
      </div>
    </div>
  );
};

export default DayPhase;
