import type { ScreenRegistry, ScreenOptionsMap } from "@/lib/navigation";
import ExercisesScreen from "./ExercisesScreen";
import GameScreen from "./GameScreen";
import HomeScreen from "./HomeScreen";
import LessonsScreen from "./LessonsScreen";
import LobbyScreen from "./LobbyScreen";
import QRScreen from "./QRScreen";
import SignInScreen from "./SignInScreen";
import SignUpScreen from "./SignUpScreen";

export type RootStackParamList = {
  Home: { source?: string } | undefined;
  Lessons: { course: string };
  Exercises: { lesson: string };
  Lobby: { pin: string; name?: string; isHost?: string };
  Game: {
    pin: string;
    exerciseId: string;
    exerciseName: string;
    isHost: string;
  };
  SignIn: undefined;
  SignUp: undefined;
  QR: undefined;
};

export const screens: ScreenRegistry = {
  Home: HomeScreen,
  Lessons: LessonsScreen,
  Exercises: ExercisesScreen,
  Lobby: LobbyScreen,
  Game: GameScreen,
  SignIn: SignInScreen,
  SignUp: SignUpScreen,
  QR: QRScreen,
};

export const screenOptions: ScreenOptionsMap = {
  Game: { gestureEnabled: false, animation: "fade" },
};
