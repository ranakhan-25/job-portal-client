"use client";

import { useState, useEffect, useCallback } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import {
  Heart,
  DollarSign,
  Layers,
  Award,
  RefreshCw,
  Loader2,
  ArrowUpRight,
  Clock
} from "lucide-react";

interface UserCrowdfundStats {
  totalDonated: number;
  donationGrowth: number;
  backedCampaigns: number;
  activeBookmarks: number;
  donorBadge: string;
}

interface DonationHistory {
  month: string;
  amount: number;
}

export default function UserCrowdfundDashboard() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<UserCrowdfundStats | null>(null);
  const [chartData, setChartData] = useState<DonationHistory[]>([]);

  // API থেকে ইউজারের ক্রাউডফান্ডিং ডেটা লোড করা
  const fetchCrowdfundData = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    else setRefreshing(true);

    try {
      const token = localStorage.getItem("user-token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/crowdfund-stats`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setStats(data.stats);
        setChartData(data.chartData);
      } else {
        loadFallbackData();
      }
    } catch (err) {
      console.error("Error fetching crowdfund metrics:", err);
      loadFallbackData();
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchCrowdfundData();
  }, [fetchCrowdfundData]);

  const loadFallbackData = () => {
    setStats({
      totalDonated: 450, // মোট ডোনেশন
      donationGrowth: 12.5,
      backedCampaigns: 6,  // কয়টি ক্যাম্পেইনে ফান্ড দিয়েছে
      activeBookmarks: 14, // কয়টি ক্যাম্পেইন সেভ করে রেখেছে
      donorBadge: "Silver Supporter" // ইউজারের ব্যাজ
    });

    setChartData([
      { month: "Jan", amount: 50 },
      { month: "Feb", amount: 100 },
      { month: "Mar", amount: 30 },
      { month: "Apr", amount: 120 },
      { month: "May", amount: 0 },
      { month: "Jun", amount: 150 }
    ]);
  };

  if (loading || !stats) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-2">
        <Loader2 className="h-9 w-9 animate-spin text-emerald-600" />
        <p className="text-xs text-gray-500 font-medium">Loading your funding impact...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl space-y-6 p-4 font-sans">
      
      {/* Header section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
            <Heart className="text-rose-500 fill-rose-500" size={24} /> My Backer Portal
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Track your contributions, backed projects, and crowdfunding impact.
          </p>
        </div>
        
        <button
          onClick={() => fetchCrowdfundData(true)}
          disabled={refreshing}
          className="flex self-start items-center gap-2 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2 text-xs font-bold text-gray-700 dark:text-gray-300 transition hover:bg-gray-50 dark:hover:bg-slate-800"
        >
          <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
          {refreshing ? "Syncing..." : "Refresh Portal"}
        </button>
      </div>

      {/* 4 Responsive Grid Cards for Crowdfunding */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Contribution */}
        <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Donated</span>
            <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/20 p-2 text-emerald-600">
              <DollarSign size={18} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              ${stats.totalDonated}
            </span>
            <span className="flex items-center text-xs font-semibold text-green-600 gap-0.5">
              <ArrowUpRight size={14} /> +{stats.donationGrowth}%
            </span>
          </div>
          <p className="text-[11px] text-gray-400 mt-1">Lifetime financial support</p>
        </div>

        {/* Backed Campaigns */}
        <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Backed Projects</span>
            <div className="rounded-lg bg-blue-50 dark:bg-blue-950/20 p-2 text-blue-600">
              <Layers size={18} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              {stats.backedCampaigns}
            </span>
          </div>
          <p className="text-[11px] text-gray-400 mt-1">Unique campaigns supported</p>
        </div>

        {/* Bookmarked Campaigns */}
        <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Saved Campaigns</span>
            <div className="rounded-lg bg-amber-50 dark:bg-amber-950/20 p-2 text-amber-600">
              <Heart size={18} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              {stats.activeBookmarks}
            </span>
          </div>
          <p className="text-[11px] text-gray-400 mt-1">Projects you are watching</p>
        </div>

        {/* Backer Badge Level */}
        <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-emerald-600 text-white p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-200 uppercase tracking-wider">Backer Tier</span>
            <div className="rounded-lg bg-emerald-500 p-2 text-white">
              <Award size={18} />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-bold tracking-tight">
              {stats.donorBadge}
            </span>
          </div>
          <p className="text-[11px] text-emerald-100 mt-2">Thank you for making an impact!</p>
        </div>
      </div>

      {/* Donation Activity Chart Grid */}
      <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1">
            <Clock size={16} className="text-emerald-600" /> Donation Timeline
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">Monthly overview of your contributions to various funding projects.</p>
        </div>

        <div className="h-64 w-full text-xs font-semibold">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:hidden" />
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" className="hidden dark:block" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip formatter={(value) => [`$${value}`, "Amount Donated"]} />
              <Bar dataKey="amount" fill="#059669" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}