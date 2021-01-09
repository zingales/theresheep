import React, {FC} from 'react';
import './Insomniac.scss';
import {useParams} from 'react-router-dom';
import {State} from 'types';
import {getImgForRole} from 'compUtils';
import classNames from 'classnames';

const Insomniac: FC<{backendState: State}> = props => {
  const {
    backendState: {knownPlayers, originalRole},
  } = props;

  const {gameId, playerId} = useParams<{gameId: string; playerId: string}>();
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

  return (
    <div className="Insomniac">
      <div className="Insomniac__column">
        <div className="Insomniac__role">
          Your Role:{' '}
          <span className={classNames(roleChanged && 'Insomniac__role--changed')}>
            insomniac
          </span>
          {roleChanged && ` ${currentRole}`}
        </div>
        <div className="Insomniac__team">Team: villager</div>
        <div className="Insomniac__description">
          You're a insomniac. Rob some shit
        </div>
        <div>
          {getImgForRole('insomniac', classNames(
              'Insomniac__image',
              roleChanged && 'Insomniac__image--oldRole',
            ))}
          {roleChanged &&
            getImgForRole(currentRole, 'Insomniac__image')}
        </div>
      </div>
    </div>
  );
};

export default Insomniac;
