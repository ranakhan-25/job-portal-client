"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Building2,
  Search,
  Filter,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Loader2,
  RefreshCw,
  MoreVertical,
  ShieldAlert,
  Users,
  DollarSign,
  ArrowUpRight,
  ExternalLink
} from "lucide-react";

// Company Interface matching DB Schema
interface RegisteredCompany {
  _id: string; // MongoDB Unique ID
  name: string;
  domain: string; // e.g., acme.platform.com
  ownerName: string;
  ownerEmail: string;
  plan: "Enterprise" | "Pro" | "Free";
  status: "Active" | "Suspended";
  totalUsersCount: number;
  monthlySpend: number;
  createdAt: string; // ISO Date String
}

export default function ManageCompaniesPage() {
  const [companies, setCompanies] = useState<RegisteredCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [planFilter, setPlanFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // Notification Banner States
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Action Menu States
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // ==========================================
  // API কানেকশন: প্ল্যাটফর্মের সব কোম্পানি ডাটা লোড করা
  // ==========================================
  const fetchCompanies = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    else setRefreshing(true);
    clearNotifications();

    try {
      const token = localStorage.getItem("super-admin-token");
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/super-admin/companies`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setCompanies(data.companies);
      } else {
        loadFallbackCompanies();
      }
    } catch (err) {
      console.error("Error fetching companies:", err);
      loadFallbackCompanies(); // অফলাইন ডেমো ফালব্যাক
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const clearNotifications = () => {
    setSuccessMessage(null);
    setErrorMessage(null);
  };

  // ডাইনামিক কারেন্ট ডেটসহ ডেমো ডাটা জেনারেট (Fallback)
  const loadFallbackCompanies = () => {
    const today = new Date();
    setCompanies([
      {
        _id: "c_1",
        name: "Acme Tech Bangladesh",
        domain: "acmetech.saas.com",
        ownerName: "Rahat Chowdhury",
        ownerEmail: "ceo@acmetech.com",
        plan: "Enterprise",
        status: "Active",
        totalUsersCount: 28,
        monthlySpend: 499,
        createdAt: new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        _id: "c_2",
        name: "Creative Studio LTD",
        domain: "creative.saas.com",
        ownerName: "Nusrat Jahan",
        ownerEmail: "admin@creative.io",
        plan: "Pro",
        status: "Active",
        totalUsersCount: 12,
        monthlySpend: 149,
        createdAt: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        _id: "c_3",
        name: "Dhaka Retailers Inc.",
        domain: "dhakaretail.saas.com",
        ownerName: "Arifur Rahman",
        ownerEmail: "info@dhakaretail.org",
        plan: "Free",
        status: "Suspended",
        totalUsersCount: 3,
        monthlySpend: 0,
        createdAt: new Date(today.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]);
  };

  // ==========================================
  // API কানেকশন: কোম্পানির অ্যাকাউন্ট সাসপেন্ড/অ্যাক্টিভ করা
  // ==========================================
  const toggleCompanyStatus = async (companyId: string, currentStatus: "Active" | "Suspended", companyName: string) => {
    const newStatus = currentStatus === "Active" ? "Suspended" : "Active";
    if (!confirm(`Are you sure you want to ${newStatus.toLowerCase()} the workspace for ${companyName}?`)) return;

    setActiveMenuId(null);
    setUpdatingId(companyId);
    clearNotifications();

    try {
      const token = localStorage.getItem("super-admin-token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/super-admin/companies/${companyId}/status`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMessage(`${companyName} has been successfully ${newStatus.toLowerCase()}.`);
        setCompanies((prev) => prev.map((c) => c._id === companyId ? { ...c, status: newStatus } : c));
      } else {
        setErrorMessage(data.message || "Failed to update company status.");
      }
    } catch (err) {
      // অফলাইন মোড আপডেট ট্র্যাকিং
      setCompanies((prev) => prev.map((c) => c._id === companyId ? { ...c, status: newStatus } : c));
      setSuccessMessage(`Fallback UI: Status forced to ${newStatus} for ${companyName}`);
    } finally {
      setUpdatingId(null);
    }
  };

  // ==========================================
  // API কানেকশন: কোম্পানির প্ল্যান পরিবর্তন (Upgrade/Downgrade)
  // ==========================================
  const changeCompanyPlan = async (companyId: string, currentPlan: string, companyName: string) => {
    const plans: Array<"Free" | "Pro" | "Enterprise"> = ["Free", "Pro", "Enterprise"];
    const nextPlan = plans[(plans.indexOf(currentPlan as any) + 1) % plans.length];
    
    if (!confirm(`Upgrade/Downgrade ${companyName} to ${nextPlan} Plan?`)) return;
    
    setActiveMenuId(null);
    setUpdatingId(companyId);
    clearNotifications();

    const mockPrice = nextPlan === "Enterprise" ? 499 : nextPlan === "Pro" ? 149 : 0;

    try {
      const token = localStorage.getItem("super-admin-token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/super-admin/companies/${companyId}/plan`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ plan: nextPlan, monthlySpend: mockPrice })
      });

      if (res.ok) {
        setSuccessMessage(`${companyName} subscription changed to ${nextPlan}`);
        setCompanies((prev) => prev.map((c) => c._id === companyId ? { ...c, plan: nextPlan, monthlySpend: mockPrice } : c));
      }
    } catch (err) {
      setCompanies((prev) => prev.map((c) => c._id === companyId ? { ...c, plan: nextPlan, monthlySpend: mockPrice } : c));
      setSuccessMessage(`Fallback UI: Package upgraded to ${nextPlan}`);
    } finally {
      setUpdatingId(null);
    }
  };

  // Live Filter & Search Analytics
  const filteredCompanies = companies.filter((company) => {
    const matchesSearch =
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.ownerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.domain.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPlan = planFilter === "All" || company.plan === planFilter;
    const matchesStatus = statusFilter === "All" || company.status === statusFilter;

    return matchesSearch && matchesPlan && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-sm text-gray-500 font-medium">Loading registered SaaS companies...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl space-y-6 p-1">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
            <Building2 className="text-primary" size={24} /> Registered SaaS Companies
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Manage tenant organizations, configure cloud billing modules, and toggle platform access controls.
          </p>
        </div>
        <button
          onClick={() => fetchCompanies(true)}
          disabled={refreshing}
          className="flex self-start items-center gap-2 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2 text-xs font-bold text-gray-700 dark:text-gray-300 transition hover:bg-gray-50 dark:hover:bg-slate-800"
        >
          <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
          {refreshing ? "Refreshing..." : "Sync Database"}
        </button>
      </div>

      {/* Dynamic Alerts */}
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

      {/* Filter Matrix Controls */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs">
        {/* Search Field */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by company title, domain, or primary owner..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 pl-10 pr-4 py-2 text-xs text-gray-900 dark:text-white focus:border-primary focus:outline-hidden focus:ring-1 focus:ring-primary transition"
          />
        </div>

        {/* Filters Select Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <Filter size={14} className="text-gray-400" />
            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              className="rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-gray-700 dark:text-gray-300 focus:outline-hidden"
            >
              <option value="All">All Tiers</option>
              <option value="Enterprise">Enterprise</option>
              <option value="Pro">Pro</option>
              <option value="Free">Free</option>
            </select>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-gray-700 dark:text-gray-300 focus:outline-hidden"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Main Corporate Workspace Grid/Table */}
      <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs text-gray-500 dark:text-gray-400">
            <thead className="bg-gray-50 dark:bg-slate-800/50 font-bold uppercase text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-slate-800">
              <tr>
                <th scope="col" className="px-6 py-4">Company Profile</th>
                <th scope="col" className="px-6 py-4">Account Owner</th>
                <th scope="col" className="px-6 py-4">Subscribed Plan</th>
                <th scope="col" className="px-6 py-4">Usage Stats</th>
                <th scope="col" className="px-6 py-4">MRR Value</th>
                <th scope="col" className="px-6 py-4">Status</th>
                <th scope="col" className="px-6 py-4 text-center">Settings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
              {filteredCompanies.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 font-medium text-gray-400">
                    No corporate workspaces found matching specifications.
                  </td>
                </tr>
              ) : (
                filteredCompanies.map((comp) => (
                  <tr key={comp._id} className={`hover:bg-gray-50/50 dark:hover:bg-slate-800/20 transition-colors ${updatingId === comp._id ? "opacity-40 pointer-events-none" : ""}`}>
                    
                    {/* Brand Meta Column */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900 dark:text-white text-sm">
                          {comp.name}
                        </span>
                        <a 
                          href={`https://${comp.domain}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-primary hover:underline text-[11px] flex items-center gap-0.5 mt-0.5 font-medium"
                        >
                          {comp.domain} <ExternalLink size={10} />
                        </a>
                      </div>
                    </td>

                    {/* Primary Admin/Owner Identity */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-800 dark:text-gray-200 capitalize">{comp.ownerName}</span>
                        <span className="text-[11px] text-gray-400">{comp.ownerEmail}</span>
                      </div>
                    </td>

                    {/* Active SaaS Plan Tier */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 rounded-md px-2.5 py-0.5 font-bold border ${
                        comp.plan === "Enterprise"
                          ? "bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-900/40"
                          : comp.plan === "Pro"
                          ? "bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-900/40"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-transparent"
                      }`}>
                        <CreditCard size={11} /> {comp.plan}
                      </span>
                    </td>

                    {/* Seat Usage Metrics */}
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-300 font-medium">
                      <div className="flex items-center gap-1">
                        <Users size={13} className="text-gray-400" />
                        <span>{comp.totalUsersCount} active slots</span>
                      </div>
                    </td>

                    {/* Monthly Financial Output */}
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white font-bold text-sm">
                      ${comp.monthlySpend}/mo
                    </td>

                    {/* Status Toggle Shield */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-semibold ${
                        comp.status === "Active"
                          ? "bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400"
                          : "bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400"
                      }`}>
                        {comp.status}
                      </span>
                    </td>

                    {/* Settings Dynamic Actions Box */}
                    <td className="px-6 py-4 whitespace-nowrap text-center relative">
                      <button
                        onClick={() => setActiveMenuId(activeMenuId === comp._id ? null : comp._id)}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-white p-1 rounded-lg transition"
                      >
                        <MoreVertical size={16} />
                      </button>

                      {activeMenuId === comp._id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setActiveMenuId(null)} />
                          
                          <div className="absolute right-6 mt-1 w-48 rounded-xl bg-white dark:bg-slate-950 shadow-lg border border-gray-200 dark:border-slate-800 py-1.5 z-20 text-left">
                            {/* Cycle Pricing Model Plan */}
                            <button
                              onClick={() => changeCompanyPlan(comp._id, comp.plan, comp.name)}
                              className="w-full flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-900 transition font-medium"
                            >
                              <ArrowUpRight size={14} className="text-blue-500" /> Toggle Pricing Tier
                            </button>
                            
                            {/* Toggle Suspend/Active access */}
                            <button
                              onClick={() => toggleCompanyStatus(comp._id, comp.status, comp.name)}
                              className="w-full flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-900 transition font-medium border-t border-gray-100 dark:border-slate-900"
                            >
                              <ShieldAlert size={14} className={comp.status === "Active" ? "text-red-500" : "text-green-500"} />
                              {comp.status === "Active" ? "Suspend Brand" : "Activate Brand"}
                            </button>
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
    </div>
  );
}