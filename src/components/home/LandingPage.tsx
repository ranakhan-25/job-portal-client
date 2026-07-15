"use client";

import { motion } from "framer-motion";
import { Zap, Shield, BarChart3, Globe2, Bot, Layers } from "lucide-react";

const features = [
  { icon: <Zap size={28} />, title: "Lightning Fast", desc: "Optimized performance to keep your workflow running at maximum speed." },
  { icon: <Shield size={28} />, title: "Enterprise Security", desc: "Top-tier encryption and compliance to keep your data safe." },
  { icon: <BarChart3 size={28} />, title: "Advanced Analytics", desc: "Make data-driven decisions with our real-time reporting engine." },
  { icon: <Globe2 size={28} />, title: "Global Scaling", desc: "Infrastructure designed to scale effortlessly across all regions." },
  { icon: <Bot size={28} />, title: "AI-Powered", desc: "Automate repetitive tasks with our intelligent workflow assistant." },
  { icon: <Layers size={28} />, title: "Seamless Integration", desc: "Connect with 500+ apps in just a few clicks." },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 py-24 px-6 transition-colors">
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center mb-20">
        <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
          Everything you need to <span className="text-[#3B3B98]">succeed.</span>
        </h1>
        <p className="text-lg text-gray-500 dark:text-slate-400">
          We’ve built a comprehensive suite of tools designed to help your team perform at their best, day in and day out.
        </p>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -10 }}
            className="group relative p-8 bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 hover:border-blue-500/50 transition-all shadow-sm hover:shadow-2xl hover:shadow-blue-500/10"
          >
            {/* Icon Wrapper */}
            <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-[#3B3B98] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              {f.icon}
            </div>
            
            <h3 className="text-xl font-bold dark:text-white mb-3">{f.title}</h3>
            <p className="text-gray-500 dark:text-slate-400 leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}