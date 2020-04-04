import React from 'react';
import werewolfImg from './pics/werewolf.png';
import './NightPhase.scss';
import {Checkbox, FormControlLabel} from '@material-ui/core';

const NightPhase = () => {
  return (
    <div className="NightPhase">
      <div className="NightPhase__column">
        <div className="NightPhase__vertical-gutter" />
        <div className="NightPhase__role">Your Role: werewolf</div>
        <div className="NightPhase__team">Team: bad</div>
        <div className="NightPhase__description">
          Shall I compare a werewolf to a summer's day? Thou art more lovely and
          more temperate. Choose someone to kill, ploop a doop boop moop.
        </div>
        <img src={werewolfImg} className="NightPhase__image" alt="logo" />
      </div>
      <div className="NightPhase__column">
        <div className="NightPhase__vertical-gutter" />
        <div className="NightPhase__box">
          <div className="NightPhase__box-header">Pick who to kill</div>
          <div>
            <FormControlLabel
              value="person-1"
              control={<Checkbox />}
              label="Person 1"
            />
          </div>
          <div>
            <FormControlLabel
              value="person-2"
              control={<Checkbox />}
              label="Person 2"
            />
          </div>
          <div>
            <FormControlLabel
              value="person-3"
              control={<Checkbox />}
              label="Person 3"
            />
          </div>
        </div>
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
