import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  children: ReactNode;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const BubbleButton = ({ children, className, ...rest }: Props) => {
  return (
    <button
      className={twMerge(
        `
            relative z-0 flex items-center gap-2 overflow-hidden whitespace-nowrap rounded-md 
            border border-zinc-700 dark:border-zinc-400 dark:bg-dorkz bg-creamy-11 
           px-3 py-1.5
           text-zinc-700 dark:text-zinc-300 transition-all duration-300
            
            before:absolute before:inset-0
            before:-z-10 before:translate-y-[200%]
            before:scale-[2.5]
            before:rounded-[100%] before:bg-zinc-50 dark:before:bg-zinc-950
            before:transition-transform before:duration-500
            before:content-[""]
    
            hover:scale-105 hover:text-zinc-700 dark:hover:text-zinc-100
            hover:before:translate-y-[0%]
            active:scale-100`,
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
};
