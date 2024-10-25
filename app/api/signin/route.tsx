import { NextResponse } from "next/server";
import { SignJWT } from "jose";
import { prisma } from "@/lib/prisma";
import { compare } from "bcrypt";

interface Response {
  success: boolean;
  data?: any;
  error?: string;
}

export async function POST(req: Request): Promise<NextResponse<Response>> {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
        },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { accounts: true },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid email or password",
        },
        { status: 401 }
      );
    }

    const oauthAccount = user.accounts.find(
      (account) => account.provider !== "email"
    );
    if (oauthAccount) {
      return NextResponse.json(
        {
          success: false,
          error: `Please sign in using ${oauthAccount.provider}. Your account was created with ${oauthAccount.provider} OAuth.`,
        },
        { status: 400 }
      );
    }

    const isPasswordValid = await compare(password, user.password_hash || "");
    if (!isPasswordValid) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid email or password",
        },
        { status: 401 }
      );
    }

    const token = await new SignJWT({ userId: user.id, email: user.email })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1h")
      .sign(new TextEncoder().encode(process.env.JWT_SECRET));

    const response = NextResponse.json({
      success: true,
      data: { message: "Signin successful", user },
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
    return NextResponse.json(
      {
        success: false,
        error: "Something went wrong",
      },
      { status: 500 }
    );
  }
}
