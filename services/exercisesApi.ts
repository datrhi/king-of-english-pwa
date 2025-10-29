import { api } from './api';

// Types
export interface Exercise {
  id: string;
  name: string;
  image?: string;
  lessonId: string;
  createdAt: string;
  updatedAt: string;
}

export type ExercisesResponse = Exercise[];

export interface GetExercisesParams {
  search?: string;
  sortBy?: string;
  order?: 'ASC' | 'DESC';
}

// API Functions
export const exercisesApi = {
  getExercisesByLessonId: async (lessonId: string, params?: GetExercisesParams): Promise<Exercise[]> => {
    const response = await api.get<ExercisesResponse>(`/exercises/lesson/${lessonId}`, { params });
    return response.data;
  },
  
  getExerciseById: async (id: string): Promise<Exercise> => {
    const response = await api.get<{ data: Exercise }>(`/exercises/${id}`);
    return response.data.data;
  },
};

