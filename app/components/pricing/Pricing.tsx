import React, { Dispatch, SetStateAction, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiCheckCircle, FiXSquare } from "react-icons/fi";
import clsx from "clsx";
import { useRouter } from "next/navigation";
export const Pricing = () => {
  const [selected, setSelected] = useState<ToggleOptionsType>("annual");
  return (
    <div className=" ">
      <section className="mx-auto max-w-7xl px-2  md:px-4">
        <h2 className="mx-auto mb-4 max-w-2xl text-center text-4xl font-bold leading-[1.15] md:text-6xl md:leading-[1.15]">
          Pricing
        </h2>
        <Toggle selected={selected} setSelected={setSelected} />
        <div className="mt-6 grid grid-cols-1 gap-6 lg:mt-12 lg:grid-cols-3 lg:gap-8">
          <PriceColumn
            title="Free"
            price="0"
            statement="Perfect for small restaurant owners exploring AI assistance. Always free."
            items={[
              {
                children: "100 Requests/Month",
                checked: true,
              },
              {
                children: "1 AI Agent",
                checked: true,
              },
              {
                children: "Email Support",
                checked: true,
              },
              {
                children: "Basic Reporting",
                checked: true,
              },
              {
                children: "Custom Branding",
                checked: false,
              },
              {
                children: "Custom AI Agents",
                checked: false,
              },
            ]}
          />
          <PriceColumn
            title="Basic"
            price={selected === "monthly" ? "20" : "15"}
            statement="For restaurants seeking to improve operations with advanced AI Agents."
            highlight
            items={[
              {
                children: "Unlimited Requests",
                checked: true,
              },
              {
                children: "Access to All AI Agents",
                checked: true,
              },
              {
                children: "Email Support",
                checked: true,
              },
              {
                children: "Basic Reporting",
                checked: true,
              },
              {
                children: "Custom Branding",
                checked: true,
              },
              {
                children: "Custom AI Agents",
                checked: false,
              },
            ]}
          />
          <PriceColumn
            title="Pro"
            price={selected === "monthly" ? "40" : "30"}
            statement="For restaurants looking to tailor their AI Agents specifically for their business."
            items={[
              {
                children: "Unlimited Requests",
                checked: true,
              },
              {
                children: "Access to All AI Agents",
                checked: true,
              },
              {
                children: "Live Support",
                checked: true,
              },
              {
                children: "Advanced Reporting",
                checked: true,
              },
              {
                children: "Custom Branding",
                checked: true,
              },
              {
                children: "Custom AI Agents",
                checked: true,
              },
            ]}
          />
        </div>
      </section>
    </div>
  );
};

const PriceColumn = ({
  highlight,
  title,
  price,
  statement,
  items,
}: PriceColumnProps) => {
  const router = useRouter();
  return (
    <div
      style={{
        boxShadow: highlight ? "0px 6px 0px rgb(24, 24, 27)" : "",
      }}
      className={`relative w-full rounded-lg p-6 md:p-8 border  border-zinc-700 dark:border-zinc-400 bg-gradient-to-br from-zinc-100/50 to-zinc-200 dark:from-dorkz2 dark:to-zinc-950`}
    >
      {highlight && (
        <span className="absolute right-4 top-0 -translate-y-1/2 rounded-full bg-indigo-600 px-2 py-0.5 text-sm text-white">
          Most Popular
        </span>
      )}

      <p className="mb-6 text-xl font-medium">{title}</p>
      <div className="mb-6 flex items-center gap-3">
        <AnimatePresence mode="popLayout">
          <motion.span
            initial={{
              y: 24,
              opacity: 0,
            }}
            animate={{
              y: 0,
              opacity: 1,
            }}
            exit={{
              y: -24,
              opacity: 0,
            }}
            key={price}
            transition={{
              duration: 0.25,
              ease: "easeInOut",
            }}
            className="block text-6xl font-bold"
          >
            ${price}
          </motion.span>
        </AnimatePresence>
        <motion.div layout className="font-medium text-zinc-600">
          <span className="block">/user</span>
          <span className="block">/month</span>
        </motion.div>
      </div>

      <p className="mb-8 text-lg">{statement}</p>

      <div className="mb-8 space-y-2">
        {items.map((i) => (
          <CheckListItem key={i.children} checked={i.checked}>
            {i.children}
          </CheckListItem>
        ))}
      </div>

      <button
        onClick={() => {
          router.push("/signup");
        }}
        className={`w-full rounded-lg p-3 text-base uppercase text-white transition-colors ${
          highlight
            ? "bg-indigo-600 hover:bg-indigo-700"
            : "bg-zinc-900 hover:bg-zinc-700"
        }`}
      >
        Try it now
      </button>
    </div>
  );
};

const Toggle = ({
  selected,
  setSelected,
}: {
  selected: ToggleOptionsType;
  setSelected: Dispatch<SetStateAction<ToggleOptionsType>>;
}) => {
  return (
    <div className="relative mx-auto mt-3 flex w-fit items-center rounded-full border  border-zinc-700 dark:border-zinc-400 bg-gradient-to-br from-zinc-100/50 to-zinc-200 dark:from-dorkz2 dark:to-zinc-950">
      <button
        className="relative z-10 flex items-center gap-2 px-3 py-1.5 text-sm font-medium"
        onClick={() => {
          setSelected("monthly");
        }}
      >
        <span
          className={clsx(
            "relative z-10 ",
            selected === "monthly"
              ? "text-zinc-300 dark:text-zinc-900"
              : "dark:text-zinc-300 text-zinc-900"
          )}
        >
          Monthly
        </span>
      </button>
      <button
        className="relative z-10 flex items-center gap-2 px-3 py-1.5 text-sm font-medium"
        onClick={() => {
          setSelected("annual");
        }}
      >
        <span
          className={clsx(
            "relative z-10 ",
            selected === "annual"
              ? "text-zinc-300 dark:text-zinc-900"
              : "dark:text-zinc-300 text-zinc-900"
          )}
        >
          Annually
        </span>
      </button>
      <div
        className={`absolute inset-0 z-0 flex ${
          selected === "annual" ? "justify-end" : "justify-start"
        }`}
      >
        <motion.span
          layout
          transition={{ ease: "easeInOut" }}
          className="h-full w-1/2 rounded-full border border-zinc-900 dark:border-zinc-400 dark:bg-zinc-100 bg-zinc-950 "
        />
      </div>
    </div>
  );
};

const CheckListItem = ({ children, checked }: CheckListItemType) => {
  return (
    <div className="flex items-center gap-2 text-lg">
      {checked ? (
        <FiCheckCircle className="text-xl text-indigo-600" />
      ) : (
        <FiXSquare className="text-xl text-zinc-400" />
      )}
      {children}
    </div>
  );
};

type PriceColumnProps = {
  highlight?: boolean;
  title: string;
  price: string;
  statement: string;
  items: CheckListItemType[];
};

type ToggleOptionsType = "monthly" | "annual";

type CheckListItemType = {
  children: string;
  checked: boolean;
};
