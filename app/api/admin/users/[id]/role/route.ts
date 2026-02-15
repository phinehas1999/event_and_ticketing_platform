import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema/users";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } },
) {
  const session = await auth();
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.role !== "ADMIN")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = (await params) as { id: string };
  const body = await req.json();
  const { role } = body as { role?: string };
  if (!role)
    return NextResponse.json({ error: "Missing role" }, { status: 400 });

  const [updated] = await db
    .update(users)
    .set({ role })
    .where(eq(users.id, id))
    .returning();

  return NextResponse.json({ ok: true, user: updated });
}
