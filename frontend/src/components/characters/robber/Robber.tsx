import React, {FC, useState} from 'react';
import robberImg from 'pics/robber.png';
import './Robber.scss';
import {choosePlayer} from 'api';
import {useParams} from 'react-router-dom';
import {State} from 'types';
import PlayersList from '../../shared/PlayersList';
import {getImgForRole} from 'compUtils';
// import CenterChooseWidget from '../../shared/CenterChooseWidget';
import ActionSubmitButton from '../../shared/ActionSubmitButton';
import classNames from 'classnames';

const Robber: FC<{backendState: State}> = props => {
  const {
    backendState: {allPlayers, knownPlayers, name, originalRole, actionPrompt},
    backendState,
  } = props;

  const [playerSelectedState, setPlayerSelectedState] = useState<{
    [playerName: string]: boolean;
  }>({});

  const switchedPlayer: string | undefined = Object.keys(knownPlayers)[0];

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
    const playerChosenCount = Object.entries(playerSelectedState).filter(
      ([_, isSelected]) => isSelected,
    ).length;

    if (playerChosenCount !== 1) {
      alert('must choose exactly 1 player');
      return;
    }

    const [playerName] = Object.entries(playerSelectedState).find(
      ([_, isSelected]) => isSelected,
    )!;

    await choosePlayer(gameId, playerId, playerName);
  };

  // const [centerChosenState, setCenterChosenState] = useState<boolean[]>([
  //   false,
  //   false,
  //   false,
  // ]);

  // const {gameId, playerId} = useParams();
  // if (gameId === undefined) {
  //   alert('bad url, must include gameId');
  //   return null;
  // }

  // if (playerId === undefined) {
  //   alert('bad url, must include playerId');
  //   return null;
  // }

  const allPlayersToRoles = Object.fromEntries(
    allPlayers
      .filter(playerName => playerName !== name)
      .map(playerName => [playerName, knownPlayers[playerName] || null]),
  );

  // const submit = async () => {
  //   const playerChosenCount = Object.entries(playerSelectedState).filter(
  //     ([_, isSelected]) => isSelected,
  //   ).length;
  //   const somePlayerIsChosen = playerChosenCount > 0;

  //   const centerChosenIndexes: number[] = [];
  //   for (let i = 0; i < centerChosenState.length; i++) {
  //     if (centerChosenState[i]) {
  //       centerChosenIndexes.push(i);
  //     }
  //   }

  //   const someCenterCardIsChosen = centerChosenIndexes.length > 0;

  //   const exactlyOneOfCenterOrPlayerIsChosen =
  //     (someCenterCardIsChosen && !somePlayerIsChosen) ||
  //     (!someCenterCardIsChosen && somePlayerIsChosen);

  //   if (!exactlyOneOfCenterOrPlayerIsChosen) {
  //     alert('Must only click cards in center OR click players');
  //     return;
  //   }

  //   if (someCenterCardIsChosen) {
  //     if (centerChosenIndexes.length !== 2) {
  //       alert('must click on exactly 2 center cards');
  //       return;
  //     }

  //     await choosePlayerOrCenter(gameId, playerId, 'center');
  //     for (const i of centerChosenIndexes) {
  //       await chooseCenterCard(gameId, playerId, i);
  //     }
  //   } else {
  //     if (playerChosenCount !== 1) {
  //       alert('must choose exactly 1 player');
  //       return;
  //     }

  //     const [playerName] = Object.entries(playerSelectedState).find(
  //       ([_, isSelected]) => isSelected,
  //     )!;

  //     await choosePlayerOrCenter(gameId, playerId, 'player');
  //     await choosePlayer(gameId, playerId, playerName);
  //   }
  // };

  const roleChanged = backendState.originalRole != backendState.currentRole;
  return (
    <div className="Robber">
      <div className="Robber__column">
        <div className="Robber__role">
          Your Role:{' '}
          <span className={classNames(roleChanged && 'Robber__role--changed')}>
            robber
          </span>
          {roleChanged && ` ${backendState.currentRole}`}
        </div>
        <div className="Robber__team">Team: villager</div>
        <div className="Robber__description">
          You're a robber. Rob some shit
        </div>
        <div>
          <img
            src={robberImg}
            className={classNames(
              'Robber__image',
              roleChanged && 'Robber__image--oldRole',
            )}
            alt="logo"
          />
          {roleChanged &&
            getImgForRole(backendState.currentRole, 'Robber__image')}
        </div>
      </div>

      <span className="Robber__column Robber__waiting-column">
        <PlayersList
          players={allPlayersToRoles}
          currentPlayer={{name, roleToDisplay: originalRole}}
          selectedState={playerSelectedState}
          setSelectedState={setPlayerSelectedState}
          fadedPlayers={[switchedPlayer]}
        />

        {backendState.phase === 'night' && (
          <ActionSubmitButton onClick={submit} actionPrompt={actionPrompt} />
        )}
      </span>
    </div>
  );
};

export default Robber;
