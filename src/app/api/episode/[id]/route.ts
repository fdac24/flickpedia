import { deleteEpisode, getEpisode, updateEpisode } from "@/db/actions/episode";
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
      { error: "Episode ID is required." },
      { status: 400 }
    );
  }

  try {
    const episode = await getEpisode(id);
    if (!episode) {
      return NextResponse.json(
        { error: "Episode not found." },
        { status: 404 }
      );
    }
    return NextResponse.json(episode, { status: 200 });
  } catch (error) {
    console.error("Error fetching episode by ID:", error);
    return NextResponse.json(
      { error: "Failed to fetch episode." },
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
      { error: "Episode ID is required." },
      { status: 400 }
    );
  }

  const episodeData = await req.json();

  if (!episodeData) {
    return NextResponse.json(
      { error: "Episode data is required." },
      { status: 400 }
    );
  }

  try {
    const episode = await updateEpisode(id, episodeData);
    return NextResponse.json(episode, { status: 200 });
  } catch (error) {
    console.error("Error updating episode:", error);
    return NextResponse.json(
      { error: "Failed to update episode." },
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
      { error: "Episode ID is required." },
      { status: 400 }
    );
  }

  try {
    await deleteEpisode(id);
    return NextResponse.json({ message: "Episode deleted." }, { status: 200 });
  } catch (error) {
    console.error("Error deleting episode:", error);
    return NextResponse.json(
      { error: "Failed to delete episode." },
      { status: 500 }
    );
  }
}
