import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await auth();

  if (!session?.accessToken) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  const { searchParams } = req.nextUrl;
  const limit = searchParams.get("limit") ?? "10";
  const offset = searchParams.get("offset") ?? "0";

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/quiz/history?limit=${limit}&offset=${offset}`,
    {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
      cache: "no-store",
    }
  );

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
