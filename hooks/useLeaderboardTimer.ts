import { useEffect, useRef, useState } from "react";

interface UseLeaderboardTimerProps {
  isActive: boolean;
  duration?: number; // in milliseconds
  onComplete: () => void;
}

export interface UseLeaderboardTimerReturn {
  progress: number; // 0-100
  stopTimer: () => void;
}

export function useLeaderboardTimer({
  isActive,
  duration = 5000,
  onComplete,
}: UseLeaderboardTimerProps): UseLeaderboardTimerReturn {
  const [progress, setProgress] = useState(100);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const onCompleteRef = useRef(onComplete);

  // Update ref when callback changes
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    if (isActive) {
      setProgress(100);
      const startTime = Date.now();
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const newProgress = Math.max(0, 100 - (elapsed / duration) * 100);
        setProgress(newProgress);

        if (newProgress <= 0) {
          clearInterval(interval);
          onCompleteRef.current();
        }
      }, 50);

      timerRef.current = interval;

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    }
  }, [isActive, duration]);

  return {
    progress,
    stopTimer,
  };
}
