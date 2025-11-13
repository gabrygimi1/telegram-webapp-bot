
// supabase.js
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE;

if (!SUPABASE_URL) {
  console.error("❌ SUPABASE_URL mancante nelle env di Render");
  process.exit(1);
}

if (!SUPABASE_SERVICE_ROLE) {
  console.error("❌ SUPABASE_SERVICE_ROLE mancante nelle env di Render");
  process.exit(1);
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);
