"use client";

import { Sun, Moon } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "next-themes";

interface NavLink {
  label: string;
  href: string;
}

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navLinks: NavLink[] = [
    { label: "Find Jobs", href: "/jobs" },
    { label: "Companies", href: "/companies" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-base-200 bg-base-100/80 dark:bg-black/10 dark:text-white backdrop-blur-xl shadow-sm">
      <div className="navbar container mx-auto px-5">
        {/* Logo */}

        <div className="navbar-start">
          <Link href="/" className="flex items-center gap-3 group">
            <div
              className="
              w-11
              h-11
              rounded-xl
              bg-[#3B3B98]
              text-white
              font-bold
              flex
              items-center
              justify-center
              shadow-lg
              transition
              duration-300
              group-hover:rotate-6
              "
            >
              JP
            </div>

            <div className="leading-5">
              <h2 className="text-xl font-bold">
                <span className="text-[#3B3B98]">Job</span>
                Portal
              </h2>

              <p className="text-xs text-base-content/60">
                Find Your Dream Career
              </p>
            </div>
          </Link>
        </div>

        {/* Desktop Menu */}

        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal gap-2">
            {navLinks.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="
                  relative
                  px-3
                  py-2
                  rounded-lg
                  font-medium
                  hover:text-[#3B3B98]
                  dark:hover:text-white
                  dark:hover:bg-[#42428c86]
                  transition-all
                  duration-300
                  group
                  "
                >
                  {item.label}

                  <span
                    className="
                    absolute
                    left-0
                    bottom-0
                    h-[2px]
                    w-full
                    bg-[#3B3B98]
                    scale-x-0
                    group-hover:scale-x-100
                    transition-transform
                    duration-300
                    origin-left
                    "
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Right */}

        <div className="navbar-end gap-2">
          {/* Theme */}

          <button
            className="btn btn-circle btn-ghost hover:bg-[#3B3B98]/20"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme == "dark" ? (
              <Sun className="w-6 h-6 text-yellow-500 animate-spin-slow" />
            ) : (
              <Moon className="w-6 h-6 text-slate-700" />
            )}
          </button>


          {!isLoggedIn ? (
            <div className="hidden sm:flex items-center gap-2">
              <Link href="/auth/login"
                className="
                btn
                btn-ghost
                hover:text-[#3B3B98]
                dark:text-white
                dark:hover:bg-[#3b3b9874]
                "
                // onClick={() => setIsLoggedIn(true)}
              >
                Login
              </Link>

              <Link
                href="/auth/signin"
                className="
                btn
                border-0
                bg-[#3B3B98]
                text-white
                hover:bg-[#3b3b98e8]
                shadow-lg
                "
                // onClick={() => setIsLoggedIn(true)}
              >
                Sign Up
              </Link>
            </div>
          ) : (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="avatar btn btn-circle btn-ghost"
              >
                <div
                  className="
                  w-11
                  rounded-full
                  ring-2
                  ring-[#3B3B98]
                  ring-offset-2
                  ring-offset-base-100
                  "
                >
                  <img src="https://i.pravatar.cc/100" alt="profile" />
                </div>
              </div>

              <ul
                tabIndex={0}
                className="
                menu
                dropdown-content
                mt-4
                w-56
                rounded-2xl
                bg-base-100
                shadow-xl
                border
                border-base-200
                p-2
                dark:text-black
                "
              >
                <li className="menu-title">
                  <span>My Account</span>
                </li>

                <li>
                  <Link href="/dashboard">Dashboard</Link>
                </li>

                <li>
                  <Link href="/profile">Profile</Link>
                </li>

                <li>
                  <Link href="/applied-jobs">Applied Jobs</Link>
                </li>

                <div className="divider my-1" />

                <li>
                  <button
                    className="text-error"
                    // onClick={() => setIsLoggedIn(false)}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}

          {/* Mobile Button */}

          <button
            className="btn btn-circle btn-ghost lg:hidden dark:hover:bg-blue-100 dark:text-white hover:dark:text-black"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
          >
            {isMobileOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>
      {/* Mobile Menu */}

      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -25 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden border-t border-base-200 bg-base-100 shadow-xl dark:text-black"
          >
            <div className="container mx-auto px-5 py-5">
              <ul className="flex flex-col gap-2">
                {navLinks.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileOpen(false)}
                      className="
                        flex
                        items-center
                        rounded-xl
                        px-4
                        py-3
                        font-medium
                        transition-all
                        duration-300
                        hover:bg-[#3B3B98]
                        hover:text-white
                      "
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="divider"></div>

              {!isLoggedIn ? (
                <div className="flex flex-col gap-3">
                  <Link
                    href="/auth/login"
                    className="btn btn-outline border-[#3B3B98] text-[#3B3B98] hover:bg-[#3B3B98] hover:text-white"
                  >
                    Login
                  </Link>

                  <Link
                    href="/auth/signin"
                    className="btn bg-[#3B3B98] border-0 text-white hover:bg-[#3b3b98e6]"
                  >
                    Create Account
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    href="/dashboard"
                    onClick={() => setIsMobileOpen(false)}
                    className="btn btn-ghost justify-start w-full"
                  >
                    Dashboard
                  </Link>

                  <Link
                    href="/profile"
                    onClick={() => setIsMobileOpen(false)}
                    className="btn btn-ghost justify-start w-full"
                  >
                    Profile
                  </Link>

                  <Link
                    href="/applied-jobs"
                    onClick={() => setIsMobileOpen(false)}
                    className="btn btn-ghost justify-start w-full"
                  >
                    Applied Jobs
                  </Link>

                  <button
                    onClick={() => {
                      setIsLoggedIn(false);
                      setIsMobileOpen(false);
                    }}
                    className="btn btn-error text-white w-full"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
