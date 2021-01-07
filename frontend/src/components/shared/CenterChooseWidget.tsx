import React, {FC} from 'react';
import './CenterChooseWidget.scss';
import {Role} from '../../types';
import {useParams} from 'react-router-dom';
import {getImgForRole} from '../../compUtils';
import classNames from 'classnames';

type CenterChooseWidgetProps = {
  chosenState: boolean[];
  setChosenState: React.Dispatch<React.SetStateAction<boolean[]>>;
  center: (Role | null)[];
};

const CenterChooseWidget: FC<CenterChooseWidgetProps> = props => {
  // what i really want here is a set, but i don't think js lets me do that
  const {chosenState, setChosenState, center} = props;

  const {gameId, playerId} = useParams();
  if (gameId === undefined) {
    alert('bad url, must include gameId');
    return null;
  }

  if (playerId === undefined) {
    alert('bad url, must include playerId');
    return null;
  }

  const toggleChosen = (idx: number) =>
    setChosenState(oldState => {
      const newState = [...oldState];
      newState[idx] = !newState[idx];
      return newState;
    });

  return (
    <div>
      <div className="CenterChooseWidget__cards-row">
        <>
          {center.map((role, idx) => (
            <div
              onClick={() => toggleChosen(idx)}
              className={classNames(
                'CenterChooseWidget__center-card',
                chosenState[idx] && 'CenterChooseWidget__center-card--border',
              )}>
              {role === null
                ? '?'
                : getImgForRole(
                    role,
                    'CenterChooseWidget__center-card no-hover',
                  )}
            </div>
          ))}
        </>
      </div>
    </div>
  );
};

export default CenterChooseWidget;
