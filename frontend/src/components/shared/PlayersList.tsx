import classNames from 'classnames';
import React, { FC } from 'react';
import { Role } from 'types';
import './PlayersList.scss';

import CharacterDisplay from './CharacterDisplay';

type PlayersListProps = {
  players: { [playerName: string]: Role | null };
  selectedState?: { [playerName: string]: boolean };

  setSelectedState?: React.Dispatch<
    // type of setFoo in const [foo, setFoo] = useState();
    React.SetStateAction<{
      [playerName: string]: boolean;
    }>
  >;
  playerOverride?: { [playerName: string]: Role };

  numToSelect?: number;
};
const PlayersList: FC<PlayersListProps> = (props) => {
  const {
    players,
    selectedState: _selectedState,
    setSelectedState: _setSelectedState,
    playerOverride: _playersOverride,
    numToSelect: _numToSelect,
  } = props;
  const playersOverride = _playersOverride || {};
  const numToSelect = _numToSelect || 0;
  const selectedState = _selectedState || {};
  const setSelectedState = _setSelectedState || (() => {});

  const toggleChosen = (playerName: string) => {
    setSelectedState((currentSelectedState) => {
      const currentSelectedStateCopy = { ...currentSelectedState };
      currentSelectedStateCopy[playerName] = !currentSelectedStateCopy[
        playerName
      ];
      const currentlySelectedPlayers = Object.entries(currentSelectedStateCopy)
        .filter(([, isSelected]) => isSelected)
        .map(([playerName]) => playerName);

      if (currentlySelectedPlayers.length > numToSelect) {
        const playerToUnselect = currentlySelectedPlayers.filter(
          (selectedPlayer) => selectedPlayer !== playerName,
        )[0];
        currentSelectedStateCopy[playerToUnselect] = false;
      }

      return currentSelectedStateCopy;
    });
  };

  return (
    <div className="PlayersList">
      <div className="PlayersList__cards-row">
        {Object.entries(players).map(([playerName, role], idx) => {
          const oldRole = playersOverride[playerName]
            ? role || undefined
            : undefined;
          return (
            <div
              className="PlayersList__card-container"
              key={`player-card-parent-${idx}`}
              onClick={() => toggleChosen(playerName)}
            >
              <div className="PlayersList__name">{playerName}</div>
              <div
                key={`player-card-${idx}`}
                className={classNames(
                  'PlayersList__card',
                  numToSelect > 0 &&
                    role === null &&
                    'PlayersList__card--selectable',
                  role !== null && 'no-background',
                  selectedState[playerName] && 'PlayersList__card--border',
                )}
              >
                {role === null ? (
                  '?'
                ) : (
                  <CharacterDisplay
                    currentRole={playersOverride[playerName] || role}
                    oldRole={oldRole}
                    className={classNames(
                      'PlayersList__card',
                      'no-hover',
                      'no-background',
                    )}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlayersList;
