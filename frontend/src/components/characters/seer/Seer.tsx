import React, { FC, useState } from 'react';
import './Seer.scss';
import { chooseCenterCard, choosePlayerOrCenter, choosePlayer } from 'api';
import { useParams } from 'react-router-dom';
import { State } from 'types';
import PlayersList from 'components/shared/PlayersList';
import CenterChooseWidget from 'components/shared/CenterChooseWidget';
import ActionSubmitButton from 'components/shared/ActionSubmitButton';
import CharacterDisplay from 'components/shared/CharacterDisplay';

const Seer: FC<{ backendState: State }> = (props) => {
  const {
    backendState: { allPlayers, knownPlayers, name, center, actionPrompt },
    backendState,
  } = props;

  const [playerSelectedState, setPlayerSelectedState] = useState<{
    [playerName: string]: boolean;
  }>({});

  const [centerChosenState, setCenterChosenState] = useState<boolean[]>([
    false,
    false,
    false,
  ]);

  const { gameId, playerId } = useParams<{
    gameId: string;
    playerId: string;
  }>();
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
      .filter((playerName) => playerName !== name)
      .map((playerName) => [playerName, knownPlayers[playerName] || null]),
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
    <div className="Seer">
      <div className="Seer__column">
        <div className="Seer__role">Your Role: seer</div>
        <div className="Seer__team">Team: villager</div>
        <div className="Seer__description">You're a seer. See some shit</div>
        <CharacterDisplay currentRole={'seer'} className={'Seer__image'} />
      </div>

      <span className="Seer__column">
        <div className="Seer__box-header">Choose card from the center</div>
        <CenterChooseWidget
          chosenState={centerChosenState}
          setChosenState={setCenterChosenState}
          center={center}
        />
        <div className="Seer__box-header">Choose who to switch</div>
        <PlayersList
          players={allPlayersToRoles}
          selectedState={playerSelectedState}
          setSelectedState={setPlayerSelectedState}
        />

        {backendState.phase === 'night' && (
          <ActionSubmitButton onClick={submit} actionPrompt={actionPrompt} />
        )}
      </span>
    </div>
  );
};

export default Seer;
