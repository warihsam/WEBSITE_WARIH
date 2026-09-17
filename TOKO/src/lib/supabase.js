import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL;

const supabasePublishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl) {
  console.warn(
    "https://koqplflfgheuyacqhbbo.supabase.co"
  );
}

if (!supabasePublishableKey) {
  console.warn(
    "sb_publishable_tc7B_WFjQB46JPGdb30umA_osSYme6l"
  );
}

export const supabase = createClient(
  supabaseUrl || "",
  supabasePublishableKey || "",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);
