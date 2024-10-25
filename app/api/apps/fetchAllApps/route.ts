// src/app/api/apps/route.ts

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Define the type for the response data if needed
interface App {
  id: string;
  name: string;
  title: string;
  description?: string | null; // Allow null
  imgUrl: string | null;
  isCustom: boolean;
  createdAt: Date;
  updatedAt: Date;
  // Add isFree to match the database structure
  isFree: boolean;
}

// Fetch all apps with a GET request
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
