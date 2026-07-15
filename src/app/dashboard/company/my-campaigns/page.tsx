"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Building2,
  Globe,
  Mail,
  MapPin,
  Phone,
  Users,
  CalendarDays,
  BriefcaseBusiness,
  Plus,
  Loader2,
  ArrowUpRight,
  Edit,
  AlertCircle,
  RefreshCw,
  ArrowLeft,
  ChevronRight,
  X,
  Save,
} from "lucide-react";
import { FaFacebook, FaGithub, FaLinkedin } from "react-icons/fa";

// ==========================================
// ১. অফলাইন টেস্টিং কনফিগ ও একাধিক ডামি কোম্পানি ডাটা
// ==========================================
const IS_OFFLINE = true; 

interface Company {
  _id: string;
  name: string;
  logo: string;
  banner: string;
  tagline: string;
  about: string;
  industry: string;
  founded: string;
  companySize: string;
  headquarters: string;
  email: string;
  phone: string;
  website: string;
  location: string;
  technologies: string[];
  socialLinks?: {
    facebook?: string;
    linkedin?: string;
    github?: string;
  };
}

const DUMMY_COMPANIES: Company[] = [
  {
    _id: "company-1",
    name: "NexTech Ventures Ltd.",
    logo: "https://i.ibb.co.com/mVWmC8Ld/images-1.jpg",
    banner: "https://i.ibb.co.com/mVWmC8Ld/images-1.jpg",
    tagline: "Empowering the next generation of eco-friendly tech innovations through community backing.",
    about: "At NexTech Ventures, we believe that the future belongs to sustainable technology. We are currently crowdfunding our next-generation smart home energy manager—'EcoPulse'. Join us on our journey to make green living accessible.",
    industry: "Green Technology / IoT",
    founded: "2022",
    companySize: "11-50 employees",
    headquarters: "Dhaka, Bangladesh",
    email: "contact@nextechventures.com",
    phone: "+880 1712-345678",
    website: "www.nextechventures.com",
    location: "Gulshan-2, Dhaka",
    technologies: ["React", "Next.js", "Node.js", "IoT Hub", "MongoDB"],
    socialLinks: {
      facebook: "https://facebook.com",
      linkedin: "https://linkedin.com",
      github: "https://github.com",
    },
  },
  {
    _id: "company-2",
    name: "GreenSprout Bio-Labs",
    logo: "https://i.ibb.co.com/mVWmC8Ld/images-1.jpg",
    banner: "https://i.ibb.co.com/mVWmC8Ld/images-1.jpg",
    tagline: "Cultivating organic solutions and smart agricultural tech for sustainable farming.",
    about: "GreenSprout Bio-Labs is focused on revolutionizing small-scale organic farming. Our ongoing crowdfunding campaign aims to mass-produce automated drip irrigation sensors designed for urban gardeners.",
    industry: "AgriTech & Bio-Science",
    founded: "2024",
    companySize: "1-10 employees",
    headquarters: "Sylhet, Bangladesh",
    email: "hello@greensprout.io",
    phone: "+880 1911-987654",
    website: "www.greensprout.io",
    location: "Zindabazar, Sylhet",
    technologies: ["Python", "Arduino", "FastAPI", "React Native"],
    socialLinks: {
      facebook: "https://facebook.com",
      linkedin: "https://linkedin.com",
    },
  }
];

export default function MyCompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // মোডাল রিলেটেড স্টেট
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<Company | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchMyCompanies = async () => {
      setLoading(true);
      setError(null);

      if (IS_OFFLINE) {
        setTimeout(() => {
          setCompanies(DUMMY_COMPANIES);
          setLoading(false);
        }, 800);
        return;
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/companies/my-companies`, {
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok && data.success && Array.isArray(data.data)) {
          setCompanies(data.data);
        } else {
          setCompanies([]);
        }
      } catch (err) {
        console.error("Error:", err);
        setError("We couldn't connect to the server.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyCompanies();
  }, [retryCount]);

  // এডিট বোতামে ক্লিক করলে মোডাল ওপেন হবে এবং সিলেক্টেড কোম্পানির ডাটা ফর্মে লোড হবে
  const openEditModal = (company: Company) => {
    setEditForm({ ...company });
    setIsEditModalOpen(true);
  };

  // ফর্ম সাবমিট হ্যান্ডলার (অফলাইন এবং অনলাইন এপিআই সাপোর্টেড)
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm) return;

    setIsSaving(true);

    if (IS_OFFLINE) {
      setTimeout(() => {
        // ১. লোকাল কোম্পানি লিস্টের স্টেট আপডেট
        setCompanies((prev) =>
          prev.map((c) => (c._id === editForm._id ? editForm : c))
        );
        // ২. কারেন্টলি ওপেন থাকা কোম্পানির ডিটেইল ভিউ স্টেট আপডেট
        setSelectedCompany(editForm);
        setIsSaving(false);
        setIsEditModalOpen(false);
      }, 1000); // ১ সেকেন্ডের আর্টিফিশিয়াল লোডিং
      return;
    }

    // অনলাইন এপিআই ইন্টিগ্রেশন প্যাটার্ন
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/companies/edit/${editForm._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });

      if (res.ok) {
        setCompanies((prev) => prev.map((c) => (c._id === editForm._id ? editForm : c)));
        setSelectedCompany(editForm);
        setIsEditModalOpen(false);
      } else {
        alert("Something went wrong while saving changes.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to connect to the server.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-sm text-gray-500 font-medium">Loading your companies...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <div className="flex flex-col items-center justify-center rounded-3xl border border-red-100 bg-red-50/50 p-8 shadow-sm">
          <AlertCircle className="mb-5 text-red-500 animate-bounce" size={44} />
          <h2 className="text-2xl font-bold">Connection Failed</h2>
          <p className="mt-3 text-sm text-gray-500">{error}</p>
          <button onClick={() => setRetryCount(prev => prev + 1)} className="mt-6 flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white">
            <RefreshCw size={16} /> Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-8 animate-fadeIn">
      
      {/* ==========================================
          ভিউ ৪: সিঙ্গেল কোম্পানি ডিটেইল ভিউ
          ========================================== */}
      {selectedCompany ? (
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <button
              onClick={() => setSelectedCompany(null)}
              className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900 dark:hover:text-white transition"
            >
              <ArrowLeft size={16} /> Back to My Companies
            </button>
            <button
              onClick={() => openEditModal(selectedCompany)} 
              className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800 transition"
            >
              <Edit size={14} /> Edit Company Profile
            </button>
          </div>

          {/* Banner & Logo */}
          <div className="relative h-64 overflow-hidden rounded-3xl bg-gray-100 dark:bg-slate-800 border border-gray-200/50">
            {selectedCompany.banner && (
              <Image src={selectedCompany.banner} alt={selectedCompany.name} fill className="object-cover" priority />
            )}
            <div className="absolute inset-0 bg-black/50" />
            <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="relative h-20 w-20 overflow-hidden rounded-2xl border-4 border-white bg-white shadow-md">
                {selectedCompany.logo && <Image src={selectedCompany.logo} alt={selectedCompany.name} fill className="object-cover" />}
              </div>
              <div className="text-white">
                <h2 className="text-3xl font-extrabold">{selectedCompany.name}</h2>
                <p className="mt-1 text-sm text-gray-200">{selectedCompany.tagline}</p>
              </div>
            </div>
          </div>

          {/* Grid Information */}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-bold">About Company</h3>
              <p className="leading-7 text-gray-600 dark:text-gray-400 text-sm whitespace-pre-line">{selectedCompany.about}</p>
            </div>

            <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-bold">Contact & Support</h3>
              <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-3"><Mail size={16} /><span>{selectedCompany.email || "N/A"}</span></div>
                <div className="flex items-center gap-3"><Phone size={16} /><span>{selectedCompany.phone || "N/A"}</span></div>
                <div className="flex items-center gap-3">
                  <Globe size={16} />
                  {selectedCompany.website ? (
                    <a href={`https://${selectedCompany.website}`} target="_blank" rel="noreferrer" className="hover:underline text-primary">{selectedCompany.website}</a>
                  ) : <span>N/A</span>}
                </div>
                <div className="flex items-center gap-3"><MapPin size={16} /><span>{selectedCompany.location || "N/A"}</span></div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ==========================================
           ভিউ ৫: মাল্টিপল কোম্পানি গ্রিড ভিউ
           ========================================== */
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold">My Companies</h1>
              <p className="text-xs text-gray-500">Manage and launch campaigns under different organizations</p>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {companies.map((comp) => (
              <div
                key={comp._id}
                onClick={() => setSelectedCompany(comp)}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 hover:shadow-md transition cursor-pointer"
              >
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary to-indigo-500" />
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="relative h-14 w-14 overflow-hidden rounded-xl border bg-white">
                      {comp.logo && <Image src={comp.logo} alt={comp.name} fill className="object-cover" />}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold group-hover:text-primary transition">{comp.name}</h3>
                      <span className="inline-block rounded-full bg-gray-100 dark:bg-slate-800 px-2.5 py-0.5 text-[10px] font-semibold text-gray-600 dark:text-gray-300">
                        {comp.industry}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">{comp.tagline}</p>
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-gray-100 dark:border-slate-800/80 pt-4">
                  <span className="flex items-center gap-1 text-xs text-gray-400"><MapPin size={12} /> {comp.location}</span>
                  <span className="flex items-center gap-1 text-xs font-bold text-primary group-hover:translate-x-1 transition duration-200">
                    Workspace <ChevronRight size={14} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==========================================
          ৬. EDIT COMPANY DIALOG / MODAL (চমৎকার অ্যানিমেশন সহ)
          ========================================== */}
      {isEditModalOpen && editForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 md:p-8 shadow-2xl animate-scaleIn">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-slate-800">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Edit Company Settings</h3>
                <p className="text-xs text-gray-500">Update your company details and workspace settings</p>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="rounded-full p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-900 transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleEditSubmit} className="mt-6 space-y-5">
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1.5">Company Name</label>
                  <input
                    type="text"
                    required
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 dark:border-slate-800 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-primary transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1.5">Industry</label>
                  <input
                    type="text"
                    required
                    value={editForm.industry}
                    onChange={(e) => setEditForm({ ...editForm, industry: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 dark:border-slate-800 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-primary transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1.5">Tagline / Short Intro</label>
                <input
                  type="text"
                  required
                  value={editForm.tagline}
                  onChange={(e) => setEditForm({ ...editForm, tagline: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 dark:border-slate-800 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-primary transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1.5">About Details</label>
                <textarea
                  rows={4}
                  required
                  value={editForm.about}
                  onChange={(e) => setEditForm({ ...editForm, about: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 dark:border-slate-800 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-primary transition resize-none"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1.5">Website</label>
                  <input
                    type="text"
                    value={editForm.website}
                    onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 dark:border-slate-800 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-primary transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1.5">HQ Location</label>
                  <input
                    type="text"
                    value={editForm.location}
                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 dark:border-slate-800 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-primary transition"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1.5">Email</label>
                  <input
                    type="email"
                    required
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 dark:border-slate-800 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-primary transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1.5">Phone Number</label>
                  <input
                    type="text"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 dark:border-slate-800 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-primary transition"
                  />
                </div>
              </div>

              {/* Modal Footer Controls */}
              <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-5 py-3 text-xs font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-xs font-bold text-white hover:opacity-90 transition disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Saving Changes...
                    </>
                  ) : (
                    <>
                      <Save size={14} /> Save Changes
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}