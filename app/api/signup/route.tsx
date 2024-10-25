import { NextResponse } from "next/server";
import { SignJWT } from "jose";
import { prisma } from "@/lib/prisma";
import { hash } from "bcrypt";

interface Response {
  success: boolean;
  data?: any;
  error?: string;
}

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      const response: Response = {
        success: false,
        error: "Missing required fields",
      };
      return NextResponse.json(response, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
      include: { accounts: true },
    });

    if (existingUser) {
      const oauthAccount = existingUser.accounts.find(
        (account) => account.provider !== "email"
      );
      if (oauthAccount) {
        const response: Response = {
          success: false,
          error: `You have already signed up using ${oauthAccount.provider}. Please sign in with ${oauthAccount.provider}.`,
        };
        return NextResponse.json(response, { status: 400 });
      }

      const response: Response = {
        success: false,
        error: "User already exists. Please log in instead.",
      };
      return NextResponse.json(response, { status: 409 });
    }

    const hashedPassword = await hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password_hash: hashedPassword,
      },
    });

    const token = await new SignJWT({ userId: user.id, email: user.email })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1h")
      .sign(new TextEncoder().encode(process.env.JWT_SECRET));

    const response = NextResponse.json({
      success: true,
      data: { message: "Signup successful", user },
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60,
    });

    return response;
  } catch (error) {
    console.error(error);
    const response: Response = {
      success: false,
      error: "Something went wrong",
    };
    return NextResponse.json(response, { status: 500 });
  }
}
