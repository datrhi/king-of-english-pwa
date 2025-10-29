import axios from 'axios';

// Create axios instance with base configuration
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // You can add auth tokens here if needed
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors here
    if (error.response?.status === 401) {
      // Handle unauthorized
      console.error('Unauthorized access');
    }
    return Promise.reject(error);
  }
);

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

