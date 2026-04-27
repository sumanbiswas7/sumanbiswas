"use client";
import { createContext, useContext, useState, ReactNode } from "react";

interface GameContextValue {
  isOpen: boolean;
  openGame: () => void;
  closeGame: () => void;
}

const GameContext = createContext<GameContextValue>({
  isOpen: false,
  openGame: () => {},
  closeGame: () => {},
});

export function GameProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <GameContext.Provider value={{ isOpen, openGame: () => setIsOpen(true), closeGame: () => setIsOpen(false) }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  return useContext(GameContext);
}
