import React from 'react';
import ReactDOM from 'react-dom';

import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

import './index.scss';
import WerewolfNightPhase from 'components/characters/werewolf/WerewolfNightPhase';
import VillagerNightPhase from 'components/characters/villager/VillagerNightPhase';

import DayPhase from 'components/screens/DayPhase';
import CreateGame from 'components/screens/CreateGame';
import Endgame from 'components/screens/Endgame';

import {useBackendState, assertNever} from 'utils';
import {State, Phase} from 'types';

import {createMuiTheme, ThemeProvider} from '@material-ui/core';
import {grey} from '@material-ui/core/colors';
import {AppBar} from '@material-ui/core';

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
  backendState: State,
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

ReactDOM.render(<App />, document.getElementById('root'));
