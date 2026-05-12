"use client";

import * as React from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
          <div className="fixed inset-0 flex items-center justify-center p-4 z-[101] pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={cn(
                "bg-card w-full max-w-lg md:rounded-[2rem] rounded-t-[2rem] border-x border-t md:border-b border-border shadow-2xl pointer-events-auto overflow-hidden absolute bottom-0 md:relative",
                className
              )}
            >
              <div className="flex items-center justify-between p-5 md:p-8 border-b border-border/50">
                <h3 className="text-xl md:text-2xl font-black tracking-tight">{title}</h3>
                <button
                  onClick={onClose}
                  className="p-2.5 bg-secondary/50 hover:bg-secondary rounded-xl transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-5 md:p-8 max-h-[85vh] overflow-y-auto custom-scrollbar">
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
