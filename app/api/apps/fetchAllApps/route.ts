import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, App } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const apps: App[] = await prisma.app.findMany({
      include: {
        userAccess: true,
      },
    });

    return NextResponse.json(apps);
  } catch (error) {
    console.error("Error fetching apps:", error);

    return new NextResponse("Failed to fetch apps", { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
