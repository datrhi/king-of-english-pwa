import { useEffect, useRef, useState } from "react";

interface UseGameTimerProps {
  shouldRun: boolean;
  onTimeOut: () => void;
}

export interface UseGameTimerReturn {
  questionProgress: number;
  questionStartTime: number | null;
  questionProgressRef: React.RefObject<number>;
  stopTimer: () => void;
}

export function useGameTimer({
  shouldRun,
  onTimeOut,
}: UseGameTimerProps): UseGameTimerReturn {
  const [questionProgress, setQuestionProgress] = useState(1000);
  const questionProgressRef = useRef(1000);
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
      questionProgressRef.current = 1000; // Update ref immediately

      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const newProgress = Math.max(0, 1000 - elapsed / 10);
        setQuestionProgress(newProgress);
        questionProgressRef.current = newProgress; // Update ref synchronously

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
    questionProgressRef,
    stopTimer,
  };
}
