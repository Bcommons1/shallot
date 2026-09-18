import "server-only";
import { createClient } from "@supabase/supabase-js";

function configured(value: string | undefined) {
  return Boolean(value?.trim() && !/your[-_]|placeholder|example\./i.test(value));
}

export function getSupabase(admin = false) {
  const url = process.env.SUPABASE_URL;
  const key = admin ? process.env.SUPABASE_SECRET_KEY : process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!configured(url) || !configured(key)) return null;
  try {
    return createClient(url!, key!, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
      global: { fetch: (input, init) => fetch(input, { ...init, signal: AbortSignal.timeout(6000) }) },
    });
  } catch { return null; }
}

export function inquiriesEnabled() {
  return process.env.INQUIRIES_ENABLED === "true" && Boolean(
    process.env.SITE_URL && process.env.INQUIRY_RATE_LIMIT_SALT && getSupabase(true),
  );
}
