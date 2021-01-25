import React, { FC, useState } from 'react';
import './Drunk.scss';
import { State } from 'types';
import { useParams } from 'react-router-dom';
import CenterChooseWidget from 'components/shared/CenterChooseWidget';
import { chooseCenterCard } from 'api';
import ActionSubmitButton from 'components/shared/ActionSubmitButton';
import PlayersList from 'components/shared/PlayersList';
import CharacterDisplay from 'components/shared/CharacterDisplay';

const Drunk: FC<{ backendState: State }> = (props) => {
  const {
    backendState: {
      center,
      phase,
      actionPrompt,
      allPlayers,
      name,
      knownPlayers,
    },
  } = props;

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

  const allPlayersToRoles = Object.fromEntries(
    allPlayers
      .filter((playerName) => playerName !== name)
      .map((playerName) => [playerName, knownPlayers[playerName] || null]),
  );

  return (
    <div className="Drunk">
      <div className="Drunk__column">
        <div className="Drunk__role">Your Role: drunk</div>
        <div className="Drunk__team">Team: villager</div>
        <div className="Drunk__description">
          Switch a random card with the center.
        </div>
        <CharacterDisplay currentRole={'drunk'} className={'Drunk__image'} />
      </div>
      <div className="Drunk__column">
        <div className="Drunk__box">
          <div className="Drunk__box-header">
            Choose a card to switch from the center
          </div>
          <CenterChooseWidget
            chosenState={centerChosenState}
            setChosenState={setCenterChosenState}
            center={center}
          />

          {phase === 'night' && (
            <ActionSubmitButton onClick={submit} actionPrompt={actionPrompt} />
          )}
          {phase === 'day' && (
            <PlayersList
              players={allPlayersToRoles}
              numToSelect={actionPrompt !== '' ? 1 : 0}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Drunk;
