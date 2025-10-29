import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { serve } from "std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SERVICE_ROLE_KEY")!
    );

    const { user_id, contest_id, contest_duration } = await req.json();

    if (!user_id || !contest_id || !contest_duration) {
      return new Response("Missing required fields", { status: 400, headers: corsHeaders });
    }

    console.log(
      `🚀 AutoSubmit scheduled for user ${user_id} | contest ${contest_id} | duration ${contest_duration}s`
    );

    // Wait contest_duration + 10 seconds
    const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
    await delay(contest_duration * 1000 + 10000);

    // Fetch the score record
    const { data: record, error: fetchError } = await supabase
      .from("scores")
      .select("*")
      .eq("user_id", user_id)
      .eq("contest_id", contest_id)
      .maybeSingle();

    if (fetchError) throw fetchError;
    if (!record) {
      return new Response("No record found", { status: 404, headers: corsHeaders });
    }

    if (record.end_time) {
      console.log(`Already submitted for user: ${user_id} | contest: ${contest_id}`);
      return new Response("Already submitted", { status: 200, headers: corsHeaders });
    }

    const finalScore = record.score || record.semi_score || 0;
    const finalTime = record.end_time || record.semi_time || new Date().toISOString();

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

    console.log(`✅ Auto-submitted for user: ${user_id} | contest: ${contest_id}`);

    return new Response("Auto-submitted successfully", {
      status: 200,
      headers: corsHeaders,
    });
  } catch (err) {
    console.error("❌ AutoSubmit error:", err.message);
    return new Response(`Internal Server Error: ${err.message}`, {
      status: 500,
      headers: corsHeaders,
    });
  }
});
