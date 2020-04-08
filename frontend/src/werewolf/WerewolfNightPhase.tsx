import React, {FC} from 'react';
import werewolfImg from 'pics/werewolf.png';
import './WerewolfNightPhase.scss';
import {BackendState} from 'types';

const WerewolfNightPhase: FC<{backendState: BackendState}> = props => {
  const {
    backendState: {originalWerewolves},
  } = props;

  const chooseFromCenter = originalWerewolves.length <= 1;

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
            {chooseFromCenter
              ? 'Choose card from center'
              : 'Your werewolves are'}
          </div>
          {chooseFromCenter ? (
            <CenterChooseWidget />
          ) : (
            originalWerewolves.map((name, idx) => (
              <div
                key={`original-werewolf-${idx}`}
                className="WerewolfNightPhase__list-item">
                {name}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const CenterChooseWidget = () => {
  return (
    <div className="CenterChooseWidget">
      <span className="CenterChooseWidget__center-card">?</span>
      <span className="CenterChooseWidget__center-card">?</span>
      <span className="CenterChooseWidget__center-card">?</span>
    </div>
  );
};

export default WerewolfNightPhase;
