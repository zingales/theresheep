import React, {FC, useState} from 'react';
import {useParams} from 'react-router-dom';
import {
  FormControl,
  RadioGroup,
  Radio,
  FormControlLabel,
} from '@material-ui/core';
import {BackendState} from 'types';
import {nominateToKill} from 'api';

import './DayPhase.scss';
import Timer from 'Timer';

const DayPhase: FC<{backendState: BackendState}> = props => {
  const {
    backendState: {allPlayers},
  } = props;
  const [radioGroupValue, setRadio] = useState<string | null>(null);

  const {gameId, playerId} = useParams();
  if (gameId === undefined || playerId === undefined) {
    return null;
  }

  const choosePlayer = async (player: string) => {
    setRadio(player);
    await nominateToKill(gameId, playerId, player);
  };

  // Making the assumption that all person names are unique
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
            onChange={(_, value) => choosePlayer(value)}>
            {allPlayers.map(person => (
              <FormControlLabel
                key={`day-phase-radio-buttons-${person}`}
                value={person}
                control={<Radio />}
                label={person}
              />
            ))}
          </RadioGroup>
        </FormControl>
      </div>
    </div>
  );
};

export default DayPhase;
