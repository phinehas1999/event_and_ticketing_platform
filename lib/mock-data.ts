// Using types derived from your schema logic
export type Event = {
  id: string;
  title: string;
  slug: string;
  description: string;
  startDate: string;
  location: string;
  coverImageUrl: string;
  status: "PUBLISHED" | "DRAFT";
};

export type TicketType = {
  id: string;
  name: string;
  price: number; // in cents
};

export const MOCK_EVENTS: Event[] = [
  {
    id: "1",
    title: "Addis Jazz Festival 2026",
    slug: "addis-jazz-festival-2026",
    description: "Experience the fusion of Ethio-jazz and modern sounds in the heart of Addis Ababa. Three days of music, culture, and food.",
    startDate: "2026-06-12T18:00:00Z",
    location: "Ghion Hotel, Addis Ababa",
    coverImageUrl: "https://images.unsplash.com/photo-1514525253440-b393452e8d26?q=80&w=800&auto=format&fit=crop",
    status: "PUBLISHED",
  },
  {
    id: "2",
    title: "Tech Summit Ethiopia",
    slug: "tech-summit-ethiopia",
    description: "The biggest gathering of developers, startups, and investors in East Africa.",
    startDate: "2026-08-20T09:00:00Z",
    location: "Skylight Hotel, Addis Ababa",
    coverImageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop",
    status: "PUBLISHED",
  },
  {
    id: "3",
    title: "Art & Wine Evening",
    slug: "art-and-wine-evening",
    description: "A relaxed evening featuring local artists and premium wine tasting.",
    startDate: "2026-05-15T19:30:00Z",
    location: "Entoto Park Gallery",
    coverImageUrl: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=800&auto=format&fit=crop",
    status: "PUBLISHED",
  }
];

export const MOCK_TICKETS: TicketType[] = [
  { id: "t1", name: "Regular Pass", price: 50000 }, // 500 ETB
  { id: "t2", name: "VIP Experience", price: 150000 }, // 1500 ETB
];