import { createSeason } from "@/db/actions/season";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { number, showId } = await req.json();

  if (!number || !showId) {
    return NextResponse.json(
      { error: "Season number and show ID are required." },
      { status: 400 }
    );
  }

  try {
    await createSeason(number, showId);
    return NextResponse.json({ message: "Season created." }, { status: 201 });
  } catch (error) {
    console.error("Error creating season:", error);
    return NextResponse.json(
      { error: "Failed to create season." },
      { status: 500 }
    );
  }
}
