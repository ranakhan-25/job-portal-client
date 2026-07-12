"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FormEvent, useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    try {
      const redirectTo = `${window.location.origin}/auth/reset-password`;
      const { data, error } = await authClient.requestPasswordReset({
        email,
        redirectTo,
      });

      if (error) {
        throw new Error(error.message || "Failed to send reset link.");
      }

      alert(data?.message || "Password reset link has been sent.");
    } catch (error) {
      console.log(error);
      alert(
        error instanceof Error ? error.message : "Failed to send reset link.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gray-50 px-6 transition-colors duration-300 dark:bg-slate-950">
      {/* Background */}

      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-[#3B3B98]/20 blur-3xl" />

        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />
      </div>

      <motion.div
        initial={{
          opacity: 0,
          y: 40,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
        }}
        className="card w-full max-w-md rounded-3xl border border-gray-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
      >
        <form onSubmit={handleSubmit} className="card-body">
          {/* Icon */}

          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#3B3B98] text-3xl text-white">
            🔑
          </div>

          {/* Title */}

          <h1 className="text-center text-3xl font-bold text-gray-900 dark:text-white">
            Forgot Password
          </h1>

          <p className="mb-6 text-center text-gray-500 dark:text-gray-400">
            Enter your email address and we&apos;ll send you a password reset
            link.
          </p>

          {/* Email */}

          <label className="label">
            <span className="label-text text-gray-700 dark:text-gray-200">
              Email Address
            </span>
          </label>

          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="input input-bordered w-full border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:border-[#3B3B98] dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder:text-gray-500"
          />

          {/* Button */}

          <button
            disabled={loading}
            className="btn mt-6 border-0 bg-[#3B3B98] text-white hover:bg-[#2E2E7A]"
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Sending...
              </>
            ) : (
              "Send Reset Link"
            )}
          </button>

          <div className="divider text-gray-500 dark:text-gray-400">OR</div>

          {/* Back Login */}

          <Link
            href="/auth/login"
            className="btn btn-outline border-[#3B3B98] text-[#3B3B98] hover:bg-[#3B3B98] hover:text-white"
          >
            Back to Login
          </Link>
        </form>
      </motion.div>
    </section>
  );
}
