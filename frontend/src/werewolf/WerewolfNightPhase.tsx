import React, {FC} from 'react';
import './WerewolfNightPhase.scss';
import {BackendState, Role} from 'types';
import {assertNever} from 'utils';
import classNames from 'classnames';
import {chooseCenterCard} from 'api';
import {useParams} from 'react-router-dom';

import werewolfImg from 'pics/werewolf.png';
import villagerImg from 'pics/villager.png';

const WerewolfNightPhase: FC<{backendState: BackendState}> = props => {
  const {
    backendState: {hasSeen, actionPrompt},
  } = props;

  const originalWerewolves = Object.entries(hasSeen)
    .filter(([, role]) => role === 'werewolf')
    .map(([name]) => name);

  // making the assumption here that it will never be the case that
  // originalWerewolves != [] and actionPrompt == choose-center-card.
  const chooseFromCenter = actionPrompt === 'choose-center-card';

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
            <CenterChooseWidget roles={[null, null, null]} />
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
  roles: (Role | null)[];
};

const CenterChooseWidget: FC<CenterChooseWidgetProps> = props => {
  const {roles} = props;

  const {gameId, playerId} = useParams();
  if (gameId === undefined || playerId === undefined) {
    // TODO: return error here? Or maybe attach game and playerid to context
    // and make them not undefined
    return null;
  }

  const chooseCard = async (cardIdx: number) =>
    chooseCenterCard(gameId, playerId, cardIdx);

  const knownCard = roles.find(x => x !== null);

  return (
    <div className="CenterChooseWidget">
      <div className="CenterChooseWidget__cards-row">
        {roles.map((card, idx) => (
          <div
            key={`center-card-${idx}`}
            onClick={() => chooseCard(idx)}
            className={classNames(
              'CenterChooseWidget__center-card',
              card && 'no-hover',
            )}>
            {card === null ? '?' : getImgForRole(card)}
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

export const getImgForRole = (
  role: Role,
  className?: string,
): React.ReactNode => {
  switch (role) {
    case 'villager':
      return <img className={className} src={villagerImg} alt="logo" />;
    case 'werewolf':
      return <img className={className} src={werewolfImg} alt="logo" />;
    default:
      return assertNever('Non exhaustive switch', role);
  }
};
