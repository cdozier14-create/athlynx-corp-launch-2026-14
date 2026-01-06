import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";

export default function EarlyAccess() {
  const { user, isAuthenticated, logout, loading: authLoading } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [sport, setSport] = useState("");
  const [vipCode, setVipCode] = useState("");
  const [showVipModal, setShowVipModal] = useState(false);
  
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    document.title = "ATHLYNX: The Perfect Storm";
  }, []);

  useEffect(() => {
    const targetDate = new Date("2026-02-01T00:00:00").getTime();
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;
      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const joinWaitlist = trpc.waitlist.join.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        setSubmitted(true);
        toast.success("Welcome to ATHLYNX! You'll receive your VIP access code soon.");
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
  const sports = ["Baseball", "Football", "Basketball", "Soccer", "Track & Field", "Volleyball"];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 text-white">
      {/* STICKY HEADER */}
      <header className="sticky top-0 z-50">
        {/* Top Bar */}
        <div className="bg-slate-800 text-cyan-400 text-center py-2 text-xs tracking-[0.2em] font-medium">
          THE FUTURE OF ATHLETE SUCCESS
        </div>
        
        {/* Main Header Row */}
        <div className="bg-gradient-to-r from-slate-900 to-blue-900 border-b border-slate-700">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            {/* ATHLYNX Logo Box */}
            <div className="relative">
              <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl px-4 py-2 flex items-center gap-3 shadow-lg">
                <img src="/athlynx-logo-icon.png" alt="ATHLYNX" className="w-10 h-10" />
                <div>
                  <h1 className="text-white font-bold text-lg tracking-wide">ATHLYNX</h1>
                  <p className="text-blue-100 text-[10px] tracking-wider">THE ATHLETE'S PLAYBOOK</p>
                </div>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border-2 border-slate-900"></div>
            </div>

            {/* Founders Button */}
            <a href="/pricing" className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-semibold px-5 py-2.5 rounded-lg text-sm flex items-center gap-2 transition-all shadow-lg">
              <span>💎</span> Pro Plans
            </a>

            {/* Login/User Section */}
            {authLoading ? (
              <div className="bg-slate-800 border-2 border-slate-600 text-slate-400 font-semibold px-5 py-2.5 rounded-lg text-sm flex items-center gap-2">
                <span className="animate-spin">◎</span> Loading...
              </div>
            ) : isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                <a href="/portal" className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white font-semibold px-5 py-2.5 rounded-lg text-sm flex items-center gap-2 transition-all shadow-lg">
                  <span>🚀</span> My Portal
                </a>
                <div className="relative group">
                  <button className="bg-slate-800 border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400/10 font-semibold px-4 py-2.5 rounded-lg text-sm flex items-center gap-2 transition-colors">
                    <img src={user.avatarUrl || '/athlynx-app-icon.png'} alt="" className="w-6 h-6 rounded-full" />
                    <span className="max-w-[100px] truncate">{user.name || 'Athlete'}</span>
                    <span>▼</span>
                  </button>
                  <div className="absolute right-0 top-full mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                    <a href="/portal" className="block px-4 py-3 text-white hover:bg-slate-700 rounded-t-lg text-sm">🏠 Dashboard</a>
                    <a href="/messenger" className="block px-4 py-3 text-white hover:bg-slate-700 text-sm">💬 Messages</a>
                    <a href="/ai" className="block px-4 py-3 text-white hover:bg-slate-700 text-sm">🤖 AI Team</a>
                    <a href="/pricing" className="block px-4 py-3 text-white hover:bg-slate-700 text-sm">💎 Upgrade</a>
                    <button onClick={logout} className="w-full text-left px-4 py-3 text-red-400 hover:bg-slate-700 rounded-b-lg text-sm">🚪 Sign Out</button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <a href="/api/auth/login" className="bg-slate-800 border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400/10 font-semibold px-5 py-2.5 rounded-lg text-sm flex items-center gap-2 transition-colors">
                  <span>◎</span> Sign In
                </a>
                <a href="/api/auth/login" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold px-5 py-2.5 rounded-lg text-sm flex items-center gap-2 transition-all shadow-lg animate-pulse">
                  <span>🚀</span> Sign Up FREE
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Blue Status Bar */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-600 text-white py-2.5 px-4 flex items-center justify-center gap-4 text-sm font-medium">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            LIVE PLATFORM
          </span>
          <span className="text-blue-300">•</span>
          <span>HIPAA-compliant</span>
          <span className="text-blue-300">•</span>
          <span>Protecting our precious cargo</span>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="relative">
        {/* Site Updating Notice */}
        <div className="bg-amber-400 py-3 px-4 text-center">
          <span className="text-slate-900 font-medium text-sm">
            ⚠️ SITE UPDATING LIVE DAILY - Please be patient with us while we add future updates and apps!
          </span>
        </div>

        {/* Hero Section with ATHLYNX Box */}
        <section className="py-12 px-4">
          <div className="max-w-md mx-auto">
            {/* ATHLYNX THE ATHLETE'S PLAYBOOK Box */}
            <div className="bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl p-8 text-center shadow-2xl relative overflow-hidden">
              <div className="absolute top-2 right-2 w-3 h-3 bg-yellow-400 rounded-full"></div>
              <h2 className="text-slate-900 font-black text-3xl tracking-wide mb-2">ATHLYNX</h2>
              <p className="text-blue-900 font-semibold text-sm tracking-wider">THE ATHLETE'S PLAYBOOK</p>
            </div>
          </div>
        </section>

        {/* VIP Code Section */}
        <section className="py-8 px-4">
          <div className="max-w-md mx-auto">
            <div 
              onClick={() => setShowVipModal(true)}
              className="bg-slate-800/80 hover:bg-slate-700/80 rounded-2xl p-8 text-center cursor-pointer transition-all shadow-xl border border-slate-700"
            >
              <h2 className="text-white font-bold text-xl mb-2 tracking-wide">HAVE A VIP CODE?</h2>
              <p className="text-cyan-400 text-sm tracking-wider underline">TAP HERE TO ENTER</p>
            </div>
          </div>
        </section>

        {/* Heavyweight Champion Banner */}
        <section className="py-4 px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-gradient-to-r from-amber-500 to-yellow-500 rounded-2xl py-4 px-6 text-center shadow-xl">
              <p className="text-slate-900 font-bold text-lg tracking-wide">
                🏆 HEAVYWEIGHT CHAMPION OF THE WORLD 🏆
              </p>
            </div>
          </div>
        </section>

        {/* DHG Crab Shield */}
        <section className="py-8 px-4">
          <div className="max-w-xs mx-auto">
            <div className="bg-slate-800 rounded-xl p-4 border border-slate-600">
              <p className="text-white text-sm font-medium mb-3">DHG Crab Shield</p>
              <img src="/dhg-crab-shield.jpeg" alt="DHG Crab Shield" className="w-full rounded-lg" />
            </div>
          </div>
        </section>

        {/* Parent Company Badge */}
        <section className="py-4 px-4">
          <div className="max-w-sm mx-auto">
            <div className="bg-gradient-to-r from-amber-100 to-yellow-100 rounded-xl py-3 px-6 text-center border border-amber-300">
              <p className="text-slate-600 text-xs font-medium">PARENT COMPANY</p>
              <p className="text-amber-700 font-bold text-lg">Dozier Holdings Group</p>
            </div>
          </div>
        </section>

        {/* THE LEGENDARY TRAINER Section */}
        <section className="py-8 px-4">
          <div className="max-w-lg mx-auto">
            <div className="bg-gradient-to-br from-slate-800 to-blue-900 rounded-2xl p-8 border border-cyan-500/30 relative">
              {/* Corner dots */}
              <div className="absolute top-3 left-3 w-2 h-2 bg-cyan-400 rounded-full"></div>
              <div className="absolute top-3 right-3 w-2 h-2 bg-cyan-400 rounded-full"></div>
              <div className="absolute bottom-3 left-3 w-2 h-2 bg-cyan-400 rounded-full"></div>
              <div className="absolute bottom-3 right-3 w-2 h-2 bg-cyan-400 rounded-full"></div>
              
              <div className="text-center">
                <img src="/athlynx-logo-icon.png" alt="ATHLYNX" className="w-16 h-16 mx-auto mb-4" />
                <h3 className="text-white font-black text-2xl mb-1">ATHLYNX</h3>
                <p className="text-cyan-400 font-semibold text-sm tracking-wider mb-4">THE ATHLETE'S PLAYBOOK</p>
                <p className="text-slate-300 text-sm mb-4">
                  The mastermind behind the champion.<br/>
                  <span className="text-cyan-400 font-semibold">Building champions</span>, 
                  <span className="text-amber-400 font-semibold"> training winners</span>, 
                  and <span className="text-green-400 font-semibold">creating empires</span>.
                </p>
                
                {/* THE EMPIRE Box */}
                <div className="bg-slate-700/50 rounded-xl p-4 mt-4 border border-slate-600">
                  <p className="text-cyan-400 font-bold text-sm mb-2">THE EMPIRE</p>
                  <div className="flex justify-center gap-3 text-2xl mb-2">
                    <span>🏆</span>
                    <span>💰</span>
                    <span>⏱️</span>
                    <span>🏢</span>
                    <span>📈</span>
                  </div>
                  <p className="text-slate-400 text-xs">PASSIVE INCOME EMPIRE</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 10 Apps Section */}
        <section className="py-12 px-4 bg-gradient-to-b from-slate-900/50 to-blue-950/50">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-center text-cyan-400 font-medium text-lg mb-10 tracking-wide">
              10 Powerful Apps. One Platform. Unlimited Potential.
            </h2>
            
            {/* Apps Grid - 5x2 */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-8">
              {/* Portal */}
              <div className="flex flex-col items-center group cursor-pointer" onClick={() => window.location.href='/portal'}>
                <div className="relative">
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white text-[8px] font-bold px-2 py-0.5 rounded-full z-20">LIVE</div>
                  <div className="bg-slate-800 rounded-2xl p-3 shadow-lg border border-slate-700 group-hover:border-cyan-400 transition-all">
                    <img src="/nil-portal-icon-final.jpeg" alt="Portal" className="w-14 h-14 rounded-xl object-cover" />
                  </div>
                </div>
                <p className="text-slate-300 text-xs mt-2 text-center font-medium">🏠 Portal</p>
              </div>
              
              {/* Messenger */}
              <div className="flex flex-col items-center group cursor-pointer">
                <div className="relative">
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white text-[8px] font-bold px-2 py-0.5 rounded-full z-20">LIVE</div>
                  <div className="bg-slate-800 rounded-2xl p-3 shadow-lg border border-slate-700 group-hover:border-cyan-400 transition-all">
                    <img src="/messenger-icon-final.jpeg" alt="Messenger" className="w-14 h-14 rounded-xl object-cover" />
                  </div>
                </div>
                <p className="text-slate-300 text-xs mt-2 text-center font-medium">💬 Messenger</p>
              </div>
              
              {/* Diamond Grind */}
              <div className="flex flex-col items-center group cursor-pointer">
                <div className="relative">
                  <div className="absolute -top-2 -right-2 bg-purple-500 text-white text-[8px] font-bold px-2 py-0.5 rounded-full z-20 flex items-center gap-1">💎 ELITE</div>
                  <div className="bg-slate-800 rounded-2xl p-3 shadow-lg border border-slate-700 group-hover:border-purple-400 transition-all">
                    <img src="/diamond-grind-app-icon.png" alt="Diamond Grind" className="w-14 h-14 rounded-xl object-cover" />
                  </div>
                </div>
                <p className="text-slate-300 text-xs mt-2 text-center font-medium">💪 Diamond Grind</p>
              </div>
              
              {/* Warriors Playbook */}
              <div className="flex flex-col items-center group cursor-pointer">
                <div className="relative">
                  <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-[8px] font-bold px-2 py-0.5 rounded-full z-20 flex items-center gap-1">⚔️ NEW</div>
                  <div className="bg-slate-800 rounded-2xl p-3 shadow-lg border border-slate-700 group-hover:border-blue-400 transition-all">
                    <img src="/warriors-playbook-icon.png" alt="Warriors Playbook" className="w-14 h-14 rounded-xl object-cover" />
                  </div>
                </div>
                <p className="text-slate-300 text-xs mt-2 text-center font-medium">📖 Warriors Playbook</p>
              </div>
              
              {/* Transfer Portal */}
              <div className="flex flex-col items-center group cursor-pointer">
                <div className="relative">
                  <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-[8px] font-bold px-2 py-0.5 rounded-full z-20 flex items-center gap-1">🔥 HOT</div>
                  <div className="bg-slate-800 rounded-2xl p-3 shadow-lg border border-slate-700 group-hover:border-orange-400 transition-all">
                    <img src="/transfer-portal-app-icon.png" alt="Transfer Portal" className="w-14 h-14 rounded-xl object-cover" />
                  </div>
                </div>
                <p className="text-slate-300 text-xs mt-2 text-center font-medium">🚀 Transfer Portal</p>
              </div>
              
              {/* NIL Vault */}
              <div className="flex flex-col items-center group cursor-pointer">
                <div className="relative">
                  <div className="absolute -top-2 -right-2 bg-emerald-500 text-white text-[8px] font-bold px-2 py-0.5 rounded-full z-20 flex items-center gap-1">💰 $$$</div>
                  <div className="bg-slate-800 rounded-2xl p-3 shadow-lg border border-slate-700 group-hover:border-emerald-400 transition-all">
                    <img src="/nil-portal-app-icon.jpeg" alt="NIL Vault" className="w-14 h-14 rounded-xl object-cover" />
                  </div>
                </div>
                <p className="text-slate-300 text-xs mt-2 text-center font-medium">🏆 NIL Vault</p>
              </div>
              
              {/* AI Sales */}
              <div className="flex flex-col items-center group cursor-pointer">
                <div className="relative">
                  <div className="absolute -top-2 -right-2 bg-violet-500 text-white text-[8px] font-bold px-2 py-0.5 rounded-full z-20 flex items-center gap-1">🧙 AI</div>
                  <div className="bg-slate-800 rounded-2xl p-3 shadow-lg border border-slate-700 group-hover:border-violet-400 transition-all">
                    <img src="/athlynx-app-icon.png" alt="AI Sales" className="w-14 h-14 rounded-xl object-cover" />
                  </div>
                </div>
                <p className="text-slate-300 text-xs mt-2 text-center font-medium">🧙 AI Sales Wizard</p>
              </div>
              
              {/* Faith */}
              <div className="flex flex-col items-center group cursor-pointer">
                <div className="relative">
                  <div className="absolute -top-2 -right-2 bg-pink-500 text-white text-[8px] font-bold px-2 py-0.5 rounded-full z-20 flex items-center gap-1">✝️ BLESSED</div>
                  <div className="bg-slate-800 rounded-2xl p-3 shadow-lg border border-slate-700 group-hover:border-pink-400 transition-all">
                    <img src="/faith-app-icon.png" alt="Faith" className="w-14 h-14 rounded-xl object-cover" />
                  </div>
                </div>
                <p className="text-slate-300 text-xs mt-2 text-center font-medium">🙏 Faith</p>
              </div>
              
              {/* AI Recruiter */}
              <div className="flex flex-col items-center group cursor-pointer">
                <div className="relative">
                  <div className="absolute -top-2 -right-2 bg-rose-500 text-white text-[8px] font-bold px-2 py-0.5 rounded-full z-20 flex items-center gap-1">🤖 AI</div>
                  <div className="bg-slate-800 rounded-2xl p-3 shadow-lg border border-slate-700 group-hover:border-rose-400 transition-all">
                    <img src="/athlynx-app-icon.png" alt="AI Recruiter" className="w-14 h-14 rounded-xl object-cover" />
                  </div>
                </div>
                <p className="text-slate-300 text-xs mt-2 text-center font-medium">🤖 AI Recruiter</p>
              </div>
              
              {/* AI Content */}
              <div className="flex flex-col items-center group cursor-pointer">
                <div className="relative">
                  <div className="absolute -top-2 -right-2 bg-amber-500 text-white text-[8px] font-bold px-2 py-0.5 rounded-full z-20 flex items-center gap-1">✨ AI</div>
                  <div className="bg-slate-800 rounded-2xl p-3 shadow-lg border border-slate-700 group-hover:border-amber-400 transition-all">
                    <img src="/athlynx-app-icon.png" alt="AI Content" className="w-14 h-14 rounded-xl object-cover" />
                  </div>
                </div>
                <p className="text-slate-300 text-xs mt-2 text-center font-medium">✨ AI Content</p>
              </div>
            </div>
          </div>
        </section>

        {/* Countdown Section */}
        <section className="py-12 px-4 bg-gradient-to-b from-blue-950 to-slate-900">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-cyan-400 text-sm tracking-wider mb-2">THE FUTURE OF ATHLETE SUCCESS</p>
            <h2 className="text-white font-black text-4xl mb-2">ATHLYNX</h2>
            <p className="text-cyan-400 font-semibold tracking-wider mb-8">THE ATHLETE'S PLAYBOOK</p>
            
            <p className="text-slate-400 text-sm mb-2">LAUNCHING IN</p>
            <p className="text-amber-400 font-bold text-xl mb-6">FEBRUARY 1, 2026</p>
            
            {/* Countdown Timer */}
            <div className="flex justify-center gap-4 mb-8">
              <div className="bg-slate-800 rounded-xl px-6 py-4 border border-slate-700">
                <p className="text-white font-black text-3xl">{timeLeft.days}</p>
                <p className="text-slate-400 text-xs">DAYS</p>
              </div>
              <div className="bg-slate-800 rounded-xl px-6 py-4 border border-slate-700">
                <p className="text-white font-black text-3xl">{timeLeft.hours}</p>
                <p className="text-slate-400 text-xs">HRS</p>
              </div>
              <div className="bg-slate-800 rounded-xl px-6 py-4 border border-slate-700">
                <p className="text-white font-black text-3xl">{timeLeft.minutes}</p>
                <p className="text-slate-400 text-xs">MIN</p>
              </div>
              <div className="bg-slate-800 rounded-xl px-6 py-4 border border-slate-700">
                <p className="text-white font-black text-3xl">{timeLeft.seconds}</p>
                <p className="text-slate-400 text-xs">SEC</p>
              </div>
            </div>
            
            <p className="text-slate-500 text-sm">FOUNDING MEMBER SPOTS</p>
            <p className="text-amber-400 font-bold text-2xl">LIMITED TO 10,000</p>
          </div>
        </section>

        {/* Signup Form Section */}
        <section className="py-12 px-4 bg-slate-900">
          <div className="max-w-md mx-auto">
            <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700">
              <h3 className="text-white font-bold text-xl text-center mb-6">Join the VIP Waitlist</h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
                />
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="">Select Your Role</option>
                  {roles.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
                <select
                  value={sport}
                  onChange={(e) => setSport(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="">Select Your Sport</option>
                  {sports.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold py-4 rounded-lg transition-all shadow-lg disabled:opacity-50"
                >
                  {isSubmitting ? "JOINING..." : "CLAIM MY VIP SPOT"}
                </button>
              </form>
              
              <p className="text-slate-500 text-xs text-center mt-4">
                No credit card required. By signing up, you agree to receive updates about ATHLYNX.
              </p>
            </div>
          </div>
        </section>

        {/* Already VIP Member Section */}
        <section className="py-8 px-4 bg-slate-900">
          <div className="max-w-md mx-auto">
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-cyan-500/30 text-center">
              <h3 className="text-white font-bold text-lg mb-2">ALREADY A VIP MEMBER?</h3>
              <p className="text-slate-400 text-sm mb-4">Enter your access code to unlock all 6 apps</p>
              <button 
                onClick={() => setShowVipModal(true)}
                className="bg-cyan-500 hover:bg-cyan-400 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
              >
                Enter VIP Code
              </button>
            </div>
          </div>
        </section>

        {/* Preview the App Section */}
        <section className="py-8 px-4 bg-slate-900">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-slate-400 text-sm mb-4">Preview the App →</p>
            <div className="flex justify-center gap-6 flex-wrap">
              <div className="flex items-center gap-2 text-slate-300 text-sm">
                <span>👥</span>
                <span className="text-green-400">✓</span>
                <span>Social Network</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300 text-sm">
                <span>🤝</span>
                <span className="text-green-400">✓</span>
                <span>NIL Deals</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300 text-sm">
                <span>💬</span>
                <span className="text-green-400">✓</span>
                <span>Messaging</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300 text-sm">
                <span>📊</span>
                <span className="text-green-400">✓</span>
                <span>Analytics</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300 text-sm">
                <span>🛡️</span>
                <span className="text-green-400">✓</span>
                <span>Compliance</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER - Black Background with Full Organization Info */}
      <footer className="bg-black text-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Top Section - Logo and Company Info */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Company Info */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <img src="/athlynx-logo-icon.png" alt="ATHLYNX" className="w-12 h-12" />
                <div>
                  <h3 className="text-white font-bold text-xl">ATHLYNX</h3>
                  <p className="text-gray-400 text-sm">THE ATHLETE'S PLAYBOOK</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                The comprehensive platform for athlete development, NIL management, recruiting, and career success.
              </p>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-gray-500 text-sm">Parent Company:</span>
                <span className="text-amber-400 font-semibold">Dozier Holdings Group, LLC</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500 text-sm">Subsidiary:</span>
                <span className="text-cyan-400 font-semibold">Athlynx AI Corporation</span>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Home</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Contact</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-white font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Cookie Policy</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">HIPAA Compliance</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Data Protection</a></li>
              </ul>
            </div>
          </div>

          {/* Chad A. Dozier Section */}
          <div className="border-t border-gray-800 pt-8 mb-8">
            <div className="bg-gray-900 rounded-xl p-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-24 h-24 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                  CAD
                </div>
                <div className="text-center md:text-left">
                  <h4 className="text-white font-bold text-xl mb-1">Chad A. Dozier</h4>
                  <p className="text-cyan-400 font-semibold mb-2">Founder & CEO</p>
                  <p className="text-gray-400 text-sm max-w-xl">
                    Visionary entrepreneur and athlete advocate dedicated to revolutionizing how athletes manage their careers, 
                    NIL opportunities, and professional development through cutting-edge technology.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="border-t border-gray-800 pt-8 mb-8">
            <h4 className="text-white font-bold text-center mb-6">Connect With Us</h4>
            <div className="flex justify-center gap-6">
              <a href="https://twitter.com/athlynx" target="_blank" rel="noopener noreferrer" className="bg-gray-800 hover:bg-gray-700 p-3 rounded-full transition-colors">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="https://instagram.com/athlynx" target="_blank" rel="noopener noreferrer" className="bg-gray-800 hover:bg-gray-700 p-3 rounded-full transition-colors">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="https://facebook.com/athlynx" target="_blank" rel="noopener noreferrer" className="bg-gray-800 hover:bg-gray-700 p-3 rounded-full transition-colors">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="https://linkedin.com/company/athlynx" target="_blank" rel="noopener noreferrer" className="bg-gray-800 hover:bg-gray-700 p-3 rounded-full transition-colors">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
              <a href="https://youtube.com/@athlynx" target="_blank" rel="noopener noreferrer" className="bg-gray-800 hover:bg-gray-700 p-3 rounded-full transition-colors">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
              <a href="https://tiktok.com/@athlynx" target="_blank" rel="noopener noreferrer" className="bg-gray-800 hover:bg-gray-700 p-3 rounded-full transition-colors">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
              </a>
            </div>
          </div>

          {/* Security & Legal Compliance */}
          <div className="border-t border-gray-800 pt-8 mb-8">
            <h4 className="text-white font-bold text-center mb-6">Security & Legal Compliance</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="bg-gray-900 rounded-lg p-4">
                <span className="text-2xl mb-2 block">🔒</span>
                <p className="text-gray-400 text-xs">256-bit SSL Encryption</p>
              </div>
              <div className="bg-gray-900 rounded-lg p-4">
                <span className="text-2xl mb-2 block">🏥</span>
                <p className="text-gray-400 text-xs">HIPAA Compliant</p>
              </div>
              <div className="bg-gray-900 rounded-lg p-4">
                <span className="text-2xl mb-2 block">🛡️</span>
                <p className="text-gray-400 text-xs">SOC 2 Type II</p>
              </div>
              <div className="bg-gray-900 rounded-lg p-4">
                <span className="text-2xl mb-2 block">🌐</span>
                <p className="text-gray-400 text-xs">GDPR Ready</p>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="border-t border-gray-800 pt-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-gray-500 text-sm">Email</p>
                <p className="text-cyan-400">support@athlynx.ai</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Phone</p>
                <p className="text-cyan-400">(601) 498-5282</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Address</p>
                <p className="text-gray-400 text-sm">19039 Cloyanna Lane, Humble, TX 77346</p>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-500 text-sm">
              © 2026 Athlynx AI Corporation. All rights reserved.
            </p>
            <p className="text-gray-600 text-xs mt-2">
              A subsidiary of Dozier Holdings Group, LLC
            </p>
          </div>
        </div>
      </footer>

      {/* VIP Code Modal */}
      {showVipModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl p-8 max-w-md w-full border border-slate-700">
            <h3 className="text-white font-bold text-xl text-center mb-6">Enter VIP Code</h3>
            <input
              type="text"
              placeholder="Enter your VIP code"
              value={vipCode}
              onChange={(e) => setVipCode(e.target.value.toUpperCase())}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 text-center text-lg tracking-wider mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowVipModal(false)}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleVipSubmit}
                className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-semibold py-3 rounded-lg transition-all"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
