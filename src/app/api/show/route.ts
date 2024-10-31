import { NextResponse } from "next/server";
import { createShow, getShows } from "@/db/actions/show";

export async function GET(req: Request) {
  try {
    const shows = await getShows();
    return NextResponse.json(shows, { status: 200 });
  } catch (error) {
    console.error("Error fetching shows:", error);
    return NextResponse.json(
      { error: "Failed to fetch shows." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const { name } = await req.json();

  if (!name) {
    return NextResponse.json(
      { error: "Show name is required." },
      { status: 400 }
    );
  }

  try {
    const show = await createShow(name);
    return NextResponse.json(show, { status: 201 });
  } catch (error) {
    console.error("Error creating show:", error);
    return NextResponse.json(
      { error: "Failed to create show." },
      { status: 500 }
    );
  }
}
