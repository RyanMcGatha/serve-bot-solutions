import React, { CSSProperties, ReactNode } from "react";
import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";

const Card = ({
  className,
  children,
  style = {},
}: {
  className?: string;
  children?: ReactNode;
  style?: CSSProperties;
}) => {
  return (
    <motion.div
      initial={{
        filter: "blur(2px)",
      }}
      whileInView={{
        filter: "blur(0px)",
      }}
      transition={{
        duration: 0.5,
        ease: "easeInOut",
        delay: 0.25,
      }}
      style={style}
      className={twMerge(
        "relative h-full w-full overflow-hidden rounded-md border border-zinc-700 dark:border-zinc-400",
        "bg-gradient-to-br from-zinc-100/50 to-zinc-200 dark:from-dorkz2 dark:to-zinc-950- p-6",
        className
      )}
    >
      {children}
    </motion.div>
  );
};

export default Card;
