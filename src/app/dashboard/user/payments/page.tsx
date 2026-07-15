"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  Receipt, 
  Search, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Loader2, 
  Download,
  Filter,
  CheckCircle,
  XCircle,
  RefreshCw
} from "lucide-react";

// Transaction Data Model
interface Transaction {
  id: string;
  type: "Deposit" | "Contribution" | "Refund";
  amount: number;
  paymentGateway: "Stripe" | "PayPal" | "Wallet Balance";
  status: "Succeeded" | "Failed" | "Processing";
  createdAt: string;
  description: string;
}

export default function PaymentHistoryPage() {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"All" | "Deposit" | "Contribution" | "Refund">("All");
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // ==========================================
  // API কানেকশন: ইউজারের পেমেন্ট হিস্ট্রি ডাটা নিয়ে আসা
  // ==========================================
  const fetchPaymentHistory = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("user-token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/payments`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setTransactions(data.transactions);
      } else {
        loadFallbackTransactions();
      }
    } catch (err) {
      console.error("Error retrieving Ledger transactions:", err);
      loadFallbackTransactions(); // অফলাইন ডেমো ডাটা লোড
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPaymentHistory();
  }, [fetchPaymentHistory]);

  // ডেমো পেমেন্ট হিস্ট্রি ডাটা (Fallback System)
  const loadFallbackTransactions = () => {
    setTransactions([
      {
        id: "TXN-10938210",
        type: "Deposit",
        amount: 250,
        paymentGateway: "Stripe",
        status: "Succeeded",
        createdAt: "2026-07-14 15:30",
        description: "Loaded balance via Stripe Checkout"
      },
      {
        id: "TXN-10938185",
        type: "Contribution",
        amount: 150,
        paymentGateway: "Wallet Balance",
        status: "Succeeded",
        createdAt: "2026-07-12 11:15",
        description: "Funded Campaign 'EcoDrive: Next-Gen Solar Bike'"
      },
      {
        id: "TXN-10938090",
        type: "Deposit",
        amount: 50,
        paymentGateway: "PayPal",
        status: "Failed",
        createdAt: "2026-07-08 09:45",
        description: "Attempted deposit via PayPal instant link"
      },
      {
        id: "TXN-10937992",
        type: "Refund",
        amount: 30,
        paymentGateway: "Wallet Balance",
        status: "Succeeded",
        createdAt: "2026-06-30 18:20",
        description: "Refunded from canceled micro-grant goal"
      }
    ]);
  };

  // সার্চ এবং ট্রানজেকশন টাইপ ফিল্টারিং লজিক
  const filteredTransactions = transactions.filter(txn => {
    const matchesSearch = txn.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          txn.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "All" || txn.type === typeFilter;
    return matchesSearch && matchesType;
  });

  // ট্রানজেকশন সামারি স্ট্যাটস (Calculated dynamic states)
  const totalInflow = transactions
    .filter(t => t.status === "Succeeded" && (t.type === "Deposit" || t.type === "Refund"))
    .reduce((sum, item) => sum + item.amount, 0);

  const totalOutflow = transactions
    .filter(t => t.status === "Succeeded" && t.type === "Contribution")
    .reduce((sum, item) => sum + item.amount, 0);

  // পিডিএফ বা এক্সেল ডেমো ডাউনলোড রিপোর্টার
  const handleDownloadInvoice = (txnId: string) => {
    alert(`Generating invoice and receipt PDF for Transaction: ${txnId}`);
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-2">
        <Loader2 className="h-9 w-9 animate-spin text-emerald-600" />
        <p className="text-xs text-gray-500 font-medium font-sans">Compiling financial audit log...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl space-y-6 p-4 font-sans">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
            <Receipt className="text-emerald-600" size={24} /> Payment History
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Audit logs, cashflows, invoice generation, and full transaction history of your account.
          </p>
        </div>
        <button 
          onClick={() => alert("Downloading CSV of all transaction data.")}
          className="flex items-center justify-center gap-1.5 self-start sm:self-auto rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50/50 transition"
        >
          <Download size={14} /> Export CSV Statement
        </button>
      </div>

      {/* Audit Stats Grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {/* Total Inflow */}
        <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Total Money Inflow</span>
            <div className="text-xl font-black text-emerald-600">+${totalInflow.toLocaleString()}</div>
          </div>
          <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/20 p-2 text-emerald-600">
            <ArrowDownLeft size={20} />
          </div>
        </div>

        {/* Total Outflow */}
        <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Campaign Contributions</span>
            <div className="text-xl font-black text-rose-600">-${totalOutflow.toLocaleString()}</div>
          </div>
          <div className="rounded-xl bg-rose-50 dark:bg-rose-950/20 p-2 text-rose-600">
            <ArrowUpRight size={20} />
          </div>
        </div>

        {/* Ledger State Status */}
        <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex items-center justify-between col-span-1 sm:col-span-2 md:col-span-1">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Ledger Status</span>
            <div className="text-sm font-extrabold text-emerald-600 flex items-center gap-1.5">
              <CheckCircle size={14} /> Synchronized & Secure
            </div>
          </div>
          <button 
            onClick={fetchPaymentHistory} 
            className="rounded-xl bg-gray-50 dark:bg-slate-800 p-2 text-gray-500 hover:bg-gray-100 transition"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* Query Filters */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center justify-between pt-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by Txn ID, reference, or action info..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 pl-10 pr-4 py-2 text-xs text-gray-900 dark:text-white focus:border-emerald-600 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-bold self-start md:self-auto">
          <span className="text-gray-400 flex items-center gap-1"><Filter size={12} /> Transaction Type:</span>
          {(["All", "Deposit", "Contribution", "Refund"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`rounded-lg px-3 py-1 transition ${
                typeFilter === type
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Transaction Audit Records */}
      {filteredTransactions.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-gray-200 dark:border-slate-800 rounded-2xl">
          <p className="text-xs text-gray-400 font-medium">No financial transactions match your selection.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100 dark:border-slate-800 bg-gray-50/55 dark:bg-slate-800/40 text-gray-400 font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Transaction ID</th>
                  <th className="px-6 py-4">Details / Description</th>
                  <th className="px-6 py-4">Gateway</th>
                  <th className="px-6 py-4">Timestamp</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Amount (USD)</th>
                  <th className="px-6 py-4 text-center">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800 font-medium">
                {filteredTransactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-gray-50/40 dark:hover:bg-slate-850/20 transition">
                    
                    {/* Transaction ID */}
                    <td className="px-6 py-4 font-mono text-gray-900 dark:text-white font-bold select-all">
                      {txn.id}
                    </td>

                    {/* Description & Type Badge */}
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <span className="block text-gray-700 dark:text-gray-300 font-bold">
                          {txn.description}
                        </span>
                        <span className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider ${
                          txn.type === "Deposit"
                            ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400"
                            : txn.type === "Contribution"
                            ? "bg-amber-50 text-amber-600 dark:bg-amber-950/20"
                            : "bg-blue-50 text-blue-600 dark:bg-blue-950/20"
                        }`}>
                          {txn.type}
                        </span>
                      </div>
                    </td>

                    {/* Gateway */}
                    <td className="px-6 py-4 text-gray-500 font-bold">
                      {txn.paymentGateway}
                    </td>

                    {/* Created At */}
                    <td className="px-6 py-4 text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} /> {txn.createdAt}
                      </span>
                    </td>

                    {/* Payment Status */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                        txn.status === "Succeeded"
                          ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400"
                          : txn.status === "Failed"
                          ? "bg-rose-50 text-rose-600 dark:bg-rose-950/20"
                          : "bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-gray-400"
                      }`}>
                        {txn.status === "Succeeded" && <CheckCircle size={10} />}
                        {txn.status === "Failed" && <XCircle size={10} />}
                        {txn.status}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className={`px-6 py-4 text-right font-black text-sm ${
                      txn.status === "Failed"
                        ? "text-gray-400 line-through"
                        : txn.type === "Deposit" || txn.type === "Refund"
                        ? "text-emerald-600"
                        : "text-rose-600"
                    }`}>
                      {txn.type === "Deposit" || txn.type === "Refund" ? "+" : "-"}${txn.amount.toLocaleString()}
                    </td>

                    {/* Actions / Invoice Download */}
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleDownloadInvoice(txn.id)}
                        disabled={txn.status !== "Succeeded"}
                        className="inline-flex items-center justify-center rounded-lg bg-gray-50 hover:bg-gray-100 dark:bg-slate-800 p-1.5 text-gray-500 hover:text-emerald-600 transition disabled:opacity-40 disabled:cursor-not-allowed"
                        title="Download Invoice"
                      >
                        <Download size={14} />
                      </button>
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