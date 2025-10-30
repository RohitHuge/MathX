import { createContext, useContext, useState } from "react";

const ContestTimerContext = createContext();

export function ContestTimerProvider({ children }) {
  const [timeLeft, setTimeLeft] = useState(600);
  return (
    <ContestTimerContext.Provider value={{ timeLeft, setTimeLeft }}>
      {children}
    </ContestTimerContext.Provider>
  );
}

export const useContestTimerContext = () => useContext(ContestTimerContext);
