"use client";

import { useEffect, useState } from "react";
import {
  DollarSign,
  Search,
  Filter,
  Download,
  Calendar,
  User,
  ArrowUpRight,
  Loader2,
  Building2,
  Briefcase,
  AlertCircle,
  RefreshCw,
  TrendingUp,
  Users,
  CheckCircle2,
  Clock,
  X,
} from "lucide-react";

// অফলাইন ডামি ডাটা কনফিগ
const IS_OFFLINE = true;

interface Contribution {
  _id: string;
  backerName: string;
  backerEmail: string;
  backerAvatar?: string;
  amount: number;
  campaignTitle: string;
  companyName: string;
  date: string;
  status: "completed" | "pending" | "refunded";
  rewardTier?: string;
  paymentMethod: string;
}

const DUMMY_CONTRIBUTIONS: Contribution[] = [
  {
    _id: "contrib-101",
    backerName: "Anisur Rahman",
    backerEmail: "anis@example.com",
    amount: 500,
    campaignTitle: "EcoPulse: Smart Home Energy Manager",
    companyName: "NexTech Ventures Ltd.",
    date: "2026-07-12",
    status: "completed",
    rewardTier: "Early Bird Smart Pack",
    paymentMethod: "Credit Card",
  },
  {
    _id: "contrib-102",
    backerName: "Sonia Akter",
    backerEmail: "sonia@example.com",
    amount: 150,
    campaignTitle: "EcoPulse: Smart Home Energy Manager",
    companyName: "NexTech Ventures Ltd.",
    date: "2026-07-14",
    status: "completed",
    rewardTier: "Supporter Tier",
    paymentMethod: "bKash",
  },
  {
    _id: "contrib-103",
    backerName: "Rahat Kabir",
    backerEmail: "rahat@example.com",
    amount: 1200,
    campaignTitle: "BioSprout Auto Drip Irrigation",
    companyName: "GreenSprout Bio-Labs",
    date: "2026-07-10",
    status: "completed",
    rewardTier: "Developer & Creator Kit",
    paymentMethod: "Nagad",
  },
  {
    _id: "contrib-104",
    backerName: "Zahid Hasan",
    backerEmail: "zahid@example.com",
    amount: 300,
    campaignTitle: "EcoPulse: Smart Home Energy Manager",
    companyName: "NexTech Ventures Ltd.",
    date: "2026-07-15",
    status: "pending",
    rewardTier: "Standard Eco-Kit",
    paymentMethod: "Bank Transfer",
  },
  {
    _id: "contrib-105",
    backerName: "Tasmia Islam",
    backerEmail: "tasmia@example.com",
    amount: 250,
    campaignTitle: "BioSprout Auto Drip Irrigation",
    companyName: "GreenSprout Bio-Labs",
    date: "2026-07-08",
    status: "refunded",
    rewardTier: "Standard Bio-Kit",
    paymentMethod: "Credit Card",
  },
];

export default function CompanyContributionsPage() {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // ফিল্টার ও সার্চ স্টেট
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [companyFilter, setCompanyFilter] = useState<string>("all");

  useEffect(() => {
    const fetchContributions = async () => {
      setLoading(true);
      setError(null);

      if (IS_OFFLINE) {
        setTimeout(() => {
          setContributions(DUMMY_CONTRIBUTIONS);
          setLoading(false);
        }, 800);
        return;
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/companies/contributions`, {
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok && data.success && Array.isArray(data.data)) {
          setContributions(data.data);
        } else {
          setContributions([]);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch contributions from the server.");
      } finally {
        setLoading(false);
      }
    };

    fetchContributions();
  }, [retryCount]);

  // ডায়নামিক ক্যালকুলেশনস (টোটাল ফান্ডিং, টোটাল ব্যাকার্স ইত্যাদি)
  const totalFunding = contributions
    .filter((c) => c.status === "completed")
    .reduce((sum, c) => sum + c.amount, 0);

  const pendingFunding = contributions
    .filter((c) => c.status === "pending")
    .reduce((sum, c) => sum + c.amount, 0);

  const uniqueBackers = new Set(contributions.map((c) => c.backerEmail)).size;

  // ইউনিক কোম্পানির লিস্ট ফিল্টারিং এর জন্য
  const uniqueCompanies = Array.from(new Set(contributions.map((c) => c.companyName)));

  // সার্চ এবং ফিল্টার অনুযায়ী ডাটা সাজানো
  const filteredContributions = contributions.filter((item) => {
    const matchesSearch =
      item.backerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.backerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.campaignTitle.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    const matchesCompany = companyFilter === "all" || item.companyName === companyFilter;

    return matchesSearch && matchesStatus && matchesCompany;
  });

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-sm text-gray-500 font-medium">Loading contributions history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <div className="flex flex-col items-center justify-center rounded-3xl border border-red-100 bg-red-50/50 p-8 shadow-sm">
          <AlertCircle className="mb-5 text-red-500 animate-bounce" size={44} />
          <h2 className="text-2xl font-bold">Failed to load data</h2>
          <p className="mt-3 text-sm text-gray-500">{error}</p>
          <button onClick={() => setRetryCount((p) => p + 1)} className="mt-6 flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white">
            <RefreshCw size={16} /> Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-8 animate-fadeIn">
      {/* Top Title Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">Backers Contributions</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Track and monitor funds raised from backers across your campaigns</p>
        </div>
        <button
          onClick={() => alert("Downloading CSV of contributions...")}
          className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800 transition shadow-xs"
        >
          <Download size={14} /> Export CSV
        </button>
      </div>

      {/* Overview Statistics Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Total Raised */}
        <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 left-0 h-1 w-full bg-emerald-500" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase">Total Received</span>
            <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-500"><TrendingUp size={16} /></div>
          </div>
          <p className="mt-4 text-2xl font-extrabold text-emerald-500">${totalFunding.toLocaleString()}</p>
          <span className="text-[10px] text-gray-400 mt-1 block">Successfully cleared funds</span>
        </div>

        {/* Card 2: Pending Funding */}
        <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 left-0 h-1 w-full bg-amber-500" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase">Pending Clearance</span>
            <div className="rounded-lg bg-amber-500/10 p-2 text-amber-500"><Clock size={16} /></div>
          </div>
          <p className="mt-4 text-2xl font-extrabold text-amber-500">${pendingFunding.toLocaleString()}</p>
          <span className="text-[10px] text-gray-400 mt-1 block">Awaiting payment gateway approval</span>
        </div>

        {/* Card 3: Total Backers */}
        <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 left-0 h-1 w-full bg-blue-500" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase">Unique Backers</span>
            <div className="rounded-lg bg-blue-50/50 dark:bg-blue-900/10 p-2 text-blue-500"><Users size={16} /></div>
          </div>
          <p className="mt-4 text-2xl font-extrabold text-gray-900 dark:text-white">{uniqueBackers}</p>
          <span className="text-[10px] text-gray-400 mt-1 block">Total distinct contributors</span>
        </div>

        {/* Card 4: Total Campaigns */}
        <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 left-0 h-1 w-full bg-indigo-500" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase">Total Transactions</span>
            <div className="rounded-lg bg-indigo-50/50 dark:bg-indigo-900/10 p-2 text-indigo-500"><DollarSign size={16} /></div>
          </div>
          <p className="mt-4 text-2xl font-extrabold text-gray-900 dark:text-white">{contributions.length}</p>
          <span className="text-[10px] text-gray-400 mt-1 block">Including refunds and pending</span>
        </div>
      </div>

      {/* Filter Options Bar */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs">
        {/* Search Bar */}
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search backer name, email, or campaign..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-gray-200 dark:border-slate-800 bg-transparent py-2 pl-10 pr-4 text-sm outline-none focus:border-primary transition"
          />
        </div>

        {/* Filters Grid */}
        <div className="flex flex-wrap gap-3 w-full lg:w-auto">
          {/* Company Filter */}
          <div className="flex items-center gap-2 rounded-xl border border-gray-200 dark:border-slate-800 bg-transparent px-3 py-1.5 text-xs text-gray-600 dark:text-gray-300">
            <Building2 size={14} className="text-gray-400" />
            <select
              value={companyFilter}
              onChange={(e) => setCompanyFilter(e.target.value)}
              className="bg-transparent outline-none cursor-pointer font-medium"
            >
              <option value="all">All Companies</option>
              {uniqueCompanies.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2 rounded-xl border border-gray-200 dark:border-slate-800 bg-transparent px-3 py-1.5 text-xs text-gray-600 dark:text-gray-300">
            <Filter size={14} className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent outline-none cursor-pointer font-medium"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
        </div>
      </div>

      {/* Contributions Table Container */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                <th className="py-4 px-6">Backer Details</th>
                <th className="py-4 px-6">Company / Campaign</th>
                <th className="py-4 px-6">Amount / Reward</th>
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Method</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-800/80 text-sm">
              {filteredContributions.length > 0 ? (
                filteredContributions.map((contrib) => (
                  <tr key={contrib._id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition">
                    {/* Backer Column */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs uppercase">
                          {contrib.backerName.substring(0, 2)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 dark:text-white truncate">{contrib.backerName}</p>
                          <p className="text-[11px] text-gray-400 truncate">{contrib.backerEmail}</p>
                        </div>
                      </div>
                    </td>

                    {/* Campaign/Company Column */}
                    <td className="py-4 px-6 max-w-[220px]">
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-800 dark:text-gray-200 truncate">{contrib.campaignTitle}</p>
                        <p className="text-[11px] text-gray-400 truncate flex items-center gap-1 mt-0.5">
                          <Building2 size={10} /> {contrib.companyName}
                        </p>
                      </div>
                    </td>

                    {/* Amount & Tier */}
                    <td className="py-4 px-6">
                      <div>
                        <span className="font-bold text-gray-900 dark:text-white">${contrib.amount}</span>
                        {contrib.rewardTier && (
                          <span className="block text-[11px] text-primary font-medium mt-0.5 truncate max-w-[150px]">
                            {contrib.rewardTier}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Date */}
                    <td className="py-4 px-6 text-xs text-gray-500 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={12} className="text-gray-400" />
                        <span>{contrib.date}</span>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-6">
                      {contrib.status === "completed" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/20 px-2.5 py-1 text-xs font-semibold text-emerald-600">
                          <CheckCircle2 size={12} /> Success
                        </span>
                      )}
                      {contrib.status === "pending" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 dark:bg-amber-950/20 px-2.5 py-1 text-xs font-semibold text-amber-600 animate-pulse">
                          <Clock size={12} /> Pending
                        </span>
                      )}
                      {contrib.status === "refunded" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 dark:bg-rose-950/20 px-2.5 py-1 text-xs font-semibold text-rose-600">
                          <X size={12} /> Refunded
                        </span>
                      )}
                    </td>

                    {/* Payment Method */}
                    <td className="py-4 px-6 text-right text-xs font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {contrib.paymentMethod}
                    </td>
                  </tr>
                ))
              ) : (
                /* Empty Result */
                <tr>
                  <td colSpan={6} className="py-12 px-6 text-center text-gray-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Search size={32} className="text-gray-300 mb-1" />
                      <p className="text-sm font-semibold text-gray-500">No contributions found</p>
                      <p className="text-xs text-gray-400">Try adjusting your filters or search keywords</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}