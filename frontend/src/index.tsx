import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory,
} from 'react-router-dom';

import './index.scss';
import WerewolfNightPhase from './werewolf/WerewolfNightPhase';
import VillagerNightPhase from './villager/VillagerNightPhase';
import DayPhase from './DayPhase';
import {useBackendState, assertNever} from './utils';
import {createNewGame, createPlayer, setRolePool, startGame} from './api';
import {BackendState} from 'types';

import {createMuiTheme, ThemeProvider} from '@material-ui/core';
import {grey} from '@material-ui/core/colors';
import {AppBar, Button} from '@material-ui/core';

type Phase = 'day' | 'night';
const App = () => {
  const theme = createMuiTheme({
    palette: {
      primary: grey,
      secondary: grey,
    },
  });
  return (
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <Router>
          <Switch>
            <Route exact path="/">
              <CreateGame />
            </Route>
            <Route path="/createGame">
              <CreateGame />
            </Route>
            <Route strict path="/game/:gameId/player/:playerId">
              <Game />
            </Route>
          </Switch>
        </Router>
      </ThemeProvider>
    </React.StrictMode>
  );
};

const CreateGame = () => {
  const history = useHistory();
  const createGameSequence = async () => {
    const gameId = await createNewGame();

    // TODO: Promise.all this
    const player1Id = await createPlayer(gameId, 'player 1');
    await createPlayer(gameId, 'player 2');
    await createPlayer(gameId, 'player 3');

    await setRolePool(gameId, [
      'werewolf',
      'werewolf',
      'villager',
      'villager',
      'villager',
      'villager',
    ]);
    await startGame(gameId);
    history.push(`/game/${gameId}/player/${player1Id}`);
  };
  return (
    <div className="App">
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

const Game = () => {
  const backendStateAsyncResult = useBackendState();
  const [phase, setPhase] = useState<Phase>('night');
  useEffect(() => {
    const listener = (e: KeyboardEvent) =>
      [' ', 'q', 's'].includes(e.key) &&
      setPhase(p => (p === 'day' ? 'night' : 'day'));
    window.addEventListener('keyup', listener);
    return () => window.removeEventListener('keyup', listener);
  }, []);

  if (backendStateAsyncResult.type === 'pending') {
    return <div>pending</div>;
  } else if (backendStateAsyncResult.type === 'error') {
    switch (backendStateAsyncResult.error.type) {
      case 'ConnectionError':
        return <div>Failed to fetch</div>;
      case 'HttpError': {
        const status = backendStateAsyncResult.error.status;
        const json = backendStateAsyncResult.error.json;
        return (
          <div>
            Http Error: {status} {json}
          </div>
        );
      }
      case 'NonJsonError': {
        const body = backendStateAsyncResult.error.body;
        return <div>non-json error "{body}"</div>;
      }
      default:
        // why do i have to return assertNever? Why can't I just assertNever?
        // https://github.com/microsoft/TypeScript/issues/10470
        return assertNever(
          'Non Exhaustive switch statement',
          backendStateAsyncResult.error,
        );
    }
  }
  const backendState = backendStateAsyncResult.result;

  const component = getComponent(phase, backendState);

  return (
    <div className="App">
      <AppBar color="primary" className="App__appbar " position="static">
        {phase === 'day' ? 'Day Phase' : 'Night Phase'}
      </AppBar>
      {component}
    </div>
  );
};

const getComponent = (
  phase: Phase,
  backendState: BackendState,
): JSX.Element => {
  if (phase === 'day') {
    return <DayPhase />;
  }
  const role = backendState.originalRole;

  switch (role) {
    case 'werewolf':
      return <WerewolfNightPhase backendState={backendState} />;
    case 'villager':
      return <VillagerNightPhase />;
  }
};

ReactDOM.render(<App />, document.getElementById('root'));
