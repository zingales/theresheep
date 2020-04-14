/*****************************************************************************
 **************************** Game State Types *******************************
 *****************************************************************************/
export type Role = 'werewolf' | 'villager';

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
  // timer: number;
  originalRole: Role;
  newRole?: Role;
  // pendingAction: Action | null;
  originalWerewolves: string[];
  centerCards: Role[];
  // gameOver?: GameOverState;
};

/*****************************************************************************
 ******************************* Utility Types *******************************
 *****************************************************************************/

type AnyObject = {[key: string]: any};

export class ConnectionError extends Error {
  type: 'ConnectionError' = 'ConnectionError';
  constructor(url: string) {
    super(`ConnectionError url::${url}`);
  }
}

export class NonJsonError extends Error {
  type: 'NonJsonError' = 'NonJsonError';
  body: string;
  constructor(body: string) {
    super(`NonJsonError :: ${body}`);
    this.body = body;
  }
}

export class HttpError<E extends AnyObject> extends Error {
  type: 'HttpError' = 'HttpError';
  status: number;
  url: string;
  json: E;
  constructor(url: string, status: number, json: E) {
    super(`HttpError url :: ${url} status :: ${status} body :: ${json}`);
    this.url = url;
    this.status = status;
    this.json = json;
  }
}

export type FetchError<E> = ConnectionError | NonJsonError | HttpError<E>;

export type DefaultFetchError = FetchError<{error: string}>;

export type AsyncResult<T> = AsyncResultWithErr<T, DefaultFetchError>;

export type AsyncResultWithErr<T, E extends FetchError<any>> =
  | {
      type: 'success';
      result: T;
    }
  | {
      type: 'pending';
    }
  | {type: 'error'; error: E};
