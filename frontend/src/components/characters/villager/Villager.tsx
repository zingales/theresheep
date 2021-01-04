import React from 'react';
import villagerImg from 'pics/villager.png';
import './Villager.scss';
import Elipsis from 'components/shared/Elipsis';

const Villager = () => {
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
        <img
          src={villagerImg}
          className="Villager__image"
          alt="logo"
        />
      </div>

      <span className="Villager__column Villager__waiting-column">
        <span>
          Waiting for other characters to finish their actions. Nothing for you
          to do
          <Elipsis />
        </span>
      </span>
    </div>
  );
};

export default Villager;
