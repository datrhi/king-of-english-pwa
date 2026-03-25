"use client";

import { useAtomValue, useSetAtom } from "jotai";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  NavigationContext,
  type NavigationContextValue,
} from "./NavigationContext";
import {
  navigationStateAtom,
  transitionStateAtom,
} from "./navigation-store";
import { StackNavigator } from "./StackNavigator";
import { getInitialRoute, syncUrlToState } from "./url-sync";
import type { NavigationContainerProps, PreventRemoveCallback } from "./types";

export function NavigationContainer({
  screens,
  initialRouteName,
  initialParams,
  screenOptions = {},
  onStateChange,
}: NavigationContainerProps) {
  const setNavState = useSetAtom(navigationStateAtom);
  const setTransition = useSetAtom(transitionStateAtom);
  const navState = useAtomValue(navigationStateAtom);

  const navStateRef = useRef(navState);
  navStateRef.current = navState;

  const preventRemoveCallbacks = useRef(
    new Map<string, PreventRemoveCallback>(),
  );

  const [isReady, setIsReady] = useState(false);

  useLayoutEffect(() => {
    if (isReady) return;

    const initialRoute = getInitialRoute(initialRouteName);

    if (!screens[initialRoute.name]) {
      initialRoute.name = initialRouteName;
      initialRoute.params = initialParams;
    }

    setNavState({ routes: [initialRoute], index: 0 });
    setIsReady(true);
  }, [isReady, screens, initialRouteName, initialParams, setNavState]);

  useEffect(() => {
    if (navState.index >= 0) {
      syncUrlToState(navState);
      onStateChange?.(navState);
    }
  }, [navState, onStateChange]);

  const goBack = useCallback(
    (options?: { skipTransition?: boolean }) => {
      const current = navStateRef.current;
      if (current.index <= 0) return;

      const exitingRoute = current.routes[current.index];

      const preventCallback = preventRemoveCallbacks.current.get(
        exitingRoute.key,
      );
      if (preventCallback) {
        const forceBack = () => {
          preventRemoveCallbacks.current.delete(exitingRoute.key);
          goBack(options);
        };
        preventCallback({ data: { action: forceBack } });
        return;
      }

      if (!options?.skipTransition) {
        setTransition({ type: "pop", exitingRoutes: [exitingRoute] });
      }

      setNavState((prev) => ({
        routes: prev.routes.slice(0, prev.index),
        index: prev.index - 1,
      }));
    },
    [setNavState, setTransition],
  );

  const contextValue = useMemo<NavigationContextValue>(
    () => ({
      screenRegistry: screens,
      screenOptions,
      preventRemoveCallbacks,
      goBack,
    }),
    [screens, screenOptions, goBack],
  );

  if (!isReady) return null;

  return (
    <NavigationContext.Provider value={contextValue}>
      <StackNavigator />
    </NavigationContext.Provider>
  );
}
