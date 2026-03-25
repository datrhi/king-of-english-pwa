import { atom } from "jotai";
import type { NavigationState, Route, TransitionState } from "./types";

export const navigationStateAtom = atom<NavigationState>({
  routes: [],
  index: -1,
});

export const transitionStateAtom = atom<TransitionState>({
  type: "none",
  exitingRoutes: [],
});

export const activeRouteAtom = atom<Route | null>((get) => {
  const { routes, index } = get(navigationStateAtom);
  return index >= 0 && index < routes.length ? routes[index] : null;
});

export const canGoBackAtom = atom<boolean>((get) => {
  return get(navigationStateAtom).index > 0;
});

let keyCounter = 0;
export const generateRouteKey = (): string => `screen-${++keyCounter}`;
