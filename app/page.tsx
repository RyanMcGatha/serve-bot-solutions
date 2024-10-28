"use client";

import { useEffect } from "react";
import { HeroHighlight } from "./components/ui/hero-highlight";
import { NeuHero } from "./components/NeuHero";
import { HeroGrid } from "./components/ui/HeroGrid";
import { Pricing } from "./components/pricing/Pricing";
import { Nav } from "./components/navbar/Nav";
import { ContainerScroll } from "./components/ui/container-scroll-animation";
import Image from "next/image";
import { MaxWidthWrapper } from "./components/utils/MaxWidthWrapper";
import { FadeIn } from "./components/fadein";
import axios from "axios";

const sendDiscordNotification = async (message: string) => {
  try {
    await axios.post("/api/sendDiscordMessage", {
      message,
      channelId: process.env.NEXT_PUBLIC_LANDING_PAGE_VISIT_CHANNEL_ID || "",
    });
  } catch (error) {
    console.error("Failed to send Discord notification:", error);
  }
};

export default function Home() {
  useEffect(() => {
    sendDiscordNotification("A user visited the landing page.");

    const hash = window.location.hash;
    if (hash) {
      document
        .getElementById(hash.replace("#", ""))
        ?.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <HeroHighlight>
      <FadeIn>
        <Nav isDashboard={false} />
      </FadeIn>
      <FadeIn className="pt-40 md:pt-20">
        <Hero />
      </FadeIn>
      <FadeIn>
        <section id="features">
          <HeroGrid />
        </section>
      </FadeIn>
      <FadeIn>
        <section id="pricing">
          <Pricing />
        </section>
      </FadeIn>
    </HeroHighlight>
  );
}

export function Hero() {
  return (
    <FadeIn>
      <MaxWidthWrapper className="relative z-20 flex flex-col items-center pb-12 pt-16">
        <ContainerScroll titleComponent={<NeuHero />}>
          <Image
            src={`/hero.png`}
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
