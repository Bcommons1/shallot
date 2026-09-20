export const restaurant: {
  name: string; address: string | null; phone: string | null;
  hours: { days: string; time: string }[];
  directionsUrl: string | null; orderUrl: string | null;
} = {
  name: "Shallot",
  address: "53 Baymont St, Clearwater Beach, FL 33767",
  phone: "(727) 281-6604",
  hours: [
    { days: "Sunday", time: "5:00 – 9:00 PM" },
    { days: "Monday", time: "Closed" },
    { days: "Tuesday – Thursday", time: "5:00 – 9:00 PM" },
    { days: "Friday – Saturday", time: "5:00 – 10:00 PM" },
  ],
  directionsUrl:
    "https://www.google.com/maps/search/?api=1&query=53+Baymont+St%2C+Clearwater+Beach%2C+FL+33767",
  orderUrl: null,
};

export function externalUrl(value: string | null): string | undefined {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.href : undefined;
  } catch { return undefined; }
}
