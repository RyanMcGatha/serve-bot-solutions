import React from "react";
import { cn } from "@/lib/utils";
export const GlowingChip = ({
  children,
  className,
  containerClassName,
}: {
  children: string;
  className?: string;
  containerClassName?: string;
}) => {
  return (
    <span
      className={cn(
        "relative z-10 mb-4 inline-block rounded-full border border-zinc-700 bg-zinc-900/20 px-3 py-1.5 text-xs text-zinc-50 md:mb-0 md:text-sm",
        containerClassName
      )}
    >
      {children}
      <span
        className={cn(
          "absolute bottom-0 left-3 right-3 h-[1px] bg-gradient-to-r from-zinc-500/0 via-zinc-300 to-zinc-500/0",
          className
        )}
      />
    </span>
  );
};
