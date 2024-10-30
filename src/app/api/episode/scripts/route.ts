import { getScripts } from "@/db/actions/episode";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
      const scripts = await getScripts();
      return NextResponse.json(scripts, { status: 200 });
    } catch (error) {
      console.error("Error fetching scripts:", error);
      return NextResponse.json(
        { error: "Failed to fetch scripts." },
        { status: 500 }
      );
    }
  }