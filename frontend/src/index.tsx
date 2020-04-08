import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom';

import './index.scss';
import WerewolfNightPhase from './werewolf/WerewolfNightPhase';
import VillagerNightPhase from './villager/VillagerNightPhase';
import DayPhase from './DayPhase';
import {useBackendState, assertNever} from './utils';
import {Role, BackendState} from 'types';

import {createMuiTheme, ThemeProvider} from '@material-ui/core';
import {grey} from '@material-ui/core/colors';
import AppBar from '@material-ui/core/AppBar';

type Phase = 'day' | 'night';
const App = () => {
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
      case 'fetchError':
        return <div>Failed to fetch</div>;
      case 'httpError': {
        const {status, body} = backendStateAsyncResult.error;
        return (
          <div>
            Http Error: {status} {body}
          </div>
        );
      }
      case 'nonJsonError': {
        const {body} = backendStateAsyncResult.error;
        return <div>non-json error "{body}"</div>;
      }
      default:
        // TODO: why do i have to return assertNever? Why can't I just
        // assertNever?
        // https://github.com/microsoft/TypeScript/issues/10470
        return assertNever(
          'Non Exhaustive switch statement',
          backendStateAsyncResult.error,
        );
    }
  }
  const backendState = backendStateAsyncResult.result;

  const component = getComponent(phase, backendState);

  const theme = createMuiTheme({
    palette: {
      primary: grey,
      secondary: grey,
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <React.StrictMode>
        <div className="App">
          <AppBar color="primary" className="App__appbar " position="static">
            {phase === 'day' ? 'Day Phase' : 'Night Phase'}
          </AppBar>
          {component}
        </div>
      </React.StrictMode>
    </ThemeProvider>
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
