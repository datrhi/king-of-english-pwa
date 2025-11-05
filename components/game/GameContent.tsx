import { useStateRef } from "@/lib/use-state-ref/useStateRef";
import { currentQuestionIndexAtom } from "@/stores/gameStore";
import type { Question } from "@/types/game";
import { useSetAtom } from "jotai";
import { forwardRef, useImperativeHandle, useRef } from "react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import { GameProgressBar, GameProgressBarRef } from "./ProgressBar";
import { GameQuestionCard } from "./QuestionCard";

interface GameContentProps {
  questions: Question[];
}

export interface GameContentRef {
  nextSlide: () => void;
}
export const GameContent = forwardRef<GameContentRef, GameContentProps>(
  ({ questions }, ref) => {
    const setCurrentQuestionIndex = useSetAtom(currentQuestionIndexAtom);
    const [_swiperInstance, setSwiperInstance, swiperInstanceRef] =
      useStateRef<SwiperType | null>(null);
    const progressBarRef = useRef<GameProgressBarRef>(null);
    useImperativeHandle(ref, () => ({
      nextSlide: () => {
        if (!swiperInstanceRef.current) return;
        swiperInstanceRef.current.slideNext();
      },
    }));
    return (
      <div
        className={`relative z-10 flex-1 flex flex-col items-center justify-start p-4`}
      >
        <Swiper
          spaceBetween={50}
          slidesPerView={1}
          onSwiper={setSwiperInstance}
          onSlideChange={(swiper) =>
            setCurrentQuestionIndex(swiper.activeIndex)
          }
          allowTouchMove={false}
          className="w-full h-full !overflow-visible"
        >
          {questions.map((question, index) => {
            const progressBar = progressBarRef.current;
            const handleStopTimer = () => {
              if (!progressBar) return;
              progressBar.stopTimer();
            };
            const handleGetCurrentProgress = () => {
              if (!progressBar) return 0;
              return progressBar.getCurrentProgress();
            };
            return (
              <SwiperSlide key={question.id}>
                <div className="flex flex-col items-center justify-start h-full">
                  <GameQuestionCard
                    question={question}
                    stopTimer={handleStopTimer}
                    getCurrentProgress={handleGetCurrentProgress}
                    index={index}
                  />

                  {/* Progress Bar */}
                  <GameProgressBar
                    ref={progressBarRef}
                    isGotQuestions={questions.length > 0}
                  />
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    );
  }
);
