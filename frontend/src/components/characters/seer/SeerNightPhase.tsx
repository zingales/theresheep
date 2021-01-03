import React, {FC, useState} from 'react';
import seerImg from 'pics/seer.png';
import './SeerNightPhase.scss';
import classNames from 'classnames';
import {Button} from '@material-ui/core';
import {chooseCenterCard, choosePlayerOrCenter, choosePlayer} from 'api';
import {useParams} from 'react-router-dom';
import {State} from 'types';

const SeerNightPhase: FC<{backendState: State}> = props => {
  const {
    backendState: {allPlayers},
  } = props;

  return (
    <div className="SeerNightPhase">
      <div className="SeerNightPhase__column">
        <div className="SeerNightPhase__role">Your Role: seer</div>
        <div className="SeerNightPhase__team">Team: villager</div>
        <div className="SeerNightPhase__description">
          You're a seer. See some shit
        </div>
        <img src={seerImg} className="SeerNightPhase__image" alt="logo" />
      </div>

      <span className="SeerNightPhase__column SeerNightPhase__waiting-column">
        <CenterChooseWidget />
        <ChoosePlayerWidget playerNames={allPlayers} />
      </span>
    </div>
  );
};

type CenterChooseWidgetProps = {};

const CenterChooseWidget: FC<CenterChooseWidgetProps> = () => {
  // what i really want here is a set, but i don't think js lets me do that
  const [chosenState, setChosenState] = useState<boolean[]>([
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

  const toggleChosen = (idx: number) =>
    setChosenState(oldState => {
      const newState = [...oldState];
      newState[idx] = !newState[idx];
      return newState;
    });

  const submit = async () => {
    const indexes: number[] = [];
    for (let i = 0; i < chosenState.length; i++) {
      if (chosenState[i]) {
        indexes.push(i);
      }
    }

    if (indexes.length !== 2) {
      alert('must click on exactly 2');
      return;
    }
    await choosePlayerOrCenter(gameId, playerId, 'center');
    for (const i of indexes) {
      await chooseCenterCard(gameId, playerId, i);
    }
  };

  // TODO: I don't know how this is getting the css for CenterChooseWidget
  return (
    <div>
      <div className="CenterChooseWidget__cards-row">
        <div
          onClick={() => toggleChosen(0)}
          className={classNames('CenterChooseWidget__center-card')}>
          {chosenState[0] ? 'T' : 'F'}
        </div>
        <div
          onClick={() => toggleChosen(1)}
          className={classNames('CenterChooseWidget__center-card')}>
          {chosenState[1] ? 'T' : 'F'}
        </div>
        <div
          onClick={() => toggleChosen(2)}
          className={classNames('CenterChooseWidget__center-card')}>
          {chosenState[2] ? 'T' : 'F'}
        </div>
      </div>
      <Button onClick={submit}>Submit</Button>
    </div>
  );
};

type ChoosePlayerWidgetProps = {
  playerNames: string[];
};
const ChoosePlayerWidget: FC<ChoosePlayerWidgetProps> = props => {
  const {playerNames} = props;
  // TODO: maybe do useParams in the parent and pass it down
  const {gameId, playerId} = useParams();
  if (gameId === undefined) {
    alert('bad url, must include gameId');
    return null;
  }

  if (playerId === undefined) {
    alert('bad url, must include playerId');
    return null;
  }

  const choose = async (
    gameId: string,
    playerId: string,
    playerName: string,
  ) => {
    await choosePlayerOrCenter(gameId, playerId, 'player');
    await choosePlayer(gameId, playerId, playerName);
  };

  return (
    <ul>
      {playerNames.map((playerName, idx) => (
        <li
          key={`player-name-picker-${idx}`}
          onClick={() => choose(gameId, playerId, playerName)}>
          {playerName}
        </li>
      ))}
    </ul>
  );
};

export default SeerNightPhase;
