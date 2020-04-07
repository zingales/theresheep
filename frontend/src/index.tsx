import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom';

import './index.scss';
import WerewolfNightPhase from './villager/VillagerNightPhase';
import WerewolfDayPhase from './werewolf/WerewolfDayPhase';
import {useBackendState, assertNever} from './utils';

import {createMuiTheme, ThemeProvider} from '@material-ui/core';
import {grey} from '@material-ui/core/colors';
import AppBar from '@material-ui/core/AppBar';

const App = () => {
  const backendStateAsyncResult = useBackendState();
  const [isWerewolfDayPhase, setPhase] = useState<boolean>(false);
  useEffect(() => {
    const listener = (e: KeyboardEvent) =>
      [' ', 'q', 's'].includes(e.key) && setPhase(p => !p);
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
        assertNever(
          'Non Exhaustive switch statement',
          backendStateAsyncResult.error,
        );
        // TODO: why is this return null necessary? shouldn't typescript
        // exhaustive switching work?
        return null;
    }
  }
  const backendState = backendStateAsyncResult.result;

  const component = isWerewolfDayPhase ? (
    <WerewolfDayPhase />
  ) : (
    <WerewolfNightPhase />
  );

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
            {isWerewolfDayPhase ? 'Day Phase' : 'Night Phase'}
          </AppBar>
          {component}
        </div>
      </React.StrictMode>
    </ThemeProvider>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
