import React, {FC} from 'react';
import './WerewolfNightPhase.scss';
import {BackendState, Role} from 'types';
import {assertNever} from 'utils';
import classNames from 'classnames';

import werewolfImg from 'pics/werewolf.png';
import villagerImg from 'pics/villager.png';

const WerewolfNightPhase: FC<{backendState: BackendState}> = props => {
  const {
    backendState: {hasSeen, expectedAction},
  } = props;

  const originalWerewolves = Object.entries(hasSeen)
    .filter(([, role]) => role === 'werewolf')
    .map(([name]) => name);

  // making the assumption here that it will never be the case that
  // originalWerewolves != [] and expectedAction == choose-center-card.
  const chooseFromCenter = expectedAction == 'choose-center-card';

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
            <CenterChooseWidget cards={[null, null, null]} />
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
  cards: (Role | null)[];
};

const CenterChooseWidget: FC<CenterChooseWidgetProps> = props => {
  const {cards} = props;

  const chooseCard = async (idx: number) => {
    // ... make api call, choose the card
  };

  return (
    <div className="CenterChooseWidget">
      <div className="CenterChooseWidget__cards-row">
        {cards.map((card, idx) => (
          <div onClick={() => chooseCard(idx)}>
            {card === null
              ? '?'
              : getImgForRole(
                  card,
                  classNames(
                    'CenterChooseWidget__center-card',
                    card && 'no-hover',
                  ),
                )}
          </div>
        ))}
      </div>
      <div className="CenterChooseWidget__prompt-row">
        {cards !== [] && `You saw ${cards[0]} in the center!`}
      </div>
    </div>
  );
};

export default WerewolfNightPhase;

export const getImgForRole = (
  role: Role,
  className: string,
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
