import classNames from 'classnames';
import React, {FC} from 'react';
import {Role} from 'types';
import './PlayersList.scss';

import {getImgForRole2} from 'compUtils';

type PlayersListProps = {
  players: {[playerName: string]: Role | null};
  selectedState: {[playerName: string]: boolean};

  setSelectedState: React.Dispatch<
    // type of setFoo in const [foo, setFoo] = useState();
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
        {Object.entries(players).map(([playerName, role], idx) => {
          const oldRole = playersOverride[playerName] ? role : undefined;
          return (
            <div
              key={`player-card-parent-${idx}`}
              onClick={() => toggleChosen(playerName)}>
              <div>{playerName}</div>
              <div
                key={`player-card-${idx}`}
                className={classNames(
                  'PlayersList__card',
                  role !== null && 'no-hover',
                  role !== null && 'no-background',
                  selectedState[playerName] && 'PlayersList__card--border',
                )}>
                {role === null
                  ? '?'
                  : getImgForRole2(playersOverride[playerName] || role, {
                      oldRole,
                      className: classNames(
                        'PlayersList__card',
                        'no-hover',
                        'no-background',
                      ),
                    })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlayersList;
