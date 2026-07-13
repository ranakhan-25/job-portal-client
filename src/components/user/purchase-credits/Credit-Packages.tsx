"use client";

import React from "react";
import { motion } from "framer-motion";
import { CreditCard, Sparkles, Wallet, Check } from "lucide-react";

// Props interface definition for type compliance
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

interface CreditPackagesProps {
  onSelectPackage: (pkg: PackageItem) => void;
  selectedPackage: PackageItem | null;
  isLoading: boolean;
}

export default function CreditPackages({ 
  onSelectPackage, 
  selectedPackage, 
  isLoading 
}: CreditPackagesProps) {

  // Dynamic Central Data Cluster
  const packages: PackageItem[] = [
    { id: "pkg_starter", credits: 100, price: 10, name: "Starter Package" },
    { id: "pkg_popular", credits: 300, price: 25, name: "Popular Choice", bonus: 20, badge: "POPULAR", isPopular: true },
    { id: "pkg_grow", credits: 800, price: 60, name: "Growth Package", bonus: 80 },
    { id: "pkg_best", credits: 1500, price: 100, name: "Elite Value", bonus: 200, badge: "BEST VALUE", isBestValue: true }
  ];

  return (
    <section className="py-8 text-slate-900 dark:text-zinc-50 transition-colors duration-300">
      {/* Header Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white">
          Choose Your Credit Package
        </h2>
        <p className="mt-2 text-sm md:text-base text-slate-600 dark:text-zinc-400">
          Select a package that fits your contribution needs. Click to select your active checkout pool.
        </p>
      </div>

      {/* Grid Engine Integration */}
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {isLoading ? (
          // Skeleton Array during Core Sync States
          Array.from({ length: 4 }).map((_, index) => (
            <div 
              key={`skeleton-${index}`} 
              className="h-[320px] w-full animate-pulse rounded-2xl bg-slate-200/60 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800"
            />
          ))
        ) : (
          packages.map((pkg) => {
            const isSelected = selectedPackage?.id === pkg.id;

            // Conditional Design Styles System Architecture
            let cardStyles = "relative overflow-hidden rounded-2xl border bg-white dark:bg-zinc-900/40 p-6 shadow-sm transition-all cursor-pointer ";
            if (isSelected) {
              cardStyles += "border-[#3B3B98] ring-2 ring-[#3B3B98]/50 dark:border-[#8e8ee6] dark:ring-[#8e8ee6]/30 bg-indigo-50/20 dark:bg-indigo-950/20";
            } else if (pkg.isPopular) {
              cardStyles += "border-2 border-[#3B3B98]/60 bg-white dark:bg-zinc-900 shadow-md shadow-[#3B3B98]/5";
            } else if (pkg.isBestValue) {
              cardStyles += "border-transparent bg-gradient-to-br from-[#3B3B98] to-[#1e1e52] text-white shadow-md shadow-[#3B3B98]/10";
            } else {
              cardStyles += "border-slate-200/80 dark:border-zinc-800 hover:border-[#3B3B98]/40 dark:hover:border-[#8e8ee6]/40";
            }

            return (
              <motion.div
                key={pkg.id}
                whileHover={{ y: -6, scale: 1.01 }}
                onClick={() => onSelectPackage(pkg)}
                className={cardStyles}
              >
                {/* Upper Dynamic Badge */}
                {pkg.badge && (
                  <span className={`absolute right-3 top-3 rounded-full px-2.5 py-0.5 text-[9px] font-bold tracking-wider uppercase backdrop-blur-sm ${
                    pkg.isBestValue ? "bg-white/20 text-white" : "bg-[#3B3B98] text-white"
                  }`}>
                    {pkg.badge}
                  </span>
                )}

                {/* Vector Visual Mapping */}
                <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl ${
                  pkg.isBestValue ? "bg-white/10 text-white" : "bg-[#3B3B98]/5 text-[#3B3B98] dark:text-[#8e8ee6]"
                }`}>
                  {pkg.isBestValue ? (
                    <Sparkles size={24} className="text-amber-300" />
                  ) : pkg.credits >= 800 ? (
                    <Sparkles size={24} />
                  ) : pkg.isPopular ? (
                    <CreditCard size={24} />
                  ) : (
                    <Wallet size={24} />
                  )}
                </div>

                {/* Operational Unit Quantities */}
                <h3 className={`text-2xl font-bold tracking-tight ${pkg.isBestValue ? "text-white" : "text-slate-950 dark:text-white"}`}>
                  {pkg.credits.toLocaleString()}
                </h3>
                <p className={`text-xs ${pkg.isBestValue ? "text-indigo-200" : "text-slate-500 dark:text-zinc-400"}`}>
                  Credits
                </p>

                <div className="mt-6">
                  <p className={`text-3xl font-black ${pkg.isBestValue ? "text-white" : "text-[#3B3B98] dark:text-[#8e8ee6]"}`}>
                    ${pkg.price}
                  </p>
                  <p className={`mt-1 text-xs ${pkg.isBestValue ? "text-indigo-200" : "text-slate-400 dark:text-zinc-500"}`}>
                    {pkg.name}
                  </p>
                </div>

                {/* Reward Engine Tracking */}
                {pkg.bonus && (
                  <div className={`mt-4 rounded-lg px-3 py-2 text-xs font-semibold ${
                    pkg.isBestValue 
                      ? "bg-white/10 text-indigo-100 backdrop-blur-sm" 
                      : pkg.isPopular
                      ? "bg-emerald-500/10 dark:bg-emerald-500/5 text-emerald-600 dark:text-emerald-400"
                      : "bg-[#3B3B98]/10 dark:bg-[#3B3B98]/5 text-[#3B3B98] dark:text-[#8e8ee6]"
                  }`}>
                    🎁 Bonus +{pkg.bonus} Credits
                  </div>
                )}

                {/* Selection State Call Button */}
                <button 
                  type="button"
                  className={`mt-6 w-full rounded-xl py-2.5 text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                    isSelected
                      ? "bg-emerald-600 text-white shadow-sm"
                      : pkg.isBestValue
                      ? "bg-white text-[#3B3B98] hover:bg-indigo-50 shadow-sm"
                      : pkg.isPopular
                      ? "bg-[#3B3B98] text-white hover:bg-[#2c2c77]"
                      : "bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-slate-800 dark:hover:bg-white"
                  }`}
                >
                  {isSelected ? (
                    <>
                      Selected <Check size={14} />
                    </>
                  ) : (
                    "Select Package"
                  )}
                </button>
              </motion.div>
            );
          })
        )}
      </div>
    </section>
  );
}