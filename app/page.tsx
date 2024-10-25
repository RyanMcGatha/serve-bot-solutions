"use client";

import { motion } from "framer-motion";
import { HeroHighlight } from "./components/ui/hero-highlight";
import { NeuHero } from "./components/NeuHero";
import { HeroGrid } from "./components/ui/HeroGrid";
import { Pricing } from "./components/pricing/Pricing";
import { Nav } from "./components/navbar/Nav";
import { ContainerScroll } from "./components/ui/container-scroll-animation";
import Image from "next/image";
import { MaxWidthWrapper } from "./components/utils/MaxWidthWrapper";

export default function Home() {
  return (
    <HeroHighlight style={{ height: "400vh", width: "100vw" }}>
      <Nav />
      <Hero />
      <HeroGrid />
      <Pricing />
    </HeroHighlight>
  );
}

export function Hero() {
  return (
    <MaxWidthWrapper className="relative z-20 flex flex-col items-center pb-12 pt-16 ">
      <ContainerScroll titleComponent={<NeuHero />}>
        <Image
          src={`/linear.webp`}
          alt="hero"
          height={720}
          width={1400}
          className="mx-auto rounded-2xl object-cover h-full object-left-top"
          draggable={false}
        />
      </ContainerScroll>
    </MaxWidthWrapper>
  );
}
