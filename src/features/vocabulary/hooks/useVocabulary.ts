'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/shared/constants/query-keys';
import { vocabularyApi } from '../api/vocabulary.api';

export function useVocabularyFeed() {
  return useQuery({
    queryKey: queryKeys.vocabulary.feed(),
    queryFn: vocabularyApi.getFeed,
    staleTime: 2 * 60 * 1000, // 2 min — due words change after reviews
    refetchOnWindowFocus: false,
  });
}

export function useVocabularyPacks() {
  return useQuery({
    queryKey: queryKeys.vocabulary.packs(),
    queryFn: vocabularyApi.getPacks,
    staleTime: 30 * 60 * 1000, // 30 min — packs rarely change
    gcTime: 60 * 60 * 1000,
  });
}

export function usePackWords(slug: string) {
  return useQuery({
    queryKey: queryKeys.vocabulary.pack(slug),
    queryFn: () => vocabularyApi.getPackWords(slug),
    staleTime: 30 * 60 * 1000,
    enabled: !!slug,
  });
}

export function useReviewWord() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ wordId, quality }: { wordId: string; quality: number }) =>
      vocabularyApi.reviewWord(wordId, quality),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.vocabulary.feed() });
    },
  });
}

export function useAddToDeck() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (wordId: string) => vocabularyApi.addToDeck(wordId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.vocabulary.feed() });
    },
  });
}
