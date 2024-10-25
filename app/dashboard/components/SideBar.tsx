"use client";
import React, { Dispatch, SetStateAction, useState } from "react";

import { IconType } from "react-icons";
import {
  FiBarChart,
  FiChevronDown,
  FiChevronsRight,
  FiDollarSign,
  FiHome,
  FiLogOut,
  FiMonitor,
  FiShoppingCart,
  FiTag,
  FiUsers,
} from "react-icons/fi";
import { motion } from "framer-motion";
import { useAuth } from "@/app/contexts/AuthContext";
import { useRouter } from "next/navigation";
export const Sidebar = () => {
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const [selected, setSelected] = useState("Dashboard");
  const { logout } = useAuth();

  return (
    <motion.nav
      layout
      className="sticky top-0 h-screen shrink-0 border-r border-zinc-700 dark:border-zinc-400 dark:bg-dorkz2 bg-creamy-11 p-2"
      style={{
        width: open ? "225px" : "fit-content",
      }}
    >
      <TitleSection open={open} />

      <div className="space-y-1">
        <Option
          Icon={FiHome}
          title="Dashboard"
          selected={selected}
          setSelected={setSelected}
          open={open}
          link={() => (window.location.href = "/dashboard")}
        />

        <Option
          Icon={FiLogOut}
          title="Logout"
          selected={selected}
          setSelected={setSelected}
          open={open}
          logout={logout}
        />
      </div>

      <ToggleClose open={open} setOpen={setOpen} />
    </motion.nav>
  );
};

const Option = ({
  Icon,
  title,
  selected,
  setSelected,
  open,
  notifs,
  logout,
  link,
}: {
  Icon: IconType;
  title: string;
  selected: string;
  setSelected: Dispatch<SetStateAction<string>>;
  open: boolean;
  notifs?: number;
  logout?: () => void;
  link?: () => void;
}) => {
  return (
    <motion.button
      layout
      onClick={() => {
        setSelected(title);
        if (logout) logout();
        if (link) link();
      }}
      className={`relative flex h-10 w-full items-center rounded-md transition-colors ${
        selected === title
          ? "bg-zinc-900 text-white dark:bg-zinc-300 dark:text-zinc-900"
          : "text-zinc-900 hover:bg-zinc-900 hover:text-white dark:text-zinc-300 dark:hover:bg-zinc-300 dark:hover:text-zinc-900"
      }`}
    >
      <motion.div
        layout
        className="grid h-full w-10 place-content-center text-lg"
      >
        <Icon />
      </motion.div>
      {open && (
        <motion.span
          layout
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.125 }}
          className="text-xs font-medium"
        >
          {title}
        </motion.span>
      )}

      {notifs && open && (
        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          style={{ y: "-50%" }}
          transition={{ delay: 0.5 }}
          className="absolute right-2 top-1/2 rounded bg-zinc-900 text-xs text-white dark:bg-zinc-300 dark:text-zinc-900"
        >
          {notifs}
        </motion.span>
      )}
    </motion.button>
  );
};

const TitleSection = ({ open }: { open: boolean }) => {
  const { user } = useAuth();
  return (
    <div className="mb-3 border-b border-zinc-900 pb-3 dark:border-zinc-300">
      <div className="flex cursor-pointer items-center justify-between rounded-md transition-colors">
        <div className="flex items-center gap-2">
          <Logo />
          {open && (
            <motion.div
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.125 }}
            >
              <span className="block text-xs font-semibold text-zinc-900 dark:text-zinc-300">
                {user?.email}
              </span>
              <span className="block text-xs text-zinc-900 dark:text-zinc-300">
                {user?.subscription} Plan
              </span>
            </motion.div>
          )}
        </div>
        {open && (
          <FiChevronDown className="mr-2 text-zinc-900 dark:text-zinc-300" />
        )}
      </div>
    </div>
  );
};

const Logo = () => {
  return (
    <motion.div
      layout
      className="grid size-10 shrink-0 place-content-center rounded-md bg-zinc-900 dark:bg-zinc-300"
    >
      <svg
        width="24"
        height="auto"
        viewBox="0 0 50 39"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="fill-white dark:fill-zinc-900"
      >
        <path d="M16.4992 2H37.5808L22.0816 24.9729H1L16.4992 2Z"></path>
        <path d="M17.4224 27.102L11.4192 36H33.5008L49 13.0271H32.7024L23.2064 27.102H17.4224Z"></path>
      </svg>
    </motion.div>
  );
};

const ToggleClose = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <motion.button
      layout
      onClick={() => setOpen((pv) => !pv)}
      className="absolute bottom-0 left-0 right-0 border-t border-zinc-900 transition-colors hover:bg-zinc-900 hover:text-white dark:border-zinc-300 dark:hover:bg-zinc-300 dark:hover:text-zinc-900"
    >
      <div className="flex items-center p-2">
        <motion.div
          layout
          className="grid size-10 place-content-center text-lg text-zinc-900 dark:text-zinc-300"
        >
          <FiChevronsRight
            className={`transition-transform ${open && "rotate-180"}`}
          />
        </motion.div>
        {open && (
          <motion.span
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.125 }}
            className="text-xs font-medium text-zinc-900 dark:text-zinc-300"
          >
            Hide
          </motion.span>
        )}
      </div>
    </motion.button>
  );
};
