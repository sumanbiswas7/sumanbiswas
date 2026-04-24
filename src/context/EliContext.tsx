"use client";
import { createContext, useContext, useState, ReactNode } from "react";

interface EliContextValue {
  isOpen: boolean;
  openEli: () => void;
  closeEli: () => void;
}

const EliContext = createContext<EliContextValue>({
  isOpen: false,
  openEli: () => {},
  closeEli: () => {},
});

export function EliProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <EliContext.Provider value={{ isOpen, openEli: () => setIsOpen(true), closeEli: () => setIsOpen(false) }}>
      {children}
    </EliContext.Provider>
  );
}

export function useEli() {
  return useContext(EliContext);
}
