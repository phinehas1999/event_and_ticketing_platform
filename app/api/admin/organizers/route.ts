import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema/users";
import { NextResponse } from "next/server";
import { sql, desc } from "drizzle-orm";

export async function GET() {
  const session = await auth();
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.role !== "ADMIN")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const list = await db
    .select({ id: users.id, name: users.name, email: users.email })
    .from(users)
    .where(sql`role = 'ORGANIZER'`)
    .orderBy(desc(users.createdAt));
  return NextResponse.json(list);
}
