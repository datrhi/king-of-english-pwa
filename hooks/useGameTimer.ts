import { useEffect, useRef, useState } from "react";

interface UseGameTimerProps {
  shouldRun: boolean;
  onTimeOut: () => void;
}

export interface UseGameTimerReturn {
  questionProgress: number;
  questionStartTime: number | null;
  stopTimer: () => void;
}

export function useGameTimer({
  shouldRun,
  onTimeOut,
}: UseGameTimerProps): UseGameTimerReturn {
  const [questionProgress, setQuestionProgress] = useState(1000);
  const [questionStartTime, setQuestionStartTime] = useState<number | null>(
    null
  );
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const onTimeOutRef = useRef(onTimeOut);

  // Update ref when callback changes
  useEffect(() => {
    onTimeOutRef.current = onTimeOut;
  }, [onTimeOut]);

  const stopTimer = () => {
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }
  };

  useEffect(() => {
    if (shouldRun) {
      const startTime = Date.now();
      setQuestionStartTime(startTime);
      setQuestionProgress(1000);

      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const newProgress = Math.max(0, 1000 - elapsed / 10);
        setQuestionProgress(newProgress);

        if (newProgress <= 0) {
          clearInterval(interval);
          onTimeOutRef.current();
        }
      }, 10);

      progressTimerRef.current = interval;

      return () => {
        if (progressTimerRef.current) {
          clearInterval(progressTimerRef.current);
        }
      };
    }
  }, [shouldRun]);

  return {
    questionProgress,
    questionStartTime,
    stopTimer,
  };
}
