"use client";
import Image from "next/image";
import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "../hooks/use-outside-click";
import axios from "axios";
import { useAuth } from "@/app/contexts/AuthContext";

export function FreeTier({ onSelect }: { onSelect: (active: any) => void }) {
  const [active, setActive] = useState<(typeof cards)[number] | boolean | null>(
    null
  );
  const [cards, setCards] = useState<any[]>([]);
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const { user } = useAuth();

  async function addUserAppAccess(appId: string) {
    try {
      const response = await axios.post("/api/apps/setUserAppAccess", {
        userId: user?.id,
        appId,
      });
      console.log("User App Access created:", response.data);
    } catch (error: any) {
      if (error.response) {
        console.error("Error:", error.response.data.error);
      } else {
        console.error("Request failed:", error.message);
      }
    }
  }

  const fetchApps = async () => {
    const res = await fetch("/api/apps/fetchAllApps");
    const data = await res.json();
    setCards(data);
    return data;
  };

  useEffect(() => {
    fetchApps();
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(false);
      }
    }

    if (active && typeof active === "object") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  return (
    <div className="flex flex-col items-center overflow-y-auto w-full max-w-7xl mx-auto p-4 text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
        Select an App
      </h2>
      <p className="text-base md:text-lg text-gray-600 dark:text-gray-300">
        Choose the app you want to use with your account.
      </p>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 z-10"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {active && (
          <div className="fixed inset-0 overflow-y-auto flex items-center justify-center z-50 p-4">
            <motion.button
              key={`close-button-${active.title}-${id}`}
              className="absolute top-4 right-4 text-gray-800 dark:text-white bg-white rounded-full h-8 w-8 flex items-center justify-center shadow-lg"
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </motion.button>
            <motion.div
              layoutId={`card-${active.title}-${id}`}
              ref={ref}
              className="bg-white dark:bg-neutral-900 rounded-lg shadow-2xl w-full max-w-xl sm:p-6 p-4"
            >
              <motion.div
                layoutId={`image-${active.title}-${id}`}
                className="relative"
              >
                <Image
                  priority
                  width={500}
                  height={250}
                  src={active.imgUrl}
                  alt={active.title}
                  className="w-full h-56 md:h-64 object-cover rounded-t-lg"
                />
              </motion.div>
              <div className="p-4 sm:p-6">
                <motion.h3
                  layoutId={`title-${active.title}-${id}`}
                  className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-white"
                >
                  {active.title}
                </motion.h3>
                <motion.p
                  layoutId={`description-${active.description}-${id}`}
                  className="mt-2 text-gray-600 dark:text-gray-400"
                >
                  {active.description}
                </motion.p>
                <div className="mt-4">
                  <motion.div
                    layout
                    className="text-zinc-700 dark:text-zinc-300 text-sm overflow-auto"
                  >
                    {typeof active.content === "function"
                      ? active.content()
                      : active.content}
                  </motion.div>
                  <button
                    onClick={() => {
                      setSelectedApp(active);
                      setActive(null);
                      onSelect(active);
                    }}
                    className="mt-4 px-4 py-2 md:px-6 md:py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg"
                  >
                    Select
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10 w-full pb-20 overflow-y-auto px-4">
        {cards.map((card, index) => (
          <motion.div
            layoutId={`card-${card.title}-${id}`}
            key={index}
            onClick={() => setActive(card)}
            className={`p-4 md:p-6 flex flex-col rounded-xl shadow-lg cursor-pointer transition-transform transform hover:scale-105 ${
              selectedApp?.title === card.title
                ? "bg-indigo-600 text-white"
                : "bg-zinc-200 dark:bg-neutral-900"
            }`}
          >
            <motion.div layoutId={`image-${card.title}-${id}`} className="mb-4">
              <Image
                width={200}
                height={200}
                src={card.imgUrl}
                alt={card.title}
                className="w-full h-36 md:h-40 object-cover rounded-lg"
              />
            </motion.div>
            <div className="flex flex-col items-start">
              <motion.h3
                layoutId={`title-${card.title}-${id}`}
                className="text-md md:text-lg font-semibold"
              >
                {card.name}
              </motion.h3>
              <motion.p
                layoutId={`description-${card.description}-${id}`}
                className="mt-1 text-gray-600 dark:text-gray-400"
              >
                {card.title}
              </motion.p>
            </div>
          </motion.div>
        ))}
      </ul>
    </div>
  );
}

export const CloseIcon = () => (
  <motion.svg
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0, transition: { duration: 0.05 } }}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4 text-black"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M18 6l-12 12" />
    <path d="M6 6l12 12" />
  </motion.svg>
);
