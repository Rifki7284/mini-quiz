import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();

  if (!session?.accessToken) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
export async function PUT(req: Request) {
  try {
    const session = await auth();

    if (!session?.accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Update profile error:", error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
