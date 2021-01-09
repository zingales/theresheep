import React, { useState, useEffect } from 'react';
import './Timer.scss';

/*
 * Emits a new number n every interval milliseconds where n is the number of
 * milliseconds elapsed since useTimer rendered.
 */
export const useTimer = (interval?: number): number => {
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

const Timer = () => {
  const elapsedMills = useTimer();
  const elapsedSeconds = Math.round(elapsedMills / 1000);
  const totalTime = 5 * 60; // 5 minutes worth of seconds
  const timeRemaining = totalTime - elapsedSeconds;
  const minutesRemaining = Math.floor(timeRemaining / 60);
  const secondsRemaining = timeRemaining % 60;

  return (
    <span className="Timer">
      {minutesRemaining} : {String(secondsRemaining).padStart(2, '0')}
    </span>
  );
};

export default Timer;
