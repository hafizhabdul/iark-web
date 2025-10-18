"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export function DashboardSidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    async function getUserData() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setUser(null);
        return;
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("username, email")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        setUser(null);
        return;
      }

      setUser({
        ...user,
        ...profile,
      });
    }

    getUserData();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        getUserData();
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/masuk");
  };

  const navItems = [
    {
      href: "/dashboard/alumni",
      label: "Alumni Directory",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
    },
    {
      href: "/dashboard/events",
      label: "Events",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
    },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="lg:hidden fixed top-20 left-4 z-50 p-2 bg-white rounded-lg shadow-lg text-gray-700 hover:text-iark-red"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
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

      {/* Sidebar */}
      <motion.aside
        className={`fixed lg:sticky top-0 left-0 h-screen bg-white border-r border-gray-200 flex flex-col z-40 transition-transform duration-300 ${
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
        style={{ width: "280px" }}
        initial={false}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-200">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative w-10 h-10">
              <Image
                src="/logos/iark-logo.png"
                alt="IARK"
                fill
                className="object-contain"
              />
            </div>
            <span className="font-bold text-xl text-gray-900">IARK</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-colors ${
                isActive(item.href)
                  ? "bg-iark-red text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* User Profile & Logout */}
        <div className="p-4 border-t border-gray-200">
          {/* User Info */}
          <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
              {user?.avatar ? (
                <Image
                  src={user.avatar}
                  alt={user.username}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-iark-red flex items-center justify-center text-white font-bold">
                  {user?.username.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-gray-900 truncate">
                {user?.name}
              </p>
              <p className="text-xs text-gray-600 truncate">{user?.username}</p>
            </div>
          </div>

          {/* Logout Button */}
          <motion.button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span>Logout</span>
          </motion.button>
        </div>
      </motion.aside>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
