import { z } from "zod";

export const inquirySchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(100),
  email: z.email("Please enter a valid email address.").trim().max(254),
  type: z.enum(["general", "catering"]),
  message: z.string().trim().min(10, "Please tell us a little more (at least 10 characters).").max(3000),
  consent: z.literal(true, { error: "Please agree so we can reply to your inquiry." }),
  website: z.string().max(0, "Please leave this field empty."),
});

export function isAllowedOrigin(origin: string | null, siteUrl: string | undefined) {
  if (!origin || !siteUrl) return false;
  try { return origin === new URL(siteUrl).origin; } catch { return false; }
}
