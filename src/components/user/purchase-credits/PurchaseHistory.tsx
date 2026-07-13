"use client";

import React from "react";
import { motion } from "framer-motion";
import { CreditCard, Loader2, ArrowUpRight } from "lucide-react";

// Explicit data compilation typings
interface HistoryItem {
  id: string | number;
  date: string;
  credits: number;
  amount: number;
  status: "Completed" | "Pending" | "Failed" | string;
  transactionId: string;
}

interface PurchaseHistoryProps {
  purchaseHistory?: HistoryItem[];
  isLoading?: boolean;
  onViewAll?: () => void;
}

export default function PurchaseHistory({
  purchaseHistory = [],
  isLoading = false,
  onViewAll,
}: PurchaseHistoryProps) {
  if (isLoading) {
    return (
      <div className="w-full h-64 animate-pulse rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-slate-400">
          <Loader2 className="animate-spin text-indigo-500" size={20} />
          <span>Fetching systemic billing history layers...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <motion.section
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
      >
        {/* Card Header Panel */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 md:px-8 md:py-6 dark:border-slate-800">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
              Recent Purchases
            </h2>
            <p className="mt-1 text-xs md:text-sm text-slate-500 dark:text-slate-400">
              Your latest credit purchase history logs
            </p>
          </div>

          {purchaseHistory.length > 0 && (
            <button
              onClick={onViewAll}
              type="button"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 px-4 py-2 text-xs md:text-sm font-medium text-slate-700 dark:text-slate-300 transition hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-98"
            >
              View All
              <ArrowUpRight size={14} />
            </button>
          )}
        </div>

        {/* Data Condition Wrapper rendering logical steps */}
        {purchaseHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-slate-400 mb-3">
              <CreditCard size={28} />
            </div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              No Transactions Yet
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 max-w-xs mt-1">
              Your processed financial logs and subscription package receipts
              will appear directly inside this interface.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-slate-600 dark:text-slate-300">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-400">
                  <th className="px-6 py-4 text-left">Date</th>
                  <th className="px-6 py-4 text-left">Credits</th>
                  <th className="px-6 py-4 text-left">Amount</th>
                  <th className="px-6 py-4 text-left">Transaction ID</th>
                  <th className="px-6 py-4 text-left">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm">
                {purchaseHistory.map((item) => (
                  <tr
                    key={item.id}
                    className="transition hover:bg-slate-50/60 dark:hover:bg-slate-800/20"
                  >
                    <td className="px-6 py-4.5 whitespace-nowrap text-slate-500 dark:text-slate-400">
                      {item.date}
                    </td>

                    <td className="px-6 py-4.5 font-bold text-slate-900 dark:text-white">
                      {item.credits.toLocaleString()}
                    </td>

                    <td className="px-6 py-4.5 font-semibold text-slate-800 dark:text-slate-200">
                      ${item.amount}
                    </td>

                    <td className="px-6 py-4.5 font-mono text-xs text-slate-400 dark:text-slate-500">
                      {item.transactionId}
                    </td>

                    <td className="px-6 py-4.5 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                          item.status === "Completed"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400"
                            : item.status === "Pending"
                              ? "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400"
                              : "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                            item.status === "Completed"
                              ? "bg-emerald-500"
                              : item.status === "Pending"
                                ? "bg-amber-500"
                                : "bg-red-500"
                          }`}
                        />
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.section>
    </div>
  );
}
