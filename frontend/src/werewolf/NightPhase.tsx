import React from 'react';
import werewolfImg from 'pics/werewolf.png';
import './NightPhase.scss';

const NightPhase = () => {
  return (
    <div className="NightPhase">
      <div className="NightPhase__column">
        <div className="NightPhase__role">Your Role: werewolf</div>
        <div className="NightPhase__team">Team: werewolf</div>
        <div className="NightPhase__description">
          At night, all Werewolves open their eyes and look for other
          werewolves. If no one else opens their eyes, the other Werewolves are
          in the center. Werewolves are on the werewolf team.
        </div>
        <img src={werewolfImg} className="NightPhase__image" alt="logo" />
      </div>
      <div className="NightPhase__column">
        <div className="NightPhase__vertical-gutter" />
        <div className="NightPhase__box">
          <div className="NightPhase__box-header">Your werewolves are</div>
          <div className="NightPhase__list-item">Werewolf 1</div>
          <div className="NightPhase__list-item">Werewolf 2</div>
          <div className="NightPhase__list-item">Werewolf 3</div>
        </div>
      </div>
    </div>
  );
};

export default NightPhase;
