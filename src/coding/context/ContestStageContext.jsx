import { createContext, useContext, useState } from "react";

const ContestStageContext = createContext();

export function ContestStageProvider({ children }) {
  const [stage, setStage] = useState(0);
  return (
    <ContestStageContext.Provider value={{ stage, setStage }}>
      {children}
    </ContestStageContext.Provider>
  );
}

export const useContestStageContext = () => useContext(ContestStageContext);
