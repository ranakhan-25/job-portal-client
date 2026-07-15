"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  Search, 
  SlidersHorizontal, 
  Heart, 
  DollarSign, 
  Calendar, 
  User, 
  Loader2, 
  ArrowUpRight,
  X,
  CheckCircle2
} from "lucide-react";

interface Campaign {
  id: string;
  title: string;
  description: string;
  category: string;
  creatorName: string;
  image: string;
  raisedAmount: number;
  goalAmount: number;
  daysLeft: number;
  isBookmarked?: boolean;
}

export default function ExploreCampaignsPage() {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  // ==========================================
  // নতুন স্টেটসমূহ (Back Project বাটন সচল করার জন্য)
  // ==========================================
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null); // কোন ক্যাম্পেইনে ডোনেট করছে
  const [donationAmount, setDonationAmount] = useState<string>(""); // ডোনেশন অ্যামাউন্ট
  const [isSubmitting, setIsSubmitting] = useState(false); // লোডিং স্টেট
  const [successMsg, setSuccessMsg] = useState<string | null>(null); // সাকসেস মেসেজ

  const categories = ["All", "Technology", "Medical", "Education", "Creative", "Disaster Relief"];

  const fetchCampaigns = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/campaigns/explore`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setCampaigns(data.campaigns);
      } else {
        loadFallbackCampaigns();
      }
    } catch (err) {
      loadFallbackCampaigns();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  const loadFallbackCampaigns = () => {
    setCampaigns([
      {
        id: "1",
        title: "EcoDrive: Next-Gen Solar Powered Commuter Bike",
        description: "An ultra-lightweight smart electric bicycle powered entirely by high-efficiency integrated solar sheets.",
        category: "Technology",
        creatorName: "Alex Vance",
        image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&auto=format&fit=crop&q=60",
        raisedAmount: 18500,
        goalAmount: 25000,
        daysLeft: 12,
        isBookmarked: false
      },
      {
        id: "2",
        title: "Emergency Relief: Floods Response Fund",
        description: "Providing instantaneous clean water kits, medical aid blocks, and dry food storage for stranded regional families.",
        category: "Disaster Relief",
        creatorName: "Red Cross Node",
        image: "https://images.unsplash.com/photo-1547683905-f686c993aae5?w=600&auto=format&fit=crop&q=60",
        raisedAmount: 42000,
        goalAmount: 40000,
        daysLeft: 4,
        isBookmarked: true
      }
    ]);
  };

  const toggleBookmark = (id: string) => {
    setCampaigns(prev => prev.map(camp => 
      camp.id === id ? { ...camp, isBookmarked: !camp.isBookmarked } : camp
    ));
  };

  // ==========================================
  // ডোনেশন সাবমিট করার এপিআই লজিক
  // ==========================================
  const handleDonateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCampaign || !donationAmount || parseFloat(donationAmount) <= 0) return;

    setIsSubmitting(true);
    setSuccessMsg(null);

    try {
      const token = localStorage.getItem("user-token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/campaigns/donate`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          campaignId: selectedCampaign.id,
          amount: parseFloat(donationAmount)
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // UI-তে রিল-টাইম ফান্ড বাড়িয়ে দেওয়া
        setCampaigns(prev => prev.map(camp => 
          camp.id === selectedCampaign.id 
            ? { ...camp, raisedAmount: camp.raisedAmount + parseFloat(donationAmount) }
            : camp
        ));
        setSuccessMsg(`Successfully backed $${donationAmount} to this project!`);
        setDonationAmount("");
        setTimeout(() => { setSelectedCampaign(null); setSuccessMsg(null); }, 2000);
      } else {
        // Fallback UI Simulation (এপিআই অফলাইন থাকলে ব্রাউজারে টেস্ট করার জন্য)
        simulateLocalDonation();
      }
    } catch (err) {
      simulateLocalDonation();
    } finally {
      setIsSubmitting(false);
    }
  };

  const simulateLocalDonation = () => {
    setCampaigns(prev => prev.map(camp => 
      camp.id === selectedCampaign?.id 
        ? { ...camp, raisedAmount: camp.raisedAmount + parseFloat(donationAmount) }
        : camp
    ));
    setSuccessMsg(`Demo Mode: Mocked $${donationAmount} transaction processed successfully!`);
    setDonationAmount("");
    setTimeout(() => { setSelectedCampaign(null); setSuccessMsg(null); }, 2000);
  };

  const filteredCampaigns = campaigns.filter(camp => {
    const matchesSearch = camp.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          camp.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || camp.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-2">
        <Loader2 className="h-9 w-9 animate-spin text-emerald-600" />
        <p className="text-xs text-gray-500 font-medium">Indexing active crowdfunding campaigns...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl space-y-6 p-4 font-sans relative">
      
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Explore Funding Campaigns</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Discover noble causes and community projects that you can support today.</p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search campaigns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 pl-10 pr-4 py-2 text-xs text-gray-900 dark:text-white focus:border-emerald-600 focus:outline-hidden"
          />
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-bold text-gray-500">
          <SlidersHorizontal size={14} /> <span>Filters</span>
        </div>
      </div>

      {/* Categories Horizontal Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-gray-100 dark:border-slate-800/60 scrollbar-none text-xs font-bold">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`whitespace-nowrap rounded-lg px-3.5 py-1.5 transition ${
              selectedCategory === cat ? "bg-emerald-600 text-white" : "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Campaigns Grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {filteredCampaigns.map((campaign) => {
          const fundingPercent = Math.min(Math.round((campaign.raisedAmount / campaign.goalAmount) * 100), 100);

          return (
            <div key={campaign.id} className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs hover:shadow-md transition duration-200">
              <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
                <img src={campaign.image} alt={campaign.title} className="h-full w-full object-cover group-hover:scale-105 transition duration-300"/>
                <span className="absolute left-3 top-3 rounded-md bg-white/90 dark:bg-slate-900/90 px-2 py-0.5 text-[10px] font-extrabold uppercase text-emerald-700 backdrop-blur-xs">{campaign.category}</span>
                <button onClick={() => toggleBookmark(campaign.id)} className="absolute right-3 top-3 rounded-full bg-white dark:bg-slate-900 p-2 text-gray-400 hover:text-rose-500 transition">
                  <Heart size={14} className={campaign.isBookmarked ? "text-rose-500 fill-rose-500" : ""} />
                </button>
              </div>

              <div className="flex flex-1 flex-col p-5 space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400"><User size={10} /> <span>by {campaign.creatorName}</span></div>
                  <h3 className="font-bold text-sm text-gray-900 dark:text-white line-clamp-1 group-hover:text-emerald-600 transition">{campaign.title}</h3>
                  <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{campaign.description}</p>
                </div>

                <div className="space-y-1 pt-2">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="text-gray-900 dark:text-white">${campaign.raisedAmount.toLocaleString()} <span className="text-gray-400 font-medium">raised</span></span>
                    <span className="text-emerald-600">{fundingPercent}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-gray-100 dark:bg-slate-800 overflow-hidden">
                    <div className="h-full rounded-full bg-emerald-600 transition-all duration-500" style={{ width: `${fundingPercent}%` }} />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-50 dark:border-slate-800/60 text-[11px] font-bold mt-auto">
                  <div className="flex items-center gap-1 text-gray-400"><Calendar size={12} /> <span>{campaign.daysLeft} days left</span></div>
                  
                  {/* সচল করা Back Project বাটন (onClick যুক্ত করা হয়েছে) */}
                  <button 
                    onClick={() => setSelectedCampaign(campaign)}
                    className="flex items-center gap-0.5 text-emerald-600 hover:text-emerald-700 transition"
                  >
                    Back Project <ArrowUpRight size={12} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ==========================================
          ডাইনামিক ডোনেশন পপআপ মডাল (Donation Modal Overlay)
          ========================================== */}
      {selectedCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">Back this Campaign</h3>
              <button 
                onClick={() => { setSelectedCampaign(null); setSuccessMsg(null); }}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition"
              >
                <X size={16} />
              </button>
            </div>

            {successMsg ? (
              <div className="flex flex-col items-center justify-center py-6 space-y-2 text-center">
                <CheckCircle2 className="h-12 w-12 text-emerald-600 animate-bounce" />
                <p className="text-xs font-bold text-gray-900 dark:text-white">{successMsg}</p>
              </div>
            ) : (
              <form onSubmit={handleDonateSubmit} className="space-y-4">
                <div className="text-xs space-y-1">
                  <span className="text-gray-400 block font-medium">Campaign Selected</span>
                  <span className="font-bold text-gray-900 dark:text-white line-clamp-1">{selectedCampaign.title}</span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <label className="font-bold text-gray-700 dark:text-gray-300">Enter Donation Amount ($)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <input
                      type="number"
                      min="1"
                      placeholder="Enter amount (e.g. 50)"
                      value={donationAmount}
                      onChange={(e) => setDonationAmount(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 pl-9 pr-4 py-2 text-xs font-semibold text-gray-900 dark:text-white focus:border-emerald-600 focus:outline-hidden"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedCampaign(null)}
                    className="rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50 transition"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition disabled:opacity-50"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={14} className="animate-spin" /> Processing...
                      </>
                    ) : (
                      "Confirm Payment"
                    )}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}