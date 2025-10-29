import { api } from './api';

// Types
export interface Course {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export type CoursesResponse = Course[];

export interface GetCoursesParams {
  search?: string;
  sortBy?: string;
  order?: 'ASC' | 'DESC';
}

// API Functions
export const coursesApi = {
  getCourses: async (params?: GetCoursesParams): Promise<Course[]> => {
    const response = await api.get<CoursesResponse>('/courses', { params });
    return response.data;
  },
  
  getCourseById: async (id: string): Promise<Course> => {
    const response = await api.get<{ data: Course }>(`/courses/${id}`);
    return response.data.data;
  },
};

