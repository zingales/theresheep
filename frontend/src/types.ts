/*****************************************************************************
 **************************** Game State Types *******************************
 *****************************************************************************/
export type Role = 'werewolf' | 'villager';

export type ActionPrompt =
  | 'choose-center-card'
  | 'choose-player'
  | 'choose-player-instead-of-center'
  | ''; // indicates no action is expected

// state as it comes in from backend. This is different from State as
// this state gets "massaged" into something more palatable for the frontend.
// Specifically hasSeen gets changed
export type StateFromBackend = {
  player: {
    name: string;
    originalRole: Role;
    hasSeen: {[x: string]: Role};
    actionPrompt: ActionPrompt;
  };
  phase: Phase;
  allPlayers: string[];
  endgame?: {
    winner: string;
    killMap: {[player: string]: string};
    originalRoles: {[player: string]: Role};
    currentRoles: {[player: string]: Role};
  };
};

export type Phase = 'day' | 'night' | 'end';

export type State = {
  name: string; // name of this player
  allPlayers: string[];
  originalRole: Role;
  knownPlayers: {[playerName: string]: Role};
  center: (Role | null)[];
  actionPrompt: ActionPrompt;
  phase: Phase;

  endgame?: {
    winner: string;
    killMap: {[player: string]: string};
    originalRoles: {[player: string]: Role};
    currentRoles: {[player: string]: Role};
  };
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
