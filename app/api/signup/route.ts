import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/db";
import { users } from "@/db/schema/users";

export async function POST(req: Request) {
  const body = await req.json();
  const { name, email, password } = body;

  const passwordHash = await bcrypt.hash(password, 10);

  await db.insert(users).values({
    name,
    email,
    passwordHash,
  });

  return NextResponse.json({ success: true });
}
