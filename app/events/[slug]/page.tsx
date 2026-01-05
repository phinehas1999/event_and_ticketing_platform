interface Props {
  params: { slug: string };
}

export default function EventDetailsPage({ params }: Props) {
  return (
    <main style={{ padding: 32 }}>
      <h1>Event: {params.slug}</h1>
      <p>Event details, ticket types, payment instructions.</p>

      <button>Request Ticket</button>
    </main>
  );
}
