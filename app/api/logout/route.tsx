import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Create a response object
    const response = NextResponse.json({ message: "Logout successful" });

    // Clear the token cookie by setting it with a past expiry date
    response.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Secure only in production
      sameSite: "lax",
      expires: new Date(0), // Expire the cookie immediately
    });

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
