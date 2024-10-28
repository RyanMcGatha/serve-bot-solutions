import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect("/signin");
  }

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

  const userResponse = await fetch(
    `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`
  );
  const userData = await userResponse.json();

  let user = await prisma.user.findUnique({
    where: { email: userData.email },
  });

  if (!user) {
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
    const account = await prisma.account.findUnique({
      where: {
        provider_providerAccountId: {
          provider: "google",
          providerAccountId: userData.id,
        },
      },
    });

    if (!account) {
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

  const response = NextResponse.redirect("https://servebot.tech/dashboard");
  response.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60,
    path: "/",
  });

  return response;
}
