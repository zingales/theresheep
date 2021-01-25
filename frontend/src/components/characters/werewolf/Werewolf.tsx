import React, { FC, useState } from 'react';
import './Werewolf.scss';
import { State } from 'types';
import { useParams } from 'react-router-dom';
import CenterChooseWidget from 'components/shared/CenterChooseWidget';
import { chooseCenterCard } from 'api';
import ActionSubmitButton from 'components/shared/ActionSubmitButton';
import CharacterDisplay from 'components/shared/CharacterDisplay';
import PlayersList from 'components/shared/PlayersList';

const Werewolf: FC<{ backendState: State }> = (props) => {
  const {
    backendState: {
      allPlayers,
      name,
      knownPlayers,
      center,
      phase,
      actionPrompt,
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

  const originalWerewolves = Object.entries(knownPlayers)
    .filter(([, role]) => role === 'werewolf')
    .map(([name]) => name);

  const allPlayersToRoles = Object.fromEntries(
    allPlayers
      .filter((playerName) => playerName !== name)
      .map((playerName) => [playerName, knownPlayers[playerName] || null]),
  );

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
        <CharacterDisplay
          currentRole={'werewolf'}
          className={'Werewolf__image'}
        />
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
            <PlayersList players={allPlayersToRoles} />
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
