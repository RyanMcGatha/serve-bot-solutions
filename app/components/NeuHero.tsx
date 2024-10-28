"use client";
import Link from "next/link";
import React from "react";
import { FiArrowUpRight } from "react-icons/fi";
import { Highlight } from "./ui/hero-highlight";
import { GlowingChip } from "./utils/GlowingChip";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { FadeIn } from "./fadein";

export const NeuHero = () => {
  const router = useRouter();
  return (
    <FadeIn>
      <div className="flex flex-col items-center text-center pb-6  ">
        <GlowingChip>Sign up for free 🎉</GlowingChip>

        <h1 className="my-3 text-center font-bold text-zinc-900 dark:text-zinc-100 text-xl auth-sm:text-2xl auth-md:text-3xl auth-lg:text-4xl md:text-5xl lg:text-7xl leading-tight">
          <span className="whitespace-nowrap">Unleash the Power of AI</span>
          <br />
          <span className="whitespace-nowrap">
            For Your Restaurant's Success
          </span>
        </h1>

        <p className="mb-6 sm:mb-8 md:mb-10 max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl text-center text-zinc-700 dark:text-zinc-300 text-sm sm:text-base md:text-lg lg:text-xl">
          Transform the way you run your restaurant. Let our AI handle the tasks
          you’d rather skip—from personalized menus to inventory management and
          staff scheduling, your AI agent does it all, effortlessly.
        </p>

        <Highlight>
          <button
            type="button"
            onClick={() => router.push("/signup")}
            className="rounded-lg z-10 relative px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 text-sm sm:text-base md:text-lg font-semibold uppercase hover:scale-105 transition-transform duration-300"
          >
            <span className="font-bold">Get Started -</span> No Credit Card
            Required
          </button>
        </Highlight>
      </div>
    </FadeIn>
  );
};
