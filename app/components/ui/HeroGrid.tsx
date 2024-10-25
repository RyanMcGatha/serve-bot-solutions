import { MaxWidthWrapper } from "@/app/components/utils/MaxWidthWrapper";
import { SectionHeading } from "@/app/components/utils/SectionHeading";
import { SectionSubheading } from "@/app/components/utils/SectionSubheading";
import { SectionHeadingSpacing } from "@/app/components/utils/SectionHeadingSpacing";
import { Tower } from "@/app/components/grid/Tower";
import { MiniCard1 } from "@/app/components/grid/MiniCard1";
import { MiniCard2 } from "@/app/components/grid/MiniCard2";
import { LongCard } from "@/app/components/grid/LongCard";
import { SimpleGrid } from "@/app/components/grid/SimpleGrid";

export const HeroGrid = () => {
  return (
    <section>
      <MaxWidthWrapper className="relative z-20 pb-20 pt-20 md:pb-28 md:pt-20">
        <SectionHeadingSpacing>
          <SectionHeading>
            Revolutionize Your Restaurant
            <br />
            <span className="bg-gradient-to-br from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              with AI-Powered Efficiency
            </span>
          </SectionHeading>
          <SectionSubheading>
            Our AI simplifies your operations, from menu personalization to
            inventory management. Focus on what matters most—delivering an
            unforgettable dining experience.
          </SectionSubheading>
        </SectionHeadingSpacing>

        <Grid />
        <div className="my-12 h-[1px] w-full bg-gradient-to-r from-violet-600/0 via-violet-600/50 to-violet-600/0 md:my-20" />
        <SimpleGrid />
      </MaxWidthWrapper>
    </section>
  );
};

const Grid = () => (
  <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
    <Tower />
    <div className="col-span-1 grid grid-cols-2 gap-4 lg:col-span-8 lg:grid-cols-2">
      <MiniCard1 />
      <MiniCard2 />
      <LongCard />
    </div>
  </div>
);
