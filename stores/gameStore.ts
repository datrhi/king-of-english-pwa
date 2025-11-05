import { setThemeColor } from "@/utils/pwa";
import { atom } from "jotai";
import { atomWithReset } from "jotai/utils";

// Core game state atoms
export const currentQuestionIndexAtom = atomWithReset(0);
export const answersAtom = atomWithReset<Record<number, string>>({});
export const scoreAtom = atomWithReset(0);
export const pointsEarnedAtom = atom(0);

// Animation state atoms
export const showPointsAnimationAtom = atom(false);
export const showCorrectAnimationAtom = atom(false);
export const showWrongAnimationAtom = atom(false);
export const showLeaderboardAtom = atom(false);
export const showWordDetailsAtom = atom(false);

// Game control atoms
export const isPausedAtom = atom(false);
export const isGameOverAtom = atom(false);

// Derived atom for current answer
export const currentAnswerAtom = atom(
  (get) => {
    const currentIndex = get(currentQuestionIndexAtom);
    const answers = get(answersAtom);
    return answers[currentIndex] || "";
  },
  (get, set, newValue: string) => {
    const currentIndex = get(currentQuestionIndexAtom);
    const answers = get(answersAtom);
    set(answersAtom, { ...answers, [currentIndex]: newValue });
  }
);

// Action atoms
export const handleCorrectAnswerAtom = atom(
  null,
  (get, set, questionProgress: number) => {
    const earnedPoints = Math.round(questionProgress);
    set(pointsEarnedAtom, earnedPoints);
    set(scoreAtom, (prev) => prev + earnedPoints);

    // Show correct animation
    set(showCorrectAnimationAtom, true);
    setThemeColor("#22c55e");

    setTimeout(() => {
      set(showCorrectAnimationAtom, false);
      setThemeColor();
    }, 2000);

    setTimeout(() => {
      set(showWordDetailsAtom, true);
    }, 800);

    // Show points animation
    set(showPointsAnimationAtom, true);
    setTimeout(() => {
      set(showPointsAnimationAtom, false);
    }, 2000);
  }
);

export const handleWrongAnswerAtom = atom(null, (get, set) => {
  set(currentAnswerAtom, "");

  // Show wrong animation
  set(showWrongAnimationAtom, true);
  setThemeColor("#ef4444");

  setTimeout(() => {
    set(showWordDetailsAtom, true);
  }, 800);

  setTimeout(() => {
    set(showWrongAnimationAtom, false);
    setThemeColor();
  }, 2000);
});

export const handleTimeOutAtom = atom(null, (get, set) => {
  set(currentAnswerAtom, "");

  set(showWrongAnimationAtom, true);
  setThemeColor("#ef4444");

  setTimeout(() => {
    set(showWordDetailsAtom, true);
  }, 800);

  setTimeout(() => {
    set(showWrongAnimationAtom, false);
    setThemeColor();
  }, 2000);
});

export const showLeaderboardActionAtom = atom(null, (get, set) => {
  set(showWordDetailsAtom, false);
  set(showLeaderboardAtom, true);
});
