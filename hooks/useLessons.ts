import { useQuery } from '@tanstack/react-query';
import { 
  lessonsApi,
  type GetLessonsParams
} from '@/services/lessonsApi';

export const useLessons = (courseId: string, params?: GetLessonsParams) => {
  return useQuery({
    queryKey: ['lessons', courseId, params],
    queryFn: () => lessonsApi.getLessonsByCourseId(courseId, params),
    enabled: !!courseId,
  });
};

export const useLesson = (id: string) => {
  return useQuery({
    queryKey: ['lesson', id],
    queryFn: () => lessonsApi.getLessonById(id),
    enabled: !!id,
  });
};

