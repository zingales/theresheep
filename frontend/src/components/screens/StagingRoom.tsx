import React, { FC, useState } from 'react';

// import {useHistory} from 'react-router-dom';
import { AppBar, Button } from '@material-ui/core';
import { useRollPool } from 'utils';

import {
  createNewGame,
  createPlayer,
  getRolePool,
  setRolePool,
  startGame,
} from 'api';
import { DefaultFetchError, Role, State, RoleCountMap } from 'types';
import Input from '@material-ui/core/Input';
import TextField from '@material-ui/core/TextField';
import { SupportedRoles, usePlayerNames } from 'utils';

import './StagingRoom.scss';
import { useParams } from 'react-router-dom';
import { keys } from '@material-ui/core/styles/createBreakpoints';
import { resolveTripleslashReference } from 'typescript';

const StagingRoom: FC = () => {
  // getRolePool;
  // Required State:
  //   1. The current Roles in this rolepool
  //   2. the current players in this game.

  const { gameId } = useParams<{
    gameId: string;
  }>();

  const rolePoolState = useRollPool();

  const playerNames = usePlayerNames();

  const [addPlayerNameText, setAddPlayerNameText] = useState<string>('');
  const [roleInputValues, setRoleInputValues] = useState<RoleCountMap>(
    rolePoolState,
  );

  const addPlayer = (event: any) => {
    createPlayer(gameId, addPlayerNameText);
    setAddPlayerNameText('');
  };

  const updateRolePoolSubmit = () => {
    // createPlayer(gameId, addPlayerNameText);
    var rolesInGame: Role[] = [];

    for (let [key, value] of Object.entries(roleInputValues)) {
      rolesInGame.push(...Array(value).fill(key));
    }
    setRolePool(gameId, rolesInGame);
  };

  return (
    <div className="">
      <AppBar color="primary" className="App__appbar " position="static">
        Game Setup
      </AppBar>
      <div className="StagingRoom">
        <div className="StagingRoom">
          <div className="StagingRoom__title"></div>
          <div className="StagingRoom__column">
            <div className="StagingRoom__info-table">
              <div className="">select roles</div>
              <div className="StagingRoom__info-row">
                <div className="StagingRoom__info-item"></div>
                <div className="StagingRoom__info-item">Role</div>
                <div className="StagingRoom__info-item">Current Count</div>
                <div className="StagingRoom__info-item">Updated</div>
              </div>
              {Object.entries(rolePoolState).map(([roleName, count]) => (
                <div className="StagingRoom__info-row">
                  <div className="StagingRoom__info-item">{roleName}</div>
                  <div className="StagingRoom__info-item">{count}</div>
                  <div className="StagingRoom__info-item">
                    <TextField
                      id={roleName}
                      label="Number"
                      type="number"
                      value={roleInputValues[roleName as Role]}
                      onChange={(event) => {
                        const value = parseInt(event.target.value);
                        setRoleInputValues((oldRoleInputValues) => {
                          const newInput = { ...oldRoleInputValues };
                          newInput[roleName as Role] = value;
                          return newInput;
                        });
                      }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </div>
                </div>
              ))}
              <div className="StagingRoom__info-row">
                <div className="StagingRoom__info-item"></div>
                <div className="StagingRoom__info-item"></div>
                <div className="StagingRoom__info-item">
                  <Button
                    onClick={updateRolePoolSubmit}
                    className="StagingRoom__button"
                    variant="contained"
                  >
                    Update Role Pool
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="StagingRoom__column">
            <div className="StagingRoom__info-table">
              <span className="">List of currrent players</span>
              <div className="StagingRoom__info-row">
                <div className="StagingRoom__info-item"></div>
                <div className="StagingRoom__info-item">Name</div>
              </div>
              {playerNames.map((playerName) => (
                <div className="StagingRoom__info-row">
                  <div className="StagingRoom__info-item">{playerName}</div>
                </div>
              ))}
              <div className="StagingRoom__info-row">
                <div className="StagingRoom__info-item">
                  <Input
                    placeholder="Player Name"
                    inputProps={{ 'aria-label': 'description' }}
                    value={addPlayerNameText}
                    onChange={(event) => {
                      setAddPlayerNameText(event.target.value);
                    }}
                  />
                </div>
                <Button
                  onClick={addPlayer}
                  className="StagingRoom__button"
                  variant="contained"
                >
                  Add Player
                </Button>
              </div>
            </div>
          </div>
          <div className="StagingRoom__column">
            <Button
              onClick={() => startGame(gameId)}
              variant="contained"
              className="StagingRoom__button"
            >
              Start Game
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StagingRoom;
