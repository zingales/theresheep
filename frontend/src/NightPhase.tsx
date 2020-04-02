import React from 'react';
import werewolfImg from './pics/werewolf.png';
import './NightPhase.scss';
import Checkbox from './Checkbox';

const NightPhase = () => {
  return (
    <div className="NightPhase">
      <div className="NightPhase__header">
        <div className="NightPhase__header-title">Night Phase</div>
      </div>
      <NightPhaseBody />
    </div>
  );
};

const NightPhaseBody = () => {
  return (
    <div className="NightPhaseBody">
      <div className="NightPhaseBody__column">
        <div className="NightPhaseBody__vertical-gutter" />
        <div className="NightPhaseBody__role">Your Role: werewolf</div>
        <div className="NightPhaseBody__team">Team: bad</div>
        <div className="NightPhaseBody__description">
          Shall I compare a werewolf to a summer's day? Thou art more lovely and
          more temperate. Choose someone to kill, ploop a doop boop moop.
        </div>
        <img src={werewolfImg} className="NightPhaseBody__image" alt="logo" />
      </div>
      <div className="NightPhaseBody__column">
        <div className="NightPhaseBody__vertical-gutter" />
        <div className="NightPhaseBody__box">
          <div className="NightPhaseBody__box-header">Pick who to kill</div>
          <Checkbox> Person 1</Checkbox>
          <Checkbox> Person 2</Checkbox>
          <Checkbox> Person 3</Checkbox>
        </div>
        <div className="NightPhaseBody__box">
          <div className="NightPhaseBody__box-header">Your werewolves are</div>
          <div className="NightPhaseBody__list-item">Werewolf 1</div>
          <div className="NightPhaseBody__list-item">Werewolf 2</div>
          <div className="NightPhaseBody__list-item">Werewolf 3</div>
        </div>
      </div>
    </div>
  );
};

export default NightPhase;
