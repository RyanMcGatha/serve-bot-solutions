"use client";
import Link from "next/link";
import React from "react";
import { FiArrowUpRight } from "react-icons/fi";
import { Highlight } from "./ui/hero-highlight";
import { GlowingChip } from "./utils/GlowingChip";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { MaxWidthWrapper } from "./utils/MaxWidthWrapper";

export const NeuHero = () => {
  const router = useRouter();
  return (
    <div className=" z-20 flex flex-col items-center justify-center px-4 md:px-32 lg:px-8 xl:px-12 pb-10 mx-auto">
      <GlowingChip>Exciting announcement 🎉</GlowingChip>

      <h1 className="my-3 text-center text-xl font-bold leading-tight text-zinc-900 dark:text-zinc-100 auth-sm:text-3xl sm:text-5xl  lg:text-7xl ">
        <span className="whitespace-nowrap">Unleash the Power of AI</span>
        <br />
        <span className="whitespace-nowrap">For Your Restaurant's Success</span>
      </h1>

      <p className="mb-9 max-w-xs text-xs sm:max-w-lg md:max-w-2xl text-center text-zinc-700 dark:text-zinc-300 sm:text-lg md:text-xl lg:text-2xl">
        Transform the way you run your restaurant. Let our AI handle the tasks
        you’d rather skip— from personalized menus to inventory management and
        staff scheduling, your AI agent does it all, effortlessly.
      </p>

      <Highlight>
        <button
          type="button"
          onClick={() => {
            router.push("/signup");
          }}
          className="rounded-lg z-10 relative px-4 py-3 uppercase font-semibold text-sm sm:text-base md:text-lg hover:scale-105 transition-transform duration-300"
        >
          <span className="font-bold">Get Started -</span> No Credit Card
          Required
        </button>
      </Highlight>
    </div>
  );
};
