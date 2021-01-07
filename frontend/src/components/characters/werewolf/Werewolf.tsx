import React, {FC, useState} from 'react';
import './Werewolf.scss';
import {State} from 'types';
import {Button} from '@material-ui/core';
import {getImgForRole} from 'compUtils';
import classNames from 'classnames';
import {useParams} from 'react-router-dom';
import CenterChooseWidget from '../../shared/CenterChooseWidget';
import {chooseCenterCard, choosePlayerOrCenter, choosePlayer} from 'api';
import ActionSubmitButton from '../../shared/ActionSubmitButton';

import werewolfImg from 'pics/werewolf.png';

const Werewolf: FC<{backendState: State}> = props => {
  const {
    backendState: {knownPlayers, center, phase, actionPrompt},
  } = props;

  const [centerChosenState, setCenterChosenState] = useState<boolean[]>([
    false,
    false,
    false,
  ]);

  const {gameId, playerId} = useParams();
  if (gameId === undefined) {
    alert('bad url, must include gameId');
    return null;
  }

  if (playerId === undefined) {
    alert('bad url, must include playerId');
    return null;
  }

  const submit = async () => {
    const centerChosenIndexes: number[] = [];
    for (let i = 0; i < centerChosenState.length; i++) {
      if (centerChosenState[i]) {
        centerChosenIndexes.push(i);
      }
    }

    if (centerChosenIndexes.length !== 1) {
      alert('must click on exactly 1 center cards');
      return;
    }

    await chooseCenterCard(gameId, playerId, centerChosenIndexes[0]);
  };

  const originalWerewolves = Object.entries(knownPlayers)
    .filter(([, role]) => role === 'werewolf')
    .map(([name]) => name);

  const showCenterWidget = originalWerewolves.length === 0;

  return (
    <div className="Werewolf">
      <div className="Werewolf__column">
        <div className="Werewolf__role">Your Role: werewolf</div>
        <div className="Werewolf__team">Team: werewolf</div>
        <div className="Werewolf__description">
          At night, all Werewolves open their eyes and look for other
          werewolves. If no one else opens their eyes, the other Werewolves are
          in the center. Werewolves are on the werewolf team.
        </div>
        <img src={werewolfImg} className="Werewolf__image" alt="logo" />
      </div>
      <div className="Werewolf__column">
        <div className="Werewolf__box">
          <div className="Werewolf__box-header">
            {showCenterWidget
              ? 'Choose card from center'
              : 'Your werewolves are'}
          </div>
          {showCenterWidget ? (
            <CenterChooseWidget
              chosenState={centerChosenState}
              setChosenState={setCenterChosenState}
              center={center}
            />
          ) : (
            originalWerewolves.map((name, idx) => (
              <div
                key={`original-werewolf-${idx}`}
                className="Werewolf__list-item">
                {name}
              </div>
            ))
          )}

          {phase === 'night' && (
            <ActionSubmitButton onClick={submit} actionPrompt={actionPrompt} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Werewolf;
