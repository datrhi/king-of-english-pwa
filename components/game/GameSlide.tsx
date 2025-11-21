import { Question } from "@/types/game";
import { useRef } from "react";
import { GameProgressBar, GameProgressBarRef } from "./ProgressBar";
import { GameQuestionCard } from "./QuestionCard";

interface Props {
  question: Question;
  index: number;
}
export const GameSlide = ({ question, index }: Props) => {
  const progressBarRef = useRef<GameProgressBarRef>(null);
  const handleStopTimer = () => {
    if (!progressBarRef.current) return;
    progressBarRef.current.stopTimer();
  };
  const handleGetCurrentProgress = () => {
    if (!progressBarRef.current) return 0;
    return progressBarRef.current.getCurrentProgress();
  };
  return (
    <div className="flex flex-col items-center justify-start h-full overflow-y-auto">
      <GameProgressBar ref={progressBarRef} index={index} />
      <GameQuestionCard
        question={question}
        stopTimer={handleStopTimer}
        getCurrentProgress={handleGetCurrentProgress}
        index={index}
      />
    </div>
  );
};
