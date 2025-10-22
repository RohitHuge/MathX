// Supabase Edge Function: autoSubmit
// ---------------------------------------------------
// Purpose: Wait for the contest duration, then finalize scores if not submitted.

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { serve } from "std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Utility function for waiting (sleep)
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

serve(async (req) => {
  try {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "authorization, content-type",
    } as const;

    if (req.method === "OPTIONS") {
      return new Response("ok", { headers: corsHeaders });
    }

    if (req.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405, headers: corsHeaders });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SERVICE_ROLE_KEY")! // renamed key as discussed
    );

    let body: any = null;
    try {
      body = await req.json();
    } catch (_e) {
      return new Response("Invalid JSON body", { status: 400, headers: corsHeaders });
    }

    const { user_id, contest_id, contest_duration } = body || {};

    if (!user_id || !contest_id || !contest_duration) {
      return new Response("Missing required fields", { status: 400, headers: corsHeaders });
    }

    console.log(
      `🚀 AutoSubmit scheduled for user ${user_id} | contest ${contest_id} | duration ${contest_duration}s`
    );

    // 1️⃣ Wait for contest duration + 10 seconds
    const waitTime = contest_duration * 1000 + 10000;
    console.log(`⏱️ Waiting ${waitTime / 1000}s before checking submission...`);
    await delay(waitTime);

    // 2️⃣ Fetch current score record
    const { data: record, error: fetchError } = await supabase
      .from("scores")
      .select("*")
      .eq("user_id", user_id)
      .eq("contest_id", contest_id)
      .maybeSingle();

    if (fetchError) throw fetchError;
    if (!record) {
      return new Response("No record found for this user/contest", { status: 404, headers: corsHeaders });
    }

    // 3️⃣ If already submitted, skip
    if (record.end_time) {
      console.log(`✅ Already submitted for ${user_id}`);
      return new Response("Already submitted", { status: 200, headers: corsHeaders });
    }

    // 4️⃣ Use semi-score as fallback
    const finalScore = record.score || record.semi_score || 0;
    const finalTime =
      record.end_time || record.semi_time || new Date().toISOString();

    // 5️⃣ Update final record
    const { error: updateError } = await supabase
      .from("scores")
      .update({
        score: finalScore,
        end_time: finalTime,
        status: "auto-submitted",
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user_id)
      .eq("contest_id", contest_id);

    if (updateError) throw updateError;

    console.log(
      `✅ Auto-submitted for user: ${user_id} | contest: ${contest_id} | score: ${finalScore}`
    );

    return new Response("Auto-submitted successfully", { status: 200, headers: corsHeaders });
  } catch (err) {
    console.error("❌ AutoSubmit error:", err.message);
    return new Response(`Internal Server Error: ${err.message}`, { status: 500, headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "authorization, content-type",
    }});
  }
});
