'use client';

import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

export interface PageTransitionProps {
  children: ReactNode;
}

// Fade transition variant
const fadeVariants = {
  hidden: { opacity: 0 },
  enter: { opacity: 1 },
  exit: { opacity: 0 },
};

// Fade + Scale transition variant (for Option 3)
const fadeScaleVariants = {
  hidden: { opacity: 0, scale: 0.96 },
  enter: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 1.02 },
};

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname}
      variants={fadeVariants}
      initial="hidden"
      animate="enter"
      exit="exit"
      transition={{
        duration: 0.4,
        ease: 'easeInOut',
      }}
      style={{ width: '100%', height: '100%' }}
    >
      {children}
    </motion.div>
  );
}

// Alternative component for Option 3 (Fade + Scale)
export function PageTransitionWithScale({ children }: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname}
      variants={fadeScaleVariants}
      initial="hidden"
      animate="enter"
      exit="exit"
      transition={{
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1], // Custom easing for smooth scale
      }}
      style={{ width: '100%', height: '100%' }}
    >
      {children}
    </motion.div>
  );
}
