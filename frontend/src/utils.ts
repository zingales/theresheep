import {useState, useEffect} from 'react';
import {BackendState, AsyncResult, FetchError} from './types';
import {getBackendState} from './api';

/**
 * Returns a promise that resolves in mills milliseconds
 */
const timeout = (mills: number) =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, mills);
  });

/*
 * A hook that polls the backend and reutrns an AsyncResult<BackendState>.
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
export const useBackendState = (): AsyncResult<BackendState, {}> => {
  const [backendState, setBackendState] = useState<
    AsyncResult<BackendState, {}>
  >({
    type: 'pending',
  });
  useEffect(() => {
    // using IIFE to avoid returning a Promise.
    // See https://medium.com/javascript-in-plain-english/how-to-use-async-function-in-react-hook-useeffect-typescript-js-6204a788a435
    (async () => {
      while (true) {
        try {
          const result = await getBackendState();
          setBackendState({type: 'success', result});
        } catch (untypedError) {
          const error = untypedError as FetchError<{}>;
          setBackendState({type: 'error', error});
        }
        await timeout(1000);
      }
    })();
  }, []);
  return backendState;
};

/*
 * Emits a new number n every interval milliseconds where n is the number of
 * milliseconds elapsed since useTimer rendered.
 */
export const useTimer = (interval?: number): number => {
  const [elapsedMills, setElapsed] = useState<number>(0);

  useEffect(() => {
    const startTimestamp = Date.now();
    const timer = setInterval(() => {
      if (startTimestamp === null) {
        return;
      }
      setElapsed(Math.floor(Date.now() - startTimestamp));
    }, interval || 1000);
    return () => clearInterval(timer);
  }, [interval]);

  return elapsedMills;
};

export const assertNever = (msg: string, _: never) => {
  throw new Error(msg);
};
