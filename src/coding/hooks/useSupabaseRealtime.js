 import { useEffect } from "react";
 import { supabase } from "../../config/supabaseClient";

 export default function useSupabaseRealtime(table, onChange) {
   useEffect(() => {
     if (!table) return;
     const channel = supabase
       .channel(`realtime:${table}`)
       .on(
         'postgres_changes',
         { event: '*', schema: 'public', table },
         (payload) => {
           try {
             onChange && onChange(payload);
           } catch (_) {}
         }
       )
       .subscribe();

     return () => {
       try { supabase.removeChannel(channel); } catch (_) {}
     };
   }, [table, onChange]);

   return null;
 }
