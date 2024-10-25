"use client";
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { motion } from "framer-motion";
import { FiMenu, FiArrowRight } from "react-icons/fi";
import Image from "next/image";
import { BubbleButton } from "../buttons/BubbleButton";
export const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav
      className={`p-4 border-b-[1px] border-zinc-700 flex items-center justify-between sticky top-0 w-full z-50 ${
        scrolled ? "bg-zinc-50 dark:bg-zinc-950 shadow-md" : "bg-transparent"
      } transition-all duration-300`}
    >
      <NavLeft setIsOpen={setIsOpen} />
      <NavRight />
      <NavMenu isOpen={isOpen} />
    </nav>
  );
};

const Logo = () => {
  // Temp logo from https://logoipsum.com/
  return (
    <Image
      src="/Serve-bot.svg"
      alt="ServeBot logo"
      width={15}
      height={0}
      className="dark:invert object-contain scale-[6] ml-6 mr-6"
      style={{ clipPath: "inset(20% 10% 21% 10%)" }}
      onClick={() => {
        window.location.href = "/";
      }}
    />
  );
};

const NavLeft = ({
  setIsOpen,
}: {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <div className="flex items-center gap-6">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="block lg:hidden text-zinc-700 dark:text-zinc-300 text-2xl"
        onClick={() => setIsOpen((pv) => !pv)}
      >
        <FiMenu />
      </motion.button>
      <Logo />
      <NavLink text="Solutions" />
      <NavLink text="Community" />
      <NavLink text="Pricing" />
      <NavLink text="Company" />
    </div>
  );
};

const NavLink = ({ text }: { text: string }) => {
  return (
    <a
      href="#"
      rel="nofollow"
      className="hidden lg:block h-[30px] overflow-hidden font-medium transition-all duration-300"
    >
      <motion.div whileHover={{ y: -30 }}>
        <span className="flex items-center h-[30px] text-zinc-700 dark:text-zinc-300">
          {text}
        </span>
        <span className="flex items-center h-[30px] text-indigo-600">
          {text}
        </span>
      </motion.div>
    </a>
  );
};

const NavRight = () => {
  return (
    <div className="flex items-center gap-4">
      <BubbleButton
        onClick={() => {
          window.location.href = "/signin";
        }}
      >
        Sign in
      </BubbleButton>
      <BubbleButton
        onClick={() => {
          window.location.href = "/signup";
        }}
      >
        Sign up
      </BubbleButton>
    </div>
  );
};

const NavMenu = ({ isOpen }: { isOpen: boolean }) => {
  return (
    <motion.div
      variants={menuVariants}
      initial="closed"
      animate={isOpen ? "open" : "closed"}
      className="absolute p-4 bg-white shadow-lg left-0 right-0 top-full origin-top flex flex-col gap-4 transition-all duration-300"
    >
      <MenuLink text="Solutions" />
      <MenuLink text="Community" />
      <MenuLink text="Pricing" />
      <MenuLink text="Company" />
    </motion.div>
  );
};

const MenuLink = ({ text }: { text: string }) => {
  return (
    <motion.a
      variants={menuLinkVariants}
      rel="nofollow"
      href="#"
      className="h-[30px] overflow-hidden font-medium text-lg flex items-start gap-2"
    >
      <motion.span variants={menuLinkArrowVariants}>
        <FiArrowRight className="h-[30px] text-black dark:text-white" />
      </motion.span>
      <motion.div whileHover={{ y: -30 }}>
        <span className="flex items-center h-[30px] text-black dark:text-white">
          {text}
        </span>
        <span className="flex items-center h-[30px] text-indigo-600">
          {text}
        </span>
      </motion.div>
    </motion.a>
  );
};

const menuVariants = {
  open: {
    scaleY: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
  closed: {
    scaleY: 0,
    transition: {
      when: "afterChildren",
      staggerChildren: 0.1,
    },
  },
};

const menuLinkVariants = {
  open: {
    y: 0,
    opacity: 1,
  },
  closed: {
    y: -10,
    opacity: 0,
  },
};

const menuLinkArrowVariants = {
  open: {
    x: 0,
  },
  closed: {
    x: -4,
  },
};
