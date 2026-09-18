// Replace null values with owner-approved business details before launch.
export const restaurant: {
  name: string; address: string | null; phone: string | null;
  hours: { days: string; time: string }[];
  directionsUrl: string | null; orderUrl: string | null;
} = {
  name: "Shallot",
  address: null,
  phone: null,
  hours: [],
  directionsUrl: null,
  orderUrl: null,
};

export function externalUrl(value: string | null): string | undefined {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.href : undefined;
  } catch { return undefined; }
}
