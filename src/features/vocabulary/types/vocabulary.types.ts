export interface VocabularyWord {
  id: string;
  word: string;
  slug: string;
  partOfSpeech: string;
  pronunciation: string | null;
  phoneticIpa: string | null;
  audioUrl: string | null;
  definition: string | null;
  shortDefinition: string | null;
  cefrLevel: string;
  ieltsBandMin: number;
  category: string;
  isIeltsCore: boolean;
  isAcademicWordList: boolean;
  synonyms: string[];
  antonyms: string[];
  collocations: string[];
  examples: string[];
  mnemonic: string | null;
  etymology: string | null;
  commonMistake: string | null;
  // SRS state — null if word not in user's deck
  srsStatus: string | null;
  nextReviewAt: string | null;
  isInDeck: boolean;
}

export interface VocabularyFeed {
  wordOfDay: VocabularyWord | null;
  dueForReview: VocabularyWord[];
  recommended: VocabularyWord[];
  totalInDeck: number;
  dueCount: number;
  masteredCount: number;
}

export interface ReviewResult {
  wordId: string;
  newStatus: string;
  newIntervalDays: number;
  nextReviewAt: string;
  xpEarned: number;
}

export interface VocabularyPack {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  category: string | null;
  ieltsTopicLabel: string | null;
  bandTarget: number;
  wordCount: number;
  isFeatured: boolean;
  coverEmoji: string | null;
  color: string | null;
}

export interface PackWords {
  pack: VocabularyPack;
  words: VocabularyWord[];
}
