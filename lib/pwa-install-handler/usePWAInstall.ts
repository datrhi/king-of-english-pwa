import { useCallback, useSyncExternalStore } from "react";
import { pwaInstallHandler } from "./pwaInstallHandler";

export const usePWAInstall: () => (() => Promise<boolean>) | null = () => {
  const subscribe = useCallback((onStoreChange: () => void) => {
    pwaInstallHandler.addListener(onStoreChange);
    return () => {
      pwaInstallHandler.removeListener(onStoreChange);
    };
  }, []);
  const getSnapshot = useCallback(
    () => (pwaInstallHandler.canInstall() ? pwaInstallHandler.install : null),
    []
  );
  const getServerSnapshot = useCallback(() => null, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
};
