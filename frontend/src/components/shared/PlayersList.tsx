import classNames from 'classnames';
import React, {FC} from 'react';
import {Role} from 'types';
import './PlayersList.scss';

import {getImgForRole} from 'compUtils';

type PlayersListProps = {
  players: {[playerName: string]: Role | null};
  selectedState: {[playerName: string]: boolean};

  // type of setFoo in const [foo, setFoo] = useState();
  setSelectedState: React.Dispatch<
    React.SetStateAction<{
      [playerName: string]: boolean;
    }>
  >;
  playerOverride?: {[playerName: string]: Role};
};
const PlayersList: FC<PlayersListProps> = props => {
  const {
    players,
    selectedState,
    setSelectedState,
    playerOverride: _playersOverride,
  } = props;
  const playersOverride = _playersOverride || {};

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
                    playersOverride[playerName] || role,
                    classNames('PlayersList__card', 'no-hover'),
                  )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayersList;
