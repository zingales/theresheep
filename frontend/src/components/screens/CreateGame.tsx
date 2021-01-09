import React from 'react';

import {useHistory} from 'react-router-dom';
import {AppBar, Button} from '@material-ui/core';

import {createNewGame, createPlayer, setRolePool, startGame} from 'api';
import {DefaultFetchError} from 'types';
import {assertNever} from 'utils';

import './CreateGame.scss';

const CreateGame = () => {
  const history = useHistory();
  const createGameSequence = async () => {
    try {
      const gameId = await createNewGame();
      const player1Id = await createPlayer(gameId, 'Adrian');
      const player2Id = await createPlayer(gameId, 'G');
      const player3Id = await createPlayer(gameId, 'Evan');

      await setRolePool(gameId, [
        'troublemaker',
        'werewolf',
        'drunk',
        'troublemaker',
        'robber',
        'robber',
      ]);
      await startGame(gameId);
      history.push(`/game/${gameId}/player/${player1Id}`);
      if (process.env.NODE_ENV === 'development') {
        window.open(`/game/${gameId}/player/${player2Id}`);
        window.open(`/game/${gameId}/player/${player3Id}`);
      }
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
            className="CreateGame__button">
            New game
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateGame;
