import {BackendState, Role, PlayerId} from './types';

export type BackendHttpError = {
  status: number;
  error: string;
};

export async function req<T>(path: string, options?: RequestInit): Promise<T> {
  // TODO: errors won't always be http error
  // TODO: even if error is http error, FE should verify that it's formatted in
  // the expected way {type: ..., error: ...}
  // TODO: this window.location hacking is dirty

  const modifiedOptions = {
    headers: {
      Accept: 'application/json',
      ...options['headers'],
    },
    ...options,
  };

  const url = `${window.location.protocol}//${window.location.hostname}:8000${path}`;
  const resp = await fetch(url, modifiedOptions);
  if (resp.ok) {
    const respJson = (await (resp.json() as unknown)) as T;
    return respJson;
  } else {
    const respJson = await resp.json();
    throw {
      status: resp.status,
      error: respJson.error,
    };
  }
}

export const getState = async (): Promise<BackendState> =>
  await req<BackendState>(`/get-state/`);

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
