import { NextResponse, NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";

interface JWTData {
  userId: number;
  email: string;
}

interface Response {
  success: boolean;
  data?: any;
  error?: string;
}

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value; // Extract the string value from the RequestCookie

    if (!token) {
      const response: Response = { success: false, error: "No token provided" };
      return NextResponse.json(response, { status: 401 });
    }

    const { payload } = (await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    )) as { payload: JWTData };

    const user = await prisma.user.findUnique({
      where: { id: String(payload.userId) },
    });

    if (!user) {
      const response: Response = { success: false, error: "User not found" };
      return NextResponse.json(response, { status: 404 });
    }

    const response: Response = { success: true, data: { user } };
    return NextResponse.json(response);
  } catch (error) {
    console.error(error);
    const response: Response = {
      success: false,
      error: error.response?.data?.error || "Invalid or expired token",
    };
    return NextResponse.json(response, { status: 401 });
  }
}
