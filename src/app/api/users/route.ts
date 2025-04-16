import { NextRequest, NextResponse } from "next/server";
import { mockUsers } from "@/lib/data/mock-data";

export async function GET(request: NextRequest) {
  const role = request.nextUrl.searchParams.get("role");

  if (role) {
    const filteredUsers = mockUsers.filter((user) => user.role === role);
    return NextResponse.json(filteredUsers);
  }

  return NextResponse.json(mockUsers);
}
