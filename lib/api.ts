export async function fetcher<T = any>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) {
    throw new Error(`API request failed: ${res.status}`);
  }
  return res.json();
}

export type Event = {
  id: string;
  title: string;
  slug: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  coverImageUrl?: string | null;
  organizerId: string;
  bankAccountId: string;
  status: "DRAFT" | "PENDING" | "PUBLISHED" | "CANCELLED";
  createdAt: string;
};
export async function fetchEvents(): Promise<Event[]> {
  return fetcher<Event[]>("/api/events");
}
