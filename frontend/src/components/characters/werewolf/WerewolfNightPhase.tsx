import React, {FC} from 'react';
import './WerewolfNightPhase.scss';
import {State, Role} from 'types';
import {getImgForRole} from 'compUtils';
import classNames from 'classnames';
import {chooseCenterCard} from 'api';
import {useParams} from 'react-router-dom';

import werewolfImg from 'pics/werewolf.png';

const WerewolfNightPhase: FC<{backendState: State}> = props => {
  const {
    backendState: {knownPlayers, center},
  } = props;

  const originalWerewolves = Object.entries(knownPlayers)
    .filter(([, role]) => role === 'werewolf')
    .map(([name]) => name);

  const showCenterWidget = originalWerewolves.length === 0;

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
            {showCenterWidget
              ? 'Choose card from center'
              : 'Your werewolves are'}
          </div>
          {showCenterWidget ? (
            <CenterChooseWidget center={center} />
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

type CenterChooseWidgetProps = {
  center: (Role | null)[];
};

const CenterChooseWidget: FC<CenterChooseWidgetProps> = props => {
  const {center} = props;

  const {gameId, playerId} = useParams();
  if (gameId === undefined || playerId === undefined) {
    // TODO: return error here? Or maybe attach game and playerid to context
    // and make them not undefined
    return null;
  }

  const chooseCard = (cardIdx: number) =>
    chooseCenterCard(gameId, playerId, cardIdx);

  const knownCard = center.find(x => x !== null);

  return (
    <div className="CenterChooseWidget">
      <div className="CenterChooseWidget__cards-row">
        {center.map((card, idx) => (
          <div
            key={`center-card-${idx}`}
            onClick={() => chooseCard(idx)}
            className={classNames(
              'CenterChooseWidget__center-card',
              card !== null && 'no-hover',
            )}>
            {card === null
              ? '?'
              : getImgForRole(card, 'CenterChooseWidget__center-card no-hover')}
          </div>
        ))}
      </div>
      <div className="CenterChooseWidget__prompt-row">
        {knownCard && `You saw ${knownCard} in the center!`}
      </div>
    </div>
  );
};

export default WerewolfNightPhase;
