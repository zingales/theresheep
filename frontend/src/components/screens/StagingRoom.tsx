import React, { FC } from 'react';

// import {useHistory} from 'react-router-dom';
import { AppBar, Button } from '@material-ui/core';

import { createNewGame, createPlayer, setRolePool, startGame } from 'api';
import { DefaultFetchError, Role, State } from 'types';
import Input from '@material-ui/core/Input';
import TextField from '@material-ui/core/TextField';
import { SupportedRoles } from 'utils';

import './StagingRoom.scss';

const StagingRoom: FC = () => {
  // getRolePool;
  // Required State:
  //   1. The current Roles in this rolepool
  //   2. the current players in this game.

  const supportedRoles = SupportedRoles;

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
                <div className="StagingRoom__info-item">Number In Game</div>
              </div>
              {supportedRoles.map((roleName) => (
                <div className="StagingRoom__info-row">
                  <div className="StagingRoom__info-item">{roleName}</div>
                  <div className="StagingRoom__info-item">
                    <TextField
                      id="standard-number"
                      label="Number"
                      type="number"
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="StagingRoom__column">
            <div className="StagingRoom__info-table">
              <span className="">List of currrent players</span>
              <div className="StagingRoom__info-row">
                <div className="StagingRoom__info-item"></div>
                <div className="StagingRoom__info-item">Name</div>
              </div>
              {[].map((playerName) => (
                <div className="StagingRoom__info-row">
                  <div className="StagingRoom__info-item">{playerName}</div>
                </div>
              ))}
              <div className="StagingRoom__info-row">
                <div className="StagingRoom__info-item">
                  <Input
                    placeholder="Player Name"
                    inputProps={{ 'aria-label': 'description' }}
                  />
                </div>
                <Button className="StagingRoom__button" variant="contained">
                  Add Player
                </Button>
              </div>
            </div>
          </div>
          <div className="StagingRoom__column">
            <Button
              // onClick={}
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
