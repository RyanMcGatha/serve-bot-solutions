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
    <MaxWidthWrapper className="relative z-20 flex flex-col items-center justify-center pb-10 ">
      <GlowingChip>Exciting announcement 🎉</GlowingChip>
      <h1 className="my-3  text-center text-3xl font-bold leading-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl sm:leading-tight md:text-5xl md:leading-tight lg:text-8xl lg:leading-tight">
        <span className="text-nowrap">Unleash the Power of AI</span>
        <br />
        <span className="text-nowrap"> For Your Restaurant's Success</span>
      </h1>

      <p className="mb-9 max-w-2xl text-center text-base text-zinc-700 dark:text-zinc-300 sm:text-lg md:text-xl">
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
          className="rounded-lg z-10 relative p-3 uppercase hover:scale-105 transition-transform duration-300"
        >
          <span className="font-bold">Get Started -</span> No Credit Card
          Required
        </button>
      </Highlight>
    </MaxWidthWrapper>
  );
};
