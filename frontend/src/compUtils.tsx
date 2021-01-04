import React from 'react';
import {Role} from './types';
import werewolfImg from 'pics/werewolf.png';
import villagerImg from 'pics/villager.png';
import seerImg from 'pics/seer.png';

import {assertNever} from './utils';

export const getImgForRole = (
  role: Role,
  className?: string,
): React.ReactNode => {
  switch (role) {
    case 'villager':
      return <img className={className} src={villagerImg} alt="logo" />;
    case 'werewolf':
      return <img className={className} src={werewolfImg} alt="logo" />;
    case 'seer':
      return <img className={className} src={seerImg} alt="logo" />;
    default:
      return assertNever('Non exhaustive switch', role);
  }
};
