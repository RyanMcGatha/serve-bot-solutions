import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Import Prisma client
import jwt from "jsonwebtoken";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect("/signin");
  }

  // Exchange the authorization code for access token
  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI!,
      grant_type: "authorization_code",
    }),
  });
  const tokenData = await tokenResponse.json();

  if (tokenData.error) {
    return NextResponse.redirect("/signin");
  }

  const { access_token } = tokenData;

  // Fetch user information from Google
  const userResponse = await fetch(
    `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`
  );
  const userData = await userResponse.json();

  // Check if the user already exists in the database
  let user = await prisma.user.findUnique({
    where: { email: userData.email },
  });

  if (!user) {
    // Create a new user if they don't exist
    user = await prisma.user.create({
      data: {
        email: userData.email,
        name: userData.name,
        imageUrl: userData.picture,
        accounts: {
          create: {
            provider: "google",
            providerAccountId: userData.id,
            accessToken: tokenData.access_token,
            refreshToken: tokenData.refresh_token,
          },
        },
      },
    });
  } else {
    // If user exists, check if there's an associated Google account
    const account = await prisma.account.findUnique({
      where: {
        provider_providerAccountId: {
          provider: "google",
          providerAccountId: userData.id,
        },
      },
    });

    if (!account) {
      // Create a new Google account if it doesn't exist
      await prisma.account.create({
        data: {
          provider: "google",
          providerAccountId: userData.id,
          userId: user.id,
          accessToken: tokenData.access_token,
          refreshToken: tokenData.refresh_token,
        },
      });
    } else {
      // Optionally, update the access and refresh tokens if the account exists
      await prisma.account.update({
        where: {
          provider_providerAccountId: {
            provider: "google",
            providerAccountId: userData.id,
          },
        },
        data: {
          accessToken: tokenData.access_token,
          refreshToken: tokenData.refresh_token,
        },
      });
    }
  }

  // Create a JWT token for the session
  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email,
      name: user.name,
      picture: user.imageUrl,
    },
    process.env.JWT_SECRET!,
    { expiresIn: "1h" }
  );

  // Set the token in a cookie
  const response = NextResponse.redirect("https://servebot.tech/dashboard");
  response.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60, // 1 hour
    path: "/",
  });

  return response;
}
