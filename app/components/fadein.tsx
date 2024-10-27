"use client";

import { motion } from "framer-motion";

export const FadeIn = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.25, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
};