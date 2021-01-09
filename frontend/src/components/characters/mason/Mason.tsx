import React, {FC} from 'react';
import './Mason.scss';
import {State} from 'types';
import {getImgForRole2} from 'compUtils';
import PlayersList from '../../shared/PlayersList';

const Mason: FC<{backendState: State}> = props => {
  const {
    backendState: {allPlayers, knownPlayers, name},
  } = props;

  const allPlayersToRoles = Object.fromEntries(
    allPlayers
      .filter(playerName => playerName !== name)
      .map(playerName => [playerName, knownPlayers[playerName] || null]),
  );

  return (
    <div className="Mason">
      <div className="Mason__column">
        <div className="Mason__role">Your Role: mason</div>
        <div className="Mason__team">Team: Villager</div>
        <div className="Mason__description">
          You see the other players that are Mason. You're friends now.
        </div>
        {getImgForRole2('mason', {className: 'Mason__image'})}
      </div>

      <span className="Mason__column Mason__waiting-column">
        <PlayersList
          players={allPlayersToRoles}
          selectedState={{}}
          setSelectedState={() => {}}
        />
      </span>
    </div>
  );
};

export default Mason;
