import { useStateRef } from "@/lib/use-state-ref/useStateRef";
import { currentQuestionIndexAtom } from "@/stores/gameStore";
import type { Question } from "@/types/game";
import { useSetAtom } from "jotai";
import { forwardRef, useImperativeHandle } from "react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import { GameSlide } from "./GameSlide";

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
    useImperativeHandle(ref, () => ({
      nextSlide: () => {
        if (!swiperInstanceRef.current) return;
        swiperInstanceRef.current.slideNext();
      },
    }));
    return (
      <div
        className={`relative z-10 flex-1 flex flex-col items-center justify-start p-4`}
        style={{ height: "calc(100% - 59px)" }}
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
            return (
              <SwiperSlide key={question.id}>
                <GameSlide question={question} index={index} />
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    );
  }
);
