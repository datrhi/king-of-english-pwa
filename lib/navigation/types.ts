import type { ComponentType } from "react";

export type Route = {
  key: string;
  name: string;
  params?: Record<string, string>;
};

export type NavigationState = {
  routes: Route[];
  index: number;
};

export type TransitionType = "push" | "pop" | "replace" | "reset" | "none";

export type TransitionState = {
  type: TransitionType;
  exitingRoutes: Route[];
};

export type ScreenComponent = ComponentType<object>;

export type ScreenRegistry = Record<string, ScreenComponent>;

export type NavigationOptions = {
  title?: string;
  headerShown?: boolean;
  animation?: "slide" | "fade" | "none";
  gestureEnabled?: boolean;
};

export type ScreenOptionsMap = Record<string, NavigationOptions | undefined>;

export type PreventRemoveCallback = (args: {
  data: { action: () => void };
}) => void;

export type NavigationContainerProps = {
  screens: ScreenRegistry;
  initialRouteName: string;
  initialParams?: Record<string, string>;
  screenOptions?: ScreenOptionsMap;
  onStateChange?: (state: NavigationState) => void;
};

export type ParamListBase = Record<
  string,
  Record<string, string | undefined> | undefined
>;
