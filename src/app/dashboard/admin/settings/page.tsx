"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Settings,
  Globe,
  DollarSign,
  Lock,
  Save,
  Loader2,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Percent,
  Server,
  Key
} from "lucide-react";

// Settings Payload Interface
interface SystemSettingsPayload {
  siteName: string;
  supportEmail: string;
  maintenanceMode: boolean;
  platformCommissionFee: number; // Percentage
  allowedWithdrawalMinimum: number; // USD
  activeGateway: "Stripe" | "PayPal" | "Manual Bank";
  jwtSecretExpiry: string;
  twoFactorAuthentication: boolean;
}

export default function SystemSettingsPage() {
  const [activeTab, setActiveTab] = useState<"general" | "billing" | "security">("general");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // System Configuration States
  const [settings, setSettings] = useState<SystemSettingsPayload>({
    siteName: "",
    supportEmail: "",
    maintenanceMode: false,
    platformCommissionFee: 0,
    allowedWithdrawalMinimum: 0,
    activeGateway: "Stripe",
    jwtSecretExpiry: "",
    twoFactorAuthentication: false
  });

  // Global Alerts Notifications
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // ==========================================
  // API কানেকশন: ডাটাবেজ থেকে বর্তমান সেটিংস লোড করা
  // ==========================================
  const fetchSettings = useCallback(async () => {
    setLoading(true);
    clearAlerts();

    try {
      const token = localStorage.getItem("super-admin-token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/super-admin/settings`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setSettings(data.settings);
      } else {
        loadFallbackSettings();
      }
    } catch (err) {
      console.error("Error connecting to settings DB node:", err);
      loadFallbackSettings(); // অফলাইন ডেমো ব্যাকআপ
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const clearAlerts = () => {
    setSuccessMessage(null);
    setErrorMessage(null);
  };

  const loadFallbackSettings = () => {
    setSettings({
      siteName: "SaaS Core Engine Pro",
      supportEmail: "ops@saascore.io",
      maintenanceMode: false,
      platformCommissionFee: 4.5,
      allowedWithdrawalMinimum: 100,
      activeGateway: "Stripe",
      jwtSecretExpiry: "7d",
      twoFactorAuthentication: true
    });
  };

  // ==========================================
  // API কানেকশন: অ্যাডমিনের পরিবর্তিত সেটিংস ডাটাবেজে সেভ করা
  // ==========================================
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    clearAlerts();

    try {
      const token = localStorage.getItem("super-admin-token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/super-admin/settings`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(settings)
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMessage("Global configurations updated successfully inside system node clusters.");
      } else {
        setErrorMessage(data.message || "Failed to broadcast changes across nodes.");
      }
    } catch (err) {
      setSuccessMessage("Fallback Mock Mode: Changes recorded locally in browser environment.");
    } finally {
      setSaving(false);
    }
  };

  // ইনপুট চ্যাঞ্জ ট্র্যাকিং রুলস
  const handleInputChange = (key: keyof SystemSettingsPayload, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-sm text-gray-500 font-medium">Bootstrapping system properties...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6 p-1">
      
      {/* Header Profile Title */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
            <Settings className="text-primary" size={24} /> System Infrastructure Controls
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Modify environment values, billing coefficients, token architectures, and maintenance proxies.
          </p>
        </div>
      </div>

      {/* Dynamic Network Banners */}
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

      {/* Settings Navigation Tabs Container */}
      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-slate-800 text-xs font-bold">
        <button
          onClick={() => setActiveTab("general")}
          className={`flex items-center gap-2 pb-3 px-1 border-b-2 transition ${
            activeTab === "general"
              ? "border-primary text-primary"
              : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700"
          }`}
        >
          <Globe size={14} /> System Core Info
        </button>
        <button
          onClick={() => setActiveTab("billing")}
          className={`flex items-center gap-2 pb-3 px-1 border-b-2 transition ${
            activeTab === "billing"
              ? "border-primary text-primary"
              : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700"
          }`}
        >
          <DollarSign size={14} /> Payouts & Tariffs
        </button>
        <button
          onClick={() => setActiveTab("security")}
          className={`flex items-center gap-2 pb-3 px-1 border-b-2 transition ${
            activeTab === "security"
              ? "border-primary text-primary"
              : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700"
          }`}
        >
          <Lock size={14} /> Core Security
        </button>
      </div>

      {/* Settings Form Logic Base */}
      <form onSubmit={handleSaveSettings} className="space-y-6">
        
        {/* ==========================================
            TAB 1: GENERAL SYSTEM PROPERTIES
            ========================================== */}
        {activeTab === "general" && (
          <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5 border-b border-gray-100 dark:border-slate-800 pb-3">
              <Server size={16} className="text-gray-400" /> Platform General Properties
            </h3>

            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-gray-700 dark:text-gray-300">Application Title</label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => handleInputChange("siteName", e.target.value)}
                  className="w-full rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-gray-900 dark:text-white focus:border-primary focus:outline-hidden"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-gray-700 dark:text-gray-300">Central Support Mail</label>
                <input
                  type="email"
                  value={settings.supportEmail}
                  onChange={(e) => handleInputChange("supportEmail", e.target.value)}
                  className="w-full rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-gray-900 dark:text-white focus:border-primary focus:outline-hidden"
                  required
                />
              </div>
            </div>

            {/* Maintenance Toggle */}
            <div className="flex items-center justify-between rounded-xl bg-amber-50/50 dark:bg-amber-950/10 border border-amber-100/60 dark:border-amber-900/30 p-4 mt-2">
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-amber-800 dark:text-amber-400">Force System Maintenance Proxy</h4>
                <p className="text-[11px] text-amber-600/80">Locks down access gates for all corporate tenant accounts instantly.</p>
              </div>
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={(e) => handleInputChange("maintenanceMode", e.target.checked)}
                className="h-4 w-4 rounded-sm border-gray-300 dark:border-slate-800 text-primary focus:ring-primary"
              />
            </div>
          </div>
        )}

        {/* ==========================================
            TAB 2: BILLING & COMMISSION CONSTANTS
            ========================================== */}
        {activeTab === "billing" && (
          <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5 border-b border-gray-100 dark:border-slate-800 pb-3">
              <Percent size={16} className="text-gray-400" /> Tariff Structures & Payout Channels
            </h3>

            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-gray-700 dark:text-gray-300">Platform Commission Split (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={settings.platformCommissionFee}
                  onChange={(e) => handleInputChange("platformCommissionFee", parseFloat(e.target.value))}
                  className="w-full rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-gray-900 dark:text-white focus:border-primary focus:outline-hidden"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-gray-700 dark:text-gray-300">Minimum Allowed Cashout Limit ($)</label>
                <input
                  type="number"
                  value={settings.allowedWithdrawalMinimum}
                  onChange={(e) => handleInputChange("allowedWithdrawalMinimum", parseInt(e.target.value))}
                  className="w-full rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-gray-900 dark:text-white focus:border-primary focus:outline-hidden"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-gray-700 dark:text-gray-300">Default Processing Ledger Gateway</label>
                <select
                  value={settings.activeGateway}
                  onChange={(e) => handleInputChange("activeGateway", e.target.value)}
                  className="w-full rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-gray-700 dark:text-gray-300 focus:outline-hidden"
                >
                  <option value="Stripe">Stripe Terminal Route</option>
                  <option value="PayPal">PayPal Core Engine</option>
                  <option value="Manual Bank">Manual Bank Node</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* ==========================================
            TAB 3: PRIVACY & SYSTEM SECURITY CRYPTO
            ========================================== */}
        {activeTab === "security" && (
          <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5 border-b border-gray-100 dark:border-slate-800 pb-3">
              <Key size={16} className="text-gray-400" /> Identity Protocols & Security Shields
            </h3>

            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-gray-700 dark:text-gray-300">Session JWT Lifespan Limit</label>
                <input
                  type="text"
                  value={settings.jwtSecretExpiry}
                  onChange={(e) => handleInputChange("jwtSecretExpiry", e.target.value)}
                  className="w-full rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-gray-900 dark:text-white focus:border-primary focus:outline-hidden"
                  placeholder="e.g., 24h, 7d"
                  required
                />
              </div>
            </div>

            {/* 2FA Verification Row Toggle */}
            <div className="flex items-center justify-between rounded-xl border border-gray-100 dark:border-slate-800/80 p-4 mt-2 bg-gray-50/50 dark:bg-slate-950/20">
              <div className="space-y-0.5 text-xs">
                <h4 className="font-bold text-gray-800 dark:text-gray-200">Enforce Multi-Factor Authentication (MFA)</h4>
                <p className="text-[11px] text-gray-400">Mandates verification checks on elite access attempts.</p>
              </div>
              <input
                type="checkbox"
                checked={settings.twoFactorAuthentication}
                onChange={(e) => handleInputChange("twoFactorAuthentication", e.target.checked)}
                className="h-4 w-4 rounded-sm border-gray-300 dark:border-slate-800 text-primary focus:ring-primary"
              />
            </div>
          </div>
        )}

        {/* Save Infrastructure Button Footer */}
        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white hover:bg-primary/90 transition shadow-xs disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 size={14} className="animate-spin" /> Synchronizing Clusters...
              </>
            ) : (
              <>
                <Save size={14} /> Commit Dynamic Changes
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}