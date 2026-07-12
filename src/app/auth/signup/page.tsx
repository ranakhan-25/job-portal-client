"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  bio: string;
}

type SignUpEmailBody = Parameters<(typeof authClient)["signUp"]["email"]>[0];

type UserRole = "user" | "company";

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>("user");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [formData, setFormData] = useState<RegisterForm>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    bio: "",
  });

  // ==============================
  // Handle Input Change
  // ==============================

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==============================
  // Handle Image Change
  // ==============================

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setImageFile(file);

    setImagePreview(URL.createObjectURL(file));
  };

  // ==============================
  // Upload Image to ImgBB
  // ==============================

  const uploadImage = async (): Promise<string> => {
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

    if (!response.ok) {
      throw new Error("Image upload failed.");
    }

    const result = await response.json();

    return result.data.display_url;
  };

  // ==============================
  // Google Login
  // ==============================

  const handleGoogleLogin = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch {
      toast.error("Google Login Failed");
    }
  };

  // ==============================
  // Register Submit
  // ==============================

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setMessage("");

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    if (formData.name.trim().length < 3) {
      setMessage("Name must be at least 3 characters.");
      return;
    }

    if (!formData.phone.trim()) {
      setMessage("Phone number is required.");
      return;
    }

    if (!formData.bio.trim()) {
      setMessage("A short bio is required.");
      return;
    }

    try {
      setLoading(true);

      let avatar = "";

      if (imageFile) {
        avatar = await uploadImage();
      }

      const signUpPayload = {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        image: avatar || undefined,
        role,
        phone: formData.phone,
        bio: formData.bio,
        callbackURL: "/auth/login",
      } as unknown as SignUpEmailBody;

      const result = await authClient.signUp.email(signUpPayload);

      if (result.error) {
        setMessage(result.error?.message || "Registration failed.");
        return;
      }

      toast.success("Registration Successful!");
      router.push("/auth/login");
    } catch (error) {
      if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage("Something went wrong.");
      }
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

            <p className="mb-6 text-center text-gray-500 dark:text-gray-400">
              Join the Job Portal today 🚀
            </p>

            {/* Name */}

            <label className="label">
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

            <label className="label mt-4">
              <span className="label-text dark:text-gray-200">
                Email Address
              </span>
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              required
              className="input input-bordered w-full dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            />

            {/* Password */}

            <label className="label mt-4">
              <span className="label-text dark:text-gray-200">Password</span>
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter password"
                className="input input-bordered w-full pr-16 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-[#3B3B98]"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {/* Confirm Password */}

            <label className="label mt-4">
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
                placeholder="Confirm password"
                className="input input-bordered w-full pr-16 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-[#3B3B98]"
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>

            {/* Profile Image */}

            <div className="mt-6">
              <label className="mb-2 block text-sm font-medium dark:text-gray-200">
                Profile Image
              </label>

              <label className="flex cursor-pointer items-center gap-4 rounded-xl border border-dashed border-[#3B3B98] p-4 transition hover:bg-gray-50 dark:hover:bg-slate-800">
                {imagePreview ? (
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    width={60}
                    height={60}
                    className="h-16 w-16 rounded-full border object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border bg-gray-100 dark:bg-slate-800">
                    📷
                  </div>
                )}

                <div>
                  <p className="font-medium">Upload Profile Photo</p>

                  <p className="text-sm text-gray-500">JPG, PNG, JPEG</p>
                </div>

                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            </div>

            {/* <label className="label mt-4">
              <span className="label-text dark:text-gray-200">
                Phone Number
              </span>
            </label> */}

            {/* <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="017XXXXXXXX"
              required
              className="input input-bordered w-full dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            /> */}

            {/* Bio */}

            {/* <label className="label mt-4">
              <span className="label-text dark:text-gray-200">
                Short Bio
              </span>
            </label>

            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              placeholder="Tell us something about yourself..."
              className="textarea textarea-bordered w-full dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            /> */}

            {/* Phone */}

            <label className="label mt-4">
              <span className="label-text dark:text-gray-200">
                Phone Number
              </span>
            </label>

            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="017XXXXXXXX"
              required
              className="input input-bordered w-full dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            />

            {/* Bio */}

            <label className="label mt-4">
              <span className="label-text dark:text-gray-200">Short Bio</span>
            </label>

            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              placeholder="Tell us something about yourself..."
              className="textarea textarea-bordered w-full dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            />

            {/* Role */}

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Select Role</label>

              <div className="grid grid-cols-2 gap-2">
                {(["user", "company"] as UserRole[]).map((item) => (
                  <label
                    key={item}
                    className={`text-center py-2 rounded-lg border cursor-pointer text-sm transition ${
                      role === item
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-gray-50 dark:bg-gray-800"
                    }`}
                  >
                    <input
                      type="radio"
                      value={item}
                      checked={role === item}
                      onChange={(e) => setRole(e.target.value as UserRole)}
                      className="hidden"
                    />
                    {item}
                  </label>
                ))}
              </div>
            </div>

            {/* Terms */}

            <div className="mt-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  className="checkbox checkbox-primary"
                />

                <span className="text-sm text-gray-600 dark:text-gray-300">
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="font-semibold text-[#3B3B98] hover:underline"
                  >
                    Terms & Conditions
                  </Link>
                </span>
              </label>
            </div>

            {/* Error Message */}

            {message && (
              <div className="mt-5 rounded-lg bg-red-100 px-4 py-3 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400">
                {message}
              </div>
            )}

            {/* Register Button */}

            <button
              type="submit"
              disabled={loading}
              className="btn mt-6 border-0 bg-[#3B3B98] text-white hover:bg-[#2f2f84] disabled:cursor-not-allowed disabled:opacity-70"
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

            <div className="divider text-gray-500">OR</div>

            {/* Google Login */}

            <button
              type="button"
              onClick={handleGoogleLogin}
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

            {/* Login */}

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
