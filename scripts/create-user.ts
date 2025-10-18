import { config } from "dotenv";
config({ path: ".env.local" }); // load your Supabase env vars

import { createClient } from "@supabase/supabase-js";

const [, , username, password] = process.argv;

if (!username || !password) {
  console.error("❌ Usage: pnpm create-user <username> <password>");
  process.exit(1);
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("Missing Supabase environment variables");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function createUserManually(username: string, password: string) {
  const email = `${username}@iark.com`;

  const { data: user, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) {
    console.error("❌ Error creating user:", error);
    process.exit(1);
  }

  const { error: insertError } = await supabase.from("profiles").insert({
    id: user.user.id,
    username,
    email,
  });

  if (insertError) {
    console.error("❌ Error inserting profile:", insertError);
    process.exit(1);
  }

  console.log(`✅ User "${username}" created successfully!`);
}

createUserManually(username, password)
  .catch(console.error)
  .finally(() => process.exit(0));

// run in terminal -> pnpm create-user [username] [password]
