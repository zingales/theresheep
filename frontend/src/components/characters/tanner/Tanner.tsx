import React, { FC } from 'react';
import './Tanner.scss';
import { State } from 'types';
import Elipsis from 'components/shared/Elipsis';
import CharacterDisplay from 'components/shared/CharacterDisplay';
import PlayersList from 'components/shared/PlayersList';

const Tanner: FC<{ backendState: State }> = (props) => {
  const {
    backendState: { allPlayers, knownPlayers, name },
  } = props;

  const allPlayersToRoles = Object.fromEntries(
    allPlayers
      .filter((playerName) => playerName !== name)
      .map((playerName) => [playerName, knownPlayers[playerName] || null]),
  );

  return (
    <div className="Tanner">
      <div className="Tanner__column">
        <div className="Tanner__role">Your Role: tanner</div>
        <div className="Tanner__team">Team: tanner</div>
        <div className="Tanner__description">
          You're sole mission is to be nominated to be killed by the town. Cause
          you are weird like that.
        </div>
        <CharacterDisplay currentRole={'tanner'} className={'Tanner__image'} />
      </div>

      <span className="Tanner__column">
        <span className="Tanner__waitingText">
          Waiting for other characters to finish their actions. Nothing for you
          to do
          <Elipsis />
        </span>
        <PlayersList players={allPlayersToRoles} />
      </span>
    </div>
  );
};

export default Tanner;
