import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const appId = searchParams.get("id");

    if (!appId) {
      return NextResponse.json(
        { error: "App ID is required" },
        { status: 400 }
      );
    }

    const app = await prisma.app.findUnique({
      where: { id: appId },
      include: {
        userAccess: true,
      },
    });

    if (!app) {
      return NextResponse.json({ error: "App not found" }, { status: 404 });
    }

    return NextResponse.json(app, { status: 200 });
  } catch (error) {
    console.error("Error fetching app by ID:", error);
    return NextResponse.json({ error: "Failed to fetch app" }, { status: 500 });
  }
}
