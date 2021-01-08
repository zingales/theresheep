import React, {FC, useState} from 'react';
import robberImg from 'pics/robber.png';
import './Robber.scss';
import {choosePlayer} from 'api';
import {useParams} from 'react-router-dom';
import {State} from 'types';
import PlayersList from '../../shared/PlayersList';
import {getImgForRole} from 'compUtils';
import ActionSubmitButton from '../../shared/ActionSubmitButton';
import classNames from 'classnames';

const Robber: FC<{backendState: State}> = props => {
  const {
    backendState: {allPlayers, knownPlayers, name, actionPrompt},
    backendState,
  } = props;

  const [playerSelectedState, setPlayerSelectedState] = useState<{
    [playerName: string]: boolean;
  }>({});

  const switchedPlayer: string | undefined = Object.keys(knownPlayers)[0];

  const {gameId, playerId} = useParams<{gameId: string; playerId: string}>();
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

  const allPlayersToRoles = Object.fromEntries(
    allPlayers
      .filter(playerName => playerName !== name)
      .map(playerName => [playerName, knownPlayers[playerName] || null]),
  );

  const currentRole = Object.values(backendState.knownPlayers)[0] || 'robber';
  const roleChanged = backendState.originalRole !== currentRole;

  return (
    <div className="Robber">
      <div className="Robber__column">
        <div className="Robber__role">
          Your Role:{' '}
          <span className={classNames(roleChanged && 'Robber__role--changed')}>
            robber
          </span>
          {roleChanged && ` ${currentRole}`}
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
            getImgForRole(currentRole, 'Robber__image')}
        </div>
      </div>

      <span className="Robber__column Robber__waiting-column">
        <PlayersList
          players={allPlayersToRoles}
          selectedState={playerSelectedState}
          setSelectedState={setPlayerSelectedState}
          playerOverride={
            switchedPlayer === undefined
              ? undefined
              : {[switchedPlayer]: 'robber'}
          }
        />

        {backendState.phase === 'night' && (
          <ActionSubmitButton onClick={submit} actionPrompt={actionPrompt} />
        )}
      </span>
    </div>
  );
};

export default Robber;
