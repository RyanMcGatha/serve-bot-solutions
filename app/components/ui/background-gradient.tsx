import { cn } from "@/lib/utils";
import React from "react";
import { motion } from "framer-motion";

export const BackgroundGradient = ({
  children,
  className,
  containerClassName,
  animate = true,
  blur,
}: {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  animate?: boolean;
  blur?: string;
}) => {
  const variants = {
    initial: {
      backgroundPosition: "0 50%",
    },
    animate: {
      backgroundPosition: ["0, 50%", "100% 50%", "0 50%"],
    },
  };

  return (
    <div className={cn("relative p-[4px] group", containerClassName)}>
      {/* Background animations */}
      <motion.div
        variants={animate ? variants : undefined}
        initial={animate ? "initial" : undefined}
        animate={animate ? "animate" : undefined}
        transition={
          animate
            ? {
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse",
              }
            : undefined
        }
        style={{
          backgroundSize: animate ? "400% 400%" : undefined,
        }}
        className={cn(
          `absolute inset-0 rounded-lg z-[1] opacity-100 group-hover:opacity-100 blur-lg transition duration-500 will-change-transform`,
          "bg-[radial-gradient(circle_farthest-side_at_0_100%,#00fffc,transparent),radial-gradient(circle_farthest-side_at_100%_0,#d24cff,transparent),radial-gradient(circle_farthest-side_at_100%_100%,#fff700,transparent),radial-gradient(circle_farthest-side_at_0_0,#00ffff,#0d0c0f)]"
        )}
      />
      <motion.div
        variants={animate ? variants : undefined}
        initial={animate ? "initial" : undefined}
        animate={animate ? "animate" : undefined}
        transition={
          animate
            ? {
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse",
              }
            : undefined
        }
        style={{
          backgroundSize: animate ? "400% 400%" : undefined,
        }}
        className={cn(
          "absolute inset-0 rounded-lg z-[1] will-change-transform",
          "bg-[radial-gradient(circle_farthest-side_at_0_100%,#00fff7,transparent),radial-gradient(circle_farthest-side_at_100%_0,#c27cff,transparent),radial-gradient(circle_farthest-side_at_100%_100%,#ffeb00,transparent),radial-gradient(circle_farthest-side_at_0_0,#00eaff,#111111)]"
        )}
      />

      {/* Transparent background for the children */}
      <div className={cn("relative z-10", className)}>{children}</div>
    </div>
  );
};
