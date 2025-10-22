import { Client, Users } from "node-appwrite";
import { createClient } from "@supabase/supabase-js";

// --- Appwrite Setup ---
const appwrite = new Client()
  .setEndpoint("https://fra.cloud.appwrite.io/v1")
  .setProject("68adcd200033ee482eba")
  .setKey("standard_e0e0611091dc8517170ed872365de6f3153b6f1ffb63efcfe05f28df695041f95e2ba575053efecdfcb4b0c46eaa2722bb7f456870fac06aebf46b11b763902a485c0363e83bf999030648b8df2c6bf4edbcc8f693f2d34cc0dc791c4ddb1eb45f83e307ca5ab8ae5222a644483a785e9b78fc9affe13d126999675f19c9e0b6"); // Use an API key with users.read scope

const users = new Users(appwrite);

// --- Supabase Setup ---
const supabase = createClient(
  "https://almxadlystsilsxaunts.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFsbXhhZGx5c3RzaWxzeGF1bnRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4OTczNTQsImV4cCI6MjA3NTQ3MzM1NH0.S7M-PdqvBVLBM7q4yKcgp72rL98VB624jQAsh8-CKwM" // service role for insert access
);

async function syncUsers() {
  const response = await users.list(); // fetch all users
  const userList = response.users;

  for (const user of userList) {
    const { $id, name, email, prefs } = user;

    const rollno = prefs?.rollno || null;
    const mobile_no = prefs?.mobile_no || null;

    const { error } = await supabase
      .from("users_public")
      .upsert({
        user_id: $id,
        name,
        email,
        rollno,
        mobile_no,
      });

    if (error) console.error("Error syncing user:", email, error.message);
    else console.log("Synced:", email);
  }

  console.log("✅ All users synced to Supabase!");
}

syncUsers().catch(console.error);
