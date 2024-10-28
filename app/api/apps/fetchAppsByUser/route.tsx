import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { jwtVerify } from "jose";

const prisma = new PrismaClient();
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "User is not authenticated" },
        { status: 401 }
      );
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userId = payload.userId as string;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const apps = await prisma.app.findMany({
      where: {
        userAccess: {
          some: {
            userId: userId,
          },
        },
      },
      include: {
        userAccess: true,
      },
    });

    if (!apps.length) {
      return NextResponse.json(
        { error: "No apps found for this user" },
        { status: 404 }
      );
    }

    return NextResponse.json(apps, { status: 200 });
  } catch (error) {
    console.error("Error fetching apps for user:", error);
    return NextResponse.json(
      { error: "Failed to fetch apps" },
      { status: 500 }
    );
  }
}
