import { DEFAULT_PARAMS, type AppParams } from './types';

type Listener = (state: AppParams, prev: AppParams) => void;

let state: AppParams = { ...DEFAULT_PARAMS };
const listeners = new Set<Listener>();

export function getState(): AppParams {
  return state;
}

export function setState(partial: Partial<AppParams>): AppParams {
  const prev = state;
  state = { ...state, ...partial };
  for (const fn of listeners) fn(state, prev);
  return state;
}

export function resetState(): AppParams {
  return setState({ ...DEFAULT_PARAMS });
}

export function subscribe(fn: Listener): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
