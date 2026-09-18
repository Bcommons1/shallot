import "server-only";
import { z } from "zod";
import { getSupabase } from "@/lib/supabase";

const menuItemSchema = z.object({
  id: z.string(), name: z.string(), description: z.string(), category: z.string(),
  price: z.number().nonnegative().nullable(), currency: z.string().regex(/^[A-Z]{3}$/),
  dietary_labels: z.array(z.string()),
});
export type MenuItem = z.infer<typeof menuItemSchema>;

export async function getMenu(): Promise<{ items: MenuItem[]; state: "live" | "preview" | "unavailable" }> {
  const client = getSupabase();
  if (!client) return { items: [], state: "preview" };
  try {
    const { data, error } = await client.from("menu_items")
      .select("id,name,description,category,price,currency,dietary_labels")
      .eq("published", true).order("sort_order").order("name");
    if (error) return { items: [], state: "unavailable" };
    const parsed = z.array(menuItemSchema).safeParse(data);
    return parsed.success ? { items: parsed.data, state: "live" } : { items: [], state: "unavailable" };
  } catch { return { items: [], state: "unavailable" }; }
}

export function formatPrice(price: number | null, currency: string) {
  if (price === null) return "Price to be added";
  try { return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(price); }
  catch { return `${price.toFixed(2)} ${currency}`; }
}
