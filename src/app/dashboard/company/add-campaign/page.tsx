"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Building2,
  Globe,
  Mail,
  MapPin,
  Phone,
  Users,
  CalendarDays,
  Tag,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Plus,
  X,
  FileText,
  Loader2
} from "lucide-react";
import { FaFacebook, FaGithub, FaLinkedin } from "react-icons/fa";

interface CompanyForm {
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
  socialLinks: {
    facebook: string;
    linkedin: string;
    github: string;
  };
}

export default function AddCompanyPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [techInput, setTechInput] = useState("");
  const [loading, setLoading] = useState(false);
  
 
  const [message, setMessage] = useState({ type: "", text: "" });

 
  const [formData, setFormData] = useState<CompanyForm>({
    name: "",
    logo: "",
    banner: "",
    tagline: "",
    about: "",
    industry: "",
    founded: "",
    companySize: "",
    headquarters: "",
    email: "",
    phone: "",
    website: "",
    location: "",
    technologies: [],
    socialLinks: {
      facebook: "",
      linkedin: "",
      github: "",
    },
  });


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith("social_")) {
      const field = name.replace("social_", "") as keyof CompanyForm["socialLinks"];
      setFormData((prev) => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };


  const handleAddTech = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && techInput.trim()) {
      e.preventDefault();
      if (!formData.technologies.includes(techInput.trim())) {
        setFormData((prev) => ({
          ...prev,
          technologies: [...prev.technologies, techInput.trim()],
        }));
      }
      setTechInput("");
    }
  };

  const handleRemoveTech = (techToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      technologies: prev.technologies.filter((tech) => tech !== techToRemove),
    }));
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  // ==================== API POST REQUEST CALL ====================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    const apiUrl = process.env.NEXT_PUBLIC_API_URL 
      ? `${process.env.NEXT_PUBLIC_API_URL}/companies` 
      : "/api/companies"; 

    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setMessage({ type: "success", text: "Company added successfully." });
        
      
        setFormData({
          name: "",
          logo: "",
          banner: "",
          tagline: "",
          about: "",
          industry: "",
          founded: "",
          companySize: "",
          headquarters: "",
          email: "",
          phone: "",
          website: "",
          location: "",
          technologies: [],
          socialLinks: { facebook: "", linkedin: "", github: "" },
        });

        
        setTimeout(() => {
          router.push("/dashboard/company"); 
        }, 2000);

      } else {
        setMessage({ 
          type: "error", 
          text: data.message || "We can't company Added. Places try again" 
        });
      }
    } catch (err) {
      console.error("API Error: ", err);
      setMessage({ 
        type: "error", 
        text: "internal server error. Please try again later." 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <div className="mb-8 text-center sm:text-left">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Add a New Company
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Fill out the form below to create a new company profile. You can preview the card on the right as you fill in the details.
        </p>
      </div>

      {/* Live Preview Card */}
      <div className="mb-8 overflow-hidden rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm transition hover:shadow-md">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-primary mb-3">Live Card Preview</p>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
            {formData.logo ? (
              <Image src={formData.logo} alt="Logo" fill className="object-cover" />
            ) : (
              <Building2 className="text-gray-300 dark:text-slate-700" size={28} />
            )}
          </div>
          <div className="text-center sm:text-left flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">
              {formData.name || "Company Name"}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
              {formData.tagline || "Your company's tagline or elevator pitch."}
            </p>
            <div className="mt-2 flex flex-wrap justify-center sm:justify-start gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] text-primary">
                <Tag size={10} />
                {formData.industry || "Industry"}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 dark:bg-slate-800 px-2.5 py-0.5 text-[10px] text-gray-600 dark:text-gray-400">
                <Users size={10} />
                {formData.companySize || "Size"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        {/* Step Progress Tracker */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setStep(num)}
                className={`flex items-center justify-center h-8 w-8 rounded-full text-xs font-bold transition-all ${
                  step === num
                    ? "bg-primary text-white ring-4 ring-primary/20"
                    : step > num
                    ? "bg-emerald-500 text-white"
                    : "bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-slate-500"
                }`}
              >
                {step > num ? <CheckCircle2 size={16} /> : num}
              </button>
            ))}
          </div>
          <div className="relative mt-2 h-1.5 w-full bg-gray-100 dark:bg-slate-800 rounded-full">
            <div
              className="absolute left-0 top-0 h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${((step - 1) / 2) * 100}%` }}
            />
          </div>
        </div>

        {/* Message Alert Banner */}
        {message.text && (
          <div
            className={`mb-6 p-4 rounded-xl text-sm font-medium border flex items-center gap-2 ${
              message.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                : "bg-red-500/10 border-red-500/20 text-red-500"
            }`}
          >
            {message.type === "success" ? <CheckCircle2 size={18} /> : <X size={18} />}
            <span>{message.text}</span>
          </div>
        )}

        {/* Multi-step Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* STEP 1: Basic Information */}
          {step === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Building2 className="text-primary" size={20} /> Step 1: Brand & Core Info
              </h2>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Company Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. TechFlow Solutions"
                    className="w-full rounded-xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/50 p-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Tagline *</label>
                  <input
                    type="text"
                    name="tagline"
                    required
                    value={formData.tagline}
                    onChange={handleChange}
                    placeholder="e.g. Empowering businesses through Cloud and AI"
                    className="w-full rounded-xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/50 p-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Logo Image URL</label>
                  <input
                    type="url"
                    name="logo"
                    value={formData.logo}
                    onChange={handleChange}
                    placeholder="https://example.com/logo.jpg"
                    className="w-full rounded-xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/50 p-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Banner Image URL</label>
                  <input
                    type="url"
                    name="banner"
                    value={formData.banner}
                    onChange={handleChange}
                    placeholder="https://example.com/banner.jpg"
                    className="w-full rounded-xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/50 p-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
                  <FileText size={14} /> Description / About *
                </label>
                <textarea
                  name="about"
                  required
                  rows={4}
                  value={formData.about}
                  onChange={handleChange}
                  placeholder="Tell potential job seekers about your mission, values, products and work culture..."
                  className="w-full rounded-xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/50 p-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none"
                />
              </div>
            </div>
          )}

          {/* STEP 2: Demographics & Contacts */}
          {step === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <MapPin className="text-primary" size={20} /> Step 2: Demographics & Contacts
              </h2>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Industry *</label>
                  <input
                    type="text"
                    name="industry"
                    required
                    value={formData.industry}
                    onChange={handleChange}
                    placeholder="e.g. Information Technology, FinTech"
                    className="w-full rounded-xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/50 p-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Headquarters *</label>
                  <input
                    type="text"
                    name="headquarters"
                    required
                    value={formData.headquarters}
                    onChange={handleChange}
                    placeholder="e.g. Silicon Valley, CA"
                    className="w-full rounded-xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/50 p-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Year Founded</label>
                  <div className="relative">
                    <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="number"
                      name="founded"
                      value={formData.founded}
                      onChange={handleChange}
                      placeholder="e.g. 2018"
                      className="w-full rounded-xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/50 py-3 pl-10 pr-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Company Size</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <select
                      name="companySize"
                      value={formData.companySize}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/50 py-3 pl-10 pr-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none appearance-none"
                    >
                      <option value="">Select Company Size</option>
                      <option value="1 - 10 Employees">1 - 10 Employees</option>
                      <option value="11 - 50 Employees">11 - 50 Employees</option>
                      <option value="51 - 200 Employees">51 - 200 Employees</option>
                      <option value="201 - 500 Employees">201 - 500 Employees</option>
                      <option value="500+ Employees">500+ Employees</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Email Address *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="contact@company.com"
                      className="w-full rounded-xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/50 py-3 pl-10 pr-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Contact Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 019-2834"
                      className="w-full rounded-xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/50 py-3 pl-10 pr-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Website URL</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      placeholder="https://company.io"
                      className="w-full rounded-xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/50 py-3 pl-10 pr-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Detailed Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="Silicon Valley, CA, USA"
                      className="w-full rounded-xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/50 py-3 pl-10 pr-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Technologies & Social Links */}
          {step === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Tag className="text-primary" size={20} /> Step 3: Technologies & Social Profiles
              </h2>

              {/* Tag System input */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Technologies / Tech Stack (Press Enter to Add)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={handleAddTech}
                    placeholder="Type Node.js, Next.js, Docker and press Enter..."
                    className="w-full rounded-xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/50 p-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
                        setFormData((prev) => ({
                          ...prev,
                          technologies: [...prev.technologies, techInput.trim()],
                        }));
                        setTechInput("");
                      }
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg bg-gray-100 dark:bg-slate-800 p-1 text-gray-500 hover:text-primary transition"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                {formData.technologies.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {formData.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                      >
                        {tech}
                        <button
                          type="button"
                          onClick={() => handleRemoveTech(tech)}
                          className="rounded-full hover:bg-primary/20 p-0.5 text-primary"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Social URLs input */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Social Connections</h3>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 flex items-center gap-2">
                    <FaFacebook className="text-blue-600" /> Facebook Profile Link
                  </label>
                  <input
                    type="url"
                    name="social_facebook"
                    value={formData.socialLinks.facebook}
                    onChange={handleChange}
                    placeholder="https://facebook.com/yourcompany"
                    className="w-full rounded-xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/50 p-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 flex items-center gap-2">
                    <FaLinkedin className="text-sky-600" /> LinkedIn Profile Link
                  </label>
                  <input
                    type="url"
                    name="social_linkedin"
                    value={formData.socialLinks.linkedin}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/company/yourcompany"
                    className="w-full rounded-xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/50 p-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 flex items-center gap-2">
                    <FaGithub className="text-gray-800 dark:text-white" /> GitHub Profile Link
                  </label>
                  <input
                    type="url"
                    name="social_github"
                    value={formData.socialLinks.github}
                    onChange={handleChange}
                    placeholder="https://github.com/yourcompany"
                    className="w-full rounded-xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/50 p-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between border-t border-gray-100 dark:border-slate-800 pt-6">
            <button
              type="button"
              disabled={step === 1 || loading}
              onClick={prevStep}
              className="flex items-center gap-2 rounded-xl border border-gray-200 dark:border-slate-800 px-5 py-2.5 text-sm font-semibold transition hover:bg-gray-50 dark:hover:bg-slate-800 disabled:opacity-40"
            >
              <ArrowLeft size={16} /> Previous
            </button>

            {step < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Next Step <ArrowRight size={16} />
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50 min-w-[150px] justify-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    Saving...
                  </>
                ) : (
                  "Submit Company"
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}