import React, { FC } from 'react';
import './Insomniac.scss';
import { useParams } from 'react-router-dom';
import { State } from 'types';
import CharacterDisplay from 'components/shared/CharacterDisplay';
import classNames from 'classnames';
import PlayersList from '../../shared/PlayersList';

const Insomniac: FC<{ backendState: State }> = (props) => {
  const {
    backendState: { allPlayers, name, knownPlayers, originalRole },
  } = props;

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

  const currentRole = Object.values(knownPlayers)[0] || 'insomniac';
  const roleChanged = originalRole !== currentRole;

  const allPlayersToRoles = Object.fromEntries(
    allPlayers
      .filter((playerName) => playerName !== name)
      .map((playerName) => [playerName, knownPlayers[playerName] || null]),
  );

  return (
    <div className="Insomniac">
      <div className="Insomniac__column">
        <div className="Insomniac__role">
          Your Role:{' '}
          <span
            className={classNames(roleChanged && 'Insomniac__role--changed')}
          >
            insomniac
          </span>
          {roleChanged && ` ${currentRole}`}
        </div>
        <div className="Insomniac__team">Team: villager</div>
        <div className="Insomniac__description">You're a insomniac.</div>
        <CharacterDisplay
          currentRole={currentRole}
          oldRole={roleChanged ? originalRole : undefined}
          className={'Insomniac__image'}
        />
      </div>
      <span className="Insomniac__column Insomniac__waiting-column">
        <PlayersList players={allPlayersToRoles} />
      </span>
    </div>
  );
};

export default Insomniac;
