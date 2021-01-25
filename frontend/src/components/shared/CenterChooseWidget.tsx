import React, { FC } from 'react';
import './CenterChooseWidget.scss';
import { Role } from 'types';
import { useParams } from 'react-router-dom';
import CharacterDisplay from './CharacterDisplay';
import classNames from 'classnames';

type CenterChooseWidgetProps = {
  chosenState: boolean[];
  setChosenState: React.Dispatch<React.SetStateAction<boolean[]>>;
  center: (Role | null)[];
  numToSelect: number;
};

const CenterChooseWidget: FC<CenterChooseWidgetProps> = (props) => {
  const { chosenState, setChosenState, center, numToSelect } = props;

  const { gameId, playerId } = useParams<{
    gameId: string;
    playerId: string;
  }>();
  if (gameId === undefined) {
    alert('bad url, must include gameId');
    return null;
  }

  if (playerId === undefined) {
    alert('bad url, must include playerId');
    return null;
  }

  const toggleChosen = (idx: number) => {
    if (numToSelect === 0) {
      return;
    }
    setChosenState((oldState) => {
      const newState = [...oldState];
      newState[idx] = !newState[idx];
      const numChosen = newState.filter((x) => x).length;
      if (numChosen > numToSelect) {
        const idxToUnselect = newState
          .map((val, idx2) => [val, idx2] as const)
          .filter(([val, idx2]) => val && idx2 !== idx)
          .map(([, idx2]) => idx2)[0];
        newState[idxToUnselect] = false;
      }
      return newState;
    });
  };

  return (
    <div>
      <div className="CenterChooseWidget__cards-row">
        <>
          {center.map((role, idx) => (
            <div
              onClick={() => toggleChosen(idx)}
              className={classNames(
                'CenterChooseWidget__center-card',
                numToSelect > 0 && 'CenterChooseWidget__center-card--hover',
                chosenState[idx] && 'CenterChooseWidget__center-card--border',
              )}
            >
              {role === null ? (
                '?'
              ) : (
                <CharacterDisplay
                  currentRole={role}
                  className={classNames('CenterChooseWidget__center-card')}
                />
              )}
            </div>
          ))}
        </>
      </div>
    </div>
  );
};

export default CenterChooseWidget;
