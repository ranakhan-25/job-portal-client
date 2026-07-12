"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import {
  Home,
  Globe,
  DollarSign,
  Handshake,
  CreditCard,
  Settings,
  PlusCircle,
  FileText,
  Users,
  Flag,
  Layers,
  Wallet,
  Menu,
  X,
} from "lucide-react";
import { accessUser } from "@/lib/auth/accessUser";
import {
  Bars,
  Bell,
  Envelope,
  Gear,
  House,
  Magnifier,
  Person,
} from "@gravity-ui/icons";
import { Button, Drawer } from "@heroui/react";

const navByRole: Record<
  "user" | "company" | "admin",
  Array<{ label: string; href: string; icon: typeof Home }>
> = {
  user: [
    { label: " Dashboard", href: "/dashboard/user", icon: Home },
    {
      label: " Explore Campaigns",
      href: "/dashboard/user/campaigns",
      icon: Globe,
    },
    {
      label: " Purchase Credits",
      href: "/dashboard/user/purchase-credits",
      icon: DollarSign,
    },
    {
      label: " My Contributions",
      href: "/dashboard/user/contributions",
      icon: Handshake,
    },
    {
      label: " Payment History",
      href: "/dashboard/user/payments",
      icon: CreditCard,
    },
    { label: " Settings", href: "/dashboard/user/settings", icon: Settings },
  ],
  company: [
    { label: " Dashboard", href: "/dashboard/company", icon: Home },
    {
      label: " Add Campaign",
      href: "/dashboard/company/add-campaign",
      icon: PlusCircle,
    },
    {
      label: " My Campaigns",
      href: "/dashboard/company/my-campaigns",
      icon: FileText,
    },
    {
      label: " Contributions",
      href: "/dashboard/company/contributions",
      icon: Handshake,
    },
    {
      label: " Withdrawals",
      href: "/dashboard/company/withdrawals",
      icon: Wallet,
    },
    {
      label: " Payment History",
      href: "/dashboard/company/payments",
      icon: CreditCard,
    },
    {
      label: " Settings",
      href: "/dashboard/company/settings",
      icon: Settings,
    },
  ],
  admin: [
    { label: " Dashboard", href: "/dashboard/admin", icon: Home },
    {
      label: " Manage Users",
      href: "/dashboard/admin/manage-users",
      icon: Users,
    },
    {
      label: " Manage Campaigns",
      href: "/dashboard/admin/manage-campaigns",
      icon: Layers,
    },
    {
      label: "Withdrawal Requests",
      href: "/dashboard/admin/withdrawals",
      icon: Wallet,
    },
    { label: "Reports", href: "/dashboard/admin/reports", icon: Flag },
    { label: "Settings", href: "/dashboard/admin/settings", icon: Settings },
  ],
};

const Sidebar = () => {
  const [role, setRole] = useState<"user" | "company" | "admin">("user");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const user = await accessUser();
      const normalizedRole = user?.role?.toLowerCase();

      if (normalizedRole === "company") {
        setRole("company");
      } else if (normalizedRole === "admin") {
        setRole("admin");
      } else {
        setRole("user");
      }

      setIsLoading(false);
    };

    loadUser();
  }, []);

  const pathname = usePathname();
  const links = navByRole[role];
  const roleLabel =
    role === "admin" ? "Admin" : role === "company" ? "Company" : "User";

  const navItems = (
    <nav className="space-y-2">
      {links.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium transition ${
              isActive
                ? "border-[#3B3B98] bg-[#3B3B98] text-white"
                : "border-transparent hover:border-slate-300 hover:bg-slate-50 dark:hover:border-slate-700 dark:hover:bg-slate-950"
            }`}
          >
            <Icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      <Drawer>
        <Drawer.Trigger
          className="lg:hidden btn btn-ghost dark:text-white dark:hover:bg-gray-800 flex items-center gap-2 m-2"
          aria-label="Open Menu"
        >
          <Bars />
          Menu
        </Drawer.Trigger>
        <Drawer.Backdrop>
          <Drawer.Content
            placement="left"
            className="h-full max-w-[85vw] sm:max-w-xs"
          >
            <Drawer.Dialog>
              <Drawer.Header className="relative border-b border-slate-200 p-4 dark:border-slate-800">
                <Drawer.Heading>
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

                      <p className="text-xs opacity-60">
                        Empower Ideas Together
                      </p>
                    </div>
                  </Link>
                </Drawer.Heading>
                <Drawer.CloseTrigger className="absolute right-4 top-4 btn btn-circle btn-ghost text-slate-900 dark:hover:text-gray-800 dark:text-slate-100" aria-label="Close Menu">
                  <X className="h-4 w-4" />
                </Drawer.CloseTrigger>
              </Drawer.Header>
              <Drawer.Body>
                <nav className="flex flex-col gap-1">{navItems}</nav>
              </Drawer.Body>
            </Drawer.Dialog>
          </Drawer.Content>
        </Drawer.Backdrop>
      </Drawer>

      <aside className="hidden lg:block w-full border-b border-slate-200 bg-white text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 lg:w-80 lg:border-r lg:border-b-0">
        <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-8 lg:px-8">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
              Dashboard
            </p>
            <h2 className="mt-2 text-2xl font-semibold">Control Panel</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              {isLoading ? "Loading menu..." : `Menu for ${roleLabel}`}
            </p>
          </div>

          {navItems}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
