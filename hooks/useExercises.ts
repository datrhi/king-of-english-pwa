import { useQuery } from '@tanstack/react-query';
import { 
  exercisesApi,
  type GetExercisesParams
} from '@/services/exercisesApi';

export const useExercises = (lessonId: string, params?: GetExercisesParams) => {
  return useQuery({
    queryKey: ['exercises', lessonId, params],
    queryFn: () => exercisesApi.getExercisesByLessonId(lessonId, params),
    enabled: !!lessonId,
  });
};

export const useExercise = (id: string) => {
  return useQuery({
    queryKey: ['exercise', id],
    queryFn: () => exercisesApi.getExerciseById(id),
    enabled: !!id,
  });
};

