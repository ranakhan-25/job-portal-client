"use client";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { auth } from "@/lib/auth/firebase";

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: "jobSeeker" | "recruiter";
}

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [imagePreview, setImagePreview] = useState<string>("");

  const [error, setError] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [formData, setFormData] = useState<RegisterForm>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "jobSeeker",
  });

  // Handle Text Input

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle Role

  const handleRoleChange = (role: "jobSeeker" | "recruiter") => {
    setFormData((prev) => ({
      ...prev,
      role,
    }));
  };

  // Handle Image

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setImageFile(file);

    setImagePreview(URL.createObjectURL(file));
  };

  // Upload Image to ImgBB

  const uploadImage = async () => {
    if (!imageFile) return "";

    const data = new FormData();

    data.append("image", imageFile);

    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_KEY}`,
      {
        method: "POST",
        body: data,
      },
    );

    const result = await response.json();

    return result.data.url;
  };

  // Submit

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Password doesn't match");

      return;
    }
    if (formData.name.trim().length < 3) {
      setError("Name must be at least 3 characters long.");
      return;
    }

    setLoading(true);

    try {
      const avatar = await uploadImage();

      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        image: avatar,
      };

      console.log(userData);
      createUserWithEmailAndPassword(auth, userData.email, userData.password)
        .then((userCredential) => {
          const user = userCredential.user;
          console.log(user);
        })
        .catch((error) => {
          console.log(error);
          setError(error.message);
        });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-gray-50 transition-colors duration-300 dark:bg-slate-950">
      {/* Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-[#3B3B98]/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />
      </div>

      <div className="container mx-auto flex min-h-screen items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="card w-full max-w-lg rounded-3xl border border-gray-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
        >
          <form onSubmit={handleSubmit} className="card-body">
            <h2 className="text-center text-3xl font-bold text-gray-900 dark:text-white">
              Create Account
            </h2>
            <p className="mb-4 text-center text-gray-500 dark:text-gray-400">
              Join the Job Portal today 🚀
            </p>
            {/* Name */}
            <label className="label mt-5">
              <span className="label-text dark:text-gray-200">Full Name</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              required
              className="input input-bordered w-full dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            />
            {/* Email */}
            <label className="label mt-3">
              <span className="label-text dark:text-gray-200">Email</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@gmail.com"
              required
              className="input input-bordered w-full dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            />
            {/* Password */}
            <label className="label mt-3">
              <span className="label-text dark:text-gray-200">Password</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="input input-bordered w-full pr-14 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3 text-sm text-[#3B3B98]"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {/* Confirm Password */}
            <label className="label mt-3">
              <span className="label-text dark:text-gray-200">
                Confirm Password
              </span>
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="input input-bordered w-full pr-14 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
              />

              {/* Avatar */}
              <div className="my-2 mt-5">
                <label className="cursor-pointer ">
                  Image
                  <div className="mt-2 flex items-center h-10 w-full overflow-hidden  border rounded pl-4 border-[#3B3B98] bg-gray-100 dark:bg-slate-800">
                    {imagePreview ? (
                      <Image
                        src={imagePreview}
                        alt="preview"
                        width={100}
                        height={100}
                        className="h-full w-10 object-cover"
                      />
                    ) : (
                      <span className="text-sm text-gray-500 w-full">
                        Upload
                      </span>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleImageChange}
                  />
                </label>
              </div>
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-3 text-sm text-[#3B3B98]"
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>
            {/* Role */}
            <label className="label mt-5">
              <span className="label-text dark:text-gray-200">Register As</span>
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleRoleChange("jobSeeker")}
                className={`rounded-xl border p-4 transition ${
                  formData.role === "jobSeeker"
                    ? "border-[#3B3B98] bg-[#3B3B98] text-white"
                    : "border-gray-300 dark:border-slate-600"
                }`}
              >
                👨‍💼 Job Seeker
              </button>

              <button
                type="button"
                onClick={() => handleRoleChange("recruiter")}
                className={`rounded-xl border p-4 transition ${
                  formData.role === "recruiter"
                    ? "border-[#3B3B98] bg-[#3B3B98] text-white"
                    : "border-gray-300 dark:border-slate-600"
                }`}
              >
                🏢 Recruiter
              </button>
            </div>{" "}
            {/* Terms & Conditions */}
            <div className="mt-5">
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  required
                  className="checkbox checkbox-primary"
                />

                <span className="text-sm text-gray-600 dark:text-gray-300">
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="font-medium text-[#3B3B98] hover:underline"
                  >
                    Terms & Conditions
                  </Link>
                </span>
              </label>
            </div>
            <div>{error && <p className="text-red-500 my-3">{error}</p>}</div>
            {/* Register Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn mt-6 border-0 bg-[#3B3B98] text-white hover:bg-[#2E2E7A] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
            {/* Divider */}
            <div className="divider text-gray-500 dark:text-gray-400">OR</div>
            {/* Google Button */}
            <button
              type="button"
              className="btn border-gray-300 bg-white text-gray-700 hover:border-[#3B3B98] hover:bg-[#3B3B98] hover:text-white dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                className="h-5 w-5"
              >
                <path
                  fill="#FFC107"
                  d="M43.6 20.5H42V20H24v8h11.3C33.6 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12S17.4 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z"
                />
              </svg>
              Continue with Google
            </button>
            {/* Login Link */}
            <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="font-semibold text-[#3B3B98] hover:underline"
              >
                Login
              </Link>
            </p>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
