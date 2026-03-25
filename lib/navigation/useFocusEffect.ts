import { useAtomValue } from "jotai";
import { useEffect } from "react";
import { activeRouteAtom } from "./navigation-store";
import { useRoute } from "./useRoute";

/**
 * Runs an effect when the screen is focused, and cleans up when blurred.
 * The callback should be wrapped in useCallback, just like React Navigation.
 *
 * @example
 * useFocusEffect(
 *   useCallback(() => {
 *     console.log('Screen focused');
 *     return () => console.log('Screen blurred');
 *   }, [])
 * );
 */
export function useFocusEffect(effect: () => void | (() => void)) {
  const route = useRoute();
  const activeRoute = useAtomValue(activeRouteAtom);
  const isFocused = activeRoute?.key === route.key;

  useEffect(() => {
    if (isFocused) {
      const cleanup = effect();
      return typeof cleanup === "function" ? cleanup : undefined;
    }
  }, [isFocused, effect]);
}
