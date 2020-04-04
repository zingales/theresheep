import React from 'react';
import werewolfImg from './pics/werewolf.png';
import './NightPhase.scss';
import {Checkbox, FormControlLabel} from '@material-ui/core';

import AppBar from '@material-ui/core/AppBar';

const NightPhase = () => {
  return (
    <div className="NightPhase">
      <AppBar color="primary" className="NightPhase__appbar " position="static">
        Night Phase
      </AppBar>
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
