"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <main className="fixed inset-0 z-[9999] flex items-center justify-center bg-base-100">
      {/* Background Blur */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 80, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-10 left-10 h-72 w-72 rounded-full bg-[#D79DE8]/20 blur-3xl"
        />

        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-10 right-10 h-80 w-80 rounded-full bg-purple-300/20 blur-3xl"
        />
      </div>

      <div className="relative flex flex-col items-center gap-6">

        {/* Animated Logo */}
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
          className="flex h-24 w-24 items-center justify-center rounded-3xl bg-[#D79DE8] shadow-2xl"
        >
          <span className="text-3xl font-bold text-white">JP</span>
        </motion.div>

        {/* Animated Spinner */}
        <div className="relative h-20 w-20">

          <motion.div
            animate={{
              rotate: 360,
            }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              ease: "linear",
            }}
            className="absolute inset-0 rounded-full border-4 border-[#D79DE8]/20 border-t-[#D79DE8]"
          />

          <motion.div
            animate={{
              rotate: -360,
            }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: "linear",
            }}
            className="absolute inset-3 rounded-full border-4 border-transparent border-t-purple-400"
          />

        </div>

        {/* Loading Text */}
        <motion.h2
          animate={{
            opacity: [0.4, 1, 0.4],
          }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
          }}
          className="text-2xl font-bold text-[#D79DE8]"
        >
          Loading...
        </motion.h2>

        <motion.p
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            repeat: Infinity,
            duration: 2,
          }}
          className="text-center text-base-content/70"
        >
          Preparing your experience...
        </motion.p>
      </div>
    </main>
  );
}