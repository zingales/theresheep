import React, {useState} from 'react';
import {
  FormControl,
  RadioGroup,
  Radio,
  FormControlLabel,
} from '@material-ui/core';

import './WerewolfDayPhase.scss';
import Timer from 'Timer';

const WerewolfDayPhase = () => {
  const [radioGroupValue, setRadio] = useState<string | null>(null);

  return (
    <div className="WerewolfDayPhase">
      <div className="WerewolfDayPhase__column WerewolfDayPhase__timer-column">
        <Timer />
      </div>
      <div className="WerewolfDayPhase__column">
        <div className="WerewolfDayPhase__kill-prompt">Choose who to kill</div>
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

export default WerewolfDayPhase;
