"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, Moon, Sun, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import DesktopNav from "@/services/DesktopNav";
import UserDropdown from "@/services/UserDropdown";
import MobileMenu from "@/services/MobileMenu";
import { accessUser } from "@/lib/auth/accessUser";
import { logoutUser } from "@/lib/auth/logout";

interface UserProfile {
  name: string;
  email: string;
  image?: string;
  role?: string;
  credits?: number;
}

export default function Navbar() {
  const { theme, setTheme } = useTheme();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);
      const currentUser = await accessUser();
      setUser(currentUser);
      setLoading(false);
    };

    loadUser();
  }, []);

  const isLoggedIn = !loading && Boolean(user);

  return (
    <header
      className="
      sticky
      top-0
      z-50
      border-b
      border-base-200
      bg-base-100/80
      dark:bg-black/80
      backdrop-blur-xl
      shadow-sm
      supports-backdrop-filter:bg-base-100/60
    "
    >
      <div className="container mx-auto h-20 px-5">
        <div className="flex h-full items-center justify-between">
          {/* Logo */}

          <Link href="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{
                rotate: 8,
                scale: 1.05,
              }}
              transition={{
                duration: 0.25,
              }}
              className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-2xl
                bg-[#3B3B98]
                text-xl
                font-bold
                text-white
                shadow-lg
              "
            >
              FF
            </motion.div>

            <div className=" leading-5">
              <h2 className="text-xl font-bold">
                <span className="text-[#3B3B98]">Fund</span>
                Flow
              </h2>

              <p className="text-xs opacity-60">Empower Ideas Together</p>
            </div>
          </Link>

          {/* Desktop Navigation */}

          <DesktopNav />

          {/* Right Side */}

          <div className="flex items-center gap-2">
            {/* Theme */}

            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="
                btn
                btn-circle
                btn-ghost
                hover:bg-[#3B3B98]/10
              "
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {/* Login State */}

            {isLoggedIn ? (
              <UserDropdown
                user={{
                  name: user?.name || "User",
                  role: user?.role || "Member",
                  credits: user?.credits || 0,
                  avatar: user?.image || "https://i.pravatar.cc/150?img=8",
                }}
                onLogout={async () => {
                  try {
                    await logoutUser();
                    setUser(null);
                  } catch (error) {
                    console.error("Logout failed", error);
                  }
                }}
              />
            ) : (
              <div className="hidden lg:flex items-center gap-3">
                <Link
                  href="/auth/login"
                  className="btn btn-ghost dark:text-gray-300 dark:hover:text-black hover:text-[#3B3B98]"
                >
                  Sign In
                </Link>

                <Link
                  href="/auth/signup"
                  className="btn bg-[#3B3B98] text-white border-0 hover:bg-[#34348d]"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile */}

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="
                btn
                btn-circle
                btn-ghost
                dark:text-gray-300
                hover:dark:text-gray-800
                lg:hidden
              "
            >
              {mobileOpen ? <X size={23} /> : <Menu size={23} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{
              opacity: 0,
              y: -20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -20,
            }}
            transition={{
              duration: 0.25,
            }}
          >
            <MobileMenu
              isLoggedIn={isLoggedIn}
              user={
                user
                  ? {
                      name: user.name,
                      role: user.role || "Member",
                      credits: user.credits || 0,
                      avatar: user.image || "https://i.pravatar.cc/150?img=8",
                    }
                  : {
                      name: "User",
                      role: "Member",
                      credits: 0,
                      avatar: "https://i.pravatar.cc/150?img=8",
                    }
              }
              closeMenu={() => setMobileOpen(false)}
              onLogout={async () => {
                try {
                  await logoutUser();
                  setUser(null);
                  setMobileOpen(false);
                } catch (error) {
                  console.error("Logout failed", error);
                }
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
