import { useContext, useEffect } from "react";
import { NavigationContext, RouteContext } from "./NavigationContext";
import type { PreventRemoveCallback } from "./types";

/**
 * Prevents the screen from being removed (e.g., on goBack) when enabled.
 * The callback receives an action that can be called to force the removal.
 *
 * @example
 * usePreventRemove(hasUnsavedChanges, ({ data }) => {
 *   showAlert({
 *     content: 'Discard changes?',
 *     onConfirm: data.action,
 *   });
 * });
 */
export function usePreventRemove(
  enabled: boolean,
  callback: PreventRemoveCallback,
) {
  const navCtx = useContext(NavigationContext);
  const route = useContext(RouteContext);

  if (!navCtx || !route) {
    throw new Error("usePreventRemove must be used within a screen");
  }

  useEffect(() => {
    if (!enabled) return;

    const { preventRemoveCallbacks } = navCtx;
    preventRemoveCallbacks.current.set(route.key, callback);

    return () => {
      preventRemoveCallbacks.current.delete(route.key);
    };
  }, [enabled, callback, navCtx, route.key]);
}
