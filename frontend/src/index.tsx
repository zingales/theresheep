import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import NightPhase from './NightPhase';
import DayPhase from './DayPhase';
import {createMuiTheme, ThemeProvider} from '@material-ui/core';
import {grey} from '@material-ui/core/colors';
import AppBar from '@material-ui/core/AppBar';

const App = () => {
  const [isDayPhase, setPhase] = useState<boolean>(false);
  const component = isDayPhase ? <DayPhase /> : <NightPhase />;

  useEffect(() => {
    const listener = (e: KeyboardEvent) =>
      [' ', 'q', 's'].includes(e.key) && setPhase(p => !p);
    window.addEventListener('keyup', listener);
    return () => window.removeEventListener('keyup', listener);
  }, []);

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
