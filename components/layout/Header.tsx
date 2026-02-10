'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { LogoCard } from './LogoCard';
import { useAuth } from '@/components/providers/AuthContext';
import { CrossDomainLink } from '@/components/features/shared/CrossDomainLink';

export interface HeaderProps {
  className?: string;
}

export function Header({ className = '' }: HeaderProps) {
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuth();
  const [isHovering, setIsHovering] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/tentang', label: 'Tentang' },
    { href: '/bidang', label: 'Bidang' },
    { href: '/kegiatan', label: 'Kegiatan' },
    { href: '/cerita', label: 'Cerita' },
    { href: '/donasi', label: 'Donasi' },
    { href: '/', label: 'Event', subdomain: 'event' as const },
  ];

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getTargetLink = () => {
    if (!isAuthenticated) return '/masuk';
    return user?.role === 'admin' ? '/admin' : '/dashboard';
  };

  const targetLink = getTargetLink();

  return (
    <header
      className={`sticky top-0 z-[10000] w-full bg-white border-b border-gray-200 transition-all duration-300 ${isScrolled ? 'shadow-xl' : 'shadow-md'
        } ${className}`}
    >
      <div className={`relative px-4 md:px-8 flex items-center justify-between gap-2 md:gap-8 lg:gap-12 transition-all duration-300 ${isScrolled ? 'py-2 md:py-2.5' : 'py-3 md:py-4'
        }`}>
        {/* Left: Logo Card */}
        <LogoCard isScrolled={isScrolled} />

        {/* Middle: Navigation Links - Centered absolutely */}
        <nav className={`hidden lg:flex items-center gap-10 absolute left-1/2 -translate-x-1/2 transition-all duration-300 ${isScrolled ? 'gap-8' : 'gap-10'
          }`}>
          {navLinks.map((link) => {
            const isActive = pathname === link.href && !link.subdomain;
            const linkClassName = `${isActive ? 'text-iark-red' : 'text-gray-800 hover:text-iark-red'
              } font-semibold transition-all duration-200 relative group ${isScrolled ? 'text-base' : 'text-lg'
              }`;

            // Use CrossDomainLink for subdomain links
            if (link.subdomain) {
              return (
                <CrossDomainLink
                  key={link.label}
                  href={link.href}
                  subdomain={link.subdomain}
                  className={linkClassName}
                >
                  {link.label}
                  <motion.span
                    className="absolute bottom-0 left-0 h-0.5 bg-iark-red"
                    initial={{ width: 0 }}
                    whileHover={{ width: '100%' }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                  />
                </CrossDomainLink>
              );
            }

            return (
              <Link
                key={link.href}
                href={link.href}
                className={linkClassName}
              >
                {link.label}
                {/* Active underline - slides between pages */}
                {isActive && (
                  <motion.span
                    layoutId="activeUnderline"
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-iark-red"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                {/* Hover underline - only for non-active pages */}
                {!isActive && (
                  <motion.span
                    className="absolute bottom-0 left-0 h-0.5 bg-iark-red"
                    initial={{ width: 0 }}
                    whileHover={{ width: '100%' }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right: Interactive #RayakanKontribusi Sign-in Link */}
        <Link href={targetLink} className="relative ml-auto hidden lg:block">
          <motion.div
            className={`text-iark-red font-bold italic flex items-center cursor-pointer rounded-full border md:border-2 border-iark-red transition-all duration-300 ${isScrolled
              ? 'text-base md:text-lg lg:text-xl py-1 md:py-1.5 px-3 md:px-4 lg:px-6'
              : 'text-base md:text-xl lg:text-2xl py-1.5 md:py-2 px-4 md:px-6 lg:px-8'
              }`}
            onHoverStart={() => setIsHovering(true)}
            onHoverEnd={() => setIsHovering(false)}
            whileHover={{
              scale: 1.05,
              boxShadow: '0 0 20px rgba(226, 28, 36, 0.3)'
            }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <span className="inline-flex items-center" style={{ transform: 'skewX(-12deg)' }}>
              <span className="mr-0.5">#</span>
              <span className="bg-iark-red text-white px-0.5 rounded">
                Rayakan
              </span>
              <span className="ml-1">Kontribusi</span>

              {/* (mu) - animated reveal */}
              <motion.span
                className="inline-flex items-center"
                initial={{ opacity: 0, width: 0 }}
                animate={
                  isHovering
                    ? { opacity: 1, width: 'auto' }
                    : { opacity: 0, width: 0 }
                }
                transition={{
                  duration: 0.25,
                  ease: 'easeOut',
                  delay: 0.05,
                }}
              >
                <motion.span
                  initial={{ opacity: 0, x: -3 }}
                  animate={
                    isHovering
                      ? { opacity: 1, x: 0 }
                      : { opacity: 0, x: -3 }
                  }
                  transition={{
                    duration: 0.2,
                    ease: 'easeOut',
                    delay: 0.08,
                  }}
                >
                  (
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={
                    isHovering
                      ? { opacity: 1, scaleX: 1 }
                      : { opacity: 0, scaleX: 0 }
                  }
                  transition={{
                    duration: 0.25,
                    ease: 'easeOut',
                    delay: 0.12,
                  }}
                  style={{ transformOrigin: 'left' }}
                >
                  mu
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, x: 3 }}
                  animate={
                    isHovering
                      ? { opacity: 1, x: 0 }
                      : { opacity: 0, x: 3 }
                  }
                  transition={{
                    duration: 0.2,
                    ease: 'easeOut',
                    delay: 0.16,
                  }}
                >
                  )
                </motion.span>
              </motion.span>

              {/* User icon - slides in smoothly */}
              <motion.svg
                className="w-5 h-5 ml-2"
                fill="currentColor"
                viewBox="0 0 20 20"
                initial={{ opacity: 0, x: -15, scale: 0.8 }}
                animate={
                  isHovering
                    ? { opacity: 1, x: 0, scale: 1 }
                    : { opacity: 0, x: -15, scale: 0.8 }
                }
                transition={{
                  duration: 0.3,
                  ease: 'easeOut',
                  delay: 0.2,
                }}
              >
                <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
              </motion.svg>
            </span>
          </motion.div>

          {/* Animated underline */}
          <motion.div
            className="absolute bottom-0 left-0 h-0.5 bg-iark-red"
            initial={{ scaleX: 0 }}
            animate={isHovering ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            style={{ transformOrigin: 'left' }}
          />

          {/* Tooltip */}
          <motion.div
            className="absolute top-full mt-2 left-1/2 -translate-x-1/2 text-xs text-gray-600 bg-white px-3 py-1 rounded shadow-md whitespace-nowrap pointer-events-none"
            initial={{ opacity: 0, y: -5 }}
            animate={
              isHovering
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: -5 }
            }
            transition={{
              duration: 0.25,
              ease: 'easeOut',
              delay: 0.25,
            }}
          >
            {isAuthenticated ? 'Buka Dashboard' : 'Klik untuk masuk'}
          </motion.div>
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2 text-gray-700 hover:text-iark-red transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <motion.div
        className="lg:hidden overflow-hidden bg-white border-t border-gray-200"
        initial={false}
        animate={{
          height: isMobileMenuOpen ? 'auto' : 0,
          opacity: isMobileMenuOpen ? 1 : 0
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <nav className="px-4 py-4 space-y-2">
          {navLinks.map((link, index) => {
            const isActive = pathname === link.href && !link.subdomain;
            const mobileLinkClassName = `block py-3 px-4 ${isActive
              ? 'bg-iark-red/10 text-iark-red border-l-4 border-iark-red'
              : 'text-gray-800 hover:bg-gray-100 hover:text-iark-red'
              } font-semibold rounded-lg transition-colors`;

            return (
              <motion.div
                key={link.subdomain ? link.label : link.href}
                initial={{ opacity: 0, x: -20 }}
                animate={isMobileMenuOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                {link.subdomain ? (
                  <CrossDomainLink
                    href={link.href}
                    subdomain={link.subdomain}
                    className={mobileLinkClassName}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </CrossDomainLink>
                ) : (
                  <Link
                    href={link.href}
                    className={mobileLinkClassName}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                )}
              </motion.div>
            );
          })}

          {/* Mobile Rayakan Kontribusi Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isMobileMenuOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.3, delay: navLinks.length * 0.05 }}
          >
            <Link
              href={targetLink}
              className="block mt-4 py-3 px-4 bg-iark-red text-white text-center font-bold rounded-lg hover:bg-red-700 transition-colors"
              onClick={() => {
                setIsMobileMenuOpen(false);
              }}
            >
              #RayakanKontribusi
            </Link>
          </motion.div>
        </nav>
      </motion.div>
    </header>
  );
}
