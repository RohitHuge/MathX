import { supabase } from "../../config/supabaseClient";
console.log("��� Supabase Helpers Loaded");

export async function fetchProblems() {
  console.log("Fetching problems...");
  return [];
}

export async function getProblemsByRound(round) {
  try {
    const { data, error } = await supabase
      .from("problems")
      .select("problem_id, title, description, difficulty, round_no")
      .eq("round_no", round);
    if (error) throw error;
    return data || [];
  } catch (e) {
    console.error("getProblemsByRound error:", e);
    return [];
  }
}

export async function getUserChoice(userId, round) {
  try {
    const { data, error } = await supabase
      .from("user_choices")
      .select("id, user_id, round_no, problem_id")
      .eq("user_id", userId)
      .eq("round_no", round)
      .maybeSingle();
    if (error && error.code !== "PGRST116") throw error;
    if (!data) return null;
    const pid = data.problem_id;
    const { data: probs } = await supabase
      .from("problems")
      .select("problem_id, title, description, difficulty, round_no")
      .or(`problem_id.eq.${pid}`)
      .limit(1);
    const problem = Array.isArray(probs) && probs.length ? probs[0] : null;
    return { choice: data, problem };
  } catch (e) {
    console.error("getUserChoice error:", e);
    return null;
  }
}

export async function saveUserChoice(userId, round, problemId) {
  console.log("Saving user choice...");
  try {
    const payload = { user_id: userId, round_no: round, problem_id: problemId };
    const { error } = await supabase
      .from("user_choices")
      .upsert(payload, { onConflict: "user_id,round_no" });
    if (error) throw error;
    console.log("User choice saved successfully");
    return { ok: true };
  } catch (e) {
    console.error("saveUserChoice error:", e);
    return { ok: false, error: String(e?.message || e) };
  }
}
