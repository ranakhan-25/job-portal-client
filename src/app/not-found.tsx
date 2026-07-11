"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">

      {/* Animated Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">

        <motion.div
          animate={{
            x: [0, 70, 0],
            y: [0, -40, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-10 top-20 h-72 w-72 rounded-full bg-[#3B3B98]/15 blur-3xl"
        />

        <motion.div
          animate={{
            x: [0, -70, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute right-10 bottom-10 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl"
        />

      </div>

      <div className="max-w-2xl text-center">

        {/* 404 */}
        <motion.h1
          initial={{ opacity: 0, scale: .5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: .8,
            type: "spring",
          }}
          className="text-8xl font-black tracking-wider text-[#3B3B98] md:text-[180px]"
        >
          404
        </motion.h1>

        {/* Title */}

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: .2,
          }}
          className="mt-3 text-3xl font-bold  md:text-5xl"
        >
          Oops! Page Not Found
        </motion.h2>

        {/* Description */}

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: .4,
          }}
          className="mx-auto mt-6 max-w-xl text-lg leading-8"
        >
          The page you are looking for doesn&apos;t,
          has been removed, or the URL may be incorrect.
        </motion.p>

        {/* Buttons */}

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: .6,
          }}
          className="mt-10 flex flex-wrap justify-center gap-4"
        >

          <Link
            href="/"
            className="btn border-0 bg-[#3B3B98] px-8 text-white hover:bg-[#2E2E7A]"
          >
            🏠 Back Home
          </Link>

          <Link
            href="/jobs"
            className="btn btn-outline border-[#3B3B98] px-8 text-[#3B3B98] hover:bg-[#3B3B98] hover:text-white"
          >
           Explore Company
          </Link>

        </motion.div>

        {/* Floating Card */}

        <motion.div
          animate={{
            y: [0, -15, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
          }}
          className="mx-auto mt-16 w-fit rounded-2xl border  px-8 py-6 shadow-xl"
        >
          <h3 className="text-2xl font-bold text-[#3B3B98]">
            🚀 Keep Exploring
          </h3>

          <p className="mt-2 ">
            Thousands of verified jobs are waiting for you.
          </p>
        </motion.div>

      </div>
    </main>
  );
}