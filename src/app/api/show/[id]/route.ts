import { NextResponse } from "next/server";
import { deleteShow, getShowById } from "@/db/actions/show";

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  const id = (await params).id;

  console.log(id);

  if (!id) {
    return NextResponse.json(
      { error: "Show ID is required." },
      { status: 400 }
    );
  }

  try {
    const show = await getShowById(id);
    if (!show) {
      return NextResponse.json({ error: "Show not found." }, { status: 404 });
    }
    return NextResponse.json(show, { status: 200 });
  } catch (error) {
    console.error("Error fetching show by ID:", error);
    return NextResponse.json(
      { error: "Failed to fetch show." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Show ID is required." },
      { status: 400 }
    );
  }

  try {
    await deleteShow(id);
    return NextResponse.json({ message: "Show deleted." }, { status: 200 });
  } catch (error) {
    console.error("Error deleting show by ID:", error);
    return NextResponse.json(
      { error: "Failed to delete show." },
      { status: 500 }
    );
  }
}
