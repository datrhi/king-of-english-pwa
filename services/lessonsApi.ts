import { api } from './api';

// Types
export interface Lesson {
  id: string;
  name: string;
  description?: string;
  image?: string;
  courseId: string;
  createdAt: string;
  updatedAt: string;
}

export type LessonsResponse = Lesson[];

export interface GetLessonsParams {
  search?: string;
  sortBy?: string;
  order?: 'ASC' | 'DESC';
}

// API Functions
export const lessonsApi = {
  getLessonsByCourseId: async (courseId: string, params?: GetLessonsParams): Promise<Lesson[]> => {
    const response = await api.get<LessonsResponse>(`/lessons/course/${courseId}`, { params });
    return response.data;
  },
  
  getLessonById: async (id: string): Promise<Lesson> => {
    const response = await api.get<{ data: Lesson }>(`/lessons/${id}`);
    return response.data.data;
  },
};

