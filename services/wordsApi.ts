import { api } from "./api";

export interface PartOfSpeech {
  id: string;
  name: string;
}

export interface Word {
  id: string;
  title: string;
  titleVoice: string;
  pronunciation: string;
  translation: string;
  synonyms: string[];
  antonyms: string[];
  examples: string[];
  partOfSpeech?: PartOfSpeech;
  partOfSpeechId?: string;
  exerciseId: string;
  photo: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetWordsParams {
  search?: string;
  sortBy?: string;
  order?: "ASC" | "DESC";
  partOfSpeech?: string;
}

// API Functions
export const wordsApi = {
  getWordsByExerciseId: async (
    exerciseId: string,
    params?: GetWordsParams
  ): Promise<Word[]> => {
    const response = await api.get<Word[]>(`/words/exercise/${exerciseId}`, {
      params,
    });
    return response.data;
  },

  getRandomWords: async (
    exerciseId: string,
    count: number = 10
  ): Promise<Word[]> => {
    const response = await api.get<Word[]>(
      `/words/exercise/${exerciseId}/random`,
      {
        params: { count },
      }
    );
    return response.data;
  },

  getWordById: async (id: string): Promise<Word> => {
    const response = await api.get<Word>(`/words/${id}`);
    return response.data;
  },
};
