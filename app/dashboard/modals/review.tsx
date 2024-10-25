"use client";
import { motion } from "framer-motion";
import Image from "next/image";

export function Review({ selectedApp }: { selectedApp: any }) {
  return (
    <div className="flex flex-col items-center p-8 w-full max-w-xl mx-auto text-center space-y-6">
      <h2 className="text-3xl font-bold text-center w-full">Review</h2>
      <p className="text-xl">You have selected {selectedApp.name}</p>
      <motion.div
        layoutId={`card-${selectedApp.title}-${selectedApp.id}`}
        key={selectedApp.id}
        onClick={() => {
          // setActive(card);
        }}
        className={`p-4 flex flex-col  rounded-xl cursor-pointer ${
          selectedApp?.title === selectedApp.title ? "bg-indigo-600" : ""
        }`}
      >
        <div className="flex gap-4 flex-col w-full">
          <motion.div layoutId={`image-${selectedApp.title}-${selectedApp.id}`}>
            <Image
              width={100}
              height={100}
              src={selectedApp.imgUrl}
              alt={selectedApp.title}
              className="h-60 w-full  rounded-lg object-cover object-top"
            />
          </motion.div>
          <div className="flex justify-center items-center flex-col">
            <motion.h3
              layoutId={`title-${selectedApp.title}-${selectedApp.id}`}
              className="font-medium text-neutral-800 dark:text-neutral-200 text-center md:text-left text-base"
            >
              {selectedApp.name}
            </motion.h3>
            <motion.p
              layoutId={`description-${selectedApp.description}-${selectedApp.id}`}
              className="text-neutral-600 dark:text-neutral-400 text-center md:text-left text-base"
            >
              {selectedApp.title}
            </motion.p>
          </div>
        </div>
      </motion.div>
      <p className="text-xl">Are you sure you want to add this app?</p>
      <p className="text-sm text-gray-500">
        This selection can not be changed on the free tier.
      </p>
    </div>
  );
}
