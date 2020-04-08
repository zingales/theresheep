/*****************************************************************************
 **************************** Game State Types *******************************
 *****************************************************************************/
export type Role = 'werewolf' | 'villager';
export type Action =
  | 'choose who to kill'
  | 'choose center card'
  | 'swap role'
  | 'seer action';

export type PlayerId = number;

// Information to be revealed to each player when the game is over.
export type GameOverState = {
  winningTeam: 'werewolf' | 'villager' | 'tanner';
  assasinatedPerson: PlayerId;
  playerToRole: Map<PlayerId, Role>;
  playerToChosenKill: Map<PlayerId, PlayerId>;
  centerCards: Role[];
};

export type BackendState = {
  timer: number;
  originalRole: Role;
  newRole?: Role;
  pendingAction: Action | null;
  originalWerewolves: string[];
  centerCards: Role[];
  gameOver?: GameOverState;
};

/*****************************************************************************
 ******************************* Utility Types *******************************
 *****************************************************************************/

type AnyObject = {[key: string]: any};
export type FetchError<E extends AnyObject> =
  | {type: 'fetchError'}
  | {type: 'nonJsonError'; body: string}
  | {type: 'httpError'; status: number; body: E};

export type AsyncResult<T, E> =
  | {
      type: 'success';
      result: T;
    }
  | {
      type: 'pending';
    }
  | {type: 'error'; error: FetchError<E>};
