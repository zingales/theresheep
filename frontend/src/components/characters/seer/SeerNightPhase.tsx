import React, {FC, useState} from 'react';
import seerImg from 'pics/seer.png';
import './SeerNightPhase.scss';
import classNames from 'classnames';
import {Button} from '@material-ui/core';
import {chooseCenterCard, choosePlayerOrCenter, choosePlayer} from 'api';
import {useParams} from 'react-router-dom';
import {State} from 'types';
import PlayersList from '../../shared/PlayersList';

const SeerNightPhase: FC<{backendState: State}> = props => {
  const {
    backendState: {allPlayers, knownPlayers, name, originalRole},
  } = props;

  const [playerSelectedState, setPlayerSelectedState] = useState<{
    [playerName: string]: boolean;
  }>({});

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

  const allPlayersToRoles = Object.fromEntries(
    allPlayers
      .filter(playerName => playerName !== name)
      .map(playerName => [playerName, knownPlayers[playerName] || null]),
  );

  const submit = async () => {
    const playerChosenCount = Object.entries(playerSelectedState).filter(
      ([_, isSelected]) => isSelected,
    ).length;
    const somePlayerIsChosen = playerChosenCount > 0;

    const centerChosenIndexes: number[] = [];
    for (let i = 0; i < centerChosenState.length; i++) {
      if (centerChosenState[i]) {
        centerChosenIndexes.push(i);
      }
    }

    const someCenterCardIsChosen = centerChosenIndexes.length > 0;

    const exactlyOneOfCenterOrPlayerIsChosen =
      (someCenterCardIsChosen && !somePlayerIsChosen) ||
      (!someCenterCardIsChosen && somePlayerIsChosen);

    if (!exactlyOneOfCenterOrPlayerIsChosen) {
      alert('Must only click cards in center OR click players');
      return;
    }

    if (someCenterCardIsChosen) {
      if (centerChosenIndexes.length !== 2) {
        alert('must click on exactly 2 center cards');
        return;
      }

      await choosePlayerOrCenter(gameId, playerId, 'center');
      for (const i of centerChosenIndexes) {
        await chooseCenterCard(gameId, playerId, i);
      }
    } else {
      if (playerChosenCount !== 1) {
        alert('must choose exactly 1 player');
        return;
      }

      const [playerName] = Object.entries(playerSelectedState).find(
        ([_, isSelected]) => isSelected,
      )!;

      await choosePlayerOrCenter(gameId, playerId, 'player');
      await choosePlayer(gameId, playerId, playerName);
    }
  };

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
        <CenterChooseWidget
          chosenState={centerChosenState}
          setChosenState={setCenterChosenState}
        />
        {/* <ChoosePlayerWidget playerNames={allPlayers} /> */}
        <PlayersList
          players={allPlayersToRoles}
          currentPlayer={{name, roleToDisplay: originalRole}}
          selectedState={playerSelectedState}
          setSelectedState={setPlayerSelectedState}
        />

        <Button onClick={submit}>Submit</Button>
      </span>
    </div>
  );
};

type CenterChooseWidgetProps = {
  chosenState: boolean[];
  setChosenState: React.Dispatch<React.SetStateAction<boolean[]>>;
};

const CenterChooseWidget: FC<CenterChooseWidgetProps> = props => {
  // what i really want here is a set, but i don't think js lets me do that
  const {chosenState, setChosenState} = props;

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
    </div>
  );
};

export default SeerNightPhase;
