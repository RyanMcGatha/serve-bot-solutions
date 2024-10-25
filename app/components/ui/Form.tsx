"use client";
import React, { ReactNode, useState } from "react";
import { SiGithub, SiGoogle } from "react-icons/si";
import { useAuth } from "@/app/contexts/AuthContext";
import { useToast } from "@/app/contexts/ToastContext";
import Image from "next/image";
import { BubbleButton } from "../buttons/BubbleButton";
export const Heading = ({ isSignup }: { isSignup: boolean }) => (
  <div className="w-full">
    <NavLogo />
    <div className="pt-10 auth-sm:pt-0 space-y-1.5 auth-sm:text-right text-center mb-4 w-full">
      <h1 className="text-5xl font-bold auth-sm:ml-36 dark:text-zinc-300 text-zinc-900">
        {isSignup ? "Create an account" : "Sign in to your account"}
      </h1>
      <p className="dark:text-zinc-300 text-zinc-700 text-xl ">
        {isSignup ? "Already have an account? " : "Don't have an account? "}
        <a
          href={isSignup ? "/signin" : "/signup"}
          className="dark:text-zinc-50 text-zinc-500 underline"
        >
          {isSignup ? "Sign in." : "Create one."}
        </a>
      </p>
    </div>
  </div>
);

export const SocialOptions = ({ isSignup }: { isSignup: boolean }) => {
  const { handleGoogleAuth, handleGitHubAuth } = useAuth();
  return (
    <div>
      <div className="mb-3 flex flex-row gap-3">
        <BubbleButton
          className="flex w-full justify-center py-3"
          onClick={handleGoogleAuth}
        >
          <SiGoogle />
        </BubbleButton>
        <BubbleButton
          className="flex w-full justify-center py-3"
          onClick={handleGitHubAuth}
        >
          <SiGithub />
        </BubbleButton>
      </div>
      <BubbleButton className="flex w-full justify-center py-3">
        {isSignup ? "Sign up with SSO" : "Sign in with SSO"}
      </BubbleButton>
    </div>
  );
};

export const Or = () => {
  return (
    <div className="my-4 flex items-center gap-3">
      <div className="h-[1px] w-full bg-zinc-900 dark:bg-zinc-300" />
      <span className="dark:text-zinc-300 text-zinc-700">OR</span>
      <div className="h-[1px] w-full bg-zinc-900 dark:bg-zinc-300" />
    </div>
  );
};

export const Email = ({ isSignup }: { isSignup: boolean }) => {
  const toast = useToast();
  const { login, signup } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await login(email, password);
    if (res?.error) {
      toast.error(res.error);
    }
  };
  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const res = await signup(email, password);
    if (res?.error) {
      toast.error(res.error);
    }
  };
  return (
    <form
      onSubmit={isSignup ? handleSignup : handleSubmit}
      className="text-zinc-700 dark:text-zinc-300"
    >
      <div className="mb-3">
        <label htmlFor="email-input" className="mb-1.5 block ">
          Email
        </label>
        <input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          autoComplete="email"
          required
          id="email-input"
          type="email"
          placeholder="jon_doe@example.com"
          className="w-full rounded-md border   px-3 py-2 placeholder-zinc-600border-zinc-700 dark:border-zinc-400 dark:bg-dorkz bg-creamy-11 dark:placeholder-zinc-400 ring-1 ring-transparent transition-shadow focus:outline-0 focus:ring-zinc-600 dark:focus:ring-zinc-100"
        />
      </div>
      <div className="mb-6">
        <div className="mb-1.5 flex items-end justify-between">
          <label htmlFor="password-input" className="block ">
            Password
          </label>
          <a href="#" className="text-sm  underline">
            Forgot?
          </a>
        </div>
        <input
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          id="password-input"
          autoComplete="current-password"
          required
          type="password"
          placeholder="••••••••••••"
          className="w-full rounded-md border border-zinc-700 dark:border-zinc-400 dark:bg-dorkz bg-creamy-11  px-3 py-2 placeholder-zinc-600 dark:placeholder-zinc-400 ring-1 ring-transparent transition-shadow focus:outline-0 focus:ring-zinc-600 dark:focus:ring-zinc-100"
        />
      </div>

      <BubbleButton type="submit" className="flex w-full justify-center py-3">
        {isSignup ? "Sign up" : "Sign in"}
      </BubbleButton>
    </form>
  );
};

export const Terms = () => (
  <div className="w-full text-center">
    <p className="mt-9 text-sm ">
      By signing in, you agree to our{" "}
      <a href="#" className="text-zinc-500 dark:text-zinc-50 underline">
        Terms & Conditions
      </a>{" "}
      and{" "}
      <a href="#" className="text-zinc-500 dark:text-zinc-50 underline">
        Privacy Policy.
      </a>
    </p>
  </div>
);

export const NavLogo = () => {
  return (
    <Image
      src="/Serve-bot.svg"
      alt="ServeBot logo"
      width={15}
      height={0}
      className="dark:invert object-contain static auth-sm:fixed auth-sm:top-12 auth-sm:left-16 mt-5 m-auto scale-[10] auth-sm:scale-[11] 480:left-20 auth-md:top-14 auth-md:scale-[13]"
      style={{ clipPath: "inset(20% 10% 21% 10%)" }}
    />
  );
};

type ButtonProps = {
  children: ReactNode;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;
