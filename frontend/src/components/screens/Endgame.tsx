import React, {FC} from 'react';

import {State} from 'types';

import './Endgame.scss';

const Endgame: FC<{backendState: State}> = props => {
  // TODO:
  const {phase, allPlayers, endgame} = props.backendState;
  if (phase !== 'end' || endgame === undefined) {
    return <div style={{color: 'red'}}>Endgame called when phase isnt end</div>;
  }

  const {winner, killMap, originalRoles, currentRoles} = endgame;

  // TODO: show center
  return (
    <div className="EndGame">
      <div className="EndGame__winner">Winner: {winner}</div>
      <div className="EndGame__endgame-info-table">
        <div className="EndGame__info-row">
          <div className="EndGame__info-item"></div>
          <div className="EndGame__info-item">Killed</div>
          <div className="EndGame__info-item">Original Role</div>
          <div className="EndGame__info-item">Current Role</div>
        </div>
        {allPlayers.map(playerName => (
          <div className="EndGame__info-row">
            <div className="EndGame__info-item">{playerName}</div>
            <div className="EndGame__info-item">{killMap[playerName]}</div>
            <div className="EndGame__info-item">
              {originalRoles[playerName]}
            </div>
            <div className="EndGame__info-item">{currentRoles[playerName]}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Endgame;
