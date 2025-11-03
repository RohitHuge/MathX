 import { useEffect, useState, useRef } from "react";
import { supabase } from "../../config/supabaseClient";

export default function LeaderboardBar() {
  const [leaders, setLeaders] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const pollRef = useRef(null);
  const userIdRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    async function loadUser() {
      try {
        const { data: auth } = await supabase.auth.getUser();
        if (!mounted) return;
        userIdRef.current = auth?.user?.id ?? null;
      } catch (_) {}
    }
    loadUser();
    return () => {
      mounted = false;
    };
  }, []);

  const fetchLeaders = async () => {
    try {
      const { data: top, error } = await supabase
        .from("leaderboard_view")
        .select("user_id,name,total_time,rank")
        .order("total_time", { ascending: true })
        .limit(10);
      if (error) throw error;
      const rows = top || [];
      setLeaders(rows);

      const uid = userIdRef.current;
      if (uid) {
        const inTop = rows.find((r) => r.user_id === uid);
        if (inTop && typeof inTop.rank === "number") {
          setUserRank(inTop.rank);
        } else if (inTop) {
          const idx = rows.findIndex((r) => r.user_id === uid);
          setUserRank(idx >= 0 ? idx + 1 : null);
        } else {
          const { data: one } = await supabase
            .from("leaderboard_view")
            .select("rank")
            .eq("user_id", uid)
            .maybeSingle();
          setUserRank(one?.rank ?? null);
        }
      } else {
        setUserRank(null);
      }
    } catch (err) {
      console.error("Leaderboard fetch error:", err);
    }
  };

  // useEffect(() => {
  //   // fetchLeaders();
  //   const tick = () => {
  //     if (document.visibilityState === "visible") fetchLeaders();
  //   };
  //   pollRef.current = setInterval(tick, 20000);
  //   const onVis = () => {
  //     if (document.visibilityState === "visible") fetchLeaders();
  //   };
  //   const onFocus = () => fetchLeaders();
  //   document.addEventListener("visibilitychange", onVis);
  //   window.addEventListener("focus", onFocus);
  //   return () => {
  //     clearInterval(pollRef.current);
  //     document.removeEventListener("visibilitychange", onVis);
  //     window.removeEventListener("focus", onFocus);
  //   };
  // }, []);

  return (
    <div className="fixed top-0 left-0 w-full backdrop-blur-sm text-white text-lg flex justify-between items-center px-4 py-2 z-50 shadow border-b border-[#A146D4]/30 bg-gradient-to-r from-[#A146D4]/10 to-[#49E3FF]/10">
      <h1>MATHX PRESENTS's CLASH OF CODERS</h1>
      
      {/* <div className="flex gap-4 overflow-x-auto">
        {leaders.map((u, i) => (
          <div key={u.user_id ?? i} className="flex items-center gap-1">
            <span className="text-[#49E3FF] font-semibold">#{i + 1}</span>
            <span className="truncate max-w-[140px] text-white">{u.name ?? "Anon"}</span>
          </div>
        ))}
      </div> */}
      {/* <div className="text-[#49E3FF] font-semibold">You: {userRank ? `#${userRank}` : "N/A"}</div> */}
    </div>
  );
}
