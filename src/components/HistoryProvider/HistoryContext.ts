import { createContext, useContext } from "react";

export const useHistory = () => {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error("useHistory must be used within a HistoryProvider");
  }
  return context;
};

type HistoryContextProps = {
  addToHistory: (trackId: string, correct: boolean) => void;
  history: { trackId: string; timestamp: number; correct: boolean }[];
};

export const HistoryContext = createContext<HistoryContextProps>({
  addToHistory: () => {},
  history: [],
});
