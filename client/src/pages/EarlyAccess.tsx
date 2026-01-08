import { useState, useEffect } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function EarlyAccess() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [sport, setSport] = useState("");
  const [vipCode, setVipCode] = useState("");
  const [showVipModal, setShowVipModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    document.title = "ATHLYNX: The Perfect Storm";
  }, []);

  // CRM tracking mutation
  const trackSignup = trpc.crm.trackSignup.useMutation();

  const joinWaitlist = trpc.waitlist.join.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        trackSignup.mutate({
          fullName,
          email,
          phone,
          role: role.toLowerCase(),
          sport,
          signupType: "waitlist",
          referralSource: document.referrer || "direct",
          utmSource: new URLSearchParams(window.location.search).get("utm_source") || undefined,
          utmMedium: new URLSearchParams(window.location.search).get("utm_medium") || undefined,
          utmCampaign: new URLSearchParams(window.location.search).get("utm_campaign") || undefined,
        });
        
        setSubmitted(true);
        toast.success("Welcome to ATHLYNX! Check your email for your VIP code!");
        setFullName("");
        setEmail("");
        setPhone("");
        setRole("");
        setSport("");
      } else {
        toast.error(data.error || "Something went wrong. Please try again.");
      }
      setIsSubmitting(false);
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong. Please try again.");
      setIsSubmitting(false);
    },
  });

  const validateVip = trpc.vip.validate.useMutation({
    onSuccess: (data) => {
      if (data.valid) {
        toast.success("VIP Code validated! Welcome to ATHLYNX!");
        setShowVipModal(false);
        window.location.href = "/portal";
      } else {
        toast.error(data.error || "Invalid VIP code");
      }
    },
    onError: (error) => {
      toast.error("Invalid VIP code. Please try again.");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName) { toast.error("Please enter your full name"); return; }
    if (!email) { toast.error("Please enter your email"); return; }
    if (!phone) { toast.error("Please enter your phone number"); return; }
    if (!role) { toast.error("Please select your role"); return; }
    if (!sport) { toast.error("Please select your sport"); return; }
    
    setIsSubmitting(true);
    joinWaitlist.mutate({
      fullName,
      email,
      phone,
      role: role.toLowerCase() as "athlete" | "parent" | "coach" | "brand",
      sport,
    });
  };

  const handleVipSubmit = () => {
    if (!vipCode.trim()) {
      toast.error("Please enter a VIP code");
      return;
    }
    validateVip.mutate({ code: vipCode.trim() });
  };

  const roles = ["Athlete", "Parent", "Coach", "Brand"];
  const sports = ["Baseball", "Football", "Basketball", "Soccer", "Track & Field", "Volleyball", "Other"];

  return (
    <div className="min-h-screen bg-slate-900">
      {/* SIMPLE HEADER - MOBILE OPTIMIZED */}
      <header className="bg-slate-900 border-b border-slate-700 px-4 py-3">
        <div className="flex items-center justify-center">
          <img 
            src="/athlynx-playbook-logo.png" 
            alt="ATHLYNX" 
            className="h-12"
          />
        </div>
        <div className="flex items-center justify-center gap-2 mt-2 text-xs text-white">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            LIVE
          </span>
          <span className="text-slate-500">•</span>
          <span>HIPAA COMPLIANT</span>
        </div>
      </header>

      {/* MAIN CONTENT - MOBILE FIRST */}
      <main className="px-4 py-6">
        
        {/* STEP 1: VIP SIGNUP - FIRST THING USERS SEE */}
        <section className="mb-6">
          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <div className="text-center mb-4">
              <h1 className="text-slate-900 font-black text-xl mb-1">JOIN THE VIP WAITLIST</h1>
              <p className="text-blue-600 text-sm">Get early access to all 6 apps</p>
            </div>
            
            {submitted ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">🎉</div>
                <h2 className="text-slate-900 font-bold text-xl mb-2">You're In!</h2>
                <p className="text-slate-600 mb-4">Check your email for your VIP code</p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="text-blue-600 underline text-sm"
                >
                  Sign up another person
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-100 border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 text-base"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-100 border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 text-base"
                />
                <input
                  type="text"
                  inputMode="tel"
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-100 border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 text-base"
                />
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-slate-100 border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-blue-500 text-base"
                >
                  <option value="">Select Your Role</option>
                  {roles.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
                <select
                  value={sport}
                  onChange={(e) => setSport(e.target.value)}
                  className="w-full bg-slate-100 border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-blue-500 text-base"
                >
                  <option value="">Select Your Sport</option>
                  {sports.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-4 rounded-xl text-lg shadow-lg disabled:opacity-50"
                >
                  {isSubmitting ? "JOINING..." : "CLAIM MY VIP SPOT"}
                </button>
              </form>
            )}
            
            <p className="text-slate-400 text-xs text-center mt-4">
              No credit card required • Join 500+ athletes
            </p>
          </div>
        </section>

        {/* STEP 2: VIP LOGIN - AFTER SIGNUP */}
        <section className="mb-6">
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <div className="text-center">
              <h2 className="text-white font-bold text-lg mb-2">ALREADY HAVE A VIP CODE?</h2>
              <p className="text-slate-400 text-sm mb-4">Enter your code to access the portal</p>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter VIP Code"
                  value={vipCode}
                  onChange={(e) => setVipCode(e.target.value.toUpperCase())}
                  className="flex-1 bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 text-base uppercase"
                />
                <button
                  onClick={handleVipSubmit}
                  className="bg-cyan-500 hover:bg-cyan-400 text-white font-bold px-6 py-3 rounded-xl"
                >
                  GO
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* STEP 3: PORTAL ACCESS */}
        <section className="mb-6">
          <Link href="/portal">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl p-6 text-center cursor-pointer hover:opacity-90 transition-opacity">
              <div className="text-3xl mb-2">🚀</div>
              <h2 className="text-white font-bold text-lg mb-1">ENTER THE PORTAL</h2>
              <p className="text-white/80 text-sm">Create profile • Link social media • Access apps</p>
            </div>
          </Link>
        </section>

        {/* STEP 4: FOUNDERS */}
        <section className="mb-6">
          <Link href="/our-story">
            <div className="bg-slate-800 rounded-2xl p-6 text-center border border-slate-700 cursor-pointer hover:border-cyan-400 transition-colors">
              <div className="text-3xl mb-2">👥</div>
              <h2 className="text-white font-bold text-lg mb-1">MEET THE FOUNDERS</h2>
              <p className="text-slate-400 text-sm">The team behind ATHLYNX</p>
            </div>
          </Link>
        </section>

        {/* STEP 5: CRM / DASHBOARD */}
        <section className="mb-6">
          <Link href="/crm">
            <div className="bg-slate-800 rounded-2xl p-6 text-center border border-slate-700 cursor-pointer hover:border-cyan-400 transition-colors">
              <div className="text-3xl mb-2">📊</div>
              <h2 className="text-white font-bold text-lg mb-1">FOUNDERS CRM</h2>
              <p className="text-slate-400 text-sm">Analytics & team management</p>
            </div>
          </Link>
        </section>

        {/* STEP 6: ALL APPS */}
        <section className="mb-6">
          <h2 className="text-white font-bold text-lg mb-4 text-center">DOWNLOAD OUR APPS</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/portal">
              <div className="bg-slate-800 rounded-xl p-4 text-center border border-slate-700 cursor-pointer hover:border-cyan-400 transition-colors">
                <div className="text-2xl mb-2">🎯</div>
                <p className="text-white text-sm font-medium">Portal</p>
              </div>
            </Link>
            <Link href="/transfer-portal">
              <div className="bg-slate-800 rounded-xl p-4 text-center border border-slate-700 cursor-pointer hover:border-cyan-400 transition-colors">
                <div className="text-2xl mb-2">🔄</div>
                <p className="text-white text-sm font-medium">Transfer</p>
              </div>
            </Link>
            <Link href="/nil-deals">
              <div className="bg-slate-800 rounded-xl p-4 text-center border border-slate-700 cursor-pointer hover:border-cyan-400 transition-colors">
                <div className="text-2xl mb-2">💰</div>
                <p className="text-white text-sm font-medium">NIL Deals</p>
              </div>
            </Link>
            <Link href="/training">
              <div className="bg-slate-800 rounded-xl p-4 text-center border border-slate-700 cursor-pointer hover:border-cyan-400 transition-colors">
                <div className="text-2xl mb-2">💪</div>
                <p className="text-white text-sm font-medium">Training</p>
              </div>
            </Link>
            <Link href="/contracts">
              <div className="bg-slate-800 rounded-xl p-4 text-center border border-slate-700 cursor-pointer hover:border-cyan-400 transition-colors">
                <div className="text-2xl mb-2">📝</div>
                <p className="text-white text-sm font-medium">Contracts</p>
              </div>
            </Link>
            <Link href="/social">
              <div className="bg-slate-800 rounded-xl p-4 text-center border border-slate-700 cursor-pointer hover:border-cyan-400 transition-colors">
                <div className="text-2xl mb-2">📱</div>
                <p className="text-white text-sm font-medium">Social Hub</p>
              </div>
            </Link>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="text-center py-6 border-t border-slate-700 mt-8">
          <p className="text-slate-500 text-xs mb-2">
            © 2026 ATHLYNX • A Dozier Holdings Group Company
          </p>
          <div className="flex justify-center gap-4 text-xs">
            <Link href="/privacy" className="text-slate-400 hover:text-white">Privacy</Link>
            <Link href="/terms" className="text-slate-400 hover:text-white">Terms</Link>
            <Link href="/hipaa" className="text-slate-400 hover:text-white">HIPAA</Link>
          </div>
        </footer>
      </main>
    </div>
  );
}
