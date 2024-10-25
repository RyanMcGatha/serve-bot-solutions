import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const userApps = await prisma.userAppAccess.findMany({
      where: { userId },
      include: {
        app: true,
      },
    });

    if (!userApps.length) {
      return NextResponse.json(
        { error: "No apps found for this user" },
        { status: 404 }
      );
    }

    return NextResponse.json(userApps, { status: 200 });
  } catch (error) {
    console.error("Error fetching user apps:", error);
    return NextResponse.json(
      { error: "Failed to fetch apps" },
      { status: 500 }
    );
  }
}
