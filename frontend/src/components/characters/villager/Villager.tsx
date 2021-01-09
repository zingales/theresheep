import React, {FC} from 'react';
import {State} from 'types';
import './Villager.scss';
import Elipsis from 'components/shared/Elipsis';
import { getImgForRole } from 'compUtils';
import PlayersList from '../../shared/PlayersList';



const Villager : FC<{backendState: State}> = props => {
  const {
    backendState: {
      allPlayers,
      knownPlayers,
      name,
      phase,
    },
  } = props;

  const allPlayersToRoles = Object.fromEntries(
    allPlayers
      .filter(playerName => playerName !== name)
      .map(playerName => [playerName, knownPlayers[playerName] || null]),
  );
  
  return (
    <div className="Villager">
      <div className="Villager__column">
        <div className="Villager__role">Your Role: villager</div>
        <div className="Villager__team">Team: villager</div>
        <div className="Villager__description">
          At night, all Werewolves open their eyes and look for other
          werewolves. If no one else opens their eyes, the other Werewolves are
          in the center. Werewolves are on the werewolf team.
        </div>
        {getImgForRole('villager', "Villager__image")}
      </div>

      <span className="Villager__column Villager__waiting-column">
      <PlayersList
          players={allPlayersToRoles}
          selectedState={{}}
          setSelectedState={() => {}}
        />
        { phase === 'night' && (
        <span>
          Waiting for other characters to finish their actions. Nothing for you
          to do
          <Elipsis />
        </span>
        )}
      </span>
    </div>
  );
};

export default Villager;
