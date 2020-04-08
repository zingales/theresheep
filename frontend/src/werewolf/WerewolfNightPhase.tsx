import React, {FC} from 'react';
import werewolfImg from 'pics/werewolf.png';
import './WerewolfNightPhase.scss';
import {BackendState} from 'types';

const WerewolfNightPhase: FC<{backendState: BackendState}> = props => {
  const {
    backendState: {originalWerewolves},
  } = props;
  return (
    <div className="WerewolfNightPhase">
      <div className="WerewolfNightPhase__column">
        <div className="WerewolfNightPhase__role">Your Role: werewolf</div>
        <div className="WerewolfNightPhase__team">Team: werewolf</div>
        <div className="WerewolfNightPhase__description">
          At night, all Werewolves open their eyes and look for other
          werewolves. If no one else opens their eyes, the other Werewolves are
          in the center. Werewolves are on the werewolf team.
        </div>
        <img
          src={werewolfImg}
          className="WerewolfNightPhase__image"
          alt="logo"
        />
      </div>
      <div className="WerewolfNightPhase__column">
        <div className="WerewolfNightPhase__box">
          <div className="WerewolfNightPhase__box-header">
            Your werewolves are
          </div>
          {originalWerewolves.map(name => (
            <div className="WerewolfNightPhase__list-item">{name}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WerewolfNightPhase;
