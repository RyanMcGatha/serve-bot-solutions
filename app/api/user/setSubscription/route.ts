import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Assuming prisma is exported from this path

export async function POST(req: NextRequest) {
  try {
    const { userId, subscriptionTier } = await req.json();

    if (!userId || !subscriptionTier) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Update the user's subscription tier
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { subscription: subscriptionTier },
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("Error updating subscription:", error);
    return NextResponse.json(
      { error: "An error occurred while updating the subscription" },
      { status: 500 }
    );
  }
}
