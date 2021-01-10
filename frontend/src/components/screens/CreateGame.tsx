import React from 'react';

import { useHistory } from 'react-router-dom';
import { AppBar, Button } from '@material-ui/core';

import { createNewGame, createPlayer, setRolePool, startGame } from 'api';
import { DefaultFetchError, Role } from 'types';
import { assertNever } from 'utils';

import './CreateGame.scss';

const CreateGame = () => {
  const history = useHistory();

  const createGameSequence = async () => {
    try {
      const gameId = await createNewGame();

      const rolesInGame: Role[] = [
        'werewolf',
        'seer',
        'robber',
        'troublemaker',
        'drunk',
        'hunter',
        'insomniac',
        'mason',
        'mason',
        'minion',
        'villager',
        'villager',
        'villager',
        'tanner',
        'villager',
      ];

      const playerIds = await Promise.all(
        rolesInGame
          .filter((_, idx) => idx < rolesInGame.length - 3)
          .map((_, idx) => createPlayer(gameId, `player${idx}`)),
      );

      await setRolePool(gameId, rolesInGame);
      await startGame(gameId);

      if (process.env.NODE_ENV === 'development') {
        playerIds.map((name) => {
          // window.open(`/game/${gameId}/player/${name}`);
          return null;
        });
      }
      history.push(`/game/${gameId}/`);
    } catch (untypedError) {
      const error = untypedError as DefaultFetchError;
      switch (error.type) {
        case 'ConnectionError':
          alert(`ConnectionError`);
          break;
        case 'HttpError':
          alert(`HttpError ${error.url} ${error.status} ${error.json.error}`);
          break;
        case 'NonJsonError':
          alert(`NonJsonError ${error.message}`);
          break;
        default:
          assertNever('Non exhaustive switch', error);
      }
    }
  };

  return (
    <div className="">
      <AppBar color="primary" className="App__appbar " position="static">
        Create Game
      </AppBar>

      <div className="CreateGame">
        <div className="CreateGame__box">
          <div className="CreateGame__title">Create a new game yo</div>
          <Button
            onClick={createGameSequence}
            variant="contained"
            className="CreateGame__button"
          >
            New Room
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateGame;
