"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  CreditCard,
  Home,
  LayoutDashboard,
  LogOut,
  User,
  Briefcase,
  HeartHandshake,
  Info,
  Phone,
} from "lucide-react";

interface User {
  name: string;
  role: string;
  credits: number;
  avatar: string;
}

interface MobileMenuProps {
  isLoggedIn: boolean;
  user: User;
  closeMenu: () => void;
  onLogout: () => Promise<void>;
}

const navLinks = [
  {
    label: "Home",
    href: "/",
    icon: Home,
  },
  {
    label: "Explore Campaigns",
    href: "/campaigns",
    icon: HeartHandshake,
  },
  {
    label: "How It Works",
    href: "/how-it-works",
    icon: Briefcase,
  },
  {
    label: "About",
    href: "/about",
    icon: Info,
  },
  {
    label: "Contact",
    href: "/contact",
    icon: Phone,
  },
];

export default function MobileMenu({
  isLoggedIn,
  user,
  closeMenu,
  onLogout,
}: MobileMenuProps) {
  const pathname = usePathname();

  return (
    <div className="lg:hidden border-t bg-base-100 dark:bg-black shadow-xl overflow-auto">
      <div className="container mx-auto px-5 py-5">
        {/* Navigation */}

        <ul className="space-y-2">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={closeMenu}
                  className={`
                    flex
                    items-center
                    gap-3
                    rounded-xl
                    px-4
                    py-3
                    font-medium
                    transition-all

                    ${
                      active
                        ? "bg-[#3B3B98] text-white"
                        : "hover:bg-[#3B3B98] hover:text-white"
                    }
                  `}
                >
                  <Icon size={20} />

                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="divider" />

        {!isLoggedIn ? (
          <div className="space-y-3">
            <Link
              href="/auth/login"
              onClick={closeMenu}
              className="
              btn
              btn-outline
              w-full
              border-[#3B3B98]
              text-[#3B3B98]
              hover:bg-[#3B3B98]
              hover:text-white
              "
            >
              Login
            </Link>

            <Link
              href="/auth/signup"
              onClick={closeMenu}
              className="
              btn
              w-full
              border-0
              bg-[#3B3B98]
              text-white
              hover:bg-[#32327f]
              "
            >
              Register
            </Link>
          </div>
        ) : (
          <div>
            {/* User */}

            <div className="rounded-2xl border p-4">
              <div className="flex items-center gap-3">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="
                  w-14
                  h-14
                  rounded-full
                  object-cover
                  ring-2
                  ring-[#3B3B98]
                  "
                />

                <div>
                  <h3 className="font-bold">{user.name}</h3>

                  <p className="text-sm opacity-60">{user.role}</p>
                </div>
              </div>

              <div className="divider " />

              <div className="flex items-center justify-between">
                <span className="text-sm">Available Credits</span>

                <span
                  className="
                  rounded-full
                  bg-[#3B3B98]
                  px-3
                  py-1
                  text-white
                  text-sm
                  "
                >
                  {user.credits}
                </span>
              </div>
            </div>

            <div className="mt-5 space-y-2">
              <Link
                href="/dashboard"
                onClick={closeMenu}
                className="btn btn-ghost dark:text-gray-400 justify-start w-full"
              >
                <LayoutDashboard size={18} />
                Dashboard
              </Link>

              <Link
                href="/profile"
                onClick={closeMenu}
                className="btn btn-ghost justify-start dark:text-gray-400 w-full"
              >
                <User size={18} />
                Profile
              </Link>

              <Link
                href="/dashboard/notifications"
                onClick={closeMenu}
                className="btn btn-ghost dark:text-gray-400 justify-start w-full"
              >
                <Bell size={18} />
                Notifications
              </Link>

              <Link
                href="/dashboard/payments"
                onClick={closeMenu}
                className="btn btn-ghost dark:text-gray-400 justify-start w-full"
              >
                <CreditCard size={18} />
                Payment History
              </Link>

              <button
                onClick={async () => {
                  await onLogout();
                  closeMenu();
                }}
                className="
                btn
                btn-error
                w-full
                text-white
                mt-3
                "
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
