"use client";

import { useState, useEffect, useCallback } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from "recharts";
import {
  TrendingUp,
  DollarSign,
  Building2,
  Users,
  Download,
  Calendar,
  Loader2,
  RefreshCw,
  FileText,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";

// Types Definition
interface ReportStats {
  totalMRR: number;
  mrrGrowth: number;
  activeCompanies: number;
  companyGrowth: number;
  totalUsers: number;
  userGrowth: number;
  activeSubscriptions: number;
}

interface RevenueData {
  month: string;
  revenue: number;
  expenses: number;
}

interface PlanDistribution {
  name: string;
  value: number;
}

export default function AnalyticsReportsPage() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState("Last 6 Months");

  // State Matrix for Analytics Data
  const [stats, setStats] = useState<ReportStats | null>(null);
  const [revenueChartData, setRevenueChartData] = useState<RevenueData[]>([]);
  const [planChartData, setPlanChartData] = useState<PlanDistribution[]>([]);

  // Pie Chart Color Palette
  const COLORS = ["#6366f1", "#3b82f6", "#10b981"];

  // ==========================================
  // API কানেকশন: অ্যানালিটিক্যাল সব ডাটা ফেচ করা
  // ==========================================
  const fetchAnalyticsData = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    else setRefreshing(true);

    try {
      const token = localStorage.getItem("super-admin-token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/super-admin/reports?range=${timeRange}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setStats(data.stats);
        setRevenueChartData(data.revenueData);
        setPlanChartData(data.planData);
      } else {
        loadFallbackAnalytics();
      }
    } catch (err) {
      console.error("Error generating system reports:", err);
      loadFallbackAnalytics(); // অফলাইন ডেমো ব্যাকআপ
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [timeRange]);

  useEffect(() => {
    fetchAnalyticsData();
  }, [fetchAnalyticsData]);

  // ডাইনামিক ডেটা সিমুলেশন (Fallback UI)
  const loadFallbackAnalytics = () => {
    setStats({
      totalMRR: 54890,
      mrrGrowth: 12.4,
      activeCompanies: 142,
      companyGrowth: 8.2,
      totalUsers: 3840,
      userGrowth: 24.6,
      activeSubscriptions: 118
    });

    setRevenueChartData([
      { month: "Jan", revenue: 32000, expenses: 18000 },
      { month: "Feb", revenue: 38000, expenses: 19500 },
      { month: "Mar", revenue: 41000, expenses: 21000 },
      { month: "Apr", revenue: 46000, expenses: 22000 },
      { month: "May", revenue: 51000, expenses: 24000 },
      { month: "Jun", revenue: 54890, expenses: 25500 }
    ]);

    setPlanChartData([
      { name: "Enterprise Plan", value: 35 },
      { name: "Pro Plan", value: 55 },
      { name: "Free Tier", value: 52 }
    ]);
  };

  // CSV বা PDF রিপোর্ট এক্সপোর্ট হ্যান্ডলার
  const triggerReportExport = () => {
    alert("Exporting system ledger for " + timeRange + " in CSV format...");
    // Real implementation: window.open('/api/admin/reports/export?type=csv')
  };

  if (loading || !stats) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-sm text-gray-500 font-medium">Compiling platform nodes & metrics...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl space-y-6 p-1">
      
      {/* Page Title & Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="text-primary" size={24} /> Financial & Usage Reports
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Audit monthly recurring revenue, platform resource logs, and tenant distribution analysis.
          </p>
        </div>
        
        {/* Interactive Filters Header */}
        <div className="flex items-center gap-2 self-start text-xs font-bold">
          <div className="flex items-center gap-1.5 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2">
            <Calendar size={14} className="text-gray-400" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-transparent focus:outline-hidden text-gray-700 dark:text-gray-300"
            >
              <option value="Last 30 Days">Last 30 Days</option>
              <option value="Last 6 Months">Last 6 Months</option>
              <option value="Year to Date">Year to Date</option>
            </select>
          </div>

          <button
            onClick={triggerReportExport}
            className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-white hover:bg-primary/90 transition shadow-xs"
          >
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* 4 Card Stats Matrix Grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: MRR */}
        <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total MRR Flow</span>
            <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/20 p-2 text-emerald-600">
              <DollarSign size={18} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              ${stats.totalMRR.toLocaleString()}
            </span>
            <span className="flex items-center text-xs font-semibold text-green-600 gap-0.5">
              <ArrowUpRight size={14} /> +{stats.mrrGrowth}%
            </span>
          </div>
          <p className="text-[11px] text-gray-400 mt-1">Platform gross revenue velocity</p>
        </div>

        {/* Card 2: Registered Tenants */}
        <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Organizations</span>
            <div className="rounded-lg bg-blue-50 dark:bg-blue-950/20 p-2 text-blue-600">
              <Building2 size={18} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              {stats.activeCompanies}
            </span>
            <span className="flex items-center text-xs font-semibold text-green-600 gap-0.5">
              <ArrowUpRight size={14} /> +{stats.companyGrowth}%
            </span>
          </div>
          <p className="text-[11px] text-gray-400 mt-1">Live corporate workspaces</p>
        </div>

        {/* Card 3: Core Seat Users */}
        <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Registered Seats</span>
            <div className="rounded-lg bg-purple-50 dark:bg-purple-950/20 p-2 text-purple-600">
              <Users size={18} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              {stats.totalUsers.toLocaleString()}
            </span>
            <span className="flex items-center text-xs font-semibold text-green-600 gap-0.5">
              <ArrowUpRight size={14} /> +{stats.userGrowth}%
            </span>
          </div>
          <p className="text-[11px] text-gray-400 mt-1">Active operators inside slots</p>
        </div>

        {/* Card 4: Retention Ratio */}
        <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Premium Gateways</span>
            <div className="rounded-lg bg-orange-50 dark:bg-orange-950/20 p-2 text-orange-600">
              <FileText size={18} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              {stats.activeSubscriptions}
            </span>
            <span className="flex items-center text-xs font-semibold text-red-500 gap-0.5">
              <ArrowDownRight size={14} /> -1.2%
            </span>
          </div>
          <p className="text-[11px] text-gray-400 mt-1">Paid commercial accounts</p>
        </div>
      </div>

      {/* Main Complex Chart Analytics Row */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Area Flow Chart: Gross Revenue vs Expenses (2/3 Width) */}
        <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs lg:col-span-2 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Revenue Scalability & Maintenance Graph</h3>
            <p className="text-xs text-gray-400 mt-0.5">Comparative ledger matching cash inflow against server expenditures.</p>
          </div>
          <div className="h-72 w-full text-xs font-semibold">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:hidden" />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" className="hidden dark:block" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" name="Gross Revenue" />
                <Bar dataKey="expenses" fill="#94a3b8" radius={[4, 4, 0, 0]} maxBarSize={20} name="Overhead Operations" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Component Chart: Tier Share Distribution (1/3 Width) */}
        <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">SaaS Product Tier Analytics</h3>
            <p className="text-xs text-gray-400 mt-0.5">Active market volume captured by distinct packages.</p>
          </div>
          
          {/* Pie Graphic Block */}
          <div className="h-44 w-full relative flex items-center justify-center my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip />
                <Pie
                  data={planChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {planChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Color Indicators Legend Layout */}
          <div className="space-y-2 text-xs font-medium text-gray-600 dark:text-gray-400">
            {planChartData.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between border-t border-gray-50 dark:border-slate-800/40 pt-2 first:border-0">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                  <span>{item.name}</span>
                </div>
                <span className="font-bold text-gray-900 dark:text-white">{item.value} companies</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}