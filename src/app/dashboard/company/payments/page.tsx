"use client";

import { useState, useEffect } from "react";
import {
  History,
  ArrowUpRight,
  ArrowDownLeft,
  Search,
  Filter,
  Download,
  CheckCircle2,
  AlertCircle,
  Clock,
  CreditCard,
  Loader2,
  Calendar,
} from "lucide-react";

// অফলাইন ডামি পেমেন্ট ডেটা
const DUMMY_PAYMENTS = [
  { _id: "p-001", type: "income", description: "Contribution from Campaign: EcoPulse", amount: 500, date: "2026-07-15", status: "completed" },
  { _id: "p-002", type: "withdrawal", description: "Withdrawal to Bank Account", amount: 2000, date: "2026-07-14", status: "completed" },
  { _id: "p-003", type: "income", description: "Contribution from Campaign: BioSprout", amount: 1200, date: "2026-07-12", status: "pending" },
  { _id: "p-004", type: "income", description: "Contribution from Campaign: EcoPulse", amount: 300, date: "2026-07-10", status: "completed" },
  { _id: "p-005", type: "withdrawal", description: "Withdrawal to bKash", amount: 500, date: "2026-07-08", status: "rejected" },
];

export default function PaymentHistoryPage() {
  const [payments, setPayments] = useState(DUMMY_PAYMENTS);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // এখানে আপনার API কল হবে
    setTimeout(() => setLoading(false), 800);
  }, []);

  const filteredPayments = payments.filter((p) =>
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-sm text-gray-500 font-medium">Loading history...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Payment History</h1>
          <p className="text-xs text-gray-500 mt-1">Full transparency of all your income and expenses.</p>
        </div>
        <button className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition shadow-xs">
          <Download size={14} /> Export Report
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-6">
          <p className="text-xs font-bold text-emerald-600 uppercase">Total Income</p>
          <p className="mt-1 text-2xl font-extrabold text-emerald-700">$2,000.00</p>
        </div>
        <div className="rounded-2xl border border-rose-100 bg-rose-50/50 p-6">
          <p className="text-xs font-bold text-rose-600 uppercase">Total Withdrawals</p>
          <p className="mt-1 text-2xl font-extrabold text-rose-700">$2,500.00</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex items-center gap-4 rounded-2xl border border-gray-200 p-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl bg-transparent py-2 pl-10 pr-4 text-sm outline-none"
          />
        </div>
      </div>

      {/* History List */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-[11px] font-bold uppercase text-gray-500">
              <th className="py-4 px-6">Transaction</th>
              <th className="py-4 px-6">Date</th>
              <th className="py-4 px-6">Amount</th>
              <th className="py-4 px-6 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {filteredPayments.map((item) => (
              <tr key={item._id} className="hover:bg-gray-50/50 transition">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${item.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                      {item.type === 'income' ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{item.description}</p>
                      <p className="text-[10px] text-gray-400 uppercase">{item.type}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6 text-gray-500 text-xs">
                  <div className="flex items-center gap-1.5"><Calendar size={12} /> {item.date}</div>
                </td>
                <td className="py-4 px-6 font-bold">
                  {item.type === 'income' ? '+' : '-'} ${item.amount}
                </td>
                <td className="py-4 px-6 text-right">
                   {item.status === 'completed' && <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-1 rounded-full font-bold">SUCCESS</span>}
                   {item.status === 'pending' && <span className="text-[10px] bg-amber-50 text-amber-600 px-2 py-1 rounded-full font-bold">PENDING</span>}
                   {item.status === 'rejected' && <span className="text-[10px] bg-rose-50 text-rose-600 px-2 py-1 rounded-full font-bold">FAILED</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}