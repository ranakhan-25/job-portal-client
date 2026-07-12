"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

interface NavLink {
  label: string;
  href: string;
}

const navLinks: NavLink[] = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "All Campaigns",
    href: "/campaigns",
  },
  {
    label: "About Us",
    href: "/about-us",
  },
  {
    label: "How It Works",
    href: "/how-it-works",
  },
];

export default function DesktopNav() {
  const pathname = usePathname();

  return (
    <nav className="hidden lg:flex items-center">
      <ul className="flex items-center gap-1">
        {navLinks.map((item) => {
          const active = pathname === item.href;

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`
                  relative
                  flex
                  items-center
                  rounded-xl
                  px-4
                  py-2
                  text-sm
                  font-medium
                  transition-all
                  duration-300

                  ${active ? "text-[#3B3B98]" : "hover:text-[#3B3B98]"}
                `}
              >
                {item.label}

                {active && (
                  <motion.span
                    layoutId="navbar-active"
                    className="
                      absolute
                      left-3
                      right-3
                      -bottom-[2px]
                      h-[3px]
                      rounded-full
                      bg-[#3B3B98]
                    "
                    transition={{
                      type: "spring",
                      stiffness: 350,
                      damping: 30,
                    }}
                  />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
