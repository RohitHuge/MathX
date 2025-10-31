 import { useEffect, useMemo, useRef, useState } from "react";
 import { getContestEndTime } from "../utils/supabaseHelpers";

 export default function useContestTimer() {
   const [endAt, setEndAt] = useState(null);
   const [now, setNow] = useState(Date.now());
   const timerRef = useRef(null);

   useEffect(() => {
     let mounted = true;
     (async () => {
       try {
         const ts = await getContestEndTime();
         if (mounted) setEndAt(ts ? new Date(ts).getTime() : null);
       } catch (_) {
         if (mounted) setEndAt(null);
       }
     })();
     return () => { mounted = false; };
   }, []);

   useEffect(() => {
     timerRef.current = setInterval(() => setNow(Date.now()), 1000);
     return () => clearInterval(timerRef.current);
   }, []);

   const remaining = useMemo(() => {
     if (!endAt) return 0;
     const diff = Math.max(0, endAt - now);
     return diff;
   }, [endAt, now]);

   const minutes = useMemo(() => Math.floor(remaining / 60000), [remaining]);
   const seconds = useMemo(() => Math.floor((remaining % 60000) / 1000), [remaining]);

   return { minutes, seconds, remaining };
 }
