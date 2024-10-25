import React, { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  children: ReactNode;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const SplashButton = ({ children, className, ...rest }: Props) => {
  return (
    <button
      className={twMerge(
        "rounded-md bg-creamy-11 px-4 py-2 text-lg text-zinc-950 ring-2 ring-zinc-600/50 ring-offset-2 ring-offset-zinc-950 transition-all hover:scale-[1.02] hover:ring-transparent active:scale-[0.98] active:ring-zinc-600/70",
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
};
