import React from 'react';
import './Tanner.scss';
import Elipsis from 'components/shared/Elipsis';
import { getImgForRole } from 'compUtils';


const Tanner = () => {
  return (
    <div className="Tanner">
      <div className="Tanner__column">
        <div className="Tanner__role">Your Role: tanner</div>
        <div className="Tanner__team">Team: tanner</div>
        <div className="Tanner__description">
          You're sole mission is to be nominated to be killed by the town. Cause you are weird like that. 
        </div>
        {getImgForRole('tanner', "Tanner__image")}
      </div>

      <span className="Tanner__column Tanner__waiting-column">
        <span>
          Waiting for other characters to finish their actions. Nothing for you
          to do
          <Elipsis />
        </span>
      </span>
    </div>
  );
};

export default Tanner;
