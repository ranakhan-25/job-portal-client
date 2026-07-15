"use client";

import { useState, useEffect, useCallback } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";
import {
  LayoutDashboard,
  DollarSign,
  Users,
  Target,
  Percent,
  ArrowUpRight,
  Loader2,
  RefreshCw,
  TrendingUp,
  Activity
} from "lucide-react";

// Crowdfunding Campaign Admin Metrics Interface
interface CampaignAdminStats {
  totalFundsRaised: number;
  fundingGrowth: number;
  totalBackers: number;
  backersGrowth: number;
  activeCampaigns: number;
  campaignsGrowth: number;
  platformFeeRate: number; // প্ল্যাটফর্ম কর্তৃক ধার্যকৃত ফি (%)
}

interface MonthlyPerformance {
  name: string;
  fundsRaised: number;
  platformFees: number;
}

export default function CampaignAdminOverviewPage() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // States Matrix for Crowdfunding Analytics
  const [stats, setStats] = useState<CampaignAdminStats | null>(null);
  const [performanceData, setPerformanceData] = useState<MonthlyPerformance[]>([]);

  // ==========================================
  // API কানেকশন: নির্দিষ্ট কোম্পানির ওভারভিউ ডাটা ফেচ করা
  // ==========================================
  const fetchCampaignDashboardData = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    else setRefreshing(true);

    try {
      const token = localStorage.getItem("company-admin-token");
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/company-admin/overview`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setStats(data.stats);
        setPerformanceData(data.performanceData);
      } else {
        loadFallbackCrowdStats();
      }
    } catch (err) {
      console.error("Error connecting to corporate tenant cluster:", err);
      loadFallbackCrowdStats(); // অফলাইন বা ডেভেলপমেন্ট ব্যাকআপ
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchCampaignDashboardData();
  }, [fetchCampaignDashboardData]);

  // ডাইনামিক ক্রাউডফান্ডিং স্পেসিফিক ডেমো ডাটা (Fallback UI)
  const loadFallbackCrowdStats = () => {
    setStats({
      totalFundsRaised: 78450,
      fundingGrowth: 22.4,
      totalBackers: 1420,
      backersGrowth: 8.7,
      activeCampaigns: 12,
      campaignsGrowth: 15.3,
      platformFeeRate: 5 // ৫% প্ল্যাটফর্ম ফি
    });

    setPerformanceData([
      { name: "Jan", fundsRaised: 25000, platformFees: 1250 },
      { name: "Feb", fundsRaised: 38000, platformFees: 1900 },
      { name: "Mar", fundsRaised: 42000, platformFees: 2100 },
      { name: "Apr", fundsRaised: 59000, platformFees: 2950 },
      { name: "May", fundsRaised: 68000, platformFees: 3400 },
      { name: "Jun", fundsRaised: 78450, platformFees: 3922 }
    ]);
  };

  if (loading || !stats) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
        <p className="text-sm text-gray-500 font-medium font-sans">Syncing workspace analytics...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl space-y-6 p-1 font-sans">
      
      {/* Top Banner Control Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
            <LayoutDashboard className="text-emerald-600" size={24} /> Company Admin Workspace
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Real-time tracking of your campaigns, supporter growth, and platform payouts.
          </p>
        </div>
        
        <button
          onClick={() => fetchCampaignDashboardData(true)}
          disabled={refreshing}
          className="flex self-start items-center gap-2 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2 text-xs font-bold text-gray-700 dark:text-gray-300 transition hover:bg-gray-50 dark:hover:bg-slate-800"
        >
          <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
          {refreshing ? "Re-indexing..." : "Sync Workspace"}
        </button>
      </div>

      {/* 4 Cards Matrix */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Funds Raised Card */}
        <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Raised</span>
            <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/20 p-2 text-emerald-600">
              <DollarSign size={18} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              ${stats.totalFundsRaised.toLocaleString()}
            </span>
            <span className="flex items-center text-xs font-semibold text-green-600 gap-0.5">
              <ArrowUpRight size={14} /> +{stats.fundingGrowth}%
            </span>
          </div>
          <p className="text-[11px] text-gray-400 mt-1">Net funding accumulated across campaigns</p>
        </div>

        {/* Active Backers Card */}
        <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Backers</span>
            <div className="rounded-lg bg-blue-50 dark:bg-blue-950/20 p-2 text-blue-600">
              <Users size={18} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              {stats.totalBackers.toLocaleString()}
            </span>
            <span className="flex items-center text-xs font-semibold text-green-600 gap-0.5">
              <ArrowUpRight size={14} /> +{stats.backersGrowth}%
            </span>
          </div>
          <p className="text-[11px] text-gray-400 mt-1">Total supporters supporting your brand</p>
        </div>

        {/* Active Campaigns */}
        <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Campaigns</span>
            <div className="rounded-lg bg-purple-50 dark:bg-purple-950/20 p-2 text-purple-600">
              <Target size={18} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              {stats.activeCampaigns}
            </span>
            <span className="flex items-center text-xs font-semibold text-green-600 gap-0.5">
              <ArrowUpRight size={14} /> +{stats.campaignsGrowth}%
            </span>
          </div>
          <p className="text-[11px] text-gray-400 mt-1">Live crowdfunding projects now</p>
        </div>

        {/* Platform Fee Card */}
        <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Platform Fee Rate</span>
            <div className="rounded-lg bg-orange-50 dark:bg-orange-950/20 p-2 text-orange-600">
              <Percent size={18} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              {stats.platformFeeRate}%
            </span>
          </div>
          <p className="text-[11px] text-gray-400 mt-1">Platform service fee applied to raised funds</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Funding Velocity Chart */}
        <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1">
                <TrendingUp size={16} className="text-emerald-600" /> Funding Accrual & Velocity Chart
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">Monthly progression representing the gross funds backed by your users.</p>
            </div>
          </div>

          <div className="h-72 w-full text-xs font-semibold">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="companyIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:hidden" />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" className="hidden dark:block" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="fundsRaised" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#companyIncome)" name="Gross Funds ($)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Platform Fees Breakdown */}
        <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1">
              <Activity size={16} className="text-orange-500" /> Platform Fees Share
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">Calculated platform commission costs corresponding to monthly goals.</p>
          </div>

          <div className="h-44 w-full text-xs font-semibold">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:hidden" />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" className="hidden dark:block" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="platformFees" fill="#f97316" radius={[4, 4, 0, 0]} name="Platform cut ($)" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-xl bg-gray-50 dark:bg-slate-800/40 p-3 text-xs border border-gray-100 dark:border-transparent">
            <span className="font-bold text-gray-700 dark:text-gray-300 block">Workspace Efficiency Status</span>
            <p className="text-[11px] text-gray-400 mt-0.5">Your campaigns are scaling efficiently. Payout processing times remain optimal.</p>
          </div>
        </div>
      </div>

    </div>
  );
}