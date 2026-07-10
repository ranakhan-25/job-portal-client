"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function LoginPage() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-gray-50 text-gray-900 transition-colors duration-300 dark:bg-[#0f172a] dark:text-white">

      {/* Background Blur */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-[#3B3B98]/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />
      </div>

      <div className="container mx-auto flex min-h-screen items-center justify-center px-6 py-10">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="card w-full max-w-md rounded-3xl border border-gray-200 bg-white shadow-2xl transition-all dark:border-slate-700 dark:bg-slate-900"
        >
          <div className="card-body">

            {/* Logo */}
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#3B3B98] text-3xl text-white shadow-lg">
              💼
            </div>

            <h1 className="text-center text-3xl font-bold text-gray-900 dark:text-white">
              Welcome Back
            </h1>

            <p className="mb-6 text-center text-gray-500 dark:text-gray-400">
              Login to continue your job search.
            </p>

            {/* Email */}
            <label className="label">
              <span className="label-text font-medium text-gray-700 dark:text-gray-200">
                Email Address
              </span>
            </label>

            <input
              type="email"
              placeholder="you@example.com"
              className="input input-bordered w-full border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:border-[#3B3B98] dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder:text-gray-500"
            />

            {/* Password */}
            <label className="label mt-4">
              <span className="label-text font-medium text-gray-700 dark:text-gray-200">
                Password
              </span>

              <Link
                href="/auth/forgot-password"
                className="label-text font-medium text-[#3B3B98] hover:underline"
              >
                Forgot?
              </Link>
            </label>

            <input
              type="password"
              placeholder="••••••••"
              className="input input-bordered w-full border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:border-[#3B3B98] dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder:text-gray-500"
            />

            {/* Remember */}
            <div className="mt-4 flex items-center justify-between">

              <label className="label cursor-pointer gap-2">

                <input
                  type="checkbox"
                  className="checkbox border-[#3B3B98] checked:bg-[#3B3B98]"
                />

                <span className="label-text text-gray-700 dark:text-gray-300">
                  Remember me
                </span>

              </label>

            </div>

            {/* Login Button */}
            <button className="btn mt-6 border-0 bg-[#3B3B98] text-white hover:bg-[#2E2E7A]">
              Login
            </button>

            {/* Divider */}
            <div className="divider text-gray-500 dark:text-gray-400">
              OR
            </div>

            {/* Google */}
            <button className="btn border-gray-300 bg-white text-gray-700 hover:border-[#3B3B98] hover:bg-[#3B3B98] hover:text-white dark:border-slate-600 dark:bg-slate-800 dark:text-white">

              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 48 48"
              >
                <path
                  fill="#FFC107"
                  d="M43.6 20.5H42V20H24v8h11.3C33.6 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12S17.4 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z"
                />
              </svg>

              Continue with Google

            </button>

            {/* Register */}
            <p className="mt-6 text-center text-gray-600 dark:text-gray-400">
              Don&apos;t have an account?{" "}

              <Link
                href="/auth/signin"
                className="font-semibold text-[#3B3B98] hover:underline"
              >
                Create Account
              </Link>

            </p>

          </div>
        </motion.div>

      </div>
    </section>
  );
}