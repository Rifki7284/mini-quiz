import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
export async function GET(
  req: Request,
  { params }: { params: Promise<{ subtest_id: string }> },
) {
  const session = await auth();
  const { subtest_id } = await params;
  if (!session?.accessToken) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/quiz/start/${subtest_id}`,
    {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    },
  );

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
