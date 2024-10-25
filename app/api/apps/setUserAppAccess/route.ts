import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, SubscriptionTier } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { userId, appId } = await req.json();

    // Fetch the user and their subscription tier
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { appAccess: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if the app exists
    const app = await prisma.app.findUnique({
      where: { id: appId },
    });

    if (!app) {
      return NextResponse.json({ error: "App not found" }, { status: 404 });
    }

    // Check if the user already has access to the app
    const existingAccess = user.appAccess.find(
      (access) => access.appId === appId
    );
    if (existingAccess) {
      return NextResponse.json(
        { error: "User already has access to this app" },
        { status: 400 }
      );
    }

    // Determine access based on the user's subscription tier
    if (user.subscription === SubscriptionTier.NONE) {
      return NextResponse.json(
        { error: "User does not have a subscription to access any apps" },
        { status: 403 }
      );
    }

    if (user.subscription === SubscriptionTier.FREE && !app.isFree) {
      return NextResponse.json(
        { error: "User on free tier cannot access paid apps" },
        { status: 403 }
      );
    }

    if (user.subscription === SubscriptionTier.BASIC && app.isCustom) {
      return NextResponse.json(
        { error: "User on basic tier cannot access custom apps" },
        { status: 403 }
      );
    }

    // Create new user app access record
    const userAppAccess = await prisma.userAppAccess.create({
      data: { userId, appId },
    });

    return NextResponse.json(userAppAccess, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "An error occurred while processing the request" },
      { status: 500 }
    );
  }
}
