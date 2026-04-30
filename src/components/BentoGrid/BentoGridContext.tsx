"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  ReactNode,
} from "react";

export type CardId =
  | "me"
  | "meHero"
  | "stacked"
  | "gallery"
  | "note"
  | "bio"
  | "playGame"
  | "work"
  | "eli"
  | "projectIdeas";

export const INITIAL_ROWS: CardId[][] = [
  ["me", "meHero", "stacked", "gallery", "projectIdeas"],
  ["bio", "playGame", "work", "eli"],
];

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type BentoContextValue = {
  rows: CardId[][];
  setRows: React.Dispatch<React.SetStateAction<CardId[][]>>;
  shuffle: () => void;
  shuffleCount: number;
  highlightedCard: CardId | null;
  highlightCard: (id: CardId) => void;
};

const BentoContext = createContext<BentoContextValue | null>(null);

export function BentoGridProvider({ children }: { children: ReactNode }) {
  const [rows, setRows] = useState<CardId[][]>(INITIAL_ROWS);
  const [shuffleCount, setShuffleCount] = useState(0);
  const [highlightedCard, setHighlightedCard] = useState<CardId | null>(null);
  const highlightTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const shuffle = useCallback(() => {
    setRows((prev) => prev.map((row) => shuffleArray(row)));
    setShuffleCount((c) => c + 1);
  }, []);

  const highlightCard = useCallback((id: CardId) => {
    if (highlightTimer.current) clearTimeout(highlightTimer.current);
    setHighlightedCard(id);
    highlightTimer.current = setTimeout(() => setHighlightedCard(null), 2500);
  }, []);

  return (
    <BentoContext.Provider value={{ rows, setRows, shuffle, shuffleCount, highlightedCard, highlightCard }}>
      {children}
    </BentoContext.Provider>
  );
}

export function useBentoGrid() {
  const ctx = useContext(BentoContext);
  if (!ctx) throw new Error("useBentoGrid must be used within BentoGridProvider");
  return ctx;
}
