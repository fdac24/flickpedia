import { createEpisode } from "@/db/actions/episode";
import { IEpisode } from "@/db/models/episode";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const episode: IEpisode = await req.json();

  if (!episode) {
    return NextResponse.json(
      { error: "Episode data is required." },
      { status: 400 }
    );
  }

  try {
    await createEpisode(episode);
    return NextResponse.json({ message: "Episode created." }, { status: 201 });
  } catch (error) {
    console.error("Error creating episode:", error);
    return NextResponse.json(
      { error: "Failed to create episode." },
      { status: 500 }
    );
  }
}
