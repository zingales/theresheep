import {
  BackendState,
  Role,
  PlayerId,
  ConnectionError,
  NonJsonError,
  HttpError,
  FetchError,
} from './types';

/*
 * Send an http request. Throws errors of type FetchError. Annoying typescript
 * can't keep track of error types, so callers of this method (or callers of
 * callers of this method) must try {...} catch(error) {...} and cast error to
 * type FetchError<E>
 *
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
    throw new HttpError(resp.status, respJson);
  }
}

export const getBackendState = async (): Promise<BackendState> =>
  await req<BackendState>(`/get-state`);

export const chooseWhoToKill = async (): Promise<{}> =>
  await req<{}>(`/choose-who-to-kill`, {method: 'POST'});

export const chooseCenterCard = async (
  cardIdx: number,
): Promise<{role: Role}> =>
  await req<{role: Role}>(`/choose-center-card`, {
    method: 'PUT',
    body: JSON.stringify({cardIdx}),
  });

export const swapRole = async (
  player1: PlayerId,
  player2: PlayerId,
): Promise<{}> =>
  await req<{}>(`swap-role`, {
    method: 'POST',
    body: JSON.stringify({player1, player2}),
  });
