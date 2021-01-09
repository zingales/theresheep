import React, {FC} from 'react';
import './Minion.scss';
import {State} from 'types';
import CharacterDisplay from '../../shared/CharacterDisplay';
import PlayersList from '../../shared/PlayersList';

const Minion: FC<{backendState: State}> = props => {
  const {
    backendState: {allPlayers, knownPlayers, name},
  } = props;

  const allPlayersToRoles = Object.fromEntries(
    allPlayers
      .filter(playerName => playerName !== name)
      .map(playerName => [playerName, knownPlayers[playerName] || null]),
  );

  return (
    <div className="Minion">
      <div className="Minion__column">
        <div className="Minion__role">Your Role: minion</div>
        <div className="Minion__team">Team: Werewolf</div>
        <div className="Minion__description">
          You see the werewolves, they don't know who you are.
        </div>
        {
          <CharacterDisplay
            currentRole={'minion'}
            className={'Minion__image'}
          />
        }
      </div>

      <span className="Minion__column Minion__waiting-column">
        <PlayersList
          players={allPlayersToRoles}
          selectedState={{}}
          setSelectedState={() => {}}
        />
      </span>
    </div>
  );
};

export default Minion;
