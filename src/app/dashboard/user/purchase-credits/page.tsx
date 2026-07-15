"use client";


// ব্যাকএন্ড API এন্ডপয়েন্ট এক্সাম্পল:
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// app.post('/api/user/stripe/create-checkout', async (req, res) => {
  // const { amount } = req.body; // ফ্রন্টএন্ড থেকে আসা অ্যামাউন্ট
  
  // try {
  //   const session = await stripe.checkout.sessions.create({
  //     payment_method_types: ['card'],
  //     line_items: [{
  //       price_data: {
  //         currency: 'usd',
  //         product_data: { name: 'Platform Wallet Credits Upgrade' },
  //         unit_amount: amount * 100, // স্ট্রাইপ সেন্ট (Cents) হিসেবে হিসাব করে ($1 = 100 Cents)
  //       },
  //       quantity: 1,
  //     }],
  //     mode: 'payment',
  //     success_url: `${process.env.CLIENT_URL}/user/dashboard?payment=success`,
  //     cancel_url: `${process.env.CLIENT_URL}/user/purchase-credits?payment=cancelled`,
  //   });

  //   res.status(200).json({ success: true, sessionId: session.id });
  // } catch (err) {
  //   res.status(500).json({ success: false, message: err.message });
  // }
// });

import { useState } from "react";
import { 
  Wallet, 
  CreditCard, 
  DollarSign, 
  CheckCircle2, 
  Loader2, 
  Sparkles, 
  ShieldCheck,
  AlertCircle
} from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import { ins } from "framer-motion/client";

// স্ট্রাইপ লাইব্রেরি ইনিশিয়েট করা (আপনার Public Key এখানে বসবে)
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_mock");

interface CreditPackage {
  id: string;
  amount: number;
  bonus: number;
  popular: boolean;
  badge?: string;
}

export default function PurchaseCreditsPage() {
  const [customAmount = "", setCustomAmount] = useState<string>("");
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const creditPackages: CreditPackage[] = [
    { id: "pkg-1", amount: 25, bonus: 0, popular: false },
    { id: "pkg-2", amount: 50, bonus: 5, popular: true, badge: "Most Popular" },
    { id: "pkg-3", amount: 100, bonus: 15, popular: false, badge: "Best Value" },
    { id: "pkg-4", amount: 250, bonus: 45, popular: false }
  ];

  const handlePackageSelect = (pkg: CreditPackage) => {
    setSelectedPackage(pkg.id);
    setCustomAmount(pkg.amount.toString());
    setErrorMsg(null);
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value);
    setSelectedPackage(null);
    setErrorMsg(null);
  };

  // ==========================================
  // স্ট্রাইপ পেমেন্ট ও ব্যাকএন্ড ইন্টিগ্রেশন লজিক
  // ==========================================
  const handleStripeCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalAmount = parseFloat(customAmount);
    if (!finalAmount || finalAmount <= 0) {
      setErrorMsg("Please enter a valid donation or credit amount.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const token = localStorage.getItem("user-token");
      
      // ১. ব্যাকএন্ডে রিকোয়েস্ট পাঠানো Stripe Checkout Session তৈরি করার জন্য
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/stripe/create-checkout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ amount: finalAmount })
      });

      const data = await res.json();

      if (!res.ok || !data.success || !data.sessionId) {
        throw new Error(data.message || "Failed to initiate Stripe gateway session.");
      }

      // ২. স্ট্রাইপ লোড করে ইউজারের ব্রাউজারকে স্ট্রাইপের অফিসিয়াল পেমেন্ট পেজে রিডাইরেক্ট করা
      const stripe = await stripePromise;
      if (!stripe) throw new Error("Stripe script failed to initialize.");

      const { error } = await stripe.redirectToCheckout({
        sessionId: data.sessionId // ব্যাকএন্ড থেকে আসা ডাইনামিক সেশন আইডি
      });

      if (error) {
        throw new Error(error.message);
      }

    } catch (err) {
      if (err instanceof Error) { 
        console.error("Stripe gateway routing issue:", err);
      setErrorMsg(err.message || "Something went wrong. Connecting to mock gateway...");
      }
      
      
      // Fallback/Mock Mode (ব্যাকএন্ড রেডি না থাকলে টেস্টিং-এর সুবিধার্থে)
      setTimeout(() => {
        setIsSubmitting(false);
        setSuccessMsg(`Mock Secure Mode: $${finalAmount} credited to vault successfully.`);
        setCustomAmount("");
        setSelectedPackage(null);
      }, 1500);
    }
  };

  return (
    <div className="max-w-5xl space-y-6 p-4 font-sans">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
          <Wallet className="text-emerald-600" size={24} /> Purchase Platform Credits
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          Load credits into your account securely via Stripe to back campaigns instantly.
        </p>
      </div>

      {/* Alert Responses */}
      {successMsg && (
        <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 dark:bg-emerald-950/20 p-4 flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
          <p className="text-xs font-bold text-emerald-800 dark:text-emerald-400">{successMsg}</p>
        </div>
      )}

      {errorMsg && (
        <div className="rounded-xl border border-rose-100 bg-rose-50/50 dark:bg-rose-950/20 p-4 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-rose-600 flex-shrink-0" />
          <p className="text-xs font-bold text-rose-800 dark:text-rose-400">{errorMsg}</p>
        </div>
      )}

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        
        {/* Left Side: Pricing grids */}
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Select Funding Package</h3>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
              {creditPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  onClick={() => handlePackageSelect(pkg)}
                  className={`relative cursor-pointer rounded-2xl border p-5 flex flex-col justify-between transition group ${
                    selectedPackage === pkg.id
                      ? "border-emerald-600 bg-emerald-50/20 dark:bg-emerald-950/10 shadow-xs"
                      : "border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-gray-300"
                  }`}
                >
                  {pkg.badge && (
                    <span className="absolute right-3 top-3 rounded-md bg-emerald-600 px-2 py-0.5 text-[9px] font-black uppercase text-white tracking-wider">
                      {pkg.badge}
                    </span>
                  )}
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-gray-400">Load Balance</span>
                    <div className="text-2xl font-black text-gray-900 dark:text-white group-hover:text-emerald-600 transition">
                      ${pkg.amount}
                    </div>
                  </div>
                  {pkg.bonus > 0 ? (
                    <div className="mt-4 flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                      <Sparkles size={12} fill="currentColor" /> <span>Includes +${pkg.bonus} matching bonus</span>
                    </div>
                  ) : (
                    <div className="mt-4 text-[11px] text-gray-400 font-medium">Standard credit allocation</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Custom Field */}
          <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3">
            <h3 className="text-xs font-bold text-gray-900 dark:text-white">Or Custom Funding Amount</h3>
            <div className="relative max-w-xs">
              <DollarSign className="absolute left-3.5 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="number"
                min="5"
                placeholder="Enter custom amount (Min $5)"
                value={customAmount}
                onChange={handleCustomAmountChange}
                className="w-full rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 pl-9 pr-4 py-2 text-xs font-bold text-gray-900 dark:text-white focus:border-emerald-600 focus:outline-hidden"
                disabled={isSubmitting}
              />
            </div>
          </div>
        </div>

        {/* Right Side: Stripe Invoice Breakdown & Checkout Trigger */}
        <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex flex-col justify-between space-y-6 h-fit">
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Secure Stripe Settlement</h3>
            
            <div className="rounded-xl bg-gray-50 dark:bg-slate-800/40 p-4 border border-gray-100 dark:border-transparent text-xs space-y-2.5">
              <div className="flex justify-between font-medium text-gray-400">
                <span>Selected Amount</span>
                <span className="text-gray-900 dark:text-white font-bold">${customAmount || "0.00"}</span>
              </div>
              <div className="flex justify-between font-medium text-gray-400 border-b border-gray-200/50 pb-2">
                <span>Stripe Processing Fee</span>
                <span className="text-emerald-600 font-bold">Covered by Platform</span>
              </div>
              <div className="flex justify-between font-bold text-sm">
                <span className="text-gray-900 dark:text-white">Total Charge (USD)</span>
                <span className="text-emerald-600">${customAmount || "0.00"}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {/* স্ট্রাইপ চেকআউটের সাথে যুক্ত বাটন */}
            <button
              onClick={handleStripeCheckout}
              disabled={isSubmitting || !customAmount || parseFloat(customAmount) <= 0}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-xs font-black text-white hover:bg-emerald-700 transition disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> Launching Stripe...
                </>
              ) : (
                <>
                  Pay via Stripe <CreditCard size={14} />
                </>
              )}
            </button>
            
            <div className="flex items-center justify-center gap-1 text-[10px] text-gray-400 font-medium">
              <ShieldCheck size={12} className="text-emerald-600" /> <span>Redirects to secure Stripe Checkout</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}