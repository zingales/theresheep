import React from 'react';
import {Role} from './types';
import werewolfImg from 'pics/werewolf.png';
import villagerImg from 'pics/villager.png';
import seerImg from 'pics/seer.png';
import robberImg from 'pics/robber.png';
import troublemakerImg from 'pics/troublemaker.png';

import drunkImg from 'pics/drunk.png';
import hunterImg from 'pics/hunter.png';
import insomniacImg from 'pics/insomniac.png';
import masonImg from 'pics/mason.png';
import minionImg from 'pics/minion.png';
import tannerImg from 'pics/tanner.png';

import {assertNever} from './utils';
import classNames from 'classnames';

import './compUtils.scss';

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
    case 'robber':
      return <img className={className} src={robberImg} alt="logo" />;
    case 'troublemaker':
      return <img className={className} src={troublemakerImg} alt="logo" />;

    case 'drunk':
      return <img className={className} src={drunkImg} alt="logo" />;
    case 'hunter':
      return <img className={className} src={hunterImg} alt="logo" />;
    case 'insomniac':
      return <img className={className} src={insomniacImg} alt="logo" />;
    case 'mason':
      return <img className={className} src={masonImg} alt="logo" />;
    case 'minion':
      return <img className={className} src={minionImg} alt="logo" />;
    case 'tanner':
      return <img className={className} src={tannerImg} alt="logo" />;
    default:
      return assertNever('Non exhaustive switch', role);
  }
};

export const getImgForRole2 = (
  currentRole: Role,
  opts?: {oldRole?: Role; className?: string},
): React.ReactNode => {
  const oldRole = opts && opts.oldRole;
  const className = opts && opts.className;

  const getImg = (role: Role, className: string) => {
    switch (role) {
      case 'villager':
        return <img className={className} src={villagerImg} alt="logo" />;
      case 'werewolf':
        return <img className={className} src={werewolfImg} alt="logo" />;
      case 'seer':
        return <img className={className} src={seerImg} alt="logo" />;
      case 'robber':
        return <img className={className} src={robberImg} alt="logo" />;
      case 'troublemaker':
        return <img className={className} src={troublemakerImg} alt="logo" />;
      case 'drunk':
        return <img className={className} src={drunkImg} alt="logo" />;
      case 'hunter':
        return <img className={className} src={hunterImg} alt="logo" />;
      case 'insomniac':
        return <img className={className} src={insomniacImg} alt="logo" />;
      case 'mason':
        return <img className={className} src={masonImg} alt="logo" />;
      case 'minion':
        return <img className={className} src={minionImg} alt="logo" />;
      case 'tanner':
        return <img className={className} src={tannerImg} alt="logo" />;
      default:
        return assertNever('Non exhaustive switch', role);
    }
  };

  return (
    <div className={'imgContainer'}>
      {oldRole && getImg(oldRole, classNames('oldRole', className))}
      {getImg(currentRole, classNames('currentRole', className))}
    </div>
  );
};
