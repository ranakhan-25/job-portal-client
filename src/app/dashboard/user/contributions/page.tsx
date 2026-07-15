"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  HeartHandshake, 
  Search, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  Loader2, 
  ExternalLink,
  SlidersHorizontal 
} from "lucide-react";

// Contribution Data Model
interface Contribution {
  id: string;
  campaignId: string;
  campaignTitle: string;
  category: string;
  image: string;
  amountContributed: number;
  dateContributed: string;
  paymentMethod: string;
  status: "Completed" | "Pending" | "Refunded";
}

export default function MyContributionsPage() {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Completed" | "Pending">("All");
  const [contributions, setContributions] = useState<Contribution[]>([]);

  // ==========================================
  // API কানেকশন: ইউজারের নিজস্ব কন্ট্রিবিউশন হিস্ট্রি ফেচ করা
  // ==========================================
  const fetchContributions = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("user-token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/contributions`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setContributions(data.contributions);
      } else {
        loadFallbackContributions();
      }
    } catch (err) {
      console.error("Error retrieving user Ledger records:", err);
      loadFallbackContributions(); // অফলাইন ডেমো ডাটা লোড
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContributions();
  }, [fetchContributions]);

  // ডেমো ডেব ডাটা (Fallback UI Simulation)
  const loadFallbackContributions = () => {
    setContributions([
      {
        id: "tx-5001",
        campaignId: "1",
        campaignTitle: "EcoDrive: Next-Gen Solar Powered Commuter Bike",
        category: "Technology",
        image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=200&auto=format&fit=crop&q=60",
        amountContributed: 150,
        dateContributed: "2026-06-12",
        paymentMethod: "Stripe Card",
        status: "Completed"
      },
      {
        id: "tx-5002",
        campaignId: "2",
        campaignTitle: "Emergency Relief: Floods Response Fund",
        category: "Disaster Relief",
        image: "https://images.unsplash.com/photo-1547683905-f686c993aae5?w=200&auto=format&fit=crop&q=60",
        amountContributed: 500,
        dateContributed: "2026-07-01",
        paymentMethod: "Wallet Credit",
        status: "Completed"
      },
      {
        id: "tx-5003",
        campaignId: "3",
        campaignTitle: "Rural Code Labs: Tech for Underprivileged Kids",
        category: "Education",
        image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=200&auto=format&fit=crop&q=60",
        amountContributed: 75,
        dateContributed: "2026-07-14",
        paymentMethod: "Wallet Credit",
        status: "Pending"
      }
    ]);
  };

  // স্ট্যাটস কার্ড ম্যাথমেটিক্যাল ক্যালকুলেশন
  const totalDonated = contributions
    .filter(c => c.status === "Completed")
    .reduce((sum, item) => sum + item.amountContributed, 0);

  const totalBackedProjects = new Set(contributions.map(c => c.campaignId)).size;

  // সার্চ এবং স্ট্যাটাস ফিল্টারিং লজিক
  const filteredContributions = contributions.filter(item => {
    const matchesSearch = item.campaignTitle.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-2">
        <Loader2 className="h-9 w-9 animate-spin text-emerald-600" />
        <p className="text-xs text-gray-500 font-medium font-sans">Decoding ledger transaction logs...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl space-y-6 p-4 font-sans">
      
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
          <HeartHandshake className="text-emerald-600" size={24} /> My Contributions
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          View and track all crowdfunding initiatives you have funded over time. Thank you for making an impact!
        </p>
      </div>

      {/* Top Interactive Metric Grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        {/* Metric 1 */}
        <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Total Invested</span>
            <div className="text-2xl font-black text-emerald-600">${totalDonated.toLocaleString()}</div>
          </div>
          <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/20 p-2 text-emerald-600">
            <TrendingUp size={20} />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Backed Campaigns</span>
            <div className="text-2xl font-black text-gray-900 dark:text-white">{totalBackedProjects} Projects</div>
          </div>
          <div className="rounded-xl bg-gray-50 dark:bg-slate-800 p-2 text-gray-500 dark:text-gray-400">
            <CheckCircle size={20} />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Recent Date</span>
            <div className="text-sm font-extrabold text-gray-700 dark:text-gray-300">
              {contributions.length > 0 ? contributions[0].dateContributed : "N/A"}
            </div>
          </div>
          <div className="rounded-xl bg-gray-50 dark:bg-slate-800 p-2 text-gray-500">
            <Calendar size={18} />
          </div>
        </div>
      </div>

      {/* Query Filters */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center justify-between pt-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by transaction ID or project title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 pl-10 pr-4 py-2 text-xs text-gray-900 dark:text-white focus:border-emerald-600 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-bold self-start md:self-auto">
          <span className="text-gray-400 flex items-center gap-1"><SlidersHorizontal size={12} /> Status:</span>
          {(["All", "Completed", "Pending"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`rounded-lg px-3 py-1 transition ${
                statusFilter === status
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Contribution Table Records */}
      {filteredContributions.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-gray-200 dark:border-slate-800 rounded-2xl">
          <p className="text-xs text-gray-400 font-medium">No contribution history matches your criteria.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100 dark:border-slate-800 bg-gray-50/55 dark:bg-slate-800/40 text-gray-400 font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Campaign Name</th>
                  <th className="px-6 py-4">Transaction ID</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Method</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Funded Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800 font-medium">
                {filteredContributions.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/40 dark:hover:bg-slate-850/20 transition">
                    
                    {/* Project & Campaign Banner Details */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={item.image} 
                          alt={item.campaignTitle} 
                          className="h-10 w-10 rounded-lg object-cover" 
                        />
                        <div className="space-y-0.5 max-w-xs">
                          <span className="text-[10px] uppercase font-black tracking-wider text-emerald-600 dark:text-emerald-400">
                            {item.category}
                          </span>
                          <span className="block font-bold text-gray-900 dark:text-white line-clamp-1">
                            {item.campaignTitle}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 font-mono text-gray-400 select-all">
                      {item.id}
                    </td>

                    <td className="px-6 py-4 text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock size={12} /> {item.dateContributed}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-gray-500 font-bold">
                      {item.paymentMethod}
                    </td>

                    {/* Transaction Status Pill Badge */}
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                          item.status === "Completed"
                            ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400"
                            : item.status === "Pending"
                            ? "bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400"
                            : "bg-rose-50 text-rose-600 dark:bg-rose-950/20"
                        }`}>
                          {item.status}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-right font-black text-sm text-gray-900 dark:text-white">
                      ${item.amountContributed.toLocaleString()}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}