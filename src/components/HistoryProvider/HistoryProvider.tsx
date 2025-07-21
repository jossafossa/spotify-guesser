import { type PropsWithChildren, useState } from "react";
import { HistoryContext } from "./HistoryContext";

type HistoryEntry = {
  trackId: string;
  timestamp: number;
  correct: boolean;
};

export const HistoryProvider = ({ children }: PropsWithChildren) => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const addToHistory = (trackId: string, correct: boolean) => {
    setHistory((prevHistory) => [
      ...prevHistory,
      { trackId, timestamp: Date.now(), correct },
    ]);
  };

  return (
    <HistoryContext.Provider value={{ addToHistory, history }}>
      {children}
    </HistoryContext.Provider>
  );
};
