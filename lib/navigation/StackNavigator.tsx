"use client";

import { useAtomValue, useSetAtom } from "jotai";
import { useCallback, useContext } from "react";
import { NavigationContext } from "./NavigationContext";
import { navigationStateAtom, transitionStateAtom } from "./navigation-store";
import { ScreenWrapper } from "./ScreenWrapper";

export function StackNavigator() {
  const navCtx = useContext(NavigationContext);
  if (!navCtx) {
    throw new Error("StackNavigator must be used within NavigationContainer");
  }

  const { screenRegistry, screenOptions, goBack } = navCtx;
  const navState = useAtomValue(navigationStateAtom);
  const transition = useAtomValue(transitionStateAtom);
  const setTransition = useSetAtom(transitionStateAtom);

  const clearExitingRoute = useCallback(
    (key: string) => {
      setTransition((prev) => {
        const remaining = prev.exitingRoutes.filter((r) => r.key !== key);
        return {
          type: remaining.length === 0 ? "none" : prev.type,
          exitingRoutes: remaining,
        };
      });
    },
    [setTransition],
  );

  const handleGestureBack = useCallback(() => {
    goBack({ skipTransition: true });
  }, [goBack]);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {navState.routes.map((route, index) => {
        const Component = screenRegistry[route.name];
        if (!Component) return null;

        const isActive = index === navState.index;
        const isEntering =
          transition.type === "push" && index === navState.index;

        return (
          <ScreenWrapper
            key={route.key}
            route={route}
            isActive={isActive}
            zIndex={index}
            isEntering={isEntering}
            isExiting={false}
            Component={Component}
            options={screenOptions[route.name]}
            onGestureBack={handleGestureBack}
          />
        );
      })}

      {transition.exitingRoutes.map((route) => {
        const Component = screenRegistry[route.name];
        if (!Component) return null;

        return (
          <ScreenWrapper
            key={route.key}
            route={route}
            isActive={false}
            zIndex={navState.routes.length + 1}
            isEntering={false}
            isExiting={true}
            onExitComplete={() => clearExitingRoute(route.key)}
            Component={Component}
            options={screenOptions[route.name]}
          />
        );
      })}
    </div>
  );
}
