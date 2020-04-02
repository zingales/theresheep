import React, {useState, useEffect} from 'react';
import './DayPhase.scss';
import Checkbox from './Checkbox';

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
      <div className="DayPhase__header">
        <div className="DayPhase__header-title">Day Phase</div>
      </div>
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
        <Checkbox> Person 1</Checkbox>
        <Checkbox> Person 2</Checkbox>
        <Checkbox> Person 3</Checkbox>
      </div>
    </div>
  );
};

export default DayPhase;
