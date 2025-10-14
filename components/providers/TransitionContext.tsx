'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TransitionContextType {
  startTransition: () => void;
  completeTransition: () => void;
}

const TransitionContext = createContext<TransitionContextType | null>(null);

export function useTransition() {
  const context = useContext(TransitionContext);
  if (!context) {
    throw new Error('useTransition must be used within TransitionProvider');
  }
  return context;
}

export function TransitionProvider({ children }: { children: ReactNode }) {
  const [isTransitioning, setIsTransitioning] = useState(false);

  const startTransition = () => {
    setIsTransitioning(true);
  };

  const completeTransition = () => {
    setIsTransitioning(false);
  };

  return (
    <TransitionContext.Provider value={{ startTransition, completeTransition }}>
      {children}

      {/* Full-page transition overlay - below header */}
      <AnimatePresence>
        {isTransitioning && (
          <>
            {/* Main overlay - positioned below header */}
            <motion.div
              className="fixed top-0 left-0 right-0 bottom-0 z-[9999] bg-white flex items-center justify-center"
              style={{ paddingTop: '80px' }} // Space for header
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.4,
                ease: 'easeInOut',
              }}
            >
              {/* Optional: Add a subtle loading indicator */}
              <motion.div
                className="w-2 h-2 bg-iark-red rounded-full"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1.5, 1], opacity: [0, 1, 0.8] }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  repeatDelay: 0.2,
                }}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </TransitionContext.Provider>
  );
}
