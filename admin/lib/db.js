import { createClient } from "@supabase/supabase-js";

export function db() {
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });
}

export const PLANS = ["free", "basic", "pro"];

export function isActive(s) {
  if (s.status !== "active") return false;
  return !s.expires_at || new Date(s.expires_at) > new Date();
}
