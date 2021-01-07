import classNames from 'classnames';
import React, {FC, useState} from 'react';
import {Role} from 'types';
import './PlayersList.scss';

import {getImgForRole} from 'compUtils';

type PlayersListProps = {
  currentPlayer: {name: string; roleToDisplay: Role};
  players: {[playerName: string]: Role | null};
  selectedState: {[playerName: string]: boolean};
  fadedPlayers?: string[];

  // type of setFoo in const [foo, setFoo] = useState();
  setSelectedState: React.Dispatch<
    React.SetStateAction<{
      [playerName: string]: boolean;
    }>
  >;
};
const PlayersList: FC<PlayersListProps> = props => {
  const {
    players,
    selectedState,
    setSelectedState,
    fadedPlayers: _fadedPlayers,
  } = props;
  const fadedPlayers = _fadedPlayers || [];

  const toggleChosen = (playerName: string) => {
    setSelectedState(currentSelectedState => {
      return {
        ...currentSelectedState,
        ...{[playerName]: !currentSelectedState[playerName]},
      };
    });
  };

  return (
    <div className="PlayersList">
      <div className="PlayersList__cards-row">
        {Object.entries(players).map(([playerName, role], idx) => (
          <div
            key={`player-card-parent-${idx}`}
            onClick={() => toggleChosen(playerName)}>
            <div>{playerName}</div>
            <div
              key={`player-card-${idx}`}
              className={classNames(
                'PlayersList__card',
                role !== null && 'no-hover',
                selectedState[playerName] && 'PlayersList__card--border',
              )}>
              {role === null
                ? '?'
                : getImgForRole(
                    role,
                    classNames(
                      'PlayersList__card',
                      'no-hover',
                      fadedPlayers.includes(playerName) &&
                        'PlayersList__card--oldRole',
                    ),
                  )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayersList;
