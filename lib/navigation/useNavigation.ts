import { useAtomValue, useSetAtom } from "jotai";
import { useCallback, useContext, useRef } from "react";
import { NavigationContext } from "./NavigationContext";
import {
  canGoBackAtom,
  generateRouteKey,
  navigationStateAtom,
  transitionStateAtom,
} from "./navigation-store";
import type { Route } from "./types";

export function useNavigation() {
  const ctx = useContext(NavigationContext);
  if (!ctx) {
    throw new Error("useNavigation must be used within a NavigationContainer");
  }

  const setNavState = useSetAtom(navigationStateAtom);
  const setTransition = useSetAtom(transitionStateAtom);
  const navState = useAtomValue(navigationStateAtom);
  const canGoBack = useAtomValue(canGoBackAtom);

  const navStateRef = useRef(navState);
  navStateRef.current = navState;

  const { goBack: contextGoBack } = ctx;

  const push = useCallback(
    (name: string, params?: Record<string, string>) => {
      const newRoute: Route = { key: generateRouteKey(), name, params };

      setTransition({ type: "push", exitingRoutes: [] });
      setNavState((prev) => ({
        routes: [...prev.routes.slice(0, prev.index + 1), newRoute],
        index: prev.index + 1,
      }));
    },
    [setNavState, setTransition],
  );

  const goBack = useCallback(
    (options?: { skipTransition?: boolean }) => {
      contextGoBack(options);
    },
    [contextGoBack],
  );

  const pop = useCallback(
    (count: number = 1) => {
      const current = navStateRef.current;
      if (current.index < count) return;

      const exitingRoutes = current.routes.slice(
        current.index - count + 1,
        current.index + 1,
      );

      setTransition({ type: "pop", exitingRoutes });
      setNavState((prev) => ({
        routes: prev.routes.slice(0, prev.index - count + 1),
        index: prev.index - count,
      }));
    },
    [setNavState, setTransition],
  );

  const replace = useCallback(
    (name: string, params?: Record<string, string>) => {
      const newRoute: Route = { key: generateRouteKey(), name, params };

      setTransition({ type: "replace", exitingRoutes: [] });
      setNavState((prev) => {
        const newRoutes = [...prev.routes];
        newRoutes[prev.index] = newRoute;
        return { routes: newRoutes, index: prev.index };
      });
    },
    [setNavState, setTransition],
  );

  const navigate = useCallback(
    (name: string, params?: Record<string, string>) => {
      const current = navStateRef.current;
      const existingIndex = current.routes.findIndex((r) => r.name === name);

      if (existingIndex >= 0 && existingIndex <= current.index) {
        const exitingRoutes = current.routes.slice(
          existingIndex + 1,
          current.index + 1,
        );
        const updatedRoute: Route = {
          ...current.routes[existingIndex],
          params: params ?? current.routes[existingIndex].params,
        };

        setTransition({ type: "pop", exitingRoutes });
        setNavState(() => {
          const newRoutes = current.routes.slice(0, existingIndex + 1);
          newRoutes[existingIndex] = updatedRoute;
          return { routes: newRoutes, index: existingIndex };
        });
      } else {
        push(name, params);
      }
    },
    [push, setNavState, setTransition],
  );

  const reset = useCallback(
    (config: {
      routes: { name: string; params?: Record<string, string> }[];
    }) => {
      const newRoutes: Route[] = config.routes.map((r) => ({
        key: generateRouteKey(),
        name: r.name,
        params: r.params,
      }));

      setTransition({ type: "reset", exitingRoutes: [] });
      setNavState({ routes: newRoutes, index: newRoutes.length - 1 });
    },
    [setNavState, setTransition],
  );

  return { push, goBack, pop, replace, navigate, reset, canGoBack };
}
