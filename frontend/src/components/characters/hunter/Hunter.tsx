import React, { FC } from 'react';
import { State } from 'types';
import './Hunter.scss';
import Elipsis from 'components/shared/Elipsis';
import CharacterDisplay from 'components/shared/CharacterDisplay';
import PlayersList from '../../shared/PlayersList';

const Hunter: FC<{ backendState: State }> = (props) => {
  const {
    backendState: { allPlayers, knownPlayers, name, phase },
  } = props;

  const allPlayersToRoles = Object.fromEntries(
    allPlayers
      .filter((playerName) => playerName !== name)
      .map((playerName) => [playerName, knownPlayers[playerName] || null]),
  );

  return (
    <div className="Hunter">
      <div className="Hunter__column">
        <div className="Hunter__role">Your Role: hunter</div>
        <div className="Hunter__team">Team: villager</div>
        <div className="Hunter__description">
          At night, all Werewolves open their eyes and look for other
          werewolves. If no one else opens their eyes, the other Werewolves are
          in the center. Werewolves are on the werewolf team.
        </div>
        <CharacterDisplay currentRole={'hunter'} className={'Hunter__image'} />
      </div>

      <span className="Hunter__column Hunter__waiting-column">
        <PlayersList
          players={allPlayersToRoles}
          selectedState={{}}
          setSelectedState={() => {}}
        />
        {phase === 'night' && (
          <span>
            Waiting for other characters to finish their actions. Nothing for
            you to do
            <Elipsis />
          </span>
        )}
      </span>
    </div>
  );
};

export default Hunter;
