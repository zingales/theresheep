import React from 'react';
import villagerImg from 'pics/villager.png';
import './VillagerNightPhase.scss';
import Elipsis from 'Elipsis';

const VillagerNightPhase = () => {
  return (
    <div className="VillagerNightPhase">
      <div className="VillagerNightPhase__column">
        <div className="VillagerNightPhase__role">Your Role: villager</div>
        <div className="VillagerNightPhase__team">Team: villager</div>
        <div className="VillagerNightPhase__description">
          At night, all Werewolves open their eyes and look for other
          werewolves. If no one else opens their eyes, the other Werewolves are
          in the center. Werewolves are on the werewolf team.
        </div>
        <img
          src={villagerImg}
          className="VillagerNightPhase__image"
          alt="logo"
        />
      </div>

      <span className="VillagerNightPhase__column VillagerNightPhase__waiting-column">
        <span>
          Waiting for other characters to finish their actions. Nothing for you
          to do
          <Elipsis />
        </span>
      </span>
    </div>
  );
};

export default VillagerNightPhase;
