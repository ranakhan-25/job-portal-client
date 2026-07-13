"use client";

import { useState, useEffect } from "react";
import CreditPackages from "@/components/user/purchase-credits/Credit-Packages";
import OrderSummary from "@/components/user/purchase-credits/Order-Summary";
import PurchaseHistory from "@/components/user/purchase-credits/PurchaseHistory";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CreditCard,
  ShieldCheck,
  Sparkles,
  Wallet,
  Loader2,
} from "lucide-react";

// TypeScript values define korar jonno exact interfaces
interface PurchaseRecord {
  id: string;
  amount: number;
  credits: number;
  status: "success" | "pending" | "failed";
  createdAt: string;
}

interface WalletData {
  currentCredits: number;
  status: string;
  history: PurchaseRecord[];
}

export default function PurchaseCredits() {
  // Application Dynamic Component States
  const [wallet, setWallet] = useState<WalletData>({
    currentCredits: 0,
    status: "active",
    history: [],
  });
  
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // API Call Execution Engine
  useEffect(() => {
    async function fetchWalletAndHistory() {
      try {
        setLoading(true);
        // data processing call logic initialization 
        const response = await fetch("/api/user/wallet"); 
        if (!response.ok) {
          throw new Error("Failed to sync wallet records from node cluster.");
        }
        const data = await response.json();
        setWallet(data);
      } catch (err: any) {
        setError(err.message || "An unexpected network execution block occurred.");
      } finally {
        setLoading(false);
      }
    }

    fetchWalletAndHistory();
  }, []);

  return (
    <div className="space-y-8 max-h-screen overflow-auto p-1">
      {/* ========================= */}
      {/* Dynamic Hero Section */}
      {/* ========================= */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-[#3B3B98]/20 bg-slate-50 dark:bg-zinc-950 p-6 md:p-10 lg:p-14 text-slate-900 dark:text-zinc-50 transition-colors duration-300"
      >
        {/* Animated Orbs Layer */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
            transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
            className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-[#3B3B98]/10 dark:bg-[#3B3B98]/5 blur-3xl"
          />
          <motion.div
            animate={{ x: [0, -30, 0], y: [0, 40, 0] }}
            transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
            className="absolute -bottom-28 right-0 h-96 w-96 rounded-full bg-[#3B3B98]/10 dark:bg-[#3B3B98]/5 blur-3xl"
          />
          <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02]">
            <div className="h-full w-full bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:40px_40px]" />
          </div>
        </div>

        {/* Content Box */}
        <div className="relative z-10 grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Left Side Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="flex flex-col justify-center"
          >
            <div className="inline-flex self-start items-center gap-2 rounded-full border border-[#3B3B98]/20 dark:border-[#3B3B98]/10 bg-[#3B3B98]/5 px-4 py-1.5">
              <Sparkles size={16} className="text-[#3B3B98] dark:text-[#5757cf]" />
              <span className="text-xs font-semibold tracking-wide uppercase text-[#3B3B98] dark:text-[#8e8ee6]">
                Secure Credit Purchase
              </span>
            </div>

            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white md:text-5xl xl:text-6xl leading-[1.15]">
              Purchase{" "}
              <span className="block mt-1 bg-gradient-to-r from-[#3B3B98] to-[#5757cf] dark:from-[#8e8ee6] dark:to-slate-200 bg-clip-text text-transparent">
                Credits Instantly
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base md:text-lg leading-relaxed text-slate-600 dark:text-zinc-400">
              Buy credits securely and instantly support your favorite campaigns.
              Your purchased credits will be added to your wallet immediately after a successful payment.
            </p>

            {/* Error Message Logger Banner */}
            {error && (
              <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-500 font-medium">
                ⚠️ Runtime Sync Issue: {error}
              </div>
            )}

            <div className="mt-8 flex flex-wrap gap-4">
              <button 
                onClick={() => document.getElementById("packages-section")?.scrollIntoView({ behavior: "smooth" })}
                className="inline-flex items-center gap-2 rounded-xl bg-[#3B3B98] px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#2c2c77] active:scale-98 shadow-md shadow-[#3B3B98]/20"
              >
                Buy Credits
                <ArrowRight size={16} />
              </button>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 border-t border-slate-200/60 dark:border-zinc-900 pt-6">
              <div className="flex items-center gap-2 text-slate-600 dark:text-zinc-400">
                <ShieldCheck size={18} className="text-emerald-500" />
                <span className="text-xs font-medium">Secure Payment Gateway</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-zinc-400">
                <CreditCard size={18} className="text-[#3B3B98] dark:text-[#8e8ee6]" />
                <span className="text-xs font-medium">Instant Credit Delivery</span>
              </div>
            </div>
          </motion.div>

          {/* Right Side (Dynamic Wallet UI status block) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
            whileHover={{ y: -4 }}
            className="rounded-2xl border border-[#3B3B98]/10 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-6 md:p-8 shadow-xl shadow-slate-200/40 dark:shadow-none"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#3B3B98]/5 text-[#3B3B98] dark:text-[#8e8ee6]">
                <Wallet size={26} />
              </div>
              {loading ? (
                <Loader2 className="text-indigo-500 animate-spin" size={20} />
              ) : (
                <ShieldCheck className="text-emerald-500" size={22} />
              )}
            </div>

            <p className="mt-6 text-xs font-semibold tracking-wider uppercase text-slate-400 dark:text-zinc-500">
              Available Balance
            </p>

            <h2 className="mt-1 text-5xl font-black tracking-tight text-slate-950 dark:text-white flex items-baseline gap-2">
              {loading ? (
                <span className="inline-block h-10 w-24 animate-pulse rounded-lg bg-slate-200 dark:bg-zinc-800" />
              ) : (
                wallet.currentCredits.toLocaleString()
              )}
              {!loading && <span className="text-sm font-bold text-[#3B3B98] dark:text-[#8e8ee6]">CRD</span>}
            </h2>

            <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">
              Ready to support your choice of campaigns
            </p>

            <div className="mt-6 rounded-xl border border-slate-100 dark:border-zinc-800/60 bg-slate-50/50 dark:bg-zinc-900/40 p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-600 dark:text-zinc-400">Wallet Status</span>
                <span className="rounded-full bg-emerald-500/10 dark:bg-emerald-500/5 px-2.5 py-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 capitalize">
                  {loading ? "syncing..." : wallet.status}
                </span>
              </div>

              <div className="mt-3 h-1.5 rounded-full bg-slate-200 dark:bg-zinc-800 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: loading ? "30%" : "100%" }}
                  className="h-full rounded-full bg-gradient-to-r from-[#3B3B98] to-[#5757cf] dark:from-[#8e8ee6]" 
                />
              </div>
              <p className="mt-2 text-[11px] text-slate-400 dark:text-zinc-500">
                Your wallet is fully active, encrypted, and synced with our mainnet channels.
              </p>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* ========================================= */}
      {/* Child Integration with Props Binding   */}
      {/* ========================================= */}
      
      <div id="packages-section">
        <CreditPackages 
          onSelectPackage={setSelectedPackage} 
          selectedPackage={selectedPackage} 
          isLoading={loading}
        />
      </div>

      <OrderSummary 
        selectedPackage={selectedPackage} 
        currentCredits={wallet.currentCredits}
        isLoading={loading}
      />

      <PurchaseHistory 
        history={wallet.history} 
        isLoading={loading}
      />
    </div>
  );
}