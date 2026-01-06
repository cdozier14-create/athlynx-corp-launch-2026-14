import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Zap, Crown, Star, Trophy, Gem, Music, Video, Bot, MessageSquare, ShoppingBag, Sparkles } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Link } from "wouter";

const PLAN_FEATURES: Record<string, { name: string; price: number; icon: any; color: string; features: string[]; popular?: boolean }> = {
  free: {
    name: "Free",
    price: 0,
    icon: Star,
    color: "from-gray-500 to-gray-600",
    features: ["Basic social feed", "Limited messaging (10/day)", "View public profiles", "Basic notifications"],
  },
  rookie: {
    name: "Rookie",
    price: 9.99,
    icon: Zap,
    color: "from-green-500 to-emerald-600",
    features: ["Unlimited messaging", "Full social feed", "Basic analytics", "100 credits/month", "Priority support"],
    popular: false,
  },
  starter: {
    name: "Starter",
    price: 19.99,
    icon: Trophy,
    color: "from-blue-500 to-cyan-600",
    features: ["All Rookie features", "AI Trainer access", "Highlight tape builder", "250 credits/month", "Profile verification"],
    popular: true,
  },
  allstar: {
    name: "All-Star",
    price: 49.99,
    icon: Crown,
    color: "from-purple-500 to-pink-600",
    features: ["All Starter features", "AI Recruiter access", "Content creation suite", "Marketplace access", "500 credits/month", "NIL deal alerts"],
    popular: false,
  },
  elite: {
    name: "Elite",
    price: 99.99,
    icon: Gem,
    color: "from-amber-500 to-orange-600",
    features: ["All All-Star features", "Full AI team access", "Priority support", "Verified badge", "1,000 credits/month", "Custom branding"],
    popular: false,
  },
  legend: {
    name: "Legend",
    price: 249.99,
    icon: Sparkles,
    color: "from-rose-500 to-red-600",
    features: ["All Elite features", "Dedicated manager", "White-glove service", "5,000 credits/month", "Custom integrations", "VIP events access"],
    popular: false,
  },
};

const SERVICES = [
  { key: "music", name: "ATHLYNX Music", price: 4.99, icon: Music, description: "Unlimited workout playlists & podcasts" },
  { key: "media", name: "Media Suite", price: 7.99, icon: Video, description: "Video editing & highlight creation tools" },
  { key: "ai_trainer", name: "AI Trainer", price: 9.99, icon: Bot, description: "Personalized workout plans & tracking" },
  { key: "ai_recruiter", name: "AI Recruiter", price: 14.99, icon: Bot, description: "College recruitment strategy & outreach" },
  { key: "content_suite", name: "Content Suite", price: 19.99, icon: Sparkles, description: "Full content creation toolkit" },
  { key: "messenger_pro", name: "Messenger Pro", price: 2.99, icon: MessageSquare, description: "Unlimited messaging & read receipts" },
  { key: "marketplace", name: "Marketplace", price: 9.99, icon: ShoppingBag, description: "Buy & sell NIL deals, merch, services" },
];

const CREDIT_PACKS = [
  { key: "small", amount: 100, price: 9.99, bonus: 0 },
  { key: "medium", amount: 300, price: 24.99, bonus: 50 },
  { key: "large", amount: 750, price: 49.99, bonus: 150 },
  { key: "mega", amount: 2000, price: 99.99, bonus: 500 },
];

export default function Pricing() {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState("plans");
  
  const subscribeMutation = trpc.subscription.subscribe.useMutation();
  const purchaseServiceMutation = trpc.services.purchase.useMutation();
  const purchaseCreditsMutation = trpc.credits.purchase.useMutation();

  const handleSubscribe = async (plan: string) => {
    if (!user) {
      window.location.href = "/early-access";
      return;
    }
    try {
      const result = await subscribeMutation.mutateAsync({ plan: plan as any });
      if (result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
      }
    } catch (error) {
      console.error("Subscription error:", error);
    }
  };

  const handlePurchaseService = async (service: string) => {
    if (!user) {
      window.location.href = "/early-access";
      return;
    }
    try {
      const result = await purchaseServiceMutation.mutateAsync({ service: service as any });
      if (result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
      }
    } catch (error) {
      console.error("Service purchase error:", error);
    }
  };

  const handlePurchaseCredits = async (pack: string) => {
    if (!user) {
      window.location.href = "/early-access";
      return;
    }
    try {
      const result = await purchaseCreditsMutation.mutateAsync({ pack: pack as any });
      if (result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
      }
    } catch (error) {
      console.error("Credits purchase error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer">
              <img src="/nil-portal-icon-final.jpeg" alt="ATHLYNX" className="w-10 h-10 rounded-lg" />
              <span className="text-xl font-bold text-white">ATHLYNX</span>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/portal">
              <Button variant="ghost" className="text-white hover:bg-white/10">Portal</Button>
            </Link>
            {user ? (
              <span className="text-white/70">{user.name}</span>
            ) : (
              <Link href="/early-access">
                <Button className="bg-gradient-to-r from-blue-500 to-cyan-500">Get Started</Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
          Choose Your <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Path</span>
        </h1>
        <p className="text-xl text-white/70 max-w-2xl mx-auto mb-8">
          Three ways to unlock your potential: Pro Plans, À La Carte Services, or Credits
        </p>
      </section>

      {/* Pricing Tabs */}
      <section className="container mx-auto px-4 pb-20">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 bg-white/10 mb-12">
            <TabsTrigger value="plans" className="data-[state=active]:bg-blue-500">Pro Plans</TabsTrigger>
            <TabsTrigger value="services" className="data-[state=active]:bg-purple-500">À La Carte</TabsTrigger>
            <TabsTrigger value="credits" className="data-[state=active]:bg-amber-500">Credits</TabsTrigger>
          </TabsList>

          {/* Pro Plans */}
          <TabsContent value="plans">
            <div className="text-center mb-8">
              <Badge className="bg-green-500/20 text-green-400 border-green-500/50 mb-4">
                7-DAY FREE TRIAL • NO CREDIT CARD REQUIRED
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {Object.entries(PLAN_FEATURES).filter(([key]) => key !== "free").map(([key, plan]) => {
                const Icon = plan.icon;
                return (
                  <Card 
                    key={key} 
                    className={`relative bg-white/5 border-white/10 backdrop-blur-sm overflow-hidden ${plan.popular ? 'ring-2 ring-blue-500' : ''}`}
                  >
                    {plan.popular && (
                      <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                        MOST POPULAR
                      </div>
                    )}
                    <CardHeader>
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-4`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle className="text-white text-2xl">{plan.name}</CardTitle>
                      <CardDescription className="text-white/60">
                        <span className="text-4xl font-bold text-white">${plan.price}</span>
                        <span className="text-white/60">/month</span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3 mb-6">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-center gap-2 text-white/80">
                            <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button 
                        className={`w-full bg-gradient-to-r ${plan.color} hover:opacity-90`}
                        onClick={() => handleSubscribe(key)}
                        disabled={subscribeMutation.isPending}
                      >
                        {subscribeMutation.isPending ? "Processing..." : "Start Free Trial"}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* À La Carte Services */}
          <TabsContent value="services">
            <div className="text-center mb-8">
              <p className="text-white/70">Pay only for what you need. Cancel anytime.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {SERVICES.map((service) => {
                const Icon = service.icon;
                return (
                  <Card key={service.key} className="bg-white/5 border-white/10 backdrop-blur-sm">
                    <CardHeader>
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle className="text-white">{service.name}</CardTitle>
                      <CardDescription className="text-white/60">{service.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <span className="text-3xl font-bold text-white">${service.price}</span>
                        <span className="text-white/60">/month</span>
                      </div>
                      <Button 
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90"
                        onClick={() => handlePurchaseService(service.key)}
                        disabled={purchaseServiceMutation.isPending}
                      >
                        {purchaseServiceMutation.isPending ? "Processing..." : "Subscribe"}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Credits */}
          <TabsContent value="credits">
            <div className="text-center mb-8">
              <p className="text-white/70 mb-2">Use credits for AI services, content creation, and premium features.</p>
              <p className="text-amber-400 text-sm">Larger packs include bonus credits!</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {CREDIT_PACKS.map((pack) => (
                <Card key={pack.key} className="bg-white/5 border-white/10 backdrop-blur-sm relative overflow-hidden">
                  {pack.bonus > 0 && (
                    <div className="absolute top-0 right-0 bg-amber-500 text-black text-xs font-bold px-2 py-1 rounded-bl-lg">
                      +{pack.bonus} BONUS
                    </div>
                  )}
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-4">
                      <Zap className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-white text-3xl">{pack.amount.toLocaleString()}</CardTitle>
                    <CardDescription className="text-amber-400">Credits</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="mb-4">
                      <span className="text-3xl font-bold text-white">${pack.price}</span>
                    </div>
                    {pack.bonus > 0 && (
                      <p className="text-sm text-green-400 mb-4">
                        Total: {(pack.amount + pack.bonus).toLocaleString()} credits
                      </p>
                    )}
                    <Button 
                      className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-90"
                      onClick={() => handlePurchaseCredits(pack.key)}
                      disabled={purchaseCreditsMutation.isPending}
                    >
                      {purchaseCreditsMutation.isPending ? "Processing..." : "Buy Now"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Credit Usage Guide */}
      <section className="bg-black/30 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white text-center mb-8">What Can You Do With Credits?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { action: "AI Chat Message", cost: 1, icon: MessageSquare },
              { action: "Generate Workout Plan", cost: 5, icon: Zap },
              { action: "Create Highlight Reel", cost: 10, icon: Video },
              { action: "AI Recruitment Analysis", cost: 15, icon: Bot },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="bg-white/5 rounded-xl p-6 text-center border border-white/10">
                  <Icon className="w-8 h-8 text-amber-400 mx-auto mb-3" />
                  <p className="text-white font-medium mb-2">{item.action}</p>
                  <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/50">
                    {item.cost} credits
                  </Badge>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold text-white text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: "Can I switch plans anytime?", a: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect at your next billing cycle." },
              { q: "Do credits expire?", a: "Credits never expire as long as your account is active. Use them whenever you need them." },
              { q: "Can I combine plans with à la carte services?", a: "Absolutely! Many users subscribe to a base plan and add specific services they need." },
              { q: "What payment methods do you accept?", a: "We accept all major credit cards, debit cards, and digital wallets through our secure Stripe integration." },
            ].map((faq, i) => (
              <div key={i} className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-white font-semibold mb-2">{faq.q}</h3>
                <p className="text-white/70">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Your Journey?</h2>
        <p className="text-white/70 mb-8">Join thousands of athletes already using ATHLYNX</p>
        <Link href="/early-access">
          <Button size="lg" className="bg-gradient-to-r from-blue-500 to-cyan-500 text-lg px-8">
            Get Started Free
          </Button>
        </Link>
      </section>
    </div>
  );
}
