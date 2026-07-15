"use client";

import { useState, useEffect, useCallback } from "react";
import {
  DollarSign,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  RefreshCw,
  MoreVertical,
  Building2,
  Clock,
  Eye,
  CreditCard,
  Banknote
} from "lucide-react";

// Withdrawal Request Interface
interface WithdrawalRequest {
  _id: string; // Dynamic DB Request ID
  companyName: string;
  requesterEmail: string;
  amount: number;
  paymentMethod: "Bank Transfer" | "bKash" | "Nagad" | "PayPal";
  accountDetails: {
    accountNumber: string;
    bankName?: string;
    branchName?: string;
    routingNumber?: string;
  };
  status: "Pending" | "Approved" | "Rejected";
  createdAt: string; // ISO Date String
}

export default function WithdrawalRequestsPage() {
  const [requests, setRequests] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [methodFilter, setMethodFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // Status Notification states
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Control Dropdown & Details Modal State
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<WithdrawalRequest | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // ==========================================
  // API কানেকশন: সব উইথড্রয়াল রিকোয়েস্ট লিস্ট নিয়ে আসা
  // ==========================================
  const fetchWithdrawalRequests = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    else setRefreshing(true);
    clearAlerts();

    try {
      const token = localStorage.getItem("super-admin-token");
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/super-admin/withdrawals`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setRequests(data.requests);
      } else {
        loadFallbackRequests();
      }
    } catch (err) {
      console.error("Error fetching payouts:", err);
      loadFallbackRequests(); // অফলাইন ডেমো ডাটা
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchWithdrawalRequests();
  }, [fetchWithdrawalRequests]);

  const clearAlerts = () => {
    setSuccessMessage(null);
    setErrorMessage(null);
  };

  // ডাইনামিক কারেন্ট ডেট সহ ডেমো ডাটা (Fallback)
  const loadFallbackRequests = () => {
    const today = new Date();
    setRequests([
      {
        _id: "w_101",
        companyName: "Acme Tech Bangladesh",
        requesterEmail: "finance@acmetech.com",
        amount: 1250,
        paymentMethod: "Bank Transfer",
        accountDetails: {
          accountNumber: "123-456-7890",
          bankName: "Dutch-Bangla Bank PLC",
          branchName: "Kawran Bazar Branch",
          routingNumber: "090261432"
        },
        status: "Pending",
        createdAt: new Date(today.getTime() - 2 * 60 * 60 * 1000).toISOString() // ২ ঘণ্টা আগে
      },
      {
        _id: "w_102",
        companyName: "Creative Studio LTD",
        requesterEmail: "billing@creative.io",
        amount: 450,
        paymentMethod: "bKash",
        accountDetails: {
          accountNumber: "01712345678"
        },
        status: "Approved",
        createdAt: new Date(today.getTime() - 24 * 60 * 60 * 1000).toISOString() // ১ দিন আগে
      },
      {
        _id: "w_103",
        companyName: "Dhaka Retailers Inc.",
        requesterEmail: "owner@dhakaretail.org",
        amount: 890,
        paymentMethod: "Nagad",
        accountDetails: {
          accountNumber: "01987654321"
        },
        status: "Rejected",
        createdAt: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString() // ৩ দিন আগে
      }
    ]);
  };

  // ==========================================
  // API কানেকশন: উইথড্রয়াল রিকোয়েস্ট Approve বা Reject করা
  // ==========================================
  const handleUpdateStatus = async (requestId: string, targetStatus: "Approved" | "Rejected", companyName: string) => {
    const actionText = targetStatus === "Approved" ? "Approve" : "Reject";
    if (!confirm(`Are you sure you want to ${actionText.toLowerCase()} this payout request for ${companyName}?`)) return;

    setActiveMenuId(null);
    setProcessingId(requestId);
    clearAlerts();

    try {
      const token = localStorage.getItem("super-admin-token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/super-admin/withdrawals/${requestId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status: targetStatus })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMessage(`Request successfully ${targetStatus.toLowerCase()} for ${companyName}.`);
        setRequests((prev) => prev.map((r) => r._id === requestId ? { ...r, status: targetStatus } : r));
      } else {
        setErrorMessage(data.message || "Failed to process request.");
      }
    } catch (err) {
      // অফলাইন মোড হ্যান্ডলিং (Fallback UI)
      setRequests((prev) => prev.map((r) => r._id === requestId ? { ...r, status: targetStatus } : r));
      setSuccessMessage(`Fallback UI: Request forced to ${targetStatus}`);
    } finally {
      setProcessingId(null);
    }
  };

  // Live Engine Search and Filter Logic
  const filteredRequests = requests.filter((req) => {
    const matchesSearch =
      req.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.requesterEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req._id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesMethod = methodFilter === "All" || req.paymentMethod === methodFilter;
    const matchesStatus = statusFilter === "All" || req.status === statusFilter;

    return matchesSearch && matchesMethod && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-sm text-gray-500 font-medium">Loading platform financial tickets...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl space-y-6 p-1">
      {/* Top Section Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
            <DollarSign className="text-emerald-600" size={24} /> Withdrawal & Payout Logs
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Review and clear cash-out requests submitted by subscription merchants and client owners.
          </p>
        </div>
        <button
          onClick={() => fetchWithdrawalRequests(true)}
          disabled={refreshing}
          className="flex self-start items-center gap-2 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2 text-xs font-bold text-gray-700 dark:text-gray-300 transition hover:bg-gray-50 dark:hover:bg-slate-800"
        >
          <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
          {refreshing ? "Updating Ledger..." : "Sync Matrix"}
        </button>
      </div>

      {/* Real-time Alerts */}
      {successMessage && (
        <div className="rounded-xl bg-green-50 dark:bg-green-950/20 p-4 border border-green-100 dark:border-green-900/30 text-green-700 dark:text-green-400 text-sm flex items-start gap-3">
          <CheckCircle className="h-5 w-5 shrink-0 text-green-600 dark:text-green-400" />
          <span>{successMessage}</span>
        </div>
      )}
      {errorMessage && (
        <div className="rounded-xl bg-red-50 dark:bg-red-950/20 p-4 border border-red-100 dark:border-red-900/30 text-red-700 dark:text-red-400 text-sm flex items-start gap-3">
          <AlertCircle className="h-5 w-5 shrink-0 text-red-600 dark:text-red-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Filter Matrix Configuration */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs">
        {/* Search Input Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by request ID, company title, or user mail..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 pl-10 pr-4 py-2 text-xs text-gray-900 dark:text-white focus:border-primary focus:outline-hidden focus:ring-1 focus:ring-primary transition"
          />
        </div>

        {/* Filter Dropdowns options */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <Filter size={14} className="text-gray-400" />
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-gray-700 dark:text-gray-300 focus:outline-hidden"
            >
              <option value="All">All Gateways</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="bKash">bKash</option>
              <option value="Nagad">Nagad</option>
              <option value="PayPal">PayPal</option>
            </select>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-gray-700 dark:text-gray-300 focus:outline-hidden"
          >
            <option value="All">All Requests</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Master Data Grid Table */}
      <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs text-gray-500 dark:text-gray-400">
            <thead className="bg-gray-50 dark:bg-slate-800/50 font-bold uppercase text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-slate-800">
              <tr>
                <th scope="col" className="px-6 py-4">Request ID</th>
                <th scope="col" className="px-6 py-4">SaaS Brand Name</th>
                <th scope="col" className="px-6 py-4">Requested Payout</th>
                <th scope="col" className="px-6 py-4">Gateway Route</th>
                <th scope="col" className="px-6 py-4">Submission Date</th>
                <th scope="col" className="px-6 py-4">Status</th>
                <th scope="col" className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 font-medium text-gray-400">
                    No money withdrawal tickets found.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => (
                  <tr key={req._id} className={`hover:bg-gray-50/50 dark:hover:bg-slate-800/20 transition-colors ${processingId === req._id ? "opacity-40 pointer-events-none" : ""}`}>
                    
                    {/* Request Reference Code */}
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-gray-900 dark:text-white font-bold">
                      #{req._id}
                    </td>

                    {/* Company Identity */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1">
                          <Building2 size={13} className="text-gray-400" /> {req.companyName}
                        </span>
                        <span className="text-[11px] text-gray-400 mt-0.5">{req.requesterEmail}</span>
                      </div>
                    </td>

                    {/* Monetary Volume */}
                    <td className="px-6 py-4 whitespace-nowrap font-bold text-sm text-gray-900 dark:text-white">
                      ${req.amount.toLocaleString()}
                    </td>

                    {/* Gateway Channel */}
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-700 dark:text-gray-300">
                      <span className="inline-flex items-center gap-1">
                        {req.paymentMethod === "Bank Transfer" ? <Banknote size={14} className="text-blue-500" /> : <CreditCard size={14} className="text-pink-500" />}
                        {req.paymentMethod}
                      </span>
                    </td>

                    {/* Dynamic Date Output */}
                    <td className="px-6 py-4 whitespace-nowrap text-gray-400 font-medium">
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        {new Date(req.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                    </td>

                    {/* Badge Status Monitor */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-semibold ${
                        req.status === "Approved"
                          ? "bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400"
                          : req.status === "Rejected"
                          ? "bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400"
                          : "bg-amber-50 dark:bg-amber-950/20 text-yellow-700 dark:text-amber-400"
                      }`}>
                        {req.status}
                      </span>
                    </td>

                    {/* Inline Controller Action Buttons */}
                    <td className="px-6 py-4 whitespace-nowrap text-center relative">
                      <button
                        onClick={() => setActiveMenuId(activeMenuId === req._id ? null : req._id)}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-white p-1 rounded-lg transition"
                      >
                        <MoreVertical size={16} />
                      </button>

                      {activeMenuId === req._id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setActiveMenuId(null)} />
                          
                          <div className="absolute right-6 mt-1 w-44 rounded-xl bg-white dark:bg-slate-950 shadow-lg border border-gray-200 dark:border-slate-800 py-1.5 z-20 text-left">
                            {/* Open Details Modal */}
                            <button
                              onClick={() => { setSelectedRequest(req); setActiveMenuId(null); }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-900 transition font-medium"
                            >
                              <Eye size={14} className="text-blue-500" /> View Bank Details
                            </button>
                            
                            {/* Conditional Actions for Pending cases */}
                            {req.status === "Pending" && (
                              <>
                                <button
                                  onClick={() => handleUpdateStatus(req._id, "Approved", req.companyName)}
                                  className="w-full flex items-center gap-2 px-3 py-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-950/20 transition font-medium border-t border-gray-100 dark:border-slate-900"
                                >
                                  <CheckCircle size={14} /> Approve Payout
                                </button>
                                <button
                                  onClick={() => handleUpdateStatus(req._id, "Rejected", req.companyName)}
                                  className="w-full flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition font-medium"
                                >
                                  <XCircle size={14} /> Deny Request
                                </button>
                              </>
                            )}
                          </div>
                        </>
                      )}
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ==========================================
          ব্যাংক অ্যাকাউন্ট/বিকাশ অ্যাকাউন্ট ডিটেইলস পপআপ মডাল
          ========================================== */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Banknote size={18} className="text-primary" /> Payout Destination Credentials
            </h3>
            <p className="text-xs text-gray-400 mt-1">Verify payment route before authorizing manual bank/wallet transfer.</p>

            <div className="mt-4 space-y-3 rounded-xl bg-gray-50 dark:bg-slate-900/50 p-4 text-xs">
              <div className="flex justify-between border-b border-gray-100 dark:border-slate-800 pb-2">
                <span className="text-gray-400 font-medium">Gateway Mode:</span>
                <span className="font-bold text-gray-900 dark:text-white">{selectedRequest.paymentMethod}</span>
              </div>
              
              <div className="flex justify-between border-b border-gray-100 dark:border-slate-800 pb-2">
                <span className="text-gray-400 font-medium">Account Number:</span>
                <span className="font-mono font-bold text-gray-900 dark:text-white">{selectedRequest.accountDetails.accountNumber}</span>
              </div>

              {/* ব্যাংক ট্রান্সফারের ক্ষেত্রে অতিরিক্ত ইনফো শো করার ডাইনামিক ফিল্ড */}
              {selectedRequest.paymentMethod === "Bank Transfer" && (
                <>
                  <div className="flex justify-between border-b border-gray-100 dark:border-slate-800 pb-2">
                    <span className="text-gray-400 font-medium">Bank Corporation:</span>
                    <span className="font-bold text-gray-900 dark:text-white text-right">{selectedRequest.accountDetails.bankName}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 dark:border-slate-800 pb-2">
                    <span className="text-gray-400 font-medium">Branch Location:</span>
                    <span className="font-bold text-gray-900 dark:text-white">{selectedRequest.accountDetails.branchName}</span>
                  </div>
                  <div className="flex justify-between pb-1">
                    <span className="text-gray-400 font-medium">Routing Code:</span>
                    <span className="font-mono font-bold text-gray-900 dark:text-white">{selectedRequest.accountDetails.routingNumber}</span>
                  </div>
                </>
              )}
            </div>

            {/* Modal Action Footer */}
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedRequest(null)}
                className="rounded-xl border border-gray-200 dark:border-slate-800 px-4 py-2 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-900 transition"
              >
                Dismiss View
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}