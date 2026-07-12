"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.password || !formData.confirmPassword) {
      setError("Both password fields are required.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!token) {
      setError("Missing reset token.");
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await authClient.resetPassword({
        token,
        newPassword: formData.password,
      });

      if (error) {
        setError(error.message || "Failed to reset password.");
        return;
      }

      if (!data?.status) {
        setError("Failed to reset password.");
        return;
      }

      setSuccess("Password reset successfully.");
      setTimeout(() => {
        router.push("/auth/login");
      }, 1200);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to reset password.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-gray-50 text-gray-900 transition-colors duration-300 dark:bg-slate-950 dark:text-white">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-[#3B3B98]/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />
      </div>

      <div className="container mx-auto flex min-h-screen items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="card w-full max-w-md rounded-3xl border border-gray-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
        >
          <form onSubmit={handleSubmit} className="card-body">
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#3B3B98] text-3xl text-white shadow-lg">
              🔒
            </div>

            <h1 className="text-center text-3xl font-bold">Reset Password</h1>

            <p className="mb-6 text-center text-gray-500 dark:text-gray-400">
              Enter a new password for your account.
            </p>

            <label className="label">
              <span className="label-text">New Password</span>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="New password"
              className="input input-bordered w-full"
              required
            />

            <label className="label mt-4">
              <span className="label-text">Confirm Password</span>
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm new password"
              className="input input-bordered w-full"
              required
            />

            {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
            {success && (
              <p className="mt-4 text-sm text-green-600">{success}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn mt-6 border-0 bg-[#3B3B98] text-white hover:bg-[#2E2E7A] disabled:opacity-70"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>

            <div className="divider">OR</div>

            <Link
              href="/auth/login"
              className="btn btn-outline border-[#3B3B98] text-[#3B3B98] hover:bg-[#3B3B98] hover:text-white"
            >
              Back to Login
            </Link>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
