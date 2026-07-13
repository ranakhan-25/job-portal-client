"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  CreditCard,
  DollarSign,
  TrendingUp,
  Rocket,
  Wallet,
  ArrowRight,
  CalendarClock,
  Search,
  CheckCircle2,
  Clock,
  ChevronRight,
  AlertCircle
} from "lucide-react";

// 1. API Response TypeScript Interface
interface DashboardData {
  user: {
    name: string;
    availableCredits: number;
    weeklyTrend: string;
  };
  stats: {
    availableCredits: { value: string; trend: string };
    totalContributions: { value: string; trend: string };
    approvedProjects: { value: string; trend: string };
    pendingReview: { value: string; trend: string };
  };
  recentContributions: Array<{
    id: string;
    title: string;
    amount: string;
    status: "Approved" | "Pending";
    date: string;
  }>;
  upcomingDeadlines: Array<{
    id: string;
    title: string;
    days: string;
    progress: number;
    urgent: boolean;
  }>;
}

export default function UserDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 2. API Call Function with Fallback Handling
  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setIsLoading(true);
        setError(null);
        
        // Replace with your actual backend API route (e.g., "http://localhost:5000/api/dashboard")
        const response = await fetch("/api/dashboard", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          }
        });

        if (!response.ok) {
          throw new Error("Failed to load dashboard data from server.");
        }

        const result: DashboardData = await response.json();
        setData(result);
      } catch (err: any) {
        console.error("API Call Error:", err);
        setError(err.message || "Something went wrong. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 120 } },
  };

  // 3. Loading UI
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center text-slate-500 font-sans gap-3">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-medium tracking-wide">Loading your command center...</p>
      </div>
    );
  }

  // 4. Safe Fallbacks if data is missing or error happens (renders 0 instead of breaking)
  const user = data?.user || { name: "Creator", availableCredits: 0, weeklyTrend: "0 Credits this week" };
  const stats = data?.stats || {
    availableCredits: { value: "0", trend: "0% from last month" },
    totalContributions: { value: "0", trend: "0 active projects" },
    approvedProjects: { value: "0", trend: "Success rate: 0%" },
    pendingReview: { value: "0", trend: "No pending review" }
  };
  const recentContributions = data?.recentContributions || [];
  const upcomingDeadlines = data?.upcomingDeadlines || [];

  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen p-4 md:p-8 transition-colors duration-300 font-sans max-h-screen overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Navigation / Action Bar */}
        <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-sm shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="relative w-64 md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
            <input 
              type="text" 
              placeholder="Search campaigns..." 
              className="w-full pl-10 pr-4 py-2 text-sm rounded-sm bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative cursor-pointer p-2.5 rounded-sm bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition">
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
            </div>
          </div>
        </div>

        {/* Welcome Section */}
        <motion.section 
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-sm overflow-hidden bg-gradient-to-br from-indigo-700 via-indigo-600 to-blue-600 p-6 md:p-8 text-white relative shadow-md"
        >
          <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-white/5 blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-4 text-center lg:text-left">
              <span className="uppercase tracking-[4px] text-xs font-bold text-indigo-100 bg-white/10 px-3 py-1 rounded-sm">
                Dashboard Overview
              </span>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight mt-2">
                Hi, {user.name} 👋
              </h1>
              <p className="max-w-xl text-indigo-100/90 leading-relaxed text-sm md:text-base">
                Support amazing creators, discover innovative projects and manage all your contributions seamlessly from your command center.
              </p>
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start pt-2">
                <button className="bg-white text-indigo-700 px-5 py-2.5 rounded-sm font-semibold shadow-sm hover:bg-slate-100 active:scale-95 transition-all">
                  Explore Campaigns
                </button>
                <button className="bg-transparent border border-white/30 px-5 py-2.5 rounded-sm font-medium hover:bg-white/10 active:scale-95 transition-all">
                  Purchase Credits
                </button>
              </div>
            </div>

            {/* Balance Card */}
            <motion.div 
              whileHover={{ y: -4 }}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-sm p-6 w-full max-w-sm shadow-lg relative overflow-hidden group"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-xs uppercase tracking-wider text-indigo-100 font-semibold">Available Balance</p>
                  <h2 className="text-4xl font-black tracking-tight mt-1">{user.availableCredits} <span className="text-xs font-medium text-indigo-200">Credits</span></h2>
                </div>
                <div className="p-3 bg-white/10 rounded-sm">
                  <Wallet className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-center gap-2 bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-sm text-xs font-semibold w-fit border border-emerald-500/30">
                <TrendingUp size={14} />
                <span>{user.weeklyTrend}</span>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Stats Grid */}
        <motion.section 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <StatCard icon={<Wallet className="text-violet-600 dark:text-violet-400" />} title="Available Credits" value={stats.availableCredits.value} color="bg-violet-500/5 dark:bg-violet-500/10 border-violet-200 dark:border-violet-800/60" variants={itemVariants} trend={stats.availableCredits.trend} />
          <StatCard icon={<Rocket className="text-blue-600 dark:text-blue-400" />} title="Total Contributions" value={stats.totalContributions.value} color="bg-blue-500/5 dark:bg-blue-500/10 border-blue-200 dark:border-blue-800/60" variants={itemVariants} trend={stats.totalContributions.trend} />
          <StatCard icon={<CheckCircle2 className="text-emerald-600 dark:text-emerald-400" />} title="Approved Projects" value={stats.approvedProjects.value} color="bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-800/60" variants={itemVariants} trend={stats.approvedProjects.trend} />
          <StatCard icon={<Clock className="text-amber-600 dark:text-amber-400" />} title="Pending Review" value={stats.pendingReview.value} color="bg-amber-500/5 dark:bg-amber-500/10 border-amber-200 dark:border-amber-800/60" variants={itemVariants} trend={stats.pendingReview.trend} />
        </motion.section>

        {/* Middle Content */}
        <section className="grid xl:grid-cols-3 gap-6">
          
          {/* Recent Contributions */}
          <div className="xl:col-span-2 rounded-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">Recent Contributions</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Your most recent funding history updates</p>
              </div>
              <button className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-all">
                View All <ArrowRight size={14} />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 text-xs uppercase font-bold tracking-wider">
                    <th className="pb-3 pl-2">Campaign</th>
                    <th className="pb-3">Amount</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 pr-2 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm">
                  {recentContributions.length > 0 ? (
                    recentContributions.map((row) => (
                      <TableRow 
                        key={row.id}
                        title={row.title} 
                        amount={row.amount} 
                        status={row.status} 
                        date={row.date} 
                      />
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-xs text-slate-400 dark:text-slate-500 font-medium">
                        No transactions found (0)
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Upcoming Deadlines */}
          <div className="rounded-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">Upcoming Deadlines</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 mb-6">Campaigns closing very soon</p>
            
            <div className="space-y-4">
              {upcomingDeadlines.length > 0 ? (
                upcomingDeadlines.map((item) => (
                  <Deadline 
                    key={item.id}
                    title={item.title} 
                    days={item.days} 
                    progress={item.progress} 
                    urgent={item.urgent} 
                  />
                ))
              ) : (
                <div className="text-center py-6 border border-dashed border-slate-200 dark:border-slate-800 rounded-sm text-xs text-slate-400">
                  No upcoming deadlines (0)
                </div>
              )}
            </div>
          </div>

        </section>

        {/* Quick Actions */}
        <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <QuickCard title="Explore Campaigns" description="Find new promising causes & creators" icon={<Rocket size={20} />} iconBg="bg-indigo-600 text-white" />
          <QuickCard title="Purchase Credits" description="Top up your funds securely via gateway" icon={<DollarSign size={20} />} iconBg="bg-purple-600 text-white" />
          <QuickCard title="Payment History" description="Download receipts and statements" icon={<CreditCard size={20} />} iconBg="bg-blue-600 text-white" />
        </section>

      </div>
    </div>
  );
}

// --- SUB COMPONENTS (STYLING UNCHANGED) ---

function StatCard({ icon, title, value, color, variants, trend }: { icon: React.ReactNode; title: string; value: string; color: string; variants: any; trend: string }) {
  // If api returns null or empty value, fallback to 0 safely
  const resolvedValue = value || "0";
  
  return (
    <motion.div 
      variants={variants}
      whileHover={{ y: -2 }}
      className={`bg-white dark:bg-slate-900 rounded-sm border ${color} p-5 shadow-sm transition-colors`}
    >
      <div className="flex justify-between items-start mb-3">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{title}</p>
        <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-sm">
          {icon}
        </div>
      </div>
      <div>
        <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-50">{resolvedValue}</h3>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 font-medium">
          {trend}
        </p>
      </div>
    </motion.div>
  );
}

function TableRow({ title, amount, status, date }: { title: string; amount: string; status: "Approved" | "Pending"; date: string }) {
  const isApproved = status === "Approved";
  return (
    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition group">
      <td className="py-3.5 pl-2 font-bold text-slate-800 dark:text-slate-200">{title}</td>
      <td className="py-3.5 font-medium text-slate-600 dark:text-slate-400">{amount || "0 Credits"}</td>
      <td className="py-3.5">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-sm text-xs font-bold ${
          isApproved ? "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" : "bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400"
        }`}>
          {status}
        </span>
      </td>
      <td className="py-3.5 pr-2 text-right text-slate-500 dark:text-slate-400 font-medium">{date}</td>
    </tr>
  );
}

function Deadline({ title, days, progress, urgent }: { title: string; days: string; progress: number; urgent?: boolean }) {
  // Safe default for styling bar width if data is empty
  const resolvedProgress = progress ?? 0;

  return (
    <div className="border border-slate-200 dark:border-slate-800 rounded-sm p-4 bg-slate-50 dark:bg-slate-800/40">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">{title}</h4>
          <p className={`text-xs font-bold mt-0.5 ${urgent ? "text-rose-600 dark:text-rose-400 animate-pulse" : "text-indigo-600 dark:text-indigo-400"}`}>
            {days || "0 Days Left"}
          </p>
        </div>
        <CalendarClock className="text-slate-400 dark:text-slate-500" size={16} />
      </div>
      <div className="w-full bg-slate-200 dark:bg-slate-800 h-1 rounded-sm overflow-hidden mt-3">
        <div 
          className={`h-full rounded-sm transition-all duration-500 ${urgent ? "bg-rose-500" : "bg-indigo-600 dark:bg-indigo-400"}`} 
          style={{ width: `${resolvedProgress}%` }} 
        />
      </div>
    </div>
  );
}

function QuickCard({ title, description, icon, iconBg }: { title: string; description: string; icon: React.ReactNode; iconBg: string }) {
  return (
    <motion.div 
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.99 }}
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-sm p-5 shadow-sm flex flex-col justify-between group cursor-pointer hover:border-indigo-500 dark:hover:border-indigo-500/60 transition-all"
    >
      <div>
        <div className={`w-10 h-10 rounded-sm ${iconBg} flex items-center justify-center mb-4 shadow-sm`}>
          {icon}
        </div>
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {title}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
          {description}
        </p>
      </div>
      <div className="mt-5 flex items-center text-xs font-bold text-slate-400 dark:text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
        <span>Proceed</span>
        <ChevronRight size={14} className="ml-0.5 group-hover:translate-x-1 transition-transform" />
      </div>
    </motion.div>
  );
}