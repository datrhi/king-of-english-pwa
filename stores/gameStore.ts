import { RoomUser } from "@/services/socketService";
import { setThemeColor } from "@/utils/pwa";
import { atom } from "jotai";
import { atomWithReset, RESET } from "jotai/utils";

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
export const correctCountAtom = atomWithReset(0);

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

export const handleInitUsers = atom(
  null,
  (get, set, users: RoomUser[]) => {
    set(usersAtom, users);
    set(leaderboardPlayersAtom, users.map((user) => ({ ...user, score: 0 })));
  }
);

export const handleAddUser = atom(
  null,
  (get, set, user: RoomUser) => {
    set(usersAtom, (prevUsers) => [...prevUsers, user]);
    set(leaderboardPlayersAtom, (prevPlayers) => [...prevPlayers, { ...user, score: 0 }]);
  }
);

export const handleRemoveUser = atom(
  null,
  (get, set, userId: string) => {
    set(usersAtom, (prevUsers) => prevUsers.filter((user) => user.id !== userId));
    set(leaderboardPlayersAtom, (prevPlayers) => prevPlayers.filter((player) => player.id !== userId));
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
    let updatedLeaderboardPlayers: Array<RoomUser & { score: number }> = leaderboardPlayers;
    const userIndex = updatedLeaderboardPlayers.findIndex(
      (user) => user.id === userId
    );
    set(correctCountAtom, prev => prev + 1)
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
  set(correctCountAtom, RESET);
  setThemeColor();
  set(showLeaderboardAtom, true);
});
