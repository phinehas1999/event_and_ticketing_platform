import { db } from "@/db";
import { events } from "@/db/schema";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const allEvents = await db.select().from(events);

    return NextResponse.json(allEvents);
  } catch (error) {
    console.error("Failed to fetch events:", error);
    return NextResponse.json(
      { error: "Internal Server Error" }, 
      { status: 500 }
    );
  }
}