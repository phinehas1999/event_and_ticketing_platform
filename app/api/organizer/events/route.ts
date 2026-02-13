import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { events } from "@/db/schema";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!(session.user.role === "ORGANIZER" || session.user.role === "ADMIN")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const {
      title,
      slug,
      description,
      startDate,
      endDate,
      location,
      coverImageUrl,
      bankAccountId,
    } = body;

    if (
      !title ||
      !slug ||
      !startDate ||
      !endDate ||
      !location ||
      !bankAccountId
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    await db.insert(events).values({
      title,
      slug,
      description: description || "",
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      location,
      coverImageUrl: coverImageUrl || null,
      organizerId: session.user.id,
      bankAccountId,
      status: "PENDING",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to create event:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
