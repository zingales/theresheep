import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import NightPhase from './NightPhase';
import DayPhase from './DayPhase';
import * as serviceWorker from './serviceWorker';

const App = () => {
  const [isDayPhase, setPhase] = useState<boolean>(true);
  const component = isDayPhase ? <DayPhase /> : <NightPhase />;

  useEffect(() => {
    const listener = (e: KeyboardEvent) =>
      [' ', 'q', 's'].includes(e.key) && setPhase(p => !p);
    window.addEventListener('keyup', listener);
  }, []);

  return (
    <React.StrictMode>
      <div>{component}</div>
    </React.StrictMode>
  );
};

ReactDOM.render(
  <App />,

  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
