import { createContext, type MutableRefObject } from "react";
import type {
  NavigationOptions,
  PreventRemoveCallback,
  Route,
  ScreenRegistry,
} from "./types";

export type NavigationContextValue = {
  screenRegistry: ScreenRegistry;
  screenOptions: Record<string, NavigationOptions | undefined>;
  preventRemoveCallbacks: MutableRefObject<Map<string, PreventRemoveCallback>>;
  goBack: (options?: { skipTransition?: boolean }) => void;
};

export const NavigationContext =
  createContext<NavigationContextValue | null>(null);

export type RouteContextValue = Route;

export const RouteContext = createContext<RouteContextValue | null>(null);
