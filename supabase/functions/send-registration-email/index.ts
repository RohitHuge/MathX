
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const { leaderEmail, teamName, teamId, members } = await req.json();

    // Log the details (Mocking email sending for now)
    console.log(`------------------------------------------------`);
    console.log(`📧 SENDING REGISTRATION EMAIL`);
    console.log(`To: ${leaderEmail}`);
    console.log(`Team: ${teamName} (ID: ${teamId})`);
    console.log(`Members: ${JSON.stringify(members)}`);
    console.log(`------------------------------------------------`);

    // TODO: Integrate with your email provider here (e.g. Resend, SendGrid)
    // Example with Resend:
    // const res = await fetch('https://api.resend.com/emails', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`
    //   },
    //   body: JSON.stringify({
    //     from: 'onboarding@resend.dev',
    //     to: leaderEmail,
    //     subject: 'Registration Confirmed - MathX',
    //     html: `<p>Welcome ${teamName}!</p>`
    //   })
    // });

    return new Response(
      JSON.stringify({ message: "Email request received" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error processing email request:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
