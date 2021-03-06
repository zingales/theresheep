import React, { FC, useState } from 'react';
import './TroubleMaker.scss';
import { State } from 'types';
import { useParams } from 'react-router-dom';
import PlayersList from 'components/shared/PlayersList';
import { choosePlayer } from 'api';
import ActionSubmitButton from 'components/shared/ActionSubmitButton';
import CharacterDisplay from 'components/shared/CharacterDisplay';

const TroubleMaker: FC<{ backendState: State }> = (props) => {
  const {
    backendState: { knownPlayers, phase, actionPrompt, allPlayers, name },
  } = props;

  const [playerSelectedState, setPlayerSelectedState] = useState<{
    [playerName: string]: boolean;
  }>({});

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

  const otherPlayersToRoles = Object.fromEntries(
    allPlayers
      .filter((playerName) => playerName !== name)
      .map((playerName) => [playerName, knownPlayers[playerName] || null]),
  );

  const submit = async () => {
    const playerChosenCount = Object.entries(playerSelectedState).filter(
      ([_, isSelected]) => isSelected,
    ).length;
    if (playerChosenCount !== 2) {
      alert('must choose exactly 2 players');
      return;
    }

    // should have a guarauntee here that the next line returns an array of
    // size exactly 2
    const [player1, player2] = Object.entries(playerSelectedState)
      .filter(([_, isSelected]) => isSelected)
      .map(([playerName]) => playerName);
    await choosePlayer(gameId, playerId, player1);
    await choosePlayer(gameId, playerId, player2);
  };

  return (
    <div className="TroubleMaker">
      <div className="TroubleMaker__column">
        <div className="TroubleMaker__role">Your Role: troublemaker</div>
        <div className="TroubleMaker__team">Team: villager</div>
        <div className="TroubleMaker__description">
          At night, all Werewolves open their eyes and look for other
          werewolves. If no one else opens their eyes, the other Werewolves are
          in the center. Werewolves are on the werewolf team.
        </div>
        <CharacterDisplay
          currentRole={'troublemaker'}
          className={'TroubleMaker__image'}
        />
      </div>
      <div className="TroubleMaker__column">
        <div className="TroubleMaker__box">
          <div className="TroubleMaker__box-header">Choose who to switch</div>
          {
            <PlayersList
              players={otherPlayersToRoles}
              selectedState={playerSelectedState}
              setSelectedState={setPlayerSelectedState}
            />
          }

          {phase === 'night' && (
            <ActionSubmitButton onClick={submit} actionPrompt={actionPrompt} />
          )}
        </div>
      </div>
    </div>
  );
};

export default TroubleMaker;
