import type { Dispatch, SetStateAction } from "react";
import { createContext, use, useEffect, useState } from "react";

// import { useBrowserNativeTransitions } from './browser-native-events'

const ViewTransitionsContext = createContext<{
  setFinishViewTransition: Dispatch<SetStateAction<null | (() => void)>>;
  setHistory: Dispatch<SetStateAction<string[]>>;
  history: string[];
}>({
  setFinishViewTransition: () => {},
  setHistory: () => {},
  history: [],
});

export function ViewTransitions({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [finishViewTransition, setFinishViewTransition] = useState<
    null | (() => void)
  >(null);

  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    if (finishViewTransition) {
      finishViewTransition();
      setFinishViewTransition(null);
    }
  }, [finishViewTransition]);

  // useBrowserNativeTransitions()

  return (
    <ViewTransitionsContext.Provider
      value={{ setFinishViewTransition, setHistory, history }}
    >
      {children}
    </ViewTransitionsContext.Provider>
  );
}

export function useViewTransitions() {
  return use(ViewTransitionsContext);
}
