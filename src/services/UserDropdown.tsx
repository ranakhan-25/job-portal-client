"use client";

import Link from "next/link";
import {
  Bell,
  ChevronDown,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Settings,
  User,
} from "lucide-react";

interface UserProps {
  user: {
    name: string;
    role: string;
    credits: number;
    avatar: string;
  };
  onLogout: () => Promise<void>;
}

export default function UserDropdown({ user, onLogout }: UserProps) {
  const dashboardPath =
    user.role === "Admin"
      ? "/dashboard/admin"
      : user.role === "Creator"
        ? "/dashboard/creator"
        : "/dashboard/supporter";

  return (
    <div className="hidden lg:flex items-center gap-3">
      {/* Credits */}

      <div className="hidden xl:flex items-center gap-2 rounded-full bg-[#3B3B98] px-4 py-2 text-white shadow">
        <CreditCard size={16} />
        <span className="text-sm font-medium">{user.credits} Credits</span>
      </div>

      {/* Notification */}

      <div className="dropdown dropdown-end">
        <label
          tabIndex={0}
          className="btn btn-circle dark:text-gray-300
                hover:dark:text-gray-800 btn-ghost relative"
        >
          <Bell size={21} />

          <span className="absolute right-2 top-2 w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
        </label>

        <div
          tabIndex={0}
          className="
          dropdown-content
          mt-4
          w-80
          rounded-2xl
          border
          bg-base-100
          dark:bg-black
          shadow-xl
          p-3
          z-50
          "
        >
          <h3 className="font-semibold">Notifications</h3>

          <div className="divider my-2"></div>

          <div className="space-y-3">
            <div className="rounded-xl p-3 dark:hover:bg-gray-700 hover:bg-base-200 transition cursor-pointer">
              <h4 className="font-medium text-sm">
                🎉 Your campaign has been approved.
              </h4>

              <p className="text-xs opacity-60 mt-1">2 minutes ago</p>
            </div>

            <div className="rounded-xl p-3 dark:hover:bg-gray-700 hover:bg-base-200 transition cursor-pointer">
              <h4 className="font-medium text-sm">
                💰 New contribution received.
              </h4>

              <p className="text-xs opacity-60 mt-1">Today</p>
            </div>

            <div className="rounded-xl p-3 dark:hover:bg-gray-700 hover:bg-base-200 transition cursor-pointer">
              <h4 className="font-medium text-sm">🚀 Welcome to FundFlow.</h4>

              <p className="text-xs opacity-60 mt-1">Yesterday</p>
            </div>
          </div>

          <div className="divider my-2"></div>

          <Link
            href="/dashboard/notifications"
            className="btn w-full bg-[#3B3B98] text-white border-0 hover:bg-[#32327f]"
          >
            View All Notifications
          </Link>
        </div>
      </div>

      {/* User */}

      <div className="dropdown dropdown-end">
        <label
          tabIndex={0}
          className="flex cursor-pointer items-center gap-2 rounded-full hover:bg-base-200 dark:hover:bg-gray-800 p-1 transition"
        >
          <img
            // width={100}
            // height={100}
            src={user.avatar}
            alt={user.name}
            className="
            w-11
            h-11
            rounded-full
            object-cover
            ring-2
            ring-[#3B3B98]
            transition
            hover:scale-105
            "
          />

          <ChevronDown size={18} className="hidden xl:block" />
        </label>

        <ul
          tabIndex={0}
          className="
          menu
          dropdown-content
          mt-4
          w-72
          rounded-2xl
          border
          bg-base-100
          dark:bg-black
          shadow-2xl
          p-2
          z-50
          "
        >
          {/* Header */}

          <div className="px-3 py-3">
            <img
              // width={100}
              // height={100}
              src={user.avatar}
              alt=""
              className="
              w-16
              h-16
              rounded-full
              ring-2
              ring-[#3B3B98]
              mx-auto
              "
            />

            <h3 className="mt-3 text-center font-bold">{user.name}</h3>

            <p className="text-center text-sm opacity-60">{user.role}</p>
          </div>

          <div className="divider my-1"></div>

          <li>
            <Link href={dashboardPath} className="dark:hover:bg-gray-900">
              <LayoutDashboard size={18} />
              Dashboard
            </Link>
          </li>

          <li>
            <Link href="/profile" className="dark:hover:bg-gray-900">
              <User size={18} />
              My Profile
            </Link>
          </li>

          <li>
            <Link href="/dashboard/payments" className="dark:hover:bg-gray-900">
              <CreditCard size={18} />
              Payments
            </Link>
          </li>

          <li>
            <Link href="/settings" className="dark:hover:bg-gray-900">
              <Settings size={18} />
              Settings
            </Link>
          </li>

          <div className="divider my-1"></div>

          <li>
            <button
              onClick={onLogout}
              className="
              text-red-500
              hover:bg-red-50
              "
            >
              <LogOut size={18} />
              Logout
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
