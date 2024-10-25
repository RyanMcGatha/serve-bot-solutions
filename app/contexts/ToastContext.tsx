import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { FiCheckSquare, FiX, FiAlertCircle } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";

const NOTIFICATION_TTL = 5000;

type ToastType = {
  id: number;
  type: "success" | "error";
  message: string;
};

interface ToastContextType {
  success: (message: string) => void;
  error: (message: string) => void;
}

interface ToastProviderProps {
  children: ReactNode;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastType[]>([]);

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const success = (message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type: "success", message }]);
    setTimeout(() => removeToast(id), NOTIFICATION_TTL);
  };

  const error = (message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type: "error", message }]);
    setTimeout(() => removeToast(id), NOTIFICATION_TTL);
  };

  return (
    <ToastContext.Provider value={{ success, error }}>
      {children}
      <div className="fixed bottom-4 right-4 space-y-2 z-[9999]">
        <AnimatePresence>
          {toasts.map((toast) => (
            <Toast key={toast.id} {...toast} removeToast={removeToast} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

interface ToastProps extends ToastType {
  removeToast: (id: number) => void;
}

const Toast: React.FC<ToastProps> = ({ id, type, message, removeToast }) => {
  return (
    <motion.div
      layout
      initial={{ y: 15, scale: 0.9, opacity: 0 }}
      animate={{ y: 0, scale: 1, opacity: 1 }}
      exit={{ y: -25, scale: 0.9, opacity: 0 }}
      transition={{ type: "spring" }}
      className="p-4 w-80 flex items-start rounded-lg gap-2 text-sm font-medium shadow-lg border border-zinc-700 dark:border-zinc-400 dark:bg-dorkz bg-creamy-11 text-zinc-700 dark:text-zinc-300 fixed z-[9999] bottom-4 right-4"
    >
      {type === "success" ? (
        <FiCheckSquare className="text-3xl absolute -top-4 -left-4 p-2 rounded-full bg-zinc-50 dark:bg-dorkz2 text-zinc-700 dark:text-zinc-300 shadow" />
      ) : (
        <FiAlertCircle className="text-3xl absolute -top-4 -left-4 p-2 rounded-full bg-zinc-50 dark:bg-dorkz2 text-zinc-700 dark:text-zinc-300 shadow" />
      )}
      <span>{message}</span>
      <button onClick={() => removeToast(id)} className="ml-auto mt-0.5">
        <FiX />
      </button>
    </motion.div>
  );
};
