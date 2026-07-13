"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, WalletCards, Loader2 } from "lucide-react";

// Explicit TypeScript compilation layer
interface PackageItem {
  id: string;
  credits: number;
  price: number;
  name: string;
  bonus?: number;
  badge?: string;
  isPopular?: boolean;
  isBestValue?: boolean;
}

interface OrderSummaryProps {
  selectedPackage: PackageItem | null;
  currentCredits: number;
  isLoading: boolean;
}

export default function OrderSummary({ 
  selectedPackage, 
  currentCredits, 
  isLoading 
}: OrderSummaryProps) {
  
  // Safe computational calculations with fallback logic
  const baseCredits = selectedPackage?.credits || 0;
  const bonusCredits = selectedPackage?.bonus || 0;
  const grandTotalCredits = baseCredits + bonusCredits;
  const totalCost = selectedPackage?.price || 0;

  if (isLoading) {
    return (
      <div className="w-full h-48 animate-pulse rounded-2xl bg-slate-100 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 flex items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-slate-400">
          <Loader2 className="animate-spin text-indigo-500" size={18} />
          <span>Synchronizing Order Computations...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="text-slate-900 dark:text-zinc-50 transition-colors duration-300">
      <section className="grid gap-6 lg:grid-cols-3">
        
        {/* ================= Left: Selected Details ================= */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-2 rounded-2xl border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-6 md:p-8 shadow-sm flex flex-col justify-between min-h-[280px]"
        >
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-950 dark:text-white flex items-center gap-2">
              Selected Package Details
            </h2>
            <p className="text-xs text-slate-400 dark:text-zinc-500 mt-1">
              Verify your operational volumes and credit increments before processing mainnet execution layers.
            </p>
          </div>

          {!selectedPackage ? (
            // Empty State view placeholder standard
            <div className="flex flex-col items-center justify-center py-8 text-center border-2 border-dashed border-slate-200 dark:border-zinc-800 rounded-xl my-4">
              <WalletCards className="text-slate-300 dark:text-zinc-700 mb-2" size={36} />
              <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">No Package Selected</p>
              <p className="text-xs text-slate-400 max-w-xs mt-1">
                Please pick a package from the bundle grid above to activate checkout calculations.
              </p>
            </div>
          ) : (
            <div className="mt-6 grid gap-6 grid-cols-3 border-t border-slate-100 dark:border-zinc-800/60 pt-6">
              <div>
                <p className="text-xs font-medium text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Credits</p>
                <h3 className="mt-1.5 text-2xl md:text-3xl font-black text-[#3B3B98] dark:text-[#8e8ee6]">
                  {baseCredits.toLocaleString()}
                </h3>
              </div>

              <div>
                <p className="text-xs font-medium text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Bonus</p>
                <h3 className="mt-1.5 text-2xl md:text-3xl font-black text-emerald-600 dark:text-emerald-400">
                  +{bonusCredits.toLocaleString()}
                </h3>
              </div>

              <div>
                <p className="text-xs font-medium text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Total</p>
                <h3 className="mt-1.5 text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
                  {grandTotalCredits.toLocaleString()}
                </h3>
              </div>
            </div>
          )}

          <div className="text-xs text-slate-400 dark:text-zinc-500 border-t border-slate-100 dark:border-zinc-800/60 pt-4 mt-4 flex justify-between">
            <span>Your Current Balance: <strong>{currentCredits} CRD</strong></span>
            {selectedPackage && <span>Post-Payment Estimate: <strong>{currentCredits + grandTotalCredits} CRD</strong></span>}
          </div>
        </motion.div>

        {/* ================= Right: Checkout Card ================= */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl bg-gradient-to-br from-[#3B3B98] to-[#252561] p-6 md:p-8 text-white shadow-xl shadow-[#3B3B98]/10 flex flex-col justify-between min-h-[320px]"
        >
          <div>
            <h2 className="text-xl font-bold tracking-tight">Order Summary</h2>

            <div className="mt-6 space-y-4 text-sm">
              <div className="flex justify-between text-indigo-100">
                <span>Base Credits</span>
                <span className="font-semibold text-white">{baseCredits.toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-indigo-100">
                <span>Bonus Credits</span>
                <span className="font-semibold text-emerald-300">+{bonusCredits.toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-indigo-100 border-b border-white/10 pb-4">
                <span>Price Package</span>
                <span className="font-semibold text-white">${totalCost}</span>
              </div>

              <div className="pt-2">
                <div className="flex items-end justify-between">
                  <span className="text-xs font-medium uppercase tracking-wider text-indigo-200">Total Credits</span>
                  <span className="text-3xl font-black tracking-tight leading-none">
                    {grandTotalCredits.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <button 
              disabled={!selectedPackage}
              type="button"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3.5 text-sm font-bold text-[#3B3B98] transition hover:bg-indigo-50 active:scale-98 shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
            >
              {selectedPackage ? "Continue To Payment" : "Select a Package First"}
              <ArrowRight size={16} />
            </button>

            <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-indigo-200/80">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span>Secure gateway terminal operations verified</span>
            </div>
          </div>
        </motion.div>

      </section>
    </div>
  );
}