import { get, post } from '@/shared/api/api-client';
import { API_ENDPOINTS } from '@/shared/api/endpoints';
import type {
  VocabularyFeed,
  ReviewResult,
  VocabularyPack,
  PackWords,
} from '../types/vocabulary.types';

export const vocabularyApi = {
  getFeed: (): Promise<VocabularyFeed> =>
    get<VocabularyFeed>(API_ENDPOINTS.vocabulary.feed),

  getPacks: (): Promise<VocabularyPack[]> =>
    get<VocabularyPack[]>(API_ENDPOINTS.vocabulary.packs),

  getPackWords: (slug: string): Promise<PackWords> =>
    get<PackWords>(API_ENDPOINTS.vocabulary.pack(slug)),

  addToDeck: (wordId: string): Promise<boolean> =>
    post<boolean>(API_ENDPOINTS.vocabulary.addToDeck(wordId)),

  reviewWord: (wordId: string, quality: number): Promise<ReviewResult> =>
    post<ReviewResult>(API_ENDPOINTS.vocabulary.review(wordId), { quality }),
};
