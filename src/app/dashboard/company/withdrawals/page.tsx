"use client";

import { useState, useEffect } from "react";
import {
  WalletCards,
  ArrowDownToLine,
  CheckCircle2,
  Clock,
  XCircle,
  Building2,
  Calendar,
  CreditCard,
  Building,
  RefreshCw,
  Loader2,
  AlertCircle,
  X,
  Landmark
} from "lucide-react";

// ==========================================
// অফলাইন ডামি ডাটা কনফিগ
// ==========================================
const IS_OFFLINE = true;

interface WithdrawalRecord {
  _id: string;
  companyName: string;
  amount: number;
  method: string; // Bank, Mobile Banking, PayPal etc.
  accountDetails: string;
  date: string;
  status: "completed" | "pending" | "rejected";
  txId?: string; // Transaction ID if completed
}

const DUMMY_WITHDRAWALS: WithdrawalRecord[] = [
  {
    _id: "wd-1001",
    companyName: "NexTech Ventures Ltd.",
    amount: 5000,
    method: "Bank Transfer",
    accountDetails: "DBBL - ****4521",
    date: "2026-07-10",
    status: "completed",
    txId: "TRX987654321AB",
  },
  {
    _id: "wd-1002",
    companyName: "GreenSprout Bio-Labs",
    amount: 1200,
    method: "Mobile Banking (bKash)",
    accountDetails: "01712***678",
    date: "2026-07-14",
    status: "pending",
  },
  {
    _id: "wd-1003",
    companyName: "NexTech Ventures Ltd.",
    amount: 800,
    method: "PayPal",
    accountDetails: "nextech@example.com",
    date: "2026-07-05",
    status: "rejected",
  },
];

// ব্যালেন্স ডাটা (সাধারণত এপিআই থেকে আসবে)
const BALANCE_DATA = {
  availableBalance: 12450.00,
  pendingClearance: 3200.00,
  totalWithdrawn: 18500.00,
};

export default function WithdrawalsPage() {
  const [withdrawals, setWithdrawals] = useState<WithdrawalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // মোডাল ও ফর্ম স্টেট
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [withdrawForm, setWithdrawForm] = useState({
    companyName: "NexTech Ventures Ltd.", // ডামি ডিফল্ট
    amount: "",
    method: "Bank Transfer",
    accountDetails: "",
  });

  useEffect(() => {
    // ডাটা ফেচিং লজিক
    const fetchWithdrawals = async () => {
      setLoading(true);
      if (IS_OFFLINE) {
        setTimeout(() => {
          setWithdrawals(DUMMY_WITHDRAWALS);
          setLoading(false);
        }, 800);
        return;
      }
      
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/companies/withdrawals`);
        const data = await res.json();
        if (res.ok && data.success) {
          setWithdrawals(data.data);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch withdrawal history.");
      } finally {
        setLoading(false);
      }
    };
    fetchWithdrawals();
  }, []);

  const handleWithdrawRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (Number(withdrawForm.amount) > BALANCE_DATA.availableBalance) {
      alert("Withdrawal amount cannot exceed available balance.");
      return;
    }

    setIsSubmitting(true);
    
    // ডামি সাবমিশন
    setTimeout(() => {
      const newWithdrawal: WithdrawalRecord = {
        _id: `wd-${Math.floor(Math.random() * 10000)}`,
        companyName: withdrawForm.companyName,
        amount: Number(withdrawForm.amount),
        method: withdrawForm.method,
        accountDetails: withdrawForm.accountDetails,
        date: new Date().toISOString().split("T")[0],
        status: "pending",
      };

      setWithdrawals([newWithdrawal, ...withdrawals]);
      
      // লোকাল স্টেট আপডেট করে ব্যালেন্স কমানো (অফলাইন প্রিভিউ এর জন্য)
      BALANCE_DATA.availableBalance -= Number(withdrawForm.amount);
      BALANCE_DATA.pendingClearance += Number(withdrawForm.amount);

      setIsSubmitting(false);
      setIsRequestModalOpen(false);
      setWithdrawForm({ ...withdrawForm, amount: "", accountDetails: "" });
    }, 1500);
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-sm text-gray-500 font-medium">Loading wallet data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <div className="flex flex-col items-center justify-center rounded-3xl border border-red-100 bg-red-50/50 p-8 shadow-sm">
          <AlertCircle className="mb-5 text-red-500 animate-bounce" size={44} />
          <h2 className="text-2xl font-bold">Connection Failed</h2>
          <p className="mt-3 text-sm text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-8 animate-fadeIn">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">Funds & Withdrawals</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Manage your raised funds and request payouts to your bank accounts.</p>
        </div>
        <button
          onClick={() => setIsRequestModalOpen(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white transition hover:opacity-90 shadow-md shadow-primary/20"
        >
          <ArrowDownToLine size={16} /> Request Withdrawal
        </button>
      </div>

      {/* Wallet Balance Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-gradient-to-br from-emerald-500 to-emerald-700 p-6 text-white shadow-md relative overflow-hidden">
          <WalletCards className="absolute -right-4 -bottom-4 h-32 w-32 opacity-10" />
          <h3 className="text-sm font-medium text-emerald-100 uppercase tracking-wide">Available to Withdraw</h3>
          <p className="mt-2 text-3xl font-extrabold">${BALANCE_DATA.availableBalance.toLocaleString()}</p>
          <p className="mt-2 text-xs text-emerald-200">Cleared funds ready for payout</p>
        </div>

        <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="rounded-full bg-amber-50 dark:bg-amber-900/20 p-2 text-amber-500"><Clock size={16} /></div>
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300">Pending Clearance</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">${BALANCE_DATA.pendingClearance.toLocaleString()}</p>
          <p className="mt-1 text-xs text-gray-400">Funds processing or pending review</p>
        </div>

        <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="rounded-full bg-blue-50 dark:bg-blue-900/20 p-2 text-blue-500"><CheckCircle2 size={16} /></div>
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300">Total Withdrawn</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">${BALANCE_DATA.totalWithdrawn.toLocaleString()}</p>
          <p className="mt-1 text-xs text-gray-400">Lifetime successfully transferred</p>
        </div>
      </div>

      {/* Transaction History Table */}
      <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-base font-bold text-gray-900 dark:text-white">Withdrawal History</h3>
          <span className="text-xs font-semibold text-gray-500 bg-gray-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">
            {withdrawals.length} Records
          </span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-slate-900/50 text-[11px] font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100 dark:border-slate-800">
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6">Company</th>
                <th className="py-4 px-6">Payout Details</th>
                <th className="py-4 px-6">Amount</th>
                <th className="py-4 px-6 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-800/80 text-sm">
              {withdrawals.map((record) => (
                <tr key={record._id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition">
                  {/* Date */}
                  <td className="py-4 px-6 text-xs text-gray-500 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={12} className="text-gray-400" />
                      <span>{record.date}</span>
                    </div>
                  </td>

                  {/* Company */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <Building2 size={14} className="text-primary" />
                      <span className="font-semibold text-gray-800 dark:text-gray-200">{record.companyName}</span>
                    </div>
                  </td>

                  {/* Payment Method Details */}
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white flex items-center gap-1.5">
                        {record.method.includes("Bank") ? <Landmark size={12} className="text-gray-400"/> : <CreditCard size={12} className="text-gray-400"/>}
                        {record.method}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{record.accountDetails}</p>
                    </div>
                  </td>

                  {/* Amount */}
                  <td className="py-4 px-6">
                    <span className="font-bold text-gray-900 dark:text-white">${record.amount.toLocaleString()}</span>
                  </td>

                  {/* Status */}
                  <td className="py-4 px-6 text-right">
                    <div className="flex flex-col items-end gap-1">
                      {record.status === "completed" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/20 px-2.5 py-1 text-[11px] font-semibold text-emerald-600">
                          <CheckCircle2 size={12} /> Completed
                        </span>
                      )}
                      {record.status === "pending" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 dark:bg-amber-950/20 px-2.5 py-1 text-[11px] font-semibold text-amber-600 animate-pulse">
                          <Clock size={12} /> Processing
                        </span>
                      )}
                      {record.status === "rejected" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 dark:bg-rose-950/20 px-2.5 py-1 text-[11px] font-semibold text-rose-600">
                          <XCircle size={12} /> Rejected
                        </span>
                      )}
                      {record.txId && <span className="text-[10px] text-gray-400">TX: {record.txId}</span>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ==========================================
          REQUEST WITHDRAWAL MODAL
          ========================================== */}
      {isRequestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="relative w-full max-w-md rounded-3xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 md:p-8 shadow-2xl animate-scaleIn">
            
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-slate-800">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Request Payout</h3>
              <button
                onClick={() => setIsRequestModalOpen(false)}
                className="rounded-full p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-900 transition"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleWithdrawRequest} className="mt-6 space-y-5">
              
              {/* Info Alert */}
              <div className="rounded-xl bg-blue-50 dark:bg-blue-900/10 p-3 text-xs text-blue-700 dark:text-blue-300 flex items-start gap-2">
                <AlertCircle size={14} className="mt-0.5 shrink-0" />
                <p>Withdrawals take 3-5 business days to process. Maximum available to withdraw is <strong className="font-bold">${BALANCE_DATA.availableBalance}</strong>.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1.5">Select Company</label>
                <div className="relative">
                  <Building className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <select
                    required
                    value={withdrawForm.companyName}
                    onChange={(e) => setWithdrawForm({ ...withdrawForm, companyName: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 dark:border-slate-800 bg-transparent py-2.5 pl-9 pr-4 text-sm outline-none focus:border-primary transition appearance-none cursor-pointer"
                  >
                    <option value="NexTech Ventures Ltd.">NexTech Ventures Ltd.</option>
                    <option value="GreenSprout Bio-Labs">GreenSprout Bio-Labs</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1.5">Withdrawal Amount ($)</label>
                <input
                  type="number"
                  required
                  min="50"
                  max={BALANCE_DATA.availableBalance}
                  value={withdrawForm.amount}
                  onChange={(e) => setWithdrawForm({ ...withdrawForm, amount: e.target.value })}
                  placeholder="e.g. 1000"
                  className="w-full rounded-xl border border-gray-200 dark:border-slate-800 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-primary transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1.5">Payout Method</label>
                <select
                  required
                  value={withdrawForm.method}
                  onChange={(e) => setWithdrawForm({ ...withdrawForm, method: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 dark:border-slate-800 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-primary transition appearance-none cursor-pointer"
                >
                  <option value="Bank Transfer">Bank Transfer (SWIFT/Local)</option>
                  <option value="PayPal">PayPal</option>
                  <option value="Mobile Banking (bKash)">Mobile Banking (bKash)</option>
                  <option value="Payoneer">Payoneer</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1.5">Account Details</label>
                <textarea
                  rows={2}
                  required
                  value={withdrawForm.accountDetails}
                  onChange={(e) => setWithdrawForm({ ...withdrawForm, accountDetails: e.target.value })}
                  placeholder="Enter Bank Name, Account No, Routing Number OR Email for PayPal."
                  className="w-full rounded-xl border border-gray-200 dark:border-slate-800 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-primary transition resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsRequestModalOpen(false)}
                  className="rounded-xl px-5 py-3 text-xs font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-900 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-xs font-bold text-white hover:opacity-90 transition disabled:opacity-50"
                >
                  {isSubmitting ? <><Loader2 size={14} className="animate-spin" /> Processing...</> : "Submit Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}