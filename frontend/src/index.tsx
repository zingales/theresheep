import React, {FC} from 'react';
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
import {BackendState, DefaultFetchError, Phase} from 'types';

import {createMuiTheme, ThemeProvider} from '@material-ui/core';
import {grey} from '@material-ui/core/colors';
import {AppBar, Button} from '@material-ui/core';

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
    try {
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

  if (backendStateAsyncResult.type === 'pending') {
    return <div>pending</div>;
  } else if (backendStateAsyncResult.type === 'error') {
    switch (backendStateAsyncResult.error.type) {
      case 'ConnectionError':
        return <div>Failed to fetch</div>;
      case 'HttpError':
        const status = backendStateAsyncResult.error.status;
        const json = backendStateAsyncResult.error.json;
        return (
          <div>
            Http Error: {status} {json.error}
          </div>
        );
      case 'NonJsonError':
        const body = backendStateAsyncResult.error.body;
        return <div>non-json error {body}</div>;
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

  const component = getMainComponent(backendState.phase, backendState);

  return (
    <div className="App">
      <AppBar color="primary" className="App__appbar " position="static">
        {backendState.phase === 'day'
          ? 'Day Phase'
          : backendState.phase === 'night'
          ? 'Night Phase'
          : backendState.phase === 'end'
          ? 'Game Over'
          : assertNever('Non exhaustive switch', backendState.phase)}
      </AppBar>
      {component}
    </div>
  );
};

const getMainComponent = (
  phase: Phase,
  backendState: BackendState,
): React.ReactNode => {
  switch (phase) {
    case 'day':
      return <DayPhase backendState={backendState} />;
    case 'night':
      const role = backendState.originalRole;
      switch (role) {
        case 'werewolf':
          return <WerewolfNightPhase backendState={backendState} />;
        case 'villager':
          return <VillagerNightPhase />;
        default:
          return assertNever('Non Exhaustive switch', role);
      }
    case 'end':
      return <Endgame backendState={backendState} />;
    default:
      assertNever('Non exhaustive switch', phase);
  }
};

const Endgame: FC<{backendState: BackendState}> = props => {
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

ReactDOM.render(<App />, document.getElementById('root'));
