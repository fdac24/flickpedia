import { NextResponse } from "next/server";
import { deleteShow, getShowById, updateShow } from "@/db/actions/show";

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
      { error: "Show ID is required." },
      { status: 400 }
    );
  }

  const showData = await req.json();

  if (!showData) {
    return NextResponse.json(
      { error: "Show data is required." },
      { status: 400 }
    );
  }

  try {
    const show = await updateShow(id, showData);
    return NextResponse.json(show, { status: 200 });
  } catch (error) {
    console.error("Error updating show by ID:", error);
    return NextResponse.json(
      { error: "Failed to update show." },
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
