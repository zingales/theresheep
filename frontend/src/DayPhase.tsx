import React, {useState, useEffect} from 'react';
import './DayPhase.scss';
import {
  FormControl,
  RadioGroup,
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
  const elapsedMills = useTimer();
  const elapsedSeconds = Math.round(elapsedMills / 1000);
  const totalTime = 5 * 60; // 5 minutes worth of seconds
  const timeRemaining = totalTime - elapsedSeconds;
  const minutesRemaining = Math.floor(timeRemaining / 60);
  const secondsRemaining = timeRemaining % 60;

  const [radioGroupValue, setRadio] = useState<string | null>(null);

  // const handleChange = () => {};
  return (
    <div className="DayPhase">
      <div className="DayPhase__column DayPhase__timer">
        <span>
          {minutesRemaining} : {String(secondsRemaining).padStart(2, '0')}
        </span>
      </div>
      <div className="DayPhase__column">
        <div className="DayPhase__kill-prompt"> Choose who to kill </div>
        <FormControl component="fieldset">
          {/* <FormLabel component="legend">Choose who to kill</FormLabel> */}
          <RadioGroup
            aria-label="people"
            name="people"
            value={radioGroupValue}
            onChange={(_, value) => setRadio(value)}>
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