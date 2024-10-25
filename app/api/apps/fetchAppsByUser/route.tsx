import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { jwtVerify } from "jose";

const prisma = new PrismaClient();
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function GET(req: NextRequest) {
  try {
    // Retrieve JWT token
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "User is not authenticated" },
        { status: 401 }
      );
    }

    // Verify and decode JWT
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userId = payload.userId as string;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Fetch apps directly from the app table, filtering by userId in userAppAccess
    const apps = await prisma.app.findMany({
      where: {
        userAccess: {
          some: {
            userId: userId,
          },
        },
      },
      include: {
        userAccess: true, // Include related user access if needed
      },
    });

    // Check if any apps were found
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
