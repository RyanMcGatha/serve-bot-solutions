import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, App } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    // Fetch all apps from the database
    const apps: App[] = await prisma.app.findMany({
      include: {
        userAccess: true,
      },
    });

    // Respond with the list of apps as JSON
    return NextResponse.json(apps);
  } catch (error) {
    console.error("Error fetching apps:", error);
    // Respond with a 500 status code in case of error
    return new NextResponse("Failed to fetch apps", { status: 500 });
  }
}
