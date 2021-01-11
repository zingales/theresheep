import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { State, AsyncResult, DefaultFetchError, Role, RoleCountMap} from './types';
import { getBackendState, getRolePool, getPlayerNames} from './api';


/*
 * A hook that polls the backend and reutrns an AsyncResult<State>.
 * Before the first response returns this hook will return {type: 'pending'}.
 * After that this hook will cause a rerender in the calling component every
 * time a request returns. Either {type: 'success'} if the poll was successful
 * or {type: 'error'} if the poll was unsuccessful
 *
 * TODO: In the future it may be useful for this hook to cache the last successful
 * response in a ref so that it can ...
 * 1. Check the last response against the most recent response and avoid
 * calling setState (and causing a rerender) if the state is identical
 * 2. Continue returning the last successful response in the case of an error
 * so the calling component can continue displaying reasonable information
 */
export const useBackendState = (): AsyncResult<State> => {
  const { gameId, playerId } = useParams<{
    gameId: string;
    playerId: string;
  }>();
  const [backendState, setBackendState] = useState<AsyncResult<State>>({
    type: 'pending',
  });

  useEffect(() => {
    if (gameId === undefined || playerId === undefined) {
      // TODO: do something better with this
      return;
    }

    const interval = setInterval(async () => {
      try {
        const result = await getBackendState(gameId, playerId);
        setBackendState({ type: 'success', result });
      } catch (untypedError) {
        const error = untypedError as DefaultFetchError;
        setBackendState({ type: 'error', error });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [gameId, playerId]);
  return backendState;
};

export const usePlayerNames = (): string[] => {
  const { gameId} = useParams<{
    gameId: string;
  }>();

  const [playerNames, setPlayerNames] = useState<string[]>([]);

  useEffect(() => {

    const interval = setInterval(async () => {
      if (gameId === undefined) {
        return;
      }
      try {
        const playerNames = await getPlayerNames(gameId);
        setPlayerNames(playerNames);
      } catch (untypedError) {
        console.error(untypedError);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [gameId]);


  return playerNames;
}


export const useRollPool = (): RoleCountMap => {
  const { gameId} = useParams<{
    gameId: string;
  }>();

    const zeroMap = Object.fromEntries(SupportedRoles.map((role) => {
      return [role, 0];
    }));

  const [roleStateMap, setRoleStateMap] = useState<RoleCountMap>(zeroMap);

  useEffect(() => {
    if (gameId === undefined) {
      return;
    }
    const interval = setInterval(async () => {
      try {
        const result = await getRolePool(gameId);
        setRoleStateMap(result);
      } catch (untypedError) {
        console.error(untypedError);
        // setRoleStateMap(zeroMap);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [gameId])
  return roleStateMap
};

export const assertNever = (msg: string, _: never) => {
  throw new Error(msg);
};

export const SupportedRoles: ReadonlyArray<Role> =
   [
  'villager',
  'werewolf',
  'seer',
  'robber',
  'troublemaker',
  'drunk',
  'hunter',
  'insomniac',
  'mason',
  'minion',
  'tanner',
] as const
;
