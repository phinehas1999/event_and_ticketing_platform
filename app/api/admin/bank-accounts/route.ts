import { auth } from "@/auth";
import { db } from "@/db";
import { bankAccounts } from "@/db/schema/bankAccounts";
import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";

export async function GET() {
  const session = await auth();
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.role !== "ADMIN")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const list = await db
    .select()
    .from(bankAccounts)
    .orderBy(desc(bankAccounts.createdAt));
  return NextResponse.json(list);
}
