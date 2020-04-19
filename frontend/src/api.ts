import {
  BackendState,
  ConnectionError,
  NonJsonError,
  HttpError,
  StateFromBackend,
} from './types';

/*
 * Send an http request. Throws errors of type FetchError. Annoying typescript
 * can't keep track of error types, so callers of this method (or callers of
 * callers of this method) must try {...} catch(error) {...} and cast error to
 * type FetchError<E>
 */
export async function req<T>(path: string, options?: RequestInit): Promise<T> {
  // TODO: errors won't always be http error
  // TODO: even if error is http error, FE should verify that it's formatted in
  // the expected way {type: ..., error: ...}
  // TODO: this window.location hacking is dirty

  const modifiedOptions = {
    headers: {
      Accept: 'application/json',
      ...(options || {})['headers'],
    },
    ...options,
  };

  const url = `${window.location.protocol}//${window.location.hostname}:8090${path}`;
  let resp: Response;
  try {
    resp = await fetch(url, modifiedOptions);
  } catch (error) {
    throw new ConnectionError(url);
  }

  if (resp.ok) {
    const text = await resp.text();
    try {
      const respJson = JSON.parse(text);
      return respJson;
    } catch (error) {
      throw new NonJsonError(text);
    }
  } else {
    const respJson = await resp.json();
    throw new HttpError(url, resp.status, respJson);
  }
}

export const createNewGame = async () => {
  const {id} = await req<{id: string}>('/api/games', {method: 'POST'});
  return id;
};

export const createPlayer = async (gameId: string, name: string) => {
  const {id} = await req<{id: string}>(`/api/games/${gameId}/players`, {
    method: 'POST',
    body: JSON.stringify({name}),
  });
  return id;
};

export const startGame = async (gameId: string) =>
  await req<{}>(`/api/games/${gameId}/start`, {
    method: 'POST',
  });

export const setRolePool = async (gameId: string, roles: string[]) =>
  await req<{}>(`/api/games/${gameId}/role_pool`, {
    method: 'PUT',
    body: JSON.stringify({roles}),
  });

export const getBackendState = async (
  gameId: string,
  playerId: string,
): Promise<BackendState> => {
  const {player: stateFromBackend} = await req<StateFromBackend>(
    `/api/games/${gameId}/players/${playerId}`,
  );

  type HasSeen = StateFromBackend['player']['hasSeen'];
  type ParseHasSeenRetType = {
    knownPlayers: BackendState['knownPlayers'];
    center: BackendState['center'];
  };
  const parseHasSeen = (hasSeen: HasSeen): ParseHasSeenRetType => {
    let center: BackendState['center'] = [null, null, null];
    let knownPlayers: BackendState['knownPlayers'] = {};

    for (const [key, value] of Object.entries(hasSeen)) {
      const match = key.match(/Center_(\d+)/);
      if (match !== null) {
        const n = Number(match[1]);
        if (n < 0 || n > 2 || Number.isNaN(n)) {
          throw new Error(
            `Unexpected center value from backend ${n} for key ${key} ` +
              `in map hasSeen ${JSON.stringify(hasSeen)}`,
          );
        }
        center[n] = value;
      } else {
        knownPlayers[key] = value;
      }
    }

    // if (Object.entries(hasSeen).length > 0) {
    //   debugger;
    // }

    return {center, knownPlayers};
  };

  const {center, knownPlayers} = parseHasSeen(stateFromBackend.hasSeen);
  const backendState = {
    ...stateFromBackend,
    center,
    knownPlayers,
  };

  return backendState;
};

export const chooseCenterCard = async (
  gameId: string,
  playerId: string,
  cardIdx: number,
): Promise<{}> => {
  const body = JSON.stringify({
    actionType: 'choose-center-card',
    action: cardIdx,
  });
  return await req<{}>(`/api/games/${gameId}/player/${playerId}/do_action`, {
    method: 'POST',
    body,
  });
};

export const swapRole = async (player1: string, player2: string): Promise<{}> =>
  await req<{}>(`swap-role`, {
    method: 'POST',
    body: JSON.stringify({player1, player2}),
  });
