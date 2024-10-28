"use client";
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { motion } from "framer-motion";
import { FiMenu, FiArrowRight, FiX } from "react-icons/fi";
import Image from "next/image";
import { BubbleButton } from "../buttons/BubbleButton";
import { useAuth } from "@/app/contexts/AuthContext";

export const Nav = ({ isDashboard }: { isDashboard: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
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
    }
  }, []);

  return (
    <nav
      className={`p-4 border-b-[1px] border-zinc-700 flex items-center justify-between top-0 w-full z-[500] ${
        scrolled ? "bg-zinc-50 dark:bg-zinc-950 shadow-md" : "bg-transparent"
      } transition-all duration-300 ${
        isDashboard ? "sticky bg-zinc-50 dark:bg-zinc-950" : "fixed"
      }`}
    >
      <NavLeft
        setIsOpen={setIsOpen}
        isDashboard={isDashboard}
        isOpen={isOpen}
      />
      <NavRight isDashboard={isDashboard} />
      <NavMenu isOpen={isOpen} isDashboard={isDashboard} />
    </nav>
  );
};

const Logo = () => {
  return (
    <Image
      src="/Serve-bot.svg"
      alt="ServeBot logo"
      width={15}
      height={0}
      className="dark:invert object-contain scale-[6] ml-6 mr-6  "
      style={{ clipPath: "inset(20% 10% 21% 10%)" }}
      onClick={() => {
        if (typeof window !== "undefined") {
          window.location.href = "/";
        }
      }}
    />
  );
};

const NavLeft = ({
  setIsOpen,
  isDashboard,
  isOpen,
}: {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  isDashboard: boolean;
  isOpen: boolean;
}) => {
  return (
    <div className="flex items-center gap-6">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`block ${
          isDashboard ? "p-2" : ""
        } text-zinc-700 dark:text-zinc-300 text-2xl `}
        onClick={() => setIsOpen((pv) => !pv)}
      >
        {isOpen ? <FiX /> : <FiMenu />}
      </motion.button>
      <Logo />
    </div>
  );
};

const NavRight = ({ isDashboard }: { isDashboard: boolean }) => {
  return (
    <div className={`flex items-center gap-4 ${isDashboard ? "hidden" : ""}`}>
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

const NavMenu = ({
  isOpen,
  isDashboard,
}: {
  isOpen: boolean;
  isDashboard: boolean;
}) => {
  const { logout } = useAuth();
  return (
    <motion.div
      variants={menuVariants}
      initial="closed"
      animate={isOpen ? "open" : "closed"}
      className={`absolute p-4 bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-700 shadow-lg left-0 right-0 top-full origin-top flex flex-col gap-4 transition-all duration-300 
      }`}
    >
      {isDashboard && (
        <>
          <MenuLink text="Dashboard" href="/dashboard" />
          <MenuLink text="Shop" href="/shop" />
          <MenuLink text="Sign Out" onClick={logout} />
          <MenuLink text="Settings" href="/settings" />
        </>
      )}
      {!isDashboard && (
        <>
          <MenuLink
            text="Pricing"
            href={
              typeof window !== "undefined"
                ? `${window.location.origin}/#pricing`
                : "#"
            }
          />
          <MenuLink
            text="Features"
            href={
              typeof window !== "undefined"
                ? `${window.location.origin}/#features`
                : "#"
            }
          />
        </>
      )}
    </motion.div>
  );
};

const MenuLink = ({
  text,
  href,
  onClick,
}: {
  text: string;
  href?: string;
  onClick?: () => void;
}) => {
  return (
    <motion.a
      variants={menuLinkVariants}
      rel="nofollow"
      href={href}
      onClick={onClick}
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
