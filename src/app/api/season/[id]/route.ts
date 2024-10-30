import { deleteSeason, getSeason, updateSeason } from "@/db/actions/season";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  const id = (await params).id;

  if (!id) {
    return NextResponse.json(
      { error: "Season ID is required." },
      { status: 400 }
    );
  }

  try {
    const season = await getSeason(id);
    if (!season) {
      return NextResponse.json({ error: "Season not found." }, { status: 404 });
    }
    return NextResponse.json(season, { status: 200 });
  } catch (error) {
    console.error("Error fetching season by ID:", error);
    return NextResponse.json(
      { error: "Failed to fetch season." },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  const id = (await params).id;

  if (!id) {
    return NextResponse.json(
      { error: "Season ID is required." },
      { status: 400 }
    );
  }

  const seasonData = await req.json();

  if (!seasonData) {
    return NextResponse.json(
      { error: "Season data is required." },
      { status: 400 }
    );
  }

  try {
    const season = await updateSeason(id, seasonData);
    return NextResponse.json(season, { status: 200 });
  } catch (error) {
    console.error("Error updating season by ID:", error);
    return NextResponse.json(
      { error: "Failed to update season." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  const id = (await params).id;

  if (!id) {
    return NextResponse.json(
      { error: "Season ID is required." },
      { status: 400 }
    );
  }

  try {
    await deleteSeason(id);
    return NextResponse.json({ message: "Season deleted." }, { status: 200 });
  } catch (error) {
    console.error("Error deleting season by ID:", error);
    return NextResponse.json(
      { error: "Failed to delete season." },
      { status: 500 }
    );
  }
}
