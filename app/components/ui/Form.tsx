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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await (isSignup
      ? signup(email, password)
      : login(email, password));
    if (res?.error) {
      toast.error(res.error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="text-zinc-700 dark:text-zinc-300 space-y-5"
    >
      <div>
        <label htmlFor="email-input" className="block mb-2">
          Email
        </label>
        <input
          id="email-input"
          type="email"
          placeholder="example@example.com"
          className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-zinc-600 dark:focus:ring-zinc-100 border-zinc-700 dark:border-zinc-400 bg-creamy-11 dark:bg-dorkz placeholder-zinc-600 dark:placeholder-zinc-400 transition-all"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <div className="flex justify-between mb-2">
          <label htmlFor="password-input">Password</label>
          <a
            href="#"
            className="text-sm underline hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
          >
            Forgot?
          </a>
        </div>
        <input
          id="password-input"
          type="password"
          placeholder="••••••••••••"
          className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-zinc-600 dark:focus:ring-zinc-100 border-zinc-700 dark:border-zinc-400 bg-creamy-11 dark:bg-dorkz placeholder-zinc-600 dark:placeholder-zinc-400 transition-all"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <BubbleButton
        type="submit"
        className="flex w-full justify-center py-3 mt-4"
      >
        {isSignup ? "Sign Up" : "Sign In"}
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
      width={15} // adjust based on desired logo size
      height={10} // adjust based on desired logo size
      loading="eager"
      className="dark:invert object-contain static auth-sm:absolute auth-sm:top-12 auth-sm:left-16 mt-5 m-auto scale-[10] auth-sm:scale-[11] 480:left-20 auth-md:top-14 auth-md:scale-[13]"
      style={{ clipPath: "inset(20% 10% 21% 10%)" }}
    />
  );
};

type ButtonProps = {
  children: ReactNode;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;
