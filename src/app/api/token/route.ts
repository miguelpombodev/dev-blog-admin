// ✅ CORRETO: app/api/token/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const token = (await cookies()).get("loginCredentials")?.value;
  return NextResponse.json({ token: token || null });
}
