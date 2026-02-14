import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { events } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!(session.user.role === "ORGANIZER" || session.user.role === "ADMIN")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id: eventId } = await params;
    console.log(
      "Fetching event:",
      eventId,
      "for user:",
      session.user.id,
      "role:",
      session.user.role,
    );

    const whereClause =
      session.user.role === "ADMIN"
        ? eq(events.id, eventId)
        : and(eq(events.id, eventId), eq(events.organizerId, session.user.id));

    const result = await db.select().from(events).where(whereClause).limit(1);

    console.log("Query result:", result);

    const event = result[0];
    if (!event) {
      console.log("Event not found");
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error("Failed to fetch event:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!(session.user.role === "ORGANIZER" || session.user.role === "ADMIN")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id: eventId } = await params;
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

    const updated = await db
      .update(events)
      .set({
        title,
        slug,
        description: description || "",
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        location,
        coverImageUrl: coverImageUrl || null,
        bankAccountId,
      })
      .where(
        session.user.role === "ADMIN"
          ? eq(events.id, eventId)
          : and(
              eq(events.id, eventId),
              eq(events.organizerId, session.user.id),
            ),
      )
      .returning({ id: events.id });

    if (updated.length === 0) {
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to update event:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
