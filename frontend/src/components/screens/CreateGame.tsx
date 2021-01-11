import React from 'react';

import { useHistory } from 'react-router-dom';
import { AppBar, Button } from '@material-ui/core';

import { createNewGame } from 'api';
import { DefaultFetchError } from 'types';
import { assertNever } from 'utils';

import './CreateGame.scss';

const CreateGame = () => {
  const history = useHistory();

  const createGameSequence = async () => {
    try {
      const gameId = await createNewGame();

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
