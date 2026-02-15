import { redirect } from "next/navigation";

export default async function EventIdPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const { id } = (await params) as { id: string };
  // Redirect legacy /admin/events/:id to the edit page
  redirect(`/admin/events/${id}/edit`);
}
