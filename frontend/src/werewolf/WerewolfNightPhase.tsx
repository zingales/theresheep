import React, {FC, useState} from 'react';
import werewolfImg from 'pics/werewolf.png';
import villagerImg from 'pics/villager.png';
import './WerewolfNightPhase.scss';
import {assertNever} from 'utils';
import {BackendState, Role} from 'types';

const WerewolfNightPhase: FC<{backendState: BackendState}> = props => {
  const {
    backendState: {hasSeen},
  } = props;

  const [chosenCardIdx, setChosenCard] = useState<number | null>(null);

  const chooseFromCenter = false;
  const centerCards = ['villager', 'werewolf'] as const;
  const originalWerewolves = Object.entries(hasSeen)
    .filter(([, role]) => role === 'werewolf')
    .map(([name]) => name);

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
            <CenterChooseWidget
              chosenCardIdx={chosenCardIdx}
              setChosenCard={setChosenCard}
              centerCards={centerCards}
            />
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
  chosenCardIdx: number | null;
  setChosenCard: (idx: number) => void;
  centerCards: readonly Role[];
};
const CenterChooseWidget: FC<CenterChooseWidgetProps> = props => {
  const {chosenCardIdx, setChosenCard, centerCards} = props;
  const centerImages = centerCards.map(role => {
    switch (role) {
      case 'villager':
        return (
          <img
            className="CenterChooseWidget__center-card no-hover"
            src={villagerImg}
            alt="logo"
          />
        );
      case 'werewolf':
        return (
          <img
            className="CenterChooseWidget__center-card no-hover"
            src={werewolfImg}
            alt="logo"
          />
        );
      default:
        return assertNever('Non exhaustive switch', role);
    }
  });

  const noHover = chosenCardIdx === null ? '' : 'no-hover';

  return (
    <div className="CenterChooseWidget">
      <div className="CenterChooseWidget__cards-row">
        {[0, 1, 2].map(idx => (
          <div
            onClick={() => chosenCardIdx === null && setChosenCard(idx)}
            className={'CenterChooseWidget__center-card ' + noHover}>
            {chosenCardIdx === idx ? centerImages[idx] : '?'}
          </div>
        ))}
      </div>
      <div className="CenterChooseWidget__prompt-row">
        {chosenCardIdx !== null &&
          `You saw ${centerCards[chosenCardIdx]} in the center!`}
      </div>
    </div>
  );
};

export default WerewolfNightPhase;
