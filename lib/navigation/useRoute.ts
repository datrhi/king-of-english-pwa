import { useContext } from "react";
import { RouteContext } from "./NavigationContext";

export function useRoute<
  T extends Record<string, string> = Record<string, string>,
>() {
  const route = useContext(RouteContext);
  if (!route) {
    throw new Error("useRoute must be used within a screen");
  }
  return { ...route, params: (route.params ?? {}) as T };
}
