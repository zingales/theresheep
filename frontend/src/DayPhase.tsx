import React, {useState} from 'react';
import {
  FormControl,
  RadioGroup,
  Radio,
  FormControlLabel,
} from '@material-ui/core';

import './DayPhase.scss';
import Timer from 'Timer';

const DayPhase = () => {
  const [radioGroupValue, setRadio] = useState<string | null>(null);

  return (
    <div className="DayPhase">
      <div className="DayPhase__column DayPhase__timer-column">
        <Timer />
      </div>
      <div className="DayPhase__column">
        <div className="DayPhase__kill-prompt">Choose who to kill</div>
        <FormControl component="fieldset">
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
