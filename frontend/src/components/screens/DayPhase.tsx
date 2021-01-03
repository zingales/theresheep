import React, {FC, useState} from 'react';
import {useParams} from 'react-router-dom';
import {
  FormControl,
  RadioGroup,
  Radio,
  FormControlLabel,
  Divider,
} from '@material-ui/core';
import {State} from 'types';
import {chooseCenterCard, nominateToKill} from 'api';

import './DayPhase.scss';
import Timer from 'components/shared/Timer';

const DayPhase: FC<{backendState: State}> = props => {
  const {
    backendState: {allPlayers, originalRole, center, knownPlayers, name},
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

  
    const knowsCenterRole = center.filter((x) => x!== null).length > 0

    let centerBody: JSX.Element | null;
    if (knowsCenterRole) {
      centerBody = <div>
      Center Cards
    <ol>
      {center.map((role) => {
        return <li>{role || '?'}</li>
      })}
    </ol>
    </div>;
    }
    else {
      centerBody = null;
    }
          

  // Making the assumption that all person names are unique
  return (
    <div className="DayPhase">
      <div className="DayPhase__column DayPhase__timer-column">
        <Timer />
      </div>
      <div className="DayPhase__column">
        <div className="DayPhase__info">
          This is what i know:
          My Original Role {originalRole}<br></br>
          Things i know
          <ul>
            {Object.entries(knownPlayers).map(([key, value]) => {
              return <li>{`${key} : ${value}`}</li>
            })}
          </ul>
          {centerBody}
        </div>
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
