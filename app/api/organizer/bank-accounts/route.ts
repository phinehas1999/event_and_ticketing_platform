import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { bankAccounts } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json([], { status: 200 });

    const accounts = await db
      .select()
      .from(bankAccounts)
      .where(eq(bankAccounts.organizerId, session.user.id));

    return NextResponse.json(accounts);
  } catch (error) {
    console.error("Failed to fetch bank accounts:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
