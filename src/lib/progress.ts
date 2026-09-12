import { create } from "zustand";
import { persist } from "zustand/middleware";

export type QuizRecord = {
  score: number;
  total: number;
  at: number;
};

type ProgressState = {
  hasHydrated: boolean;
  completed: string[];
  sections: Record<string, string[]>;
  bookmarks: string[];
  quizzes: Record<string, QuizRecord>;
  lastSlug: string | null;
  setHydrated: () => void;
  markSection: (slug: string, sectionId: string) => void;
  markComplete: (slug: string) => void;
  toggleComplete: (slug: string) => void;
  toggleBookmark: (slug: string) => void;
  setLast: (slug: string) => void;
  saveQuiz: (slug: string, score: number, total: number) => void;
  reset: () => void;
};

export const useProgress = create<ProgressState>()(
  persist(
    (set) => ({
      hasHydrated: false,
      completed: [],
      sections: {},
      bookmarks: [],
      quizzes: {},
      lastSlug: null,
      setHydrated: () => set({ hasHydrated: true }),
      markSection: (slug, sectionId) =>
        set((s) => {
          const current = s.sections[slug] ?? [];
          if (current.includes(sectionId)) return s;
          return { sections: { ...s.sections, [slug]: [...current, sectionId] } };
        }),
      markComplete: (slug) =>
        set((s) =>
          s.completed.includes(slug) ? s : { completed: [...s.completed, slug] },
        ),
      toggleComplete: (slug) =>
        set((s) => ({
          completed: s.completed.includes(slug)
            ? s.completed.filter((x) => x !== slug)
            : [...s.completed, slug],
        })),
      toggleBookmark: (slug) =>
        set((s) => ({
          bookmarks: s.bookmarks.includes(slug)
            ? s.bookmarks.filter((x) => x !== slug)
            : [...s.bookmarks, slug],
        })),
      setLast: (slug) => set({ lastSlug: slug }),
      saveQuiz: (slug, score, total) =>
        set((s) => ({
          quizzes: { ...s.quizzes, [slug]: { score, total, at: Date.now() } },
        })),
      reset: () =>
        set({
          completed: [],
          sections: {},
          bookmarks: [],
          quizzes: {},
          lastSlug: null,
        }),
    }),
    {
      name: "grounded-progress",
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    },
  ),
);
