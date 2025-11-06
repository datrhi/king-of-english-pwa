import { RoomUser } from "@/services/socketService";
import { setThemeColor } from "@/utils/pwa";
import { atom } from "jotai";
import { atomWithReset } from "jotai/utils";

// Core game state atoms
export const currentQuestionIndexAtom = atomWithReset(0);
export const answersAtom = atomWithReset<Record<number, string>>({});
export const scoreAtom = atomWithReset(0);
export const pointsEarnedAtom = atom(0);
export const usersAtom = atom<RoomUser[]>([]);
export const userIdAtom = atom<string>("");
export const leaderboardPlayersAtom = atom<Array<RoomUser & { score: number }>>(
  []
);

// Animation state atoms
export const showPointsAnimationAtom = atom(false);
export const showCorrectAnimationAtom = atom(false);
export const showWrongAnimationAtom = atom(false);
export const showLeaderboardAtom = atom(false);
export const showWordDetailsAtom = atom(false);

// Game control atoms
export const isPausedAtom = atom(false);
export const isGameOverAtom = atom(false);
let wrongAnswerTimeout: NodeJS.Timeout | null = null;

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
    set(pointsEarnedAtom, questionProgress);
    set(scoreAtom, (prev) => prev + questionProgress);

    // Show correct animation
    set(showCorrectAnimationAtom, true);
    setThemeColor("#22c55e");

    // Show points animation
    set(showPointsAnimationAtom, true);
    setTimeout(() => {
      set(showPointsAnimationAtom, false);
    }, 2000);
  }
);

export const handleWrongAnswerAtom = atom(null, (get, set) => {
  set(currentAnswerAtom, "");
  if (wrongAnswerTimeout) {
    clearTimeout(wrongAnswerTimeout);
  }
  // Show wrong animation
  set(showWrongAnimationAtom, true);
  setThemeColor("#ef4444");

  wrongAnswerTimeout = setTimeout(() => {
    set(showWrongAnimationAtom, false);
    setThemeColor();
  }, 2000);
});

export const handleScoreUpdateAtom = atom(
  null,
  (get, set, userId: string, score: number) => {
    const leaderboardPlayers = get(leaderboardPlayersAtom);
    const users = get(usersAtom);
    let updatedLeaderboardPlayers: Array<RoomUser & { score: number }> =
      leaderboardPlayers.length > 0
        ? leaderboardPlayers
        : users.map((user) => ({ ...user, score: 0 }));
    const userIndex = updatedLeaderboardPlayers.findIndex(
      (user) => user.id === userId
    );
    if (userIndex !== -1) {
      updatedLeaderboardPlayers[userIndex].score += score;
    }
    set(
      leaderboardPlayersAtom,
      updatedLeaderboardPlayers.sort((a, b) => b.score - a.score)
    );
  }
);

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
  set(showCorrectAnimationAtom, false);
  setThemeColor();
  set(showLeaderboardAtom, true);
});
