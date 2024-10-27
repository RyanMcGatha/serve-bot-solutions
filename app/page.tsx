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
import { FadeIn } from "./components/fadein";

export default function Home() {
  const isSmallViewport =
    typeof window !== "undefined" && window.innerWidth < 1025;

  return (
    <HeroHighlight
      style={{
        height: isSmallViewport ? "770vh" : "500vh",
        width: "100vw",
        overflow: "hidden",
      }}
    >
      <FadeIn>
        <Nav />
      </FadeIn>
      <FadeIn>
        <Hero />
      </FadeIn>
      <FadeIn>
        <HeroGrid />
      </FadeIn>
      <FadeIn>
        <Pricing />
      </FadeIn>
    </HeroHighlight>
  );
}

export function Hero() {
  return (
    <FadeIn>
      <MaxWidthWrapper className="relative z-20 flex flex-col items-center pb-12 pt-16 ">
        <ContainerScroll titleComponent={<NeuHero />}>
          <Image
            src={`/laptop.png`}
            alt="hero"
            height={720}
            width={1400}
            className="mx-auto rounded-2xl object-cover h-full object-left-top"
            draggable={false}
          />
        </ContainerScroll>
      </MaxWidthWrapper>
    </FadeIn>
  );
}
