import { wordsApi, type GetWordsParams } from "@/services/wordsApi";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

export const useWords = (exerciseId: string, params?: GetWordsParams) => {
  return useQuery({
    queryKey: ["words", exerciseId, params],
    queryFn: () => wordsApi.getWordsByExerciseId(exerciseId, params),
    enabled: !!exerciseId,
  });
};

export const useRandomWords = (exerciseId: string, count: number = 10) => {
  const searchParams = useSearchParams();
  const isHost = searchParams.get("isHost") === "true";
  return useQuery({
    queryKey: ["randomWords", exerciseId, count],
    queryFn: () => wordsApi.getRandomWords(exerciseId, count),
    enabled: !!exerciseId && isHost,
  });
};

export const useWord = (id: string) => {
  return useQuery({
    queryKey: ["word", id],
    queryFn: () => wordsApi.getWordById(id),
    enabled: !!id,
  });
};
