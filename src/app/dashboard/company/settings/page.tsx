"use client";

import { useState } from "react";
import { 
  User, 
  Lock, 
  Bell, 
  Building2, 
  Save, 
  ShieldCheck, 
  Mail, 
  Smartphone,
  Globe
} from "lucide-react";
import Link from "next/link";

export default function CompanySettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 animate-fadeIn">
      <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-6">Account Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Tabs */}
        <div className="md:col-span-1 space-y-2">
          {["profile", "security", "notifications"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold capitalize transition ${
                activeTab === tab 
                ? "bg-primary text-white" 
                : "text-gray-600 hover:bg-gray-100 dark:text-gray-400"
              }`}
            >
              {tab === "profile" && <User size={18} />}
              {tab === "security" && <Lock size={18} />}
              {tab === "notifications" && <Bell size={18} />}
              {tab}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="md:col-span-3 bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm">
          
          {activeTab === "profile" && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold">Organization Details</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-bold uppercase text-gray-500">Legal Name</label>
                  <input className="w-full mt-1 p-3 rounded-xl border border-gray-200 outline-none focus:border-primary" defaultValue="NexTech Ventures" />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-gray-500">Contact Email</label>
                  <input className="w-full mt-1 p-3 rounded-xl border border-gray-200 outline-none focus:border-primary" defaultValue="admin@nextech.com" />
                </div>
              </div>
              <button className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-sm">
                <Save size={16} /> Save Changes
              </button>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold">Security & Login</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-xl">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="text-emerald-500" />
                    <div>
                      <p className="font-semibold text-sm">Two-Factor Authentication</p>
                      <p className="text-xs text-gray-400">Add an extra layer of security</p>
                    </div>
                  </div>
                  <input type="checkbox" className="toggle" defaultChecked />
                </div>
                <Link href="/auth/forgot-password" className="text-primary text-sm font-semibold hover:underline">Change Password</Link>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold">Notification Preferences</h2>
              <div className="space-y-4">
                {[
                  { title: "New Contribution Alerts", icon: <Mail size={16} /> },
                  { title: "Withdrawal Updates", icon: <Smartphone size={16} /> },
                  { title: "Campaign Milestone Alerts", icon: <Globe size={16} /> },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border rounded-xl">
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <p className="text-sm">{item.title}</p>
                    </div>
                    <input type="checkbox" defaultChecked />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}