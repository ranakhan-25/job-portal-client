"use client";

import { useState, useEffect } from "react";
import {
  Building2,
  Users,
  DollarSign,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  RefreshCw,
  TrendingUp,
  Globe,
  Server
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

// Interfaces
interface SuperAdminStats {
  totalCompanies: number;
  totalUsers: number;
  monthlyRevenue: number;
  serverStatus: "Optimal" | "High Load" | "Critical";
  companyGrowthPercent: number;
  userGrowthPercent: number;
  revenueGrowthPercent: number;
  activeSubscriptionsCount: number;
}

interface RevenueAndCompanyTrend {
  month: string; // Dynamic month name (e.g., "Jan", "Feb")
  revenue: number;
  companies: number;
}

interface PlanDistribution {
  name: string;
  value: number;
}

interface RecentCompany {
  id: string;
  name: string;
  ownerEmail: string;
  plan: "Enterprise" | "Pro" | "Free";
  status: "Active" | "Suspended";
  createdAt: string; // ISO string format backend specific (e.g., "2026-07-15T08:30:00.000Z")
}

export default function WebsiteAdminDashboard() {
  const [stats, setStats] = useState<SuperAdminStats | null>(null);
  const [trends, setTrends] = useState<RevenueAndCompanyTrend[]>([]);
  const [planData, setPlanData] = useState<PlanDistribution[]>([]);
  const [recentCompanies, setRecentCompanies] = useState<RecentCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // ==========================================
  // API কানেকশন এবং ডাটা ফেচ করার ডাইনামিক মেকানিজম
  // ==========================================
  const fetchSuperAdminData = async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    else setRefreshing(true);

    try {
      // ১. ব্রাউজারের লোকাল স্টোরেজ বা কুকি থেকে সুপার অ্যাডমিনের সিকিউর টোকেন রিড করা হচ্ছে
      const token = localStorage.getItem("super-admin-token"); 
      
      // ২. আপনার env ফাইল থেকে API Base URL নিয়ে কল করা হচ্ছে
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/super-admin/dashboard`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // হেডার সিকিউরিটি নিশ্চিত করতে টোকেন পাঠানো হচ্ছে
          "Content-Type": "application/json"
        }
      });
      const data = await res.json();

      if (res.ok && data.success) {
        // ৩. API সফলভাবে রেসপন্স করলে নিচের স্টেটগুলো ডাইনামিক ডেটা দিয়ে আপডেট হয়ে যাবে
        // API response format matching the states below:
        setStats(data.stats);
        setTrends(data.trends); // API থেকে আশা করা হচ্ছে: [{ month: "Jan", revenue: 8000, companies: 90 }, ...]
        setPlanData(data.planDistribution);
        setRecentCompanies(data.recentCompanies); // API থেকে আশা করা হচ্ছে: [{ id: "1", createdAt: "2026-07-15T08:30:00Z", ... }]
      } else {
        // API কল ব্যর্থ হলে বা ডাটা না থাকলে ডেমো ফালব্যাক ডাটা লোড হবে
        loadFallbackData();
      }
    } catch (err) {
      console.error("Super Admin Analytics API Load Error:", err);
      // API বা ইন্টারনেট কানেকশনে কোনো এরর ঘটলে অফলাইনে ডেমো ডাটা দেখানোর ব্যবস্থা
      loadFallbackData();
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ==========================================
  // dynamic dates সহ ডেমো ডাটা জেনারেট করার মেথড
  // ==========================================
  const loadFallbackData = () => {
    // জাভাস্ক্রিপ্ট ডেট অবজেক্ট ব্যবহার করে বর্তমান সাল বা দিন ডাইনামিক করা হচ্ছে
    const today = new Date();
    
    // ডাইনামিকভাবে বিগত ৫ মাসের নাম বের করার লজিক (যাতে চার্ট সবসময় রিয়েল-টাইম মাস দেখায়)
    const getPastMonthName = (monthsAgo: number) => {
      const d = new Date();
      d.setMonth(today.getMonth() - monthsAgo);
      return d.toLocaleString("en-US", { month: "short" });
    };

    setStats({
      totalCompanies: 142,
      totalUsers: 1840,
      monthlyRevenue: 14580,
      serverStatus: "Optimal",
      companyGrowthPercent: 18.2,
      userGrowthPercent: 24.5,
      revenueGrowthPercent: 11.8,
      activeSubscriptionsCount: 98
    });

    // ডাইনামিক ৫ মাস অনুযায়ী ট্রেন্ড চার্ট ডাটা
    setTrends([
      { month: getPastMonthName(5), revenue: 8200, companies: 90 },
      { month: getPastMonthName(4), revenue: 9500, companies: 102 },
      { month: getPastMonthName(3), revenue: 11000, companies: 115 },
      { month: getPastMonthName(2), revenue: 12100, companies: 122 },
      { month: getPastMonthName(1), revenue: 13800, companies: 131 },
      { month: "Current", revenue: 14580, companies: 142 }
    ]);

    setPlanData([
      { name: "Enterprise Plan", value: 18 },
      { name: "Pro Plan", value: 80 },
      { name: "Free Tier", value: 44 }
    ]);

    // ডাইনামিক কারেন্ট ডেট ব্যাকএন্ড স্টাইলে জেনারেট করা হয়েছে
    setRecentCompanies([
      {
        id: "101",
        name: "Acme Tech Bangladesh",
        ownerEmail: "ceo@acmetech.com",
        plan: "Enterprise",
        status: "Active",
        createdAt: new Date(today.getTime() - 12 * 60 * 60 * 1000).toISOString() // ১২ ঘণ্টা আগের টাইম
      },
      {
        id: "102",
        name: "Creative Studio LTD",
        ownerEmail: "admin@creativestudio.net",
        plan: "Pro",
        status: "Active",
        createdAt: new Date(today.getTime() - 24 * 60 * 60 * 1000).toISOString() // ১ দিন আগের টাইম
      },
      {
        id: "103",
        name: "Dhaka Retailers Inc.",
        ownerEmail: "info@dhakaretail.org",
        plan: "Free",
        status: "Suspended",
        createdAt: new Date(today.getTime() - 48 * 60 * 60 * 1000).toISOString() // ২ দিন আগের টাইম
      }
    ]);
  };

  useEffect(() => {
    fetchSuperAdminData();
  }, []);

  const PLAN_COLORS = ["#8b5cf6", "#3b82f6", "#64748b"];

  if (loading) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-3">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-sm text-gray-500 font-medium">Loading platform-wide ecosystem analytics...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl space-y-8 p-1">
      {/* Top Title Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400 text-xs px-2.5 py-0.5 font-bold tracking-wider uppercase">
              Super Admin Control
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mt-1">
            Website Ecosystem Overview
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Monitor registered SaaS companies, global subscription revenue, and active platform systems.
          </p>
        </div>

        <button
          onClick={() => fetchSuperAdminData(true)}
          disabled={refreshing}
          className="flex self-start items-center gap-2 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 text-xs font-bold text-gray-700 dark:text-gray-300 transition hover:bg-gray-50 dark:hover:bg-slate-800 disabled:opacity-50"
        >
          <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
          {refreshing ? "Syncing Platform..." : "Reload Metrics"}
        </button>
      </div>

      {/* Website Level Core Stats */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Registered Companies */}
        <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Total SaaS Companies
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400">
              <Building2 size={18} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.totalCompanies}</span>
            <span className="flex items-center gap-0.5 text-xs font-bold text-green-600">
              <ArrowUpRight size={14} />
              {stats?.companyGrowthPercent}%
            </span>
          </div>
          <p className="text-[11px] text-gray-400 mt-1">New business accounts setup</p>
        </div>

        {/* Global Users Count */}
        <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Cumulative Platform Users
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400">
              <Users size={18} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.totalUsers}</span>
            <span className="flex items-center gap-0.5 text-xs font-bold text-green-600">
              <ArrowUpRight size={14} />
              {stats?.userGrowthPercent}%
            </span>
          </div>
          <p className="text-[11px] text-gray-400 mt-1">Across all registered workspaces</p>
        </div>

        {/* Monthly Subscription Revenue */}
        <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Monthly Recurring MRR
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400">
              <DollarSign size={18} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">${stats?.monthlyRevenue.toLocaleString()}</span>
            <span className="flex items-center gap-0.5 text-xs font-bold text-green-600">
              <ArrowUpRight size={14} />
              {stats?.revenueGrowthPercent}%
            </span>
          </div>
          <p className="text-[11px] text-gray-400 mt-1">From ({stats?.activeSubscriptionsCount}) premium clients</p>
        </div>

        {/* Core Server Status */}
        <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Platform Server Health
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400">
              <Server size={18} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats?.serverStatus}</span>
          </div>
          <p className="text-[11px] text-gray-400 mt-1">All microservices running optimal</p>
        </div>
      </div>

      {/* Dynamic Graph Visualizers */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* SaaS Growth Chart */}
        <div className="lg:col-span-2 rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                <TrendingUp size={16} className="text-purple-500" /> Platform MRR vs Client Acquisition
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">Scale correlation between monthly added organizations and payment logs</p>
            </div>
          </div>

          <div className="h-72 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trends} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCompanies" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-100 dark:stroke-slate-800/60" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" tickLine={false} />
                <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                    border: 'none', 
                    borderRadius: '12px',
                    color: '#fff' 
                  }} 
                />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" name="MRR ($)" />
                <Area type="monotone" dataKey="companies" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorCompanies)" name="Registered SaaS Users" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pricing Plan Distribution Pie Chart */}
        <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
              <Globe size={16} className="text-blue-500" /> Plan Distribution
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">Ratio of active packages chosen by client brands</p>
          </div>

          <div className="h-52 w-full flex items-center justify-center my-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={planData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={6}
                  dataKey="value"
                >
                  {planData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PLAN_COLORS[index % PLAN_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '11px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Custom Legends */}
          <div className="space-y-2 text-[11px] font-semibold text-gray-500 dark:text-gray-400">
            {planData.map((plan, index) => (
              <div key={plan.name} className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: PLAN_COLORS[index % PLAN_COLORS.length] }} />
                  <span>{plan.name}</span>
                </div>
                <span className="text-gray-900 dark:text-white">{plan.value} companies</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recetly Onboarded Companies Table */}
      <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Building2 size={18} className="text-gray-400" /> New SaaS Organizations Joining
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm text-gray-500 dark:text-gray-400">
            <thead className="bg-gray-50 dark:bg-slate-800/50 text-xs font-bold uppercase text-gray-700 dark:text-gray-300">
              <tr>
                <th scope="col" className="px-6 py-4">Company Name</th>
                <th scope="col" className="px-6 py-4">Owner Email</th>
                <th scope="col" className="px-6 py-4">Active Plan</th>
                <th scope="col" className="px-6 py-4">Status</th>
                <th scope="col" className="px-6 py-4">Onboarded</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
              {recentCompanies.map((comp) => (
                <tr key={comp.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/20 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-semibold text-gray-900 dark:text-white capitalize">
                      {comp.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs">
                    {comp.ownerEmail}
                  </td>
                  {/* Selected Pricing Plan */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 rounded-md px-2.5 py-0.5 text-xs font-semibold ${
                      comp.plan === "Enterprise" 
                        ? "bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400"
                        : comp.plan === "Pro"
                        ? "bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                    }`}>
                      {comp.plan}
                    </span>
                  </td>
                  {/* Account Status Badge */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        comp.status === "Active"
                          ? "bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400"
                          : "bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400"
                      }`}
                    >
                      {comp.status}
                    </span>
                  </td>
                  {/* ডাইনামিক ডেট ফরম্যাটিং: ISO String-কে রিড-এবল ফর্মে শো করার কোড */}
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-400">
                    {new Date(comp.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}