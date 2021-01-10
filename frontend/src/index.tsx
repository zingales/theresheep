import React, { FC } from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import './index.scss';
import Werewolf from 'components/characters/werewolf/Werewolf';
import Villager from 'components/characters/villager/Villager';
import Seer from 'components/characters/seer/Seer';
import Robber from 'components/characters/robber/Robber';
import TroubleMaker from 'components/characters/troublemaker/TroubleMaker';
import Mason from 'components/characters/mason/Mason';
import Minion from 'components/characters/minion/Minion';
import Insomniac from 'components/characters/insomniac/Insomniac';
import Tanner from 'components/characters/tanner/Tanner';
import Drunk from 'components/characters/drunk/Drunk';
import Hunter from 'components/characters/hunter/Hunter';

import CreateGame from 'components/screens/CreateGame';
import Endgame from 'components/screens/Endgame';
import Timer from 'components/shared/Timer';
import ChooseWhoToKill from 'components/shared/ChooseWhoToKill';
import Elipsis from 'components/shared/Elipsis';

import { useBackendState, assertNever } from 'utils';
import { State, Phase } from 'types';

import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';
import { AppBar } from '@material-ui/core';
import Modal from '@material-ui/core/Modal';

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
      {backendState.phase === 'day' && (
        <DayPhaseTopBar backendState={backendState} />
      )}

      {component}

      {backendState.phase === 'end' && backendState.endgame === undefined && (
        <HunterKilledModal backendState={backendState} />
      )}
    </div>
  );
};

const HunterKilledModal: FC<{ backendState: State }> = (props) => {
  const {
    backendState: { actionPrompt, allPlayers },
  } = props;
  const waitingMessage = (
    <div>
      <div>Hunter was killed, waiting on hunter to pick player to kill</div>
      <Elipsis />
    </div>
  );
  const content =
    actionPrompt === 'blocking-nominate-who-to-kill' ? (
      <ChooseWhoToKill playerNames={allPlayers} />
    ) : (
      waitingMessage
    );
  return (
    <Modal open={true}>
      <div className="HunterKilledModal__body">{content}</div>
    </Modal>
  );
};

const DayPhaseTopBar: FC<{ backendState: State }> = (props) => {
  const {
    backendState: { phase, allPlayers },
  } = props;
  return (
    <div className="DayPhaseTopBar">
      <div className="DayPhaseTopBar__gutter" />
      <div className="DayPhaseTopBar__middle">
        {phase === 'day' && <Timer />}
      </div>

      <div className="DayPhaseTopBar__gutter">
        {phase === 'day' && <ChooseWhoToKill playerNames={allPlayers} />}
      </div>
    </div>
  );
};

const getMainComponent = (
  phase: Phase,
  backendState: State,
): React.ReactNode => {
  const { endgame } = backendState;
  if (phase === 'end' && endgame !== undefined) {
    return <Endgame backendState={backendState} />;
  }

  const role = backendState.originalRole;
  switch (role) {
    case 'werewolf':
      return <Werewolf backendState={backendState} />;
    case 'villager':
      return <Villager backendState={backendState} />;
    case 'tanner':
      return <Tanner backendState={backendState} />;
    case 'seer':
      return <Seer backendState={backendState} />;
    case 'robber':
      return <Robber backendState={backendState} />;
    case 'troublemaker':
      return <TroubleMaker backendState={backendState} />;
    case 'mason':
      return <Mason backendState={backendState} />;
    case 'minion':
      return <Minion backendState={backendState} />;
    case 'insomniac':
      return <Insomniac backendState={backendState} />;
    case 'drunk':
      return <Drunk backendState={backendState} />;
    case 'hunter':
      return <Hunter backendState={backendState} />;
    default:
      return assertNever(`Unkonwn role ${role}`, role);
  }
};

ReactDOM.render(<App />, document.getElementById('root'));
