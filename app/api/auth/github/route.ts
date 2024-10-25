import { NextResponse } from "next/server";

export async function GET() {
  const rootUrl = "https://github.com/login/oauth/authorize";

  const options = {
    client_id: process.env.GITHUB_CLIENT_ID,
    redirect_uri: process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URI,
    scope: "read:user user:email", // Scope to access user info
    allow_signup: "true",
  };

  const qs = new URLSearchParams(options as Record<string, string>);
  const githubAuthUrl = `${rootUrl}?${qs.toString()}`;

  return NextResponse.redirect(githubAuthUrl);
}
