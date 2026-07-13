"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  HeartHandshake,
  Coins,
  Target,
  Calendar,
  ArrowRight,
  Sparkles,
  Search,
  Loader2,
} from "lucide-react";

// TypeScript integration standard shape match (Optional but highly recommended)
interface ContributionItem {
  id: number;
  campaign: string;
  company: string;
  image: string;
  credits: number;
  date: string;
  transaction: string;
  status: "Completed" | "Pending" | "Refunded" | string;
}

export default function MyContributions() {
  // State definitions
  const [contributions, setContributions] = useState<ContributionItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetching data from API
  useEffect(() => {
    const fetchContributions = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/contributions");

        if (!response.ok) {
          throw new Error("Failed to fetch contributions data.");
        }

        const data = await response.json();
        setContributions(data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message || "Failed to fetch contributions data.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchContributions();
  }, []);

  // Simple statistics calculations from active dynamic data
  const totalCredits = contributions.reduce(
    (sum, item) => sum + item.credits,
    0,
  );
  const completedCount = contributions.filter(
    (item) => item.status === "Completed",
  ).length;
  const pendingCount = contributions.filter(
    (item) => item.status === "Pending",
  ).length;
  const refundedCount = contributions.filter(
    (item) => item.status === "Refunded",
  ).length;

  return (
    <div className="space-y-8 max-h-screen overflow-auto">
      {/* ================================================= */}
      {/* Hero Section */}
      {/* ================================================= */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-indigo-950 via-slate-900 to-violet-950 p-8 border border-white/5 lg:p-14 shadow-2xl"
      >
        {/* Dynamic Floating Aura Circles (Unique Background Layer) */}
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            x: [0, 15, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-indigo-500/15 blur-[80px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, -25, 0],
            y: [0, 15, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute -bottom-32 right-10 h-[450px] w-[450px] rounded-full bg-cyan-500/10 blur-[100px]"
        />

        {/* Subtle Grid overlay for Tech Aesthetic */}
        <div className="absolute inset-0 opacity-5 mix-blend-overlay pointer-events-none">
          <div className="h-full w-full bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]" />
        </div>

        <div className="relative z-10 flex flex-col gap-12 lg:flex-row lg:items-center lg:justify-between">
          {/* Left Content Side */}
          <div className="flex-1 max-w-3xl">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-2 backdrop-blur-md"
            >
              <Sparkles size={14} className="text-cyan-400 animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-200">
                Impact Dashboard
              </span>
            </motion.div>

            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-white lg:text-6xl leading-[1.1]">
              Your Support
              <span className="block mt-2 bg-gradient-to-r from-cyan-300 via-teal-200 to-indigo-200 bg-clip-text text-transparent">
                Shapes The Future
              </span>
            </h1>

            <p className="mt-6 text-base lg:text-lg leading-relaxed text-slate-300/90 max-w-xl">
              Track every ecosystem campaign you have backed, manage structural
              credit lifecycles, and witness live transparency benchmarks driven
              by your activity.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-500 px-6 py-3.5 font-semibold text-white transition-all duration-300 hover:opacity-90 hover:shadow-[0_0_25px_rgba(6,182,212,0.3)] hover:translate-y-[-2px]">
                Explore Campaigns
                <ArrowRight size={18} />
              </button>
            </div>
          </div>

          {/* Right Interactive Card (Premium Glassmorphism) */}
          <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-2xl saturate-150 shadow-[0_20px_50px_rgba(0,0,0,0.3)] lg:w-[360px]"
          >
            <div className="absolute top-0 right-0 h-32 w-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

            <p className="text-sm font-medium tracking-wide text-slate-400 uppercase">
              Total Generated Power
            </p>

            <div className="mt-4 flex items-baseline gap-2">
              <h2 className="text-5xl font-black tracking-tight text-white lg:text-6xl">
                {loading ? (
                  <span className="inline-block h-12 w-32 animate-pulse rounded-xl bg-white/10" />
                ) : (
                  totalCredits.toLocaleString()
                )}
              </h2>
              {!loading && (
                <span className="text-sm font-bold text-cyan-400 uppercase">
                  CRD
                </span>
              )}
            </div>

            <div className="mt-6 border-t border-white/5 pt-4">
              <p className="text-xs leading-relaxed text-slate-400">
                Thank you for being a core node in supporting meaningful
                real-world operations. ❤️
              </p>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* ================================================= */}
      {/* Statistics */}
      {/* ================================================= */}
      <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <motion.div
          whileHover={{ y: -8 }}
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-pink-100 dark:bg-pink-500/20">
            <HeartHandshake className="text-pink-600" size={30} />
          </div>
          <h3 className="mt-6 text-4xl font-black dark:text-white">
            {loading ? "..." : contributions.length}
          </h3>
          <p className="mt-2 text-slate-500">Total Contributions</p>
        </motion.div>

        <motion.div
          whileHover={{ y: -8 }}
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 dark:bg-indigo-500/20">
            <Coins className="text-indigo-600" size={30} />
          </div>
          <h3 className="mt-6 text-4xl font-black dark:text-white">
            {loading ? "..." : totalCredits.toLocaleString()}
          </h3>
          <p className="mt-2 text-slate-500">Credits Used</p>
        </motion.div>

        <motion.div
          whileHover={{ y: -8 }}
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-500/20">
            <Target className="text-emerald-600" size={30} />
          </div>
          <h3 className="mt-6 text-4xl font-black dark:text-white">
            {loading ? "..." : completedCount}
          </h3>
          <p className="mt-2 text-slate-500">Campaigns Completed</p>
        </motion.div>

        <motion.div
          whileHover={{ y: -8 }}
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-500/20">
            <Calendar className="text-amber-600" size={30} />
          </div>
          <h3 className="mt-6 text-4xl font-black dark:text-white">
            {loading ? "..." : pendingCount}
          </h3>
          <p className="mt-2 text-slate-500">Pending Approvals</p>
        </motion.div>
      </section>

      {/* ================================================= */}
      {/* Search & Filter */}
      {/* ================================================= */}
      <motion.section
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
      >
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="relative w-full xl:max-w-md">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search campaign..."
              className="h-12 w-full rounded-xl border border-slate-300 bg-white pl-11 pr-4 outline-none transition focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <select className="h-12 rounded-xl border border-slate-300 bg-white px-4 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white">
              <option>All Status</option>
              <option>Completed</option>
              <option>Pending</option>
              <option>Refunded</option>
            </select>

            <select className="h-12 rounded-xl border border-slate-300 bg-white px-4 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white">
              <option>Latest</option>
              <option>Oldest</option>
              <option>Highest Credits</option>
              <option>Lowest Credits</option>
            </select>

            <button className="rounded-xl bg-indigo-600 px-6 text-white transition hover:bg-indigo-700">
              Apply
            </button>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-4 border-t border-slate-200 pt-5 dark:border-slate-800 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Contribution History
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Showing{" "}
              <span className="mx-1 font-semibold text-indigo-600">
                {contributions.length}
              </span>{" "}
              contributions
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
              Completed: {completedCount}
            </span>
            <span className="rounded-full bg-amber-100 px-4 py-2 text-sm font-medium text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
              Pending: {pendingCount}
            </span>
            <span className="rounded-full bg-red-100 px-4 py-2 text-sm font-medium text-red-700 dark:bg-red-500/20 dark:text-red-300">
              Refunded: {refundedCount}
            </span>
          </div>
        </div>
      </motion.section>

      {/* ================================================= */}
      {/* Data Render Conditions (Loading, Error, Empty & Cards) */}
      {/* ================================================= */}
      {loading ? (
        // Loading Spinner/State
        <div className="flex flex-col items-center justify-center p-12 space-y-4">
          <Loader2 className="animate-spin text-indigo-600" size={40} />
          <p className="text-slate-500 animate-pulse">
            Loading contributions data...
          </p>
        </div>
      ) : error ? (
        // Error handling fallback
        <div className="text-center p-8 bg-red-50 text-red-600 rounded-3xl dark:bg-red-950/20 dark:text-red-400">
          <p className="font-semibold">{error}</p>
        </div>
      ) : contributions.length > 0 ? (
        // Safe mapping using .slice() instead of destructive .splice()
        <section className="space-y-6">
          {contributions.slice(0, 3).map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="grid lg:grid-cols-4">
                <div className="relative h-64 lg:h-full">
                  <img
                    src={item.image}
                    alt={item.campaign}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute left-4 top-4 rounded-full bg-white/90 dark:bg-black/80 px-3 py-1 text-sm font-semibold backdrop-blur">
                    {item.company}
                  </div>
                </div>

                <div className="space-y-6 p-8 lg:col-span-3">
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                        {item.campaign}
                      </h2>
                      <p className="mt-2 text-slate-500 dark:text-slate-400">
                        Supported Organization
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-4 py-2 text-sm font-semibold ${
                        item.status === "Completed"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
                          : item.status === "Pending"
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300"
                            : "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <div className="grid gap-6 md:grid-cols-3">
                    <div>
                      <p className="text-sm text-slate-500">Credits</p>
                      <h3 className="mt-2 text-2xl font-bold text-indigo-600">
                        {item.credits}
                      </h3>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">
                        Contribution Date
                      </p>
                      <h3 className="mt-2 text-lg font-semibold dark:text-white">
                        {item.date}
                      </h3>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Transaction ID</p>
                      <h3 className="mt-2 font-semibold text-slate-700 dark:text-slate-300">
                        {item.transaction}
                      </h3>
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm text-slate-500">
                        Contribution Progress
                      </span>
                      <span className="text-sm font-semibold text-indigo-600">
                        100%
                      </span>
                    </div>
                    <div className="h-3 rounded-full bg-slate-200 dark:bg-slate-800">
                      <div className="h-full w-full rounded-full bg-gradient-to-r from-indigo-600 via-violet-600 to-sky-500" />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <button className="rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700">
                      View Campaign
                    </button>
                    <button className="rounded-xl border border-slate-300 px-6 py-3 font-semibold transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800">
                      Download Receipt
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </section>
      ) : (
        // Empty State
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center dark:border-slate-700 dark:bg-slate-900/50"
        >
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-500/20">
            <HeartHandshake
              size={42}
              className="text-indigo-600 dark:text-indigo-400"
            />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-slate-900 dark:text-white">
            No Contributions Found
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-500 dark:text-slate-400">
            Explore more campaigns and continue supporting meaningful projects
            around the world.
          </p>
          <button className="mt-8 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700 hover:scale-105">
            Explore Campaigns <ArrowRight size={18} />
          </button>
        </motion.section>
      )}

      {/* ================================================= */}
      {/* Pagination */}
      {/* ================================================= */}
      {!loading && !error && contributions.length > 0 && (
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-between gap-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:flex-row"
        >
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Showing{" "}
            <span className="font-semibold">
              1 - {Math.min(3, contributions.length)}
            </span>{" "}
            of <span className="font-semibold">{contributions.length}</span>{" "}
            contributions
          </p>

          <div className="flex items-center gap-2">
            <button className="rounded-xl border border-slate-300 px-4 py-2 transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800">
              Previous
            </button>
            <button className="h-10 w-10 rounded-xl bg-indigo-600 font-semibold text-white">
              1
            </button>
            <button className="h-10 w-10 rounded-xl border border-slate-300 transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800">
              2
            </button>
            <button className="h-10 w-10 rounded-xl border border-slate-300 transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800">
              3
            </button>
            <button className="rounded-xl border border-slate-300 px-4 py-2 transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800">
              Next
            </button>
          </div>
        </motion.section>
      )}
    </div>
  );
}
