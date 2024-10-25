import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Import Prisma client
import jwt from "jsonwebtoken";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect("/signin");
  }

  // Exchange the authorization code for an access token
  const tokenResponse = await fetch(
    "https://github.com/login/oauth/access_token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: new URLSearchParams({
        code,
        client_id: process.env.GITHUB_CLIENT_ID!,
        client_secret: process.env.GITHUB_CLIENT_SECRET!,
        redirect_uri: process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URI!,
      }),
    }
  );
  const tokenData = await tokenResponse.json();

  if (tokenData.error) {
    return NextResponse.redirect("/signin");
  }

  const { access_token } = tokenData;

  // Fetch user information from GitHub
  const userResponse = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  const userData = await userResponse.json();

  // Fetch user's email (since it's a separate API call in GitHub)
  const emailResponse = await fetch("https://api.github.com/user/emails", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  const emailData = await emailResponse.json();
  const primaryEmail = emailData.find(
    (email: any) => email.primary && email.verified
  )?.email;

  if (!primaryEmail) {
    return NextResponse.redirect("/signin?error=NoEmail");
  }

  // Check if the user already exists in the database
  let user = await prisma.user.findUnique({
    where: { email: primaryEmail },
  });

  if (!user) {
    // Create a new user if they don't exist
    user = await prisma.user.create({
      data: {
        email: primaryEmail,
        name: userData.name,
        imageUrl: userData.avatar_url,
        accounts: {
          create: {
            provider: "github",
            providerAccountId: userData.id.toString(),
            accessToken: access_token,
          },
        },
      },
    });
  } else {
    // If user exists, check if there's an associated GitHub account
    const account = await prisma.account.findUnique({
      where: {
        provider_providerAccountId: {
          provider: "github",
          providerAccountId: userData.id.toString(),
        },
      },
    });

    if (!account) {
      // Create a new GitHub account if it doesn't exist
      await prisma.account.create({
        data: {
          provider: "github",
          providerAccountId: userData.id.toString(),
          userId: user.id,
          accessToken: access_token,
        },
      });
    } else {
      // Optionally, update the access token if the account exists
      await prisma.account.update({
        where: {
          provider_providerAccountId: {
            provider: "github",
            providerAccountId: userData.id.toString(),
          },
        },
        data: {
          accessToken: access_token,
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
