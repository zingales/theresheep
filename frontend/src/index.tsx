import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom';

import './index.scss';
import NightPhase from './NightPhase';
import DayPhase from './DayPhase';
import {useBackendState, assertNever} from './utils';

import {createMuiTheme, ThemeProvider} from '@material-ui/core';
import {grey} from '@material-ui/core/colors';
import AppBar from '@material-ui/core/AppBar';

// const App = () => null;
const App = () => {
  const backendStateAsyncResult = useBackendState();
  const [isDayPhase, setPhase] = useState<boolean>(false);
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
        return null;
    }
  }
  const backendState = backendStateAsyncResult.result;

  const component = isDayPhase ? <DayPhase /> : <NightPhase />;

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
            {isDayPhase ? 'Day Phase' : 'Night Phase'}
          </AppBar>
          {component}
        </div>
      </React.StrictMode>
    </ThemeProvider>
  );
};

ReactDOM.render(
  <App />,

  document.getElementById('root'),
);
