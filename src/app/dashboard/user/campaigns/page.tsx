"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Search,
  Sparkles,
  Users,
} from "lucide-react";

// Explicit TypeScript typing definitions
interface FeaturedCompany {
  name: string;
  description: string;
  raisedAmount: string;
  profileId: string | number;
}

interface CompanyHeroStats {
  verifiedCompanies: string | number;
  companiesGrowth: string;
  activeSupporters: string | number;
  successfulCampaigns: string | number;
}

interface CompanyHeroProps {
  stats?: CompanyHeroStats;
  featuredCompany?: FeaturedCompany;
  onSearch?: (searchQuery: string) => void;
  onBrowseCampaigns?: () => void;
  onViewFeaturedProfile?: (id: string | number) => void;
}

export default function CompanyHero({
  stats = {
    verifiedCompanies: "120+",
    companiesGrowth: "+12%",
    activeSupporters: "15K+",
    successfulCampaigns: "980+",
  },
  featuredCompany = {
    name: "GreenTech Foundation",
    description: "Building sustainable technology projects to create a greener future.",
    raisedAmount: "250K+",
    profileId: "greentech-01",
  },
  onSearch,
  onBrowseCampaigns,
  onViewFeaturedProfile,
}: CompanyHeroProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  return (
    <section className="relative rounded-3xl border border-slate-200 dark:border-[#3B3B98]/20 bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-50 transition-colors duration-300 max-h-screen overflow-auto">
      {/* ================= Background Blobs & Grid ================= */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Soft Glowing Midnight Blue Orb (Top Left) */}
        <motion.div
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 10,
            ease: "easeInOut",
          }}
          className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-[#3B3B98]/10 dark:bg-[#3B3B98]/5 blur-3xl"
        />

        {/* Soft Glowing Tint Orb (Bottom Right) */}
        <motion.div
          animate={{
            x: [0, -20, 0],
            y: [0, 20, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 12,
            ease: "easeInOut",
          }}
          className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-[#3B3B98]/10 dark:bg-[#3B3B98]/5 blur-3xl"
        />

        {/* Minimal Grid Pattern for Depth */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02]">
          <div className="h-full w-full bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:40px_40px]" />
        </div>
      </div>

      {/* ================= Content Container ================= */}
      <div className="relative z-10 grid gap-12 px-6 py-14 2xl:grid-cols-2 lg:px-14 lg:py-24">
        
        {/* ================= Left Side (Hero Copy) ================= */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-col justify-center"
        >
          {/* Badge using #3B3B98 Tint */}
          <div className="inline-flex self-start items-center gap-2 rounded-full border border-[#3B3B98]/20 dark:border-[#3B3B98]/10 bg-[#3B3B98]/5 px-4 py-1.5">
            <BadgeCheck size={16} className="text-[#3B3B98] dark:text-[#5757cf]" />
            <span className="text-xs font-semibold tracking-wide uppercase text-[#3B3B98] dark:text-[#8e8ee6]">
              Trusted Company Directory
            </span>
          </div>

          {/* Heading with #3B3B98 Gradient */}
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white md:text-5xl xl:text-6xl leading-[1.15]">
            Discover{" "}
            <span className="block mt-1 bg-gradient-to-r from-[#3B3B98] to-[#5757cf] dark:from-[#8e8ee6] dark:to-slate-200 bg-clip-text text-transparent">
              Amazing Companies
            </span>
            To Support
          </h1>

          {/* Description */}
          <p className="mt-6 max-w-xl text-base md:text-lg leading-relaxed text-slate-600 dark:text-zinc-400">
            Browse verified companies and creators from different industries.
            Explore their campaigns, learn their mission, and support projects
            that create real impact.
          </p>

          {/* Search Box Form implementation */}
          <motion.form
            onSubmit={handleSearchSubmit}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            viewport={{ once: true }}
            className="mt-8 max-w-xl"
          >
            <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-2 shadow-xl shadow-slate-200/50 dark:shadow-none md:flex-row">
              <div className="relative flex-1">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search companies, startups or creators..."
                  className="h-12 w-full rounded-xl bg-transparent pl-11 pr-4 text-sm text-slate-800 dark:text-zinc-100 outline-none transition"
                />
              </div>

              {/* Main Search Button (#3B3B98) */}
              <button 
                type="submit"
                className="h-12 rounded-xl bg-[#3B3B98] px-6 text-sm font-semibold text-white transition-all hover:bg-[#2c2c77] active:scale-98 shadow-md shadow-[#3B3B98]/20"
              >
                Search
              </button>
            </div>
          </motion.form>

          {/* Secondary CTA Actions */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
            className="mt-6 flex flex-wrap gap-4"
          >
            <button 
              onClick={onBrowseCampaigns}
              type="button"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-5 py-3 text-sm font-medium text-slate-700 dark:text-zinc-300 transition-all hover:bg-slate-50 dark:hover:bg-zinc-800 active:scale-98"
            >
              Browse Campaigns
              <ArrowRight size={16} className="text-slate-400" />
            </button>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-10 flex flex-wrap gap-x-6 gap-y-3 border-t border-slate-200 dark:border-zinc-900 pt-6"
          >
            <div className="flex items-center gap-2 text-slate-600 dark:text-zinc-400">
              <Sparkles size={16} className="text-amber-500" />
              <span className="text-xs font-medium">100% Verified Creators</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600 dark:text-zinc-400">
              <BadgeCheck size={16} className="text-emerald-500" />
              <span className="text-xs font-medium">Secure Contributions</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600 dark:text-zinc-400">
              <Users size={16} className="text-[#3B3B98] dark:text-[#8e8ee6]" />
              <span className="text-xs font-medium">Trusted by 15K+ Supporters</span>
            </div>
          </motion.div>
        </motion.div>

        {/* ================= Right Side (Stats & Feature Card) ================= */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid gap-4 sm:grid-cols-2 lg:h-fit my-auto"
        >
          {/* Card 1 */}
          <div className="rounded-2xl border border-slate-200/60 dark:border-zinc-900 bg-white dark:bg-zinc-900/50 p-6 shadow-sm shadow-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#3B3B98]/5 text-[#3B3B98] dark:text-[#8e8ee6]">
                <Building2 size={24} />
              </div>
              <span className="rounded-full bg-emerald-500/10 dark:bg-emerald-500/5 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                {stats.companiesGrowth}
              </span>
            </div>
            <h2 className="mt-6 text-4xl font-bold tracking-tight text-slate-950 dark:text-white">
              {stats.verifiedCompanies}
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">Verified Companies</p>
          </div>

          {/* Card 2 */}
          <div className="rounded-2xl border border-slate-200/60 dark:border-zinc-900 bg-white dark:bg-zinc-900/50 p-6 shadow-sm shadow-slate-100">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#3B3B98]/5 text-[#3B3B98] dark:text-[#8e8ee6]">
              <Users size={24} />
            </div>
            <h2 className="mt-6 text-4xl font-bold tracking-tight text-slate-950 dark:text-white">
              {stats.activeSupporters}
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">Active Supporters</p>
          </div>

          {/* Card 3 */}
          <div className="rounded-2xl border border-slate-200/60 dark:border-zinc-900 bg-white dark:bg-zinc-900/50 p-6 shadow-sm shadow-slate-100">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#3B3B98]/5 text-[#3B3B98] dark:text-[#8e8ee6]">
              <Sparkles size={24} />
            </div>
            <h2 className="mt-6 text-4xl font-bold tracking-tight text-slate-950 dark:text-white">
              {stats.successfulCampaigns}
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">Successful Campaigns</p>
          </div>

          {/* Featured Card */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            className="rounded-2xl border border-[#3B3B98]/20 dark:border-[#3B3B98]/30 bg-gradient-to-br from-[#3B3B98]/5 to-white dark:from-zinc-900 dark:to-zinc-900/40 p-6 shadow-md shadow-slate-100 dark:shadow-none flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-[#3B3B98]/10 dark:bg-[#3B3B98]/20 px-3 py-1 text-xs font-semibold text-[#3B3B98] dark:text-[#8e8ee6]">
                  Featured
                </span>
                <BadgeCheck className="text-[#3B3B98] dark:text-[#8e8ee6]" size={20} />
              </div>

              <h3 className="mt-4 text-xl font-bold text-slate-950 dark:text-white">{featuredCompany.name}</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-zinc-400">
                {featuredCompany.description}
              </p>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-slate-200/60 dark:border-zinc-800/60 pt-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">Raised</p>
                <h4 className="text-2xl font-black text-[#3B3B98] dark:text-[#8e8ee6]">{featuredCompany.raisedAmount}</h4>
              </div>

              <button 
                onClick={() => onViewFeaturedProfile && onViewFeaturedProfile(featuredCompany.profileId)}
                type="button"
                className="rounded-lg bg-[#3B3B98] hover:bg-[#2c2c77] px-4 py-2 text-xs font-semibold text-white transition active:scale-95"
              >
                View Profile
              </button>
            </div>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}