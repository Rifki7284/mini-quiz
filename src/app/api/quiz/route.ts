import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();

  if (!session?.accessToken) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subtests`, {
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
