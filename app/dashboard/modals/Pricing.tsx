import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";

export default function Pricing({
  setSelectedPlan,
}: {
  setSelectedPlan: React.Dispatch<React.SetStateAction<any>>;
}) {
  const [selected, setSelected] = useState<"M" | "A">("M");
  const [free, setFree] = useState(false);
  const [basic, setBasic] = useState(false);
  const [pro, setPro] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  return (
    <div className="text-zinc-700 dark:text-zinc-300 bg-zinc-100 p-10 dark:bg-zinc-950 w-full overflow-y-auto ">
      <Heading selected={selected} setSelected={setSelected} />
      <PriceCards
        selected={selected}
        free={free}
        basic={basic}
        pro={pro}
        setSelectedPlan={(plan: any) => setSelectedPlan(plan)}
        setFree={(value) => {
          setFree(value);
          setBasic(false);
          setPro(false);
          setShowCheckout(true);
          setSelectedPlan("free");
        }}
        setBasic={(value) => {
          setFree(false);
          setBasic(value);
          setPro(false);
          setShowCheckout(true);
          setSelectedPlan("basic");
        }}
        setPro={(value) => {
          setFree(false);
          setBasic(false);
          setPro(value);
          setShowCheckout(true);
          setSelectedPlan("pro");
        }}
      />
    </div>
  );
}

const SELECTED_STYLES = "text-white font-medium rounded-lg py-3 w-28 relative";
const DESELECTED_STYLES =
  "font-medium rounded-lg py-3 w-28 hover:bg-slate-100 transition-colors relative";

interface HeadingProps {
  selected: "M" | "A";
  setSelected: React.Dispatch<React.SetStateAction<"M" | "A">>;
}

const Heading = ({ selected, setSelected }: HeadingProps) => {
  return (
    <div className="  relative z-10">
      <h3 className="font-semibold text-5xl lg:text-7xl text-center mb-6">
        Pricing plans
      </h3>
      <p className="text-center text-xl mx-auto max-w-lg mb-8">
        Choose the plan that best suits your needs. <br /> Select your plan and
        click next!
      </p>
    </div>
  );
};

const BackgroundShift = () => (
  <motion.span
    layoutId="bg-shift"
    className="absolute inset-0 bg-black rounded-lg -z-10"
  />
);

const CTAArrow = () => (
  <div className="absolute -right-[100px] top-2 sm:top-0">
    <motion.svg
      width="95"
      height="62"
      viewBox="0 0 95 62"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="scale-50 sm:scale-75"
      initial={{ scale: 0.7, rotate: 5 }}
      animate={{ scale: 0.75, rotate: 0 }}
      transition={{
        repeat: Infinity,
        repeatType: "mirror",
        duration: 1,
        ease: "easeOut",
      }}
    >
      <path
        d="M14.7705 15.8619C33.2146 15.2843 72.0772 22.1597 79.9754 54.2825"
        stroke="#7D7BE5"
        strokeWidth="3"
      />
      <path
        d="M17.7987 7.81217C18.0393 11.5987 16.4421 15.8467 15.5055 19.282C15.2179 20.3369 14.9203 21.3791 14.5871 22.4078C14.4728 22.7608 14.074 22.8153 13.9187 23.136C13.5641 23.8683 12.0906 22.7958 11.7114 22.5416C8.63713 20.4812 5.49156 18.3863 2.58664 15.9321C1.05261 14.6361 2.32549 14.1125 3.42136 13.0646C4.37585 12.152 5.13317 11.3811 6.22467 10.7447C8.97946 9.13838 12.7454 8.32946 15.8379 8.01289"
        stroke="#7D7BE5"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </motion.svg>
    <span className="block text-xs w-fit bg-indigo-500 text-white shadow px-1.5 py-0.5 rounded -mt-1 ml-8 -rotate-2 font-light italic">
      Save $$$
    </span>
  </div>
);

interface PriceCardProps {
  setSelectedPlan: React.Dispatch<React.SetStateAction<any>>;
  selected: "M" | "A";
  free: boolean;
  basic: boolean;
  pro: boolean;
  setFree?: React.Dispatch<React.SetStateAction<boolean>>;
  setBasic?: React.Dispatch<React.SetStateAction<boolean>>;
  setPro?: React.Dispatch<React.SetStateAction<boolean>>;
}

const PriceCards = ({
  selected,
  free,
  basic,
  pro,
  setFree,
  setBasic,
  setPro,
  setSelectedPlan,
}: PriceCardProps) => (
  <div className="flex flex-col lg:flex-row gap-8 lg:gap-4 w-full max-w-6xl mx-auto relative z-10 pb-10 ">
    {/* FREE */}
    <div
      className={clsx(
        "w-full p-6 border  border-zinc-700 dark:border-zinc-400 rounded-xl",
        free
          ? "bg-indigo-500 text-white"
          : "bg-gradient-to-br from-zinc-100/50 to-zinc-200 dark:from-dorkz2 dark:to-zinc-950"
      )}
    >
      <p className="text-2xl font-bold mb-2">Free</p>
      <p className="text-lg mb-6">
        Perfect for small restaurant owners exploring AI assistance. Always
        free.
      </p>
      <p className="text-6xl font-bold mb-8">
        $0<span className="font-normal text-xl">/month</span>
      </p>
      <div className="flex items-center gap-2 mb-2">
        <svg
          width="20"
          height="15"
          viewBox="0 0 20 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="shrink-0"
        >
          <path
            d="M6.35588 11.8345L1.61455 7.17002L0 8.7472L6.35588 15L20 1.57718L18.3968 0L6.35588 11.8345Z"
            fill="black"
          />
        </svg>
        <span className="text-base">100 requests/month</span>
      </div>
      <div className="flex items-center gap-2 mb-2">
        <svg
          width="20"
          height="15"
          viewBox="0 0 20 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="shrink-0"
        >
          <path
            d="M6.35588 11.8345L1.61455 7.17002L0 8.7472L6.35588 15L20 1.57718L18.3968 0L6.35588 11.8345Z"
            fill="black"
          />
        </svg>
        <span className="text-base">1 AI Agent</span>
      </div>
      <div className="flex items-center gap-2 mb-2">
        <svg
          width="20"
          height="15"
          viewBox="0 0 20 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="shrink-0"
        >
          <path
            d="M6.35588 11.8345L1.61455 7.17002L0 8.7472L6.35588 15L20 1.57718L18.3968 0L6.35588 11.8345Z"
            fill="black"
          />
        </svg>
        <span className="text-base">Email Support</span>
      </div>
      <div className="flex items-center gap-2 mb-2">
        <svg
          width="20"
          height="15"
          viewBox="0 0 20 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="shrink-0"
        >
          <path
            d="M6.35588 11.8345L1.61455 7.17002L0 8.7472L6.35588 15L20 1.57718L18.3968 0L6.35588 11.8345Z"
            fill="black"
          />
        </svg>
        <span className="text-base">Basic Reporting</span>
      </div>

      <motion.button
        whileHover={{ scale: 1.015 }}
        whileTap={{ scale: 0.985 }}
        className="w-full py-4 mt-8 font-semibold bg-black text-white rounded-lg uppercase"
        onClick={() => {
          setBasic && setBasic(false);
          setPro && setPro(false);
          setFree && setFree(true);
          setSelectedPlan("free");
        }}
      >
        Sign up free
      </motion.button>
    </div>

    {/* BASIC */}
    <div
      className={clsx(
        "w-full p-6 border  border-zinc-700 dark:border-zinc-400 rounded-xl",
        basic
          ? "bg-indigo-500 text-white"
          : "bg-gradient-to-br from-zinc-100/50 to-zinc-200 dark:from-dorkz2 dark:to-zinc-950"
      )}
    >
      <p className="text-2xl font-bold mb-2">Basic</p>
      <p className="text-lg mb-6">
        For restaurants seeking to improve operations with advanced AI Agents.
      </p>
      <div className="overflow-hidden mb-8">
        <AnimatePresence mode="wait">
          {selected === "M" ? (
            <motion.p
              key="monthly1"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ ease: "linear", duration: 0.25 }}
              className="text-6xl font-bold "
            >
              <span>$20</span>
              <span className="font-normal text-xl">/month</span>
            </motion.p>
          ) : (
            <motion.p
              key="monthly2"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ ease: "linear", duration: 0.25 }}
              className="text-6xl font-bold text-indigo-500"
            >
              <span>$15</span>
              <span className="font-normal text-xl">/month</span>
            </motion.p>
          )}
        </AnimatePresence>
      </div>
      <div className="flex items-center gap-2 mb-2">
        <svg
          width="20"
          height="15"
          viewBox="0 0 20 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="shrink-0"
        >
          <path
            d="M6.35588 11.8345L1.61455 7.17002L0 8.7472L6.35588 15L20 1.57718L18.3968 0L6.35588 11.8345Z"
            fill="black"
          />
        </svg>
        <span className="text-base">Unlimited Requests</span>
      </div>
      <div className="flex items-center gap-2 mb-2">
        <svg
          width="20"
          height="15"
          viewBox="0 0 20 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="shrink-0"
        >
          <path
            d="M6.35588 11.8345L1.61455 7.17002L0 8.7472L6.35588 15L20 1.57718L18.3968 0L6.35588 11.8345Z"
            fill="black"
          />
        </svg>
        <span className="text-base">Access to All AI Agents</span>
      </div>
      <div className="flex items-center gap-2 mb-2">
        <svg
          width="20"
          height="15"
          viewBox="0 0 20 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="shrink-0"
        >
          <path
            d="M6.35588 11.8345L1.61455 7.17002L0 8.7472L6.35588 15L20 1.57718L18.3968 0L6.35588 11.8345Z"
            fill="black"
          />
        </svg>
        <span className="text-base">Email Support</span>
      </div>
      <div className="flex items-center gap-2 mb-2">
        <svg
          width="20"
          height="15"
          viewBox="0 0 20 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="shrink-0"
        >
          <path
            d="M6.35588 11.8345L1.61455 7.17002L0 8.7472L6.35588 15L20 1.57718L18.3968 0L6.35588 11.8345Z"
            fill="black"
          />
        </svg>
        <span className="text-base">Basic Reporting</span>
      </div>

      <motion.button
        whileHover={{ scale: 1.015 }}
        whileTap={{ scale: 0.985 }}
        className="w-full py-4 mt-8 font-semibold bg-black text-white rounded-lg uppercase"
        onClick={() => {
          setFree && setFree(false);
          setPro && setPro(false);
          setBasic && setBasic(true);
          setSelectedPlan("basic");
        }}
      >
        Sign up professional
      </motion.button>
    </div>

    {/* PRO */}
    <div
      className={clsx(
        "w-full p-6 border  border-zinc-700 dark:border-zinc-400 rounded-xl",
        pro
          ? "bg-indigo-500 text-white"
          : "bg-gradient-to-br from-zinc-100/50 to-zinc-200 dark:from-dorkz2 dark:to-zinc-950"
      )}
    >
      <p className="text-2xl font-bold mb-2">Pro</p>
      <p className="text-lg mb-6">
        For restaurants looking to tailor their AI Agents specifically for their
        business.
      </p>
      <div className="overflow-hidden mb-8">
        <AnimatePresence mode="wait">
          {selected === "M" ? (
            <motion.p
              key="yearly1"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ ease: "linear", duration: 0.25 }}
              className="text-6xl font-bold"
            >
              <span>$40</span>
              <span className="font-normal text-xl">/month</span>
            </motion.p>
          ) : (
            <motion.p
              key="yearly2"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ ease: "linear", duration: 0.25 }}
              className="text-6xl font-bold"
            >
              <span>$30</span>
              <span className="font-normal text-xl">/month</span>
            </motion.p>
          )}
        </AnimatePresence>
      </div>
      <div className="flex items-center gap-2 mb-2">
        <svg
          width="20"
          height="15"
          viewBox="0 0 20 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="shrink-0"
        >
          <path
            d="M6.35588 11.8345L1.61455 7.17002L0 8.7472L6.35588 15L20 1.57718L18.3968 0L6.35588 11.8345Z"
            fill="black"
          />
        </svg>
        <span className="text-base">Unlimited Requests</span>
      </div>
      <div className="flex items-center gap-2 mb-2">
        <svg
          width="20"
          height="15"
          viewBox="0 0 20 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="shrink-0"
        >
          <path
            d="M6.35588 11.8345L1.61455 7.17002L0 8.7472L6.35588 15L20 1.57718L18.3968 0L6.35588 11.8345Z"
            fill="black"
          />
        </svg>
        <span className="text-base">Access to All AI Agents</span>
      </div>
      <div className="flex items-center gap-2 mb-2">
        <svg
          width="20"
          height="15"
          viewBox="0 0 20 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="shrink-0"
        >
          <path
            d="M6.35588 11.8345L1.61455 7.17002L0 8.7472L6.35588 15L20 1.57718L18.3968 0L6.35588 11.8345Z"
            fill="black"
          />
        </svg>
        <span className="text-base">Custom AI Agents</span>
      </div>
      <div className="flex items-center gap-2 mb-2">
        <svg
          width="20"
          height="15"
          viewBox="0 0 20 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="shrink-0"
        >
          <path
            d="M6.35588 11.8345L1.61455 7.17002L0 8.7472L6.35588 15L20 1.57718L18.3968 0L6.35588 11.8345Z"
            fill="black"
          />
        </svg>
        <span className="text-base">Advanced Reporting</span>
      </div>

      <motion.button
        whileHover={{ scale: 1.015 }}
        whileTap={{ scale: 0.985 }}
        className="w-full py-4 mt-8 font-semibold bg-black text-white rounded-lg uppercase"
        onClick={() => {
          setFree && setFree(false);
          setBasic && setBasic(false);
          setPro && setPro(true);
          setSelectedPlan("pro");
        }}
      >
        Sign up enterprise
      </motion.button>
    </div>
  </div>
);

const TopLeftCircle = () => {
  return (
    <motion.div
      initial={{ rotate: "0deg" }}
      animate={{ rotate: "360deg" }}
      transition={{ duration: 100, ease: "linear", repeat: Infinity }}
      className="w-[450px] h-[450px] rounded-full border-2 border-slate-500 border-dotted absolute z-0 -left-[250px] -top-[200px]"
    />
  );
};

const BottomRightCircle = () => {
  return (
    <motion.div
      initial={{ rotate: "0deg" }}
      animate={{ rotate: "-360deg" }}
      transition={{ duration: 100, ease: "linear", repeat: Infinity }}
      className="w-[450px] h-[450px] rounded-full border-2 border-slate-500 border-dotted absolute z-0 -right-[250px] -bottom-[200px]"
    />
  );
};

const BackgroundGradient = () => (
  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/50 to-indigo-500/50 rounded-lg -z-10"></div>
);
