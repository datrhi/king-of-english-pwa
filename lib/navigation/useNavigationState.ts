import { useAtomValue } from "jotai";
import { navigationStateAtom } from "./navigation-store";

export function useNavigationState() {
  return useAtomValue(navigationStateAtom);
}
