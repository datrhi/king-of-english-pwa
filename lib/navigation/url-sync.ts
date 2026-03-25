import { generateRouteKey } from "./navigation-store";
import type { NavigationState, Route } from "./types";

export function parseUrlToRoute(url: URL, defaultScreen: string): Route {
  const allParams = Object.fromEntries(url.searchParams.entries());
  const screen = allParams.screen || defaultScreen;
  delete allParams.screen;

  const params = Object.keys(allParams).length > 0 ? allParams : undefined;

  return {
    key: generateRouteKey(),
    name: screen,
    params,
  };
}

export function routeToSearchParams(route: Route): URLSearchParams {
  const params = new URLSearchParams();
  params.set("screen", route.name);

  if (route.params) {
    for (const [key, value] of Object.entries(route.params)) {
      if (value !== undefined) {
        params.set(key, value);
      }
    }
  }

  return params;
}

export function syncUrlToState(state: NavigationState): void {
  if (typeof window === "undefined") return;

  const activeRoute = state.routes[state.index];
  if (!activeRoute) return;

  const params = routeToSearchParams(activeRoute);
  const newUrl = `${window.location.pathname}?${params.toString()}`;

  window.history.replaceState(
    {
      navigationState: {
        index: state.index,
        routeCount: state.routes.length,
      },
    },
    "",
    newUrl,
  );
}

export function getInitialRoute(defaultScreen: string): Route {
  if (typeof window === "undefined") {
    return { key: generateRouteKey(), name: defaultScreen };
  }

  return parseUrlToRoute(new URL(window.location.href), defaultScreen);
}
