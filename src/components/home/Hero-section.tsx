"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-base-100 dark:bg-black ">
      {/* Background Blur */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-0 top-20 h-80 w-80 rounded-full bg-[#3B3B98]/10 blur-3xl" />

        <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-[#3B3B98]/10 blur-3xl" />
      </div>

      <div className="container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-5xl text-center"
        >
          {/* Badge */}

          <span className="inline-flex items-center rounded-full border border-[#3B3B98]/20 bg-[#3B3B98]/10 px-5 py-2 text-sm font-semibold text-[#3B3B98]">
            🚀 Trusted by 5,000+ Companies Worldwide
          </span>

          {/* Heading */}

          <h1 className="mt-8 text-5xl font-black leading-tight md:text-7xl">
            Find Your{" "}
            <motion.span
              initial={{
                x: -150,
                opacity: 0,
              }}
              animate={{
                x: 0,
                opacity: 1,
              }}
              transition={{
                duration: 0.8,
                delay: 0.3,
                ease: "easeOut",
              }}
              className="block text-[#3B3B98]"
            >
              Dream Job
            </motion.span>
            Build Your Career
          </h1>

          {/* Description */}

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-500">
            Discover thousands of verified opportunities from leading companies.
            Search jobs, connect with employers and take the next step toward
            your dream career.
          </p>

          {/* Search */}

          <div className="mx-auto mt-12 max-w-5xl rounded-xl border p-4 shadow-2xl">
            <div className="grid gap-4 lg:grid-cols-4">
              <input
                type="text"
                placeholder="🔍 Job title or keyword"
                className="input input-bordered w-full dark:bg-[#3b3b982b]"
              />

              <input
                type="text"
                placeholder="📍 Location"
                className="input input-bordered w-full dark:bg-[#3b3b982b]"
              />

              <select className="select select-bordered w-full dark:bg-[#0d0d1a]">
                <option>Job Type</option>
                <option>Remote</option>
                <option>Full Time</option>
                <option>Part Time</option>
                <option>Internship</option>
              </select>

              <button className="btn bg-[#3B3B98] border-0 text-white hover:bg-[#2E2E7A]">
                Search Jobs
              </button>
            </div>
          </div>

          {/* Buttons */}

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/jobs"
              className="btn bg-[#3B3B98] border-0 px-8 text-white hover:bg-[#2E2E7A]"
            >
              Browse Jobs
            </Link>

            <Link
              href="/companies"
              className="btn btn-outline border-[#3B3B98] px-8 text-[#3B3B98] hover:bg-[#3B3B98] hover:text-white"
            >
              Explore Companies
            </Link>
          </div>
        </motion.div>

        {/* Floating Cards */}

        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ repeat: Infinity, duration: 4 }}
          className="absolute left-10 top-44 hidden rounded-2xl border border-base-300 dark:border-[#27274954] bg-base-100 dark:bg-[#27274954] p-5 shadow-xl xl:block"
        >
          <p className="text-sm text-base-content/60 dark:text-white">
            💼 Jobs Posted Today
          </p>

          <h3 className="mt-2 text-3xl font-bold text-[#3B3B98]">150+</h3>
        </motion.div>

        <motion.div
          animate={{ y: [0, 15, 0] }}
          transition={{ repeat: Infinity, duration: 5 }}
          className="absolute right-10 top-60 hidden rounded-2xl border border-base-300 bg-base-100 p-5 shadow-xl xl:block dark:border-[#27274954] dark:bg-[#27274954]"
        >
          <p className="text-sm text-base-content/60 dark:text-white">
            🌍 Remote Jobs
          </p>

          <h3 className="mt-2 text-2xl font-bold text-[#3B3B98]">Worldwide</h3>
        </motion.div>
      </div>
    </section>
  );
}
