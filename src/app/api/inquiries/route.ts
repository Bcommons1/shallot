import { createHmac } from "node:crypto";
import { NextResponse } from "next/server";
import { inquirySchema, isAllowedOrigin } from "@/lib/inquiry";
import { getSupabase, inquiriesEnabled } from "@/lib/supabase";

export const runtime = "nodejs";
export async function POST(request: Request) {
  if (!inquiriesEnabled()) return NextResponse.json({ error: "Online inquiries are not available yet. Nothing has been saved." }, { status: 503 });
  if (!isAllowedOrigin(request.headers.get("origin"), process.env.SITE_URL)) return NextResponse.json({ error: "This request is not allowed." }, { status: 403 });
  if (!request.headers.get("content-type")?.startsWith("application/json")) return NextResponse.json({ error: "Please send a valid inquiry." }, { status: 415 });
  // Stream with a hard cap; do not trust Content-Length from a public client.
  const reader = request.body?.getReader();
  if (!reader) return NextResponse.json({ error: "An inquiry is required." }, { status: 400 });
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 16_384) { await reader.cancel(); return NextResponse.json({ error: "Your message is too long." }, { status: 413 }); }
      chunks.push(value);
    }
    const parsed = inquirySchema.safeParse(JSON.parse(Buffer.concat(chunks).toString("utf8")));
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message || "Please check your inquiry." }, { status: 400 });
    // Vercel overwrites x-vercel-forwarded-for. Never trust client-supplied x-forwarded-for.
    const ip = process.env.VERCEL === "1" ? request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() || "unknown" : "local";
    const fingerprint = createHmac("sha256", process.env.INQUIRY_RATE_LIMIT_SALT!).update(ip).digest("hex");
    const { name, email, type, message } = parsed.data;
    const { error } = await getSupabase(true)!.rpc("submit_inquiry", { p_name: name, p_email: email, p_type: type, p_message: message, p_fingerprint: fingerprint });
    if (error?.code === "PT429") return NextResponse.json({ error: "Too many inquiries. Please try again in an hour." }, { status: 429, headers: { "Retry-After": "3600" } });
    if (error) return NextResponse.json({ error: "We couldn't save your inquiry. Please try again later." }, { status: 503 });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof SyntaxError ? "Please send a valid inquiry." : "We couldn't save your inquiry. Please try again later." }, { status: error instanceof SyntaxError ? 400 : 503 });
  }
}
