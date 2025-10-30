import { createContext, useContext } from "react";
import useContestStage from "../hooks/useContestStage";

const ContestStageContext = createContext();

export function ContestStageProvider({ children }) {
  const { stageCode, phase, round, message, roundStart, roundEnd, updateStage, loading } = useContestStage();

  return (
    <ContestStageContext.Provider
      value={{ stageCode, phase, round, message, roundStart, roundEnd, updateStage, loading }}
    >
      {children}
    </ContestStageContext.Provider>
  );
}

export const useContestStageContext = () => useContext(ContestStageContext);
