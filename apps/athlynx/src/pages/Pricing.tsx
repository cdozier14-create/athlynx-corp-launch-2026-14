import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

/**
 * ATHLYNX PRICING PAGE
 * A DOZIER HOLDINGS GROUP COMPANY
 * Powered by Manus AI
 * 
 * THE MONEY-MAKING MACHINE - IPO BOUND! 🚀
 */

const ATHLETE_TIERS = [
  {
    id: "free",
    name: "ROOKIE",
    tagline: "Start Your Journey",
    priceMonthly: 0,
    priceYearly: 0,
    features: [
      "Basic athlete profile",
      "Waitlist access to NIL deals",
      "Community feed access",
      "1 highlight video upload",
      "10 AI credits/month",
    ],
    cta: "Get Started Free",
    popular: false,
    color: "from-slate-600 to-slate-700",
  },
  {
    id: "pro",
    name: "ALL-STAR",
    tagline: "Level Up Your Game",
    priceMonthly: 19.99,
    priceYearly: 199.99,
    savings: 40,
    features: [
      "Everything in Rookie",
      "Unlimited highlight videos",
      "Priority NIL deal matching",
      "Advanced analytics dashboard",
      "Direct messaging with brands",
      "Transfer portal visibility",
      "Verified athlete badge",
      "100 AI credits/month",
    ],
    cta: "Go All-Star",
    popular: true,
    color: "from-cyan-500 to-blue-600",
  },
  {
    id: "elite",
    name: "MVP",
    tagline: "Champion Package",
    priceMonthly: 49.99,
    priceYearly: 499.99,
    savings: 100,
    features: [
      "Everything in All-Star",
      "1-on-1 NIL coaching sessions",
      "Personal brand strategy",
      "Contract review assistance",
      "Priority customer support",
      "Early access to features",
      "Exclusive MVP community",
      "500 AI credits/month",
    ],
    cta: "Become MVP",
    popular: false,
    color: "from-yellow-500 to-orange-500",
  },
];

const BRAND_TIERS = [
  {
    id: "brand_starter",
    name: "STARTER",
    tagline: "Begin Your NIL Journey",
    priceMonthly: 99,
    priceYearly: 999,
    features: [
      "Browse athlete profiles",
      "5 athlete connections/month",
      "Basic campaign tools",
      "Standard support",
    ],
    cta: "Start Now",
    popular: false,
    color: "from-slate-600 to-slate-700",
  },
  {
    id: "brand_pro",
    name: "PRO",
    tagline: "Scale Your Partnerships",
    priceMonthly: 299,
    priceYearly: 2999,
    savings: 589,
    features: [
      "Everything in Starter",
      "Unlimited athlete connections",
      "Advanced campaign analytics",
      "Priority athlete matching",
      "Dedicated account manager",
      "Custom contract templates",
    ],
    cta: "Go Pro",
    popular: true,
    color: "from-purple-500 to-purple-700",
  },
  {
    id: "brand_enterprise",
    name: "ENTERPRISE",
    tagline: "Full Partnership Suite",
    priceMonthly: 999,
    priceYearly: 9999,
    savings: 1989,
    features: [
      "Everything in Pro",
      "Custom integrations",
      "White-label options",
      "Dedicated success team",
      "Custom reporting",
      "SLA guarantees",
    ],
    cta: "Contact Sales",
    popular: false,
    color: "from-yellow-500 to-orange-500",
  },
];

const CREDIT_PACKS = [
  { id: "starter", credits: 50, price: 4.99, perCredit: 0.10 },
  { id: "value", credits: 150, price: 12.99, perCredit: 0.087, popular: true, savings: "13%" },
  { id: "pro", credits: 500, price: 39.99, perCredit: 0.08, savings: "20%" },
  { id: "elite", credits: 1500, price: 99.99, perCredit: 0.067, savings: "33%" },
];

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [userType, setUserType] = useState<"athlete" | "brand">("athlete");

  const checkoutMutation = trpc.stripe.createCheckout.useMutation({
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (error) => {
      if (error.message.includes("UNAUTHORIZED")) {
        toast.error("Please sign in to subscribe");
        // Redirect to login
        window.location.href = "/portal";
      } else {
        toast.error(error.message || "Checkout failed. Please try again.");
      }
    },
  });

  const handleCheckout = async (tierId: string, tierName: string) => {
    if (tierId === "free") {
      toast.success("Welcome to ATHLYNX! Sign up to get started.");
      window.location.href = "/";
      return;
    }
    
    toast.loading(`Preparing checkout for ${tierName}...`);
    checkoutMutation.mutate({
      tierId,
      billingCycle,
    });
  };

  const handleCreditPurchase = (packId: string, credits: number) => {
    toast.loading(`Preparing checkout for ${credits} AI credits...`);
    checkoutMutation.mutate({
      productId: `credit_pack_${packId}`,
    });
  };

  const tiers = userType === "athlete" ? ATHLETE_TIERS : BRAND_TIERS;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer">
              <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl p-2">
                <span className="text-2xl">🦁</span>
              </div>
              <div>
                <h1 className="text-white font-bold text-lg">ATHLYNX</h1>
                <p className="text-cyan-400 text-xs">PRICING</p>
              </div>
            </div>
          </Link>
          <Link href="/">
            <Button variant="outline" className="border-cyan-500 text-cyan-400 hover:bg-cyan-500/10">
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 text-center">
        <h1 className="text-5xl md:text-6xl font-black mb-4">
          <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Choose Your Path
          </span>
        </h1>
        <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
          Invest in your future. Every champion started somewhere.
        </p>

        {/* User Type Toggle */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setUserType("athlete")}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${
              userType === "athlete"
                ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30"
                : "bg-slate-800 text-slate-400 hover:bg-slate-700"
            }`}
          >
            🏆 Athletes
          </button>
          <button
            onClick={() => setUserType("brand")}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${
              userType === "brand"
                ? "bg-gradient-to-r from-purple-500 to-purple-700 text-white shadow-lg shadow-purple-500/30"
                : "bg-slate-800 text-slate-400 hover:bg-slate-700"
            }`}
          >
            🏢 Brands
          </button>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <span className={billingCycle === "monthly" ? "text-white font-semibold" : "text-slate-500"}>Monthly</span>
          <button
            onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
            className={`relative w-16 h-8 rounded-full transition-all ${
              billingCycle === "yearly" ? "bg-green-500" : "bg-slate-600"
            }`}
          >
            <div
              className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${
                billingCycle === "yearly" ? "left-9" : "left-1"
              }`}
            />
          </button>
          <span className={billingCycle === "yearly" ? "text-white font-semibold" : "text-slate-500"}>
            Yearly <span className="text-green-400 text-sm">(Save up to 20%)</span>
          </span>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="pb-20 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={`relative rounded-3xl p-8 border ${
                tier.popular
                  ? "bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-cyan-500 shadow-2xl shadow-cyan-500/20 scale-105"
                  : "bg-slate-800/50 border-slate-700"
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm font-bold px-4 py-1 rounded-full">
                  MOST POPULAR
                </div>
              )}

              <div className={`inline-block bg-gradient-to-r ${tier.color} text-white text-xs font-bold px-3 py-1 rounded-full mb-4`}>
                {tier.name}
              </div>

              <h3 className="text-2xl font-bold text-white mb-2">{tier.tagline}</h3>

              <div className="mb-6">
                <span className="text-5xl font-black text-white">
                  ${billingCycle === "yearly" ? tier.priceYearly : tier.priceMonthly}
                </span>
                <span className="text-slate-400">
                  /{billingCycle === "yearly" ? "year" : "month"}
                </span>
                {tier.savings && billingCycle === "yearly" && (
                  <div className="text-green-400 text-sm mt-1">Save ${tier.savings}/year</div>
                )}
              </div>

              <ul className="space-y-3 mb-8">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-slate-300">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handleCheckout(tier.id, tier.name)}
                className={`w-full py-6 text-lg font-bold rounded-xl ${
                  tier.popular
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500"
                    : "bg-slate-700 hover:bg-slate-600"
                }`}
              >
                {tier.cta}
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* AI Credits Section */}
      <section className="py-20 bg-gradient-to-r from-purple-900/30 via-slate-900 to-cyan-900/30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              <span className="text-purple-400">AI Credits</span> - Powered by Manus
            </h2>
            <p className="text-slate-400">Buy credits for AI features • Never expires • Use anytime</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {CREDIT_PACKS.map((pack) => (
              <div
                key={pack.id}
                className={`relative rounded-2xl p-6 border text-center ${
                  pack.popular
                    ? "bg-gradient-to-br from-purple-600/30 to-cyan-600/30 border-purple-500"
                    : "bg-slate-800/50 border-slate-700"
                }`}
              >
                {pack.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-cyan-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    BEST VALUE
                  </div>
                )}
                <div className="text-4xl font-black text-cyan-400 mb-1">{pack.credits}</div>
                <div className="text-slate-400 text-sm mb-4">credits</div>
                <div className="text-3xl font-bold text-white mb-1">${pack.price}</div>
                <div className="text-slate-500 text-xs mb-2">${pack.perCredit.toFixed(3)}/credit</div>
                {pack.savings && <div className="text-green-400 text-xs mb-4">{pack.savings} savings</div>}
                <Button
                  onClick={() => handleCreditPurchase(pack.id, pack.credits)}
                  variant="outline"
                  className="w-full border-purple-500 text-purple-400 hover:bg-purple-500/10"
                >
                  Buy Now
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Referral Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            🚀 <span className="text-green-400">Earn While You Share</span>
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Refer friends and earn credits + cash rewards!
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-xl font-bold text-white mb-2">Friend Signs Up</h3>
              <p className="text-green-400 font-bold text-2xl">+50 Credits</p>
            </div>
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
              <div className="text-4xl mb-4">💳</div>
              <h3 className="text-xl font-bold text-white mb-2">Friend Subscribes</h3>
              <p className="text-green-400 font-bold text-2xl">+100 Credits + $10</p>
            </div>
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
              <div className="text-4xl mb-4">🔄</div>
              <h3 className="text-xl font-bold text-white mb-2">Recurring Bonus</h3>
              <p className="text-green-400 font-bold text-2xl">10% Forever</p>
            </div>
          </div>

          <Link href="/">
            <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold px-8 py-6 text-lg rounded-xl">
              Get Your Referral Link
            </Button>
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-slate-800/30">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            {[
              {
                q: "Can I cancel anytime?",
                a: "Yes! Cancel anytime with no fees. Your subscription remains active until the end of your billing period."
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept all major credit cards, debit cards, and Apple Pay through our secure Stripe payment system."
              },
              {
                q: "Do AI credits expire?",
                a: "No! Purchased credits never expire. Monthly subscription credits reset each billing cycle."
              },
              {
                q: "Can I upgrade or downgrade?",
                a: "Absolutely! Change your plan anytime. Upgrades take effect immediately, downgrades at next billing cycle."
              },
            ].map((faq, i) => (
              <div key={i} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                <h3 className="text-lg font-bold text-white mb-2">{faq.q}</h3>
                <p className="text-slate-400">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-20 text-center">
        <h2 className="text-4xl font-bold mb-4">Ready to Start Your Journey?</h2>
        <p className="text-slate-400 mb-8">Join thousands of athletes already winning with ATHLYNX</p>
        <Link href="/">
          <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold px-12 py-6 text-xl rounded-xl">
            Get Started Now
          </Button>
        </Link>
        <p className="text-slate-500 text-sm mt-4">A Dozier Holdings Group Company • Powered by Manus AI</p>
      </section>
    </div>
  );
}
