"use client";
import React from "react";
import { motion } from "framer-motion";
import { HeroHighlight } from "@/app/components/ui/hero-highlight";
import { BackgroundGradient } from "@/app/components/ui/background-gradient";
import {
  Heading,
  SocialOptions,
  Or,
  Email,
  Terms,
} from "@/app/components/ui/Form";
import { Nav } from "@/app/components/navbar/Nav";
interface Error {
  message: string;
}

export default function SignupPage() {
  return (
    <HeroHighlight
      style={{ height: "100vh", width: "100vw", overflow: "hidden" }}
    >
      <Nav />

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.25, ease: "easeInOut" }}
        className="w-full h-[92vh] flex items-center justify-center px-2 480:px-8 auth-md:px-12 sm:px-16"
      >
        <BackgroundGradient
          className=" w-full "
          containerClassName="w-full max-w-xl"
        >
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.25, ease: "easeInOut" }}
            className="bg-zinc-100 dark:bg-dorkz2 rounded-md h-full py-6 px-4 "
          >
            <Heading isSignup={true} />

            <SocialOptions isSignup={true} />
            <Or />
            <Email isSignup={true} />
            <Terms />
          </motion.div>
        </BackgroundGradient>
      </motion.div>
    </HeroHighlight>
  );
}
