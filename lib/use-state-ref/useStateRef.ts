// Source - https://stackoverflow.com/questions/66603920/combining-usestate-and-useref-in-reactjs
// Posted by CertainPerformance
// Retrieved 11/5/2025, License - CC-BY-SA 4.0

import { useEffect, useRef, useState } from "react";

export const useStateRef = <T extends unknown>(initialState: T) => {
  const [state, setState] = useState(initialState);
  const ref = useRef(initialState);

  useEffect(() => {
    ref.current = state;
  }, [state]);

  // Use "as const" below so the returned array is a proper tuple
  return [state, setState, ref] as const;
};
