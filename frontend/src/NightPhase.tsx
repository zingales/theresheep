import React, {FC, ReactNode} from 'react';
import werewolfImg from './pics/werewolf.png';
import './NightPhase.scss';

const NightPhase = () => {
  return (
    <div className="NightPhase">
      <div className="NightPhase__header">
        <div className="NightPhase__header-gutter" />
        <div className="NightPhase__header-title">Night Phase</div>
        <div className="NightPhase__header-gutter" />
      </div>
      <Body />
    </div>
  );
};

const Body = () => {
  return (
    <div className="Body">
      <div className="Body__column">
        <div className="Body__role">Your Role: werewolf</div>
        <div className="Body__team">Team: bad</div>
        <div className="Body__description">
          Shall I compare a werewolf to a summer's day? Thou art more lovely and
          more temperate. Choose someone to kill, ploop a doop boop moop.
        </div>
        <img src={werewolfImg} className="Body__image" alt="logo" />
      </div>
      <div className="Body__column">
        <div className="Body__box">
          <div className="Body__box-header">Pick who to kill</div>
          <Checkbox> Person 1</Checkbox>
          <Checkbox> Person 2</Checkbox>
          <Checkbox> Person 3</Checkbox>
        </div>
        <div className="Body__box">
          <div className="Body__box-header">Your werewolves are</div>
          <div className="Body__list-item">Werewolf 1</div>
          <div className="Body__list-item">Werewolf 2</div>
          <div className="Body__list-item">Werewolf 3</div>
        </div>
      </div>
    </div>
  );
};

const Checkbox: FC<{children?: string}> = props => {
  return (
    <div>
      <span className="Checkbox__row">
        <input type="checkbox" className="Checkbox__checkbox" />
        {props.children}
      </span>
    </div>
  );
};

export default NightPhase;
