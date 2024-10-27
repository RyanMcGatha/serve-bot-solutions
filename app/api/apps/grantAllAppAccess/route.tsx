import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, SubscriptionTier } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();

    // Fetch the user and their subscription tier
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { appAccess: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch all available apps
    const apps = await prisma.app.findMany();

    const accessibleApps = apps.filter((app) => {
      if (user.subscription === SubscriptionTier.FREE) {
        return app.isFree; // Allow only free apps for free tier users
      }
      if (user.subscription === SubscriptionTier.BASIC) {
        return !app.isCustom; // Allow all apps except custom apps for basic tier users
      }
      return true; // Allow all apps for pro tier users
    });

    // Filter out apps the user already has access to
    const newAppAccess = accessibleApps.filter(
      (app) => !user.appAccess.some((access) => access.appId === app.id)
    );

    // Bulk create new app access entries for the user
    const userAppAccess = await prisma.userAppAccess.createMany({
      data: newAppAccess.map((app) => ({
        userId,
        appId: app.id,
      })),
      skipDuplicates: true,
    });

    return NextResponse.json(
      { message: "Access granted to all applicable apps", userAppAccess },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "An error occurred while processing the request" },
      { status: 500 }
    );
  }
}
