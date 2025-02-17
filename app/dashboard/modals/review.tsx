"use client";
import { motion } from "framer-motion";
import Image from "next/image";

export function Review({ selectedApp }: { selectedApp: any }) {
  return (
    <div className="overflow-y-auto p-4 sm:p-6 w-full h-full text-center space-y-6 sm:space-y-8">
      <h2 className="text-3xl sm:text-4xl font-semibold text-zinc-800 dark:text-zinc-200">
        Review Your Selection
      </h2>
      <p className="text-base sm:text-lg text-zinc-700 dark:text-zinc-300">
        You have selected{" "}
        <span className="font-medium text-indigo-600">{selectedApp.name}</span>
      </p>

      <motion.div
        layoutId={`card-${selectedApp.title}-${selectedApp.id}`}
        key={selectedApp.id}
        className="p-4 sm:p-6 bg-zinc-200 dark:bg-neutral-900 rounded-xl cursor-pointer transition duration-300 shadow-lg max-w-md mx-auto"
      >
        <div className="flex flex-col items-center gap-4 sm:gap-6">
          <motion.div
            layoutId={`image-${selectedApp.title}-${selectedApp.id}`}
            className="overflow-hidden rounded-lg w-full max-w-xs"
          >
            <Image
              width={320}
              height={320}
              src={selectedApp.imgUrl}
              alt={selectedApp.title}
              className="w-full h-auto object-cover transition-transform duration-500 transform hover:scale-105"
            />
          </motion.div>
          <div className="flex flex-col items-center text-center space-y-1 sm:space-y-2">
            <motion.h3
              layoutId={`title-${selectedApp.title}-${selectedApp.id}`}
              className="font-semibold text-neutral-800 dark:text-neutral-200 text-lg sm:text-xl"
            >
              {selectedApp.name}
            </motion.h3>
            <motion.p
              layoutId={`description-${selectedApp.description}-${selectedApp.id}`}
              className="text-neutral-600 dark:text-neutral-400 text-sm sm:text-base"
            >
              {selectedApp.title}
            </motion.p>
          </div>
        </div>
      </motion.div>

      <p className="text-base sm:text-lg text-zinc-700 dark:text-zinc-300">
        Are you sure you want to add this app?
      </p>
      <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-300 italic">
        This selection cannot be changed on the free tier.
      </p>
    </div>
  );
}
