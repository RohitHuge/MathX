 import { useContestStageContext } from "../context/ContestStageContext";
 import ContestLayout from "../layouts/ContestLayout";
 import ContestRulesModal from "../components/modals/ContestRulesModal";

 export default function ContestLandingPage() {
   const { stageCode, message } = useContestStageContext();
   const isWaiting = stageCode?.startsWith("A");

   return (
     <ContestLayout>
       {isWaiting && <ContestRulesModal />}
       <div className="flex flex-col items-center justify-center h-[80vh] text-center">
         <h1 className="text-3xl md:text-4xl font-extrabold text-[#00FFC6] mb-3 shadow-[0_0_10px_#00FFC6]/30">
           🏁 MathX Contest Waiting Room
         </h1>
         <p className="text-gray-300 max-w-lg">{message || "Awaiting next round..."}</p>
         <p className="text-sm text-gray-500 mt-4">Stay focused — fullscreen mode is required!</p>
       </div>
     </ContestLayout>
   );
 }
