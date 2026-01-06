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
  
  // CRM tracking mutation
  const trackSignup = trpc.crm.trackSignup.useMutation();

  const joinWaitlist = trpc.waitlist.join.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        // Also track in CRM for analytics
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
            {/* ATHLYNX Logo Box - THE ATHLETE'S PLAYBOOK */}
            <Link href="/">
              <div className="relative cursor-pointer group">
                <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 rounded-xl px-5 py-3 flex items-center gap-4 shadow-xl hover:shadow-cyan-500/30 transition-all border border-cyan-400/30">
                  <img src="/athlynx-playbook-logo.png" alt="ATHLYNX - The Athlete's Playbook" className="h-14 md:h-16 rounded-lg shadow-lg" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border-2 border-slate-900 animate-pulse"></div>
                {/* Shine effect */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700 overflow-hidden"></div>
              </div>
            </Link>

            {/* Parent Company Text */}
            <div className="hidden md:flex items-center gap-6">
              <span className="text-slate-400 text-sm flex items-center gap-2">
                <span>🏢</span> PARENT COMPANY: <span className="text-white font-medium">Dozier Holdings Group</span>
              </span>
            </div>

            {/* Navigation Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Link href="/our-story">
                <button className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-all shadow-lg">
                  <span>👥</span> Founders
                </button>
              </Link>
              <button 
                onClick={() => setShowVipModal(true)}
                className="bg-white border-2 border-blue-500 text-blue-600 hover:bg-blue-50 font-semibold px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors"
              >
                <span>◎</span> Portal Login
              </button>
            </div>


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

        {/* Hero Section with ATHLYNX Logo - QUEEN OF THE BALL */}
        <section className="py-12 px-4">
          <div className="max-w-lg mx-auto">
            {/* ATHLYNX THE ATHLETE'S PLAYBOOK - Queen of the Ball */}
            <div className="relative group cursor-pointer">
              {/* Outer glow on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 rounded-3xl blur-2xl opacity-0 group-hover:opacity-60 transition-all duration-500 scale-110"></div>
              
              <div className="relative bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 rounded-3xl p-8 text-center shadow-2xl overflow-hidden border-2 border-cyan-400/30 group-hover:border-cyan-300 group-hover:scale-[1.02] transition-all duration-300">
                {/* Animated sparkles */}
                <div className="absolute top-3 right-3 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                <div className="absolute top-6 left-6 w-2 h-2 bg-white rounded-full animate-ping"></div>
                <div className="absolute bottom-6 right-8 w-2 h-2 bg-white rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
                <div className="absolute bottom-8 left-10 w-1.5 h-1.5 bg-yellow-300 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
                
                {/* Crown icon on hover */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-3xl opacity-0 group-hover:opacity-100 group-hover:-top-4 transition-all duration-300">👑</div>
                
                {/* Logo Image - THE QUEEN */}
                <div className="flex justify-center mb-4">
                  <img 
                    src="/athlynx-playbook-logo.png" 
                    alt="ATHLYNX - The Athlete's Playbook" 
                    className="h-20 md:h-24 rounded-xl shadow-2xl group-hover:scale-110 group-hover:shadow-cyan-400/50 transition-all duration-300"
                  />
                </div>
                
                {/* THE LEGENDARY TRAINER badge */}
                <div className="inline-block bg-cyan-400 text-slate-900 font-bold text-xs tracking-widest px-4 py-1.5 rounded-full mb-4 shadow-lg">
                  THE LEGENDARY TRAINER
                </div>
                
                {/* Tagline */}
                <p className="text-white/90 text-sm mb-1">The mastermind behind the champion.</p>
                <p className="text-cyan-300 text-sm font-semibold">Building champions, training winners, and creating empires.</p>
                
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
              </div>
            </div>
          </div>
        </section>

        {/* EPIC LAUNCH VIDEO SECTION */}
        <section className="py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="relative group">
              {/* Outer glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-amber-500 rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition-all duration-500"></div>
              
              {/* Video container */}
              <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 rounded-3xl p-6 border-2 border-cyan-400/30 shadow-2xl">
                <div className="text-center mb-6">
                  <span className="text-amber-400 text-3xl">🎬</span>
                  <h3 className="text-white font-black text-2xl mt-2">THE VISION</h3>
                  <p className="text-cyan-400 text-sm tracking-wider">DREAMS DO COME TRUE</p>
                </div>
                
                {/* Video Player */}
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-cyan-400/20">
                  <video 
                    controls 
                    className="w-full aspect-video bg-black"
                    poster="/athlynx-logo-icon.png"
                  >
                    <source src="/videos/NIL_Portal_Epic_Launch.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
                
                {/* Video caption */}
                <p className="text-slate-400 text-center text-sm mt-4">
                  <span className="text-cyan-400">★</span> ATHLYNX: The Perfect Storm Launch <span className="text-cyan-400">★</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* VIP Code Section - Queen of the Ball */}
        <section className="py-8 px-4">
          <div className="max-w-md mx-auto">
            <div className="relative group">
              {/* Outer glow on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-40 transition-all duration-500"></div>
              
              <div 
                onClick={() => setShowVipModal(true)}
                className="relative bg-gradient-to-b from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 rounded-2xl p-8 text-center cursor-pointer transition-all shadow-xl border border-cyan-500/20 group-hover:border-cyan-400/50 group-hover:scale-[1.02]"
              >
                {/* Logo at top */}
                <div className="flex justify-center mb-4">
                  <img 
                    src="/athlynx-playbook-logo.png" 
                    alt="ATHLYNX" 
                    className="h-12 rounded-lg shadow-lg group-hover:scale-110 group-hover:shadow-cyan-400/30 transition-all duration-300"
                  />
                </div>
                
                <h2 className="text-white font-black text-xl mb-2 tracking-wide">HAVE A VIP CODE?</h2>
                <p className="text-cyan-400 text-sm tracking-wider">TAP HERE TO ENTER</p>
                
                {/* Shine effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700 overflow-hidden"></div>
              </div>
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

        {/* ATHLYNX Star Logo with Glow */}
        <section className="py-12 px-4">
          <div className="max-w-md mx-auto">
            <div className="relative group">
              {/* Outer glow ring */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-3xl blur-xl opacity-40 group-hover:opacity-70 transition-all duration-500 animate-pulse"></div>
              
              {/* Main card */}
              <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 rounded-3xl p-8 border-2 border-cyan-400/50 group-hover:border-cyan-400 transition-all duration-300 shadow-2xl">
                {/* Stars decoration */}
                <div className="absolute top-4 left-4 text-yellow-400 text-2xl animate-pulse">⭐</div>
                <div className="absolute top-4 right-4 text-yellow-400 text-2xl animate-pulse delay-100">⭐</div>
                <div className="absolute bottom-4 left-4 text-yellow-400 text-xl animate-pulse delay-200">✨</div>
                <div className="absolute bottom-4 right-4 text-yellow-400 text-xl animate-pulse delay-300">✨</div>
                
                {/* Logo container with glow */}
                <div className="flex flex-col items-center">
                  <div className="relative mb-6">
                    {/* Logo glow */}
                    <div className="absolute inset-0 bg-cyan-400 rounded-full blur-2xl opacity-30 group-hover:opacity-50 transition-all"></div>
                    <img 
                      src="/athlynx-playbook-logo.png" 
                      alt="ATHLYNX - The Athlete's Playbook" 
                      className="relative h-28 md:h-32 drop-shadow-[0_0_25px_rgba(34,211,238,0.5)] group-hover:drop-shadow-[0_0_35px_rgba(34,211,238,0.8)] transition-all duration-300 group-hover:scale-110 rounded-xl" 
                    />
                  </div>
                  
                  {/* Brand text */}
                  <h3 className="text-white font-black text-4xl tracking-wider mb-2 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">ATHLYNX</h3>
                  <p className="text-cyan-400 font-bold text-lg tracking-[0.3em] mb-4">THE ATHLETE'S PLAYBOOK</p>
                  
                  {/* Star rating */}
                  <div className="flex items-center gap-1 mb-4">
                    <span className="text-yellow-400 text-3xl drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]">★</span>
                    <span className="text-yellow-400 text-3xl drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]">★</span>
                    <span className="text-yellow-400 text-3xl drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]">★</span>
                    <span className="text-yellow-400 text-3xl drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]">★</span>
                    <span className="text-yellow-400 text-3xl drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]">★</span>
                  </div>
                  
                  {/* Tagline */}
                  <p className="text-slate-300 text-center text-sm">
                    <span className="text-cyan-400 font-semibold">Dreams</span> • 
                    <span className="text-amber-400 font-semibold"> Do</span> • 
                    <span className="text-green-400 font-semibold"> Come True</span>
                  </p>
                </div>
              </div>
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
            <div className="bg-gradient-to-br from-slate-800 to-blue-900 rounded-2xl p-8 border border-cyan-500/30 relative overflow-hidden">
              {/* Animated glow background */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-amber-500/10 animate-pulse"></div>
              
              {/* Corner dots */}
              <div className="absolute top-3 left-3 w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              <div className="absolute top-3 right-3 w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-100"></div>
              <div className="absolute bottom-3 left-3 w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-200"></div>
              <div className="absolute bottom-3 right-3 w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-300"></div>
              
              <div className="relative text-center">
                <p className="text-amber-400 text-xs font-bold tracking-widest mb-2">THE LEGENDARY TRAINER</p>
                <img src="/athlynx-playbook-logo.png" alt="ATHLYNX - The Athlete's Playbook" className="h-16 mx-auto mb-4 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)] rounded-lg" />
                <h3 className="text-white font-black text-2xl mb-1">ATHLYNX</h3>
                <p className="text-cyan-400 font-semibold text-sm tracking-wider mb-4">THE ATHLETE'S PLAYBOOK</p>
                
                {/* Stats Row - Undefeated / Knockouts / Champion */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-slate-900/50 rounded-xl p-3 border border-green-500/30">
                    <p className="text-green-400 font-black text-2xl">∞</p>
                    <p className="text-slate-400 text-xs">UNDEFEATED</p>
                  </div>
                  <div className="bg-slate-900/50 rounded-xl p-3 border border-red-500/30">
                    <p className="text-red-400 font-black text-2xl">100%</p>
                    <p className="text-slate-400 text-xs">KNOCKOUTS</p>
                  </div>
                  <div className="bg-slate-900/50 rounded-xl p-3 border border-amber-500/30">
                    <p className="text-amber-400 font-black text-2xl">🏆</p>
                    <p className="text-slate-400 text-xs">CHAMPION</p>
                  </div>
                </div>
                
                <p className="text-slate-300 text-sm mb-4">
                  The mastermind behind the champion.<br/>
                  <span className="text-cyan-400 font-semibold">Building champions</span>, 
                  <span className="text-amber-400 font-semibold"> training winners</span>, 
                  and <span className="text-green-400 font-semibold">creating empires</span>.
                </p>
                
                {/* THE EMPIRE Box */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-4 mt-4 border border-amber-500/30">
                  <p className="text-amber-400 font-bold text-sm mb-2">THE EMPIRE</p>
                  <div className="flex justify-center gap-3 text-2xl mb-2">
                    <span className="hover:scale-125 transition-transform cursor-pointer">🏆</span>
                    <span className="hover:scale-125 transition-transform cursor-pointer">💰</span>
                    <span className="hover:scale-125 transition-transform cursor-pointer">⏱️</span>
                    <span className="hover:scale-125 transition-transform cursor-pointer">🏢</span>
                    <span className="hover:scale-125 transition-transform cursor-pointer">📈</span>
                  </div>
                  <p className="text-slate-400 text-xs">PASSIVE INCOME EMPIRE</p>
                  <p className="text-amber-400/70 text-[10px] mt-1">12 Companies • Global Reach • Infinite Potential</p>
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
            
            {/* Apps Grid - 5x2 - Matching athlynx.manus.space */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 mb-8">
              {/* Portal */}
              <div className="flex flex-col items-center group cursor-pointer" onClick={() => window.location.href='/portal'}>
                <div className="bg-slate-700/80 rounded-2xl p-4 shadow-lg border border-slate-600 group-hover:border-cyan-400 transition-all">
                  <img src="/icons/portal.jpeg" alt="Portal" className="w-16 h-16 rounded-xl object-cover" />
                </div>
                <p className="text-slate-300 text-sm mt-3 text-center font-medium">Portal</p>
              </div>
              
              {/* Messenger */}
              <div className="flex flex-col items-center group cursor-pointer">
                <div className="bg-slate-700/80 rounded-2xl p-4 shadow-lg border border-slate-600 group-hover:border-cyan-400 transition-all">
                  <img src="/icons/messenger.jpeg" alt="Messenger" className="w-16 h-16 rounded-xl object-cover" />
                </div>
                <p className="text-slate-300 text-sm mt-3 text-center font-medium">Messenger</p>
              </div>
              
              {/* Diamond Grind */}
              <div className="flex flex-col items-center group cursor-pointer">
                <div className="bg-slate-700/80 rounded-2xl p-4 shadow-lg border border-slate-600 group-hover:border-purple-400 transition-all">
                  <img src="/icons/diamond-grind.png" alt="Diamond Grind" className="w-16 h-16 rounded-xl object-cover" />
                </div>
                <p className="text-slate-300 text-sm mt-3 text-center font-medium">Diamond Grind</p>
              </div>
              
              {/* Warriors Playbook */}
              <div className="flex flex-col items-center group cursor-pointer">
                <div className="bg-slate-700/80 rounded-2xl p-4 shadow-lg border border-slate-600 group-hover:border-blue-400 transition-all">
                  <img src="/icons/warriors-playbook.png" alt="Warriors Playbook" className="w-16 h-16 rounded-xl object-cover" />
                </div>
                <p className="text-slate-300 text-sm mt-3 text-center font-medium">Warriors Playbook</p>
              </div>
              
              {/* Transfer Portal */}
              <div className="flex flex-col items-center group cursor-pointer" onClick={() => window.location.href='/transfer-portal'}>
                <div className="bg-slate-700/80 rounded-2xl p-4 shadow-lg border border-slate-600 group-hover:border-green-400 transition-all">
                  <img src="/icons/transfer-portal.png" alt="Transfer Portal" className="w-16 h-16 rounded-xl object-cover" />
                </div>
                <p className="text-slate-300 text-sm mt-3 text-center font-medium">Transfer Portal</p>
              </div>
              
              {/* NIL Vault */}
              <div className="flex flex-col items-center group cursor-pointer">
                <div className="bg-slate-700/80 rounded-2xl p-4 shadow-lg border border-slate-600 group-hover:border-emerald-400 transition-all">
                  <img src="/icons/nil-vault.png" alt="NIL Vault" className="w-16 h-16 rounded-xl object-cover" />
                </div>
                <p className="text-slate-300 text-sm mt-3 text-center font-medium">NIL Vault</p>
              </div>
              
              {/* AI Sales */}
              <div className="flex flex-col items-center group cursor-pointer">
                <div className="bg-slate-700/80 rounded-2xl p-4 shadow-lg border border-slate-600 group-hover:border-violet-400 transition-all">
                  <img src="/icons/ai-sales.png" alt="AI Sales" className="w-16 h-16 rounded-xl object-cover" />
                </div>
                <p className="text-slate-300 text-sm mt-3 text-center font-medium">AI Sales</p>
              </div>
              
              {/* Faith */}
              <div className="flex flex-col items-center group cursor-pointer">
                <div className="bg-slate-700/80 rounded-2xl p-4 shadow-lg border border-slate-600 group-hover:border-pink-400 transition-all">
                  <img src="/icons/faith.png" alt="Faith" className="w-16 h-16 rounded-xl object-cover" />
                </div>
                <p className="text-slate-300 text-sm mt-3 text-center font-medium">Faith</p>
              </div>
              
              {/* AI Recruiter */}
              <div className="flex flex-col items-center group cursor-pointer">
                <div className="bg-slate-700/80 rounded-2xl p-4 shadow-lg border border-slate-600 group-hover:border-rose-400 transition-all">
                  <img src="/icons/ai-recruiter.png" alt="AI Recruiter" className="w-16 h-16 rounded-xl object-cover" />
                </div>
                <p className="text-slate-300 text-sm mt-3 text-center font-medium">AI Recruiter</p>
              </div>
              
              {/* AI Content */}
              <div className="flex flex-col items-center group cursor-pointer">
                <div className="bg-slate-700/80 rounded-2xl p-4 shadow-lg border border-slate-600 group-hover:border-amber-400 transition-all">
                  <img src="/icons/ai-content.png" alt="AI Content" className="w-16 h-16 rounded-xl object-cover" />
                </div>
                <p className="text-slate-300 text-sm mt-3 text-center font-medium">AI Content</p>
              </div>
            </div>
          </div>
        </section>

        {/* Video Gallery Section */}
        <section className="py-16 px-4 bg-gradient-to-b from-slate-900 to-blue-950">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-amber-400 text-sm tracking-widest mb-2">🎬 MEDIA GALLERY 🎬</p>
              <h2 className="text-white font-black text-3xl mb-2">See The Vision</h2>
              <p className="text-cyan-400 text-sm">Watch our journey unfold</p>
            </div>
            
            {/* Video Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* NIL Portal Launch */}
              <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700 hover:border-cyan-400 transition-all">
                <video controls className="w-full aspect-video rounded-xl mb-3 bg-black" poster="/athlynx-logo-icon.png">
                  <source src="/videos/nil-portal-football.mp4" type="video/mp4" />
                </video>
                <h4 className="text-white font-bold">NIL Portal - Football</h4>
                <p className="text-slate-400 text-sm">The future of athlete recruitment</p>
              </div>
              
              {/* Diamond Grind */}
              <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700 hover:border-purple-400 transition-all">
                <video controls className="w-full aspect-video rounded-xl mb-3 bg-black" poster="/athlynx-logo-icon.png">
                  <source src="/videos/diamond-grind-baseball.mp4" type="video/mp4" />
                </video>
                <h4 className="text-white font-bold">Diamond Grind - Baseball</h4>
                <p className="text-slate-400 text-sm">Training excellence for athletes</p>
              </div>
              
              {/* Softmor AI */}
              <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700 hover:border-blue-400 transition-all">
                <video controls className="w-full aspect-video rounded-xl mb-3 bg-black" poster="/athlynx-logo-icon.png">
                  <source src="/videos/softmor-ai.mp4" type="video/mp4" />
                </video>
                <h4 className="text-white font-bold">Softmor AI</h4>
                <p className="text-slate-400 text-sm">Powering the future with AI</p>
              </div>
              
              {/* DHG Corporate */}
              <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700 hover:border-amber-400 transition-all">
                <video controls className="w-full aspect-video rounded-xl mb-3 bg-black" poster="/athlynx-logo-icon.png">
                  <source src="/videos/dhg-corporate.mov" type="video/mp4" />
                </video>
                <h4 className="text-white font-bold">DHG Empire</h4>
                <p className="text-slate-400 text-sm">The parent company behind it all</p>
              </div>
              
              {/* NIL Youth */}
              <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700 hover:border-green-400 transition-all">
                <video controls className="w-full aspect-video rounded-xl mb-3 bg-black" poster="/athlynx-logo-icon.png">
                  <source src="/videos/nil-portal-youth.mp4" type="video/mp4" />
                </video>
                <h4 className="text-white font-bold">NIL Portal - Youth</h4>
                <p className="text-slate-400 text-sm">Building tomorrow's champions</p>
              </div>
              
              {/* ATHLYNX Intro */}
              <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700 hover:border-cyan-400 transition-all">
                <video controls className="w-full aspect-video rounded-xl mb-3 bg-black" poster="/athlynx-logo-icon.png">
                  <source src="/videos/athlynx-intro-1.mp4" type="video/mp4" />
                </video>
                <h4 className="text-white font-bold">ATHLYNX Introduction</h4>
                <p className="text-slate-400 text-sm">The Athlete's Playbook</p>
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

        {/* THE DYNASTY SECTION - Kraft/Belichick/Brady Story */}
        <section className="py-16 px-4 bg-gradient-to-b from-slate-900 via-blue-950/50 to-slate-900">
          <div className="max-w-5xl mx-auto">
            {/* Dynasty Header */}
            <div className="text-center mb-12">
              <p className="text-amber-400 text-sm tracking-widest mb-2">🏆 THE PERFECT STORM 🏆</p>
              <h2 className="text-white font-black text-4xl md:text-5xl mb-4">Building a Dynasty</h2>
              <p className="text-cyan-400 font-semibold tracking-wider">FROM NOTHING TO EVERYTHING</p>
            </div>

            {/* Dynasty Story Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {/* The Owner - Kraft = Chad */}
              <div className="bg-gradient-to-br from-amber-900/30 to-slate-900 rounded-2xl p-6 border border-amber-500/30 hover:border-amber-400 transition-all group">
                <div className="text-4xl mb-4">👔</div>
                <h3 className="text-amber-400 font-bold text-xl mb-2">The Visionary Owner</h3>
                <p className="text-slate-300 text-sm mb-4">Robert Kraft bought a struggling franchise and built an empire. <span className="text-amber-400 font-semibold">Chad A. Dozier</span> is doing the same with ATHLYNX.</p>
                <p className="text-slate-500 text-xs italic">"I saw what others couldn't see. A platform that serves athletes, not exploits them."</p>
              </div>

              {/* The System - Belichick = Manus AI */}
              <div className="bg-gradient-to-br from-blue-900/30 to-slate-900 rounded-2xl p-6 border border-blue-500/30 hover:border-blue-400 transition-all group">
                <div className="text-4xl mb-4">🧠</div>
                <h3 className="text-blue-400 font-bold text-xl mb-2">The System</h3>
                <p className="text-slate-300 text-sm mb-4">Bill Belichick's system made average players elite. <span className="text-blue-400 font-semibold">Manus AI</span> is our system—executing strategy with precision.</p>
                <p className="text-slate-500 text-xs italic">"Do your job." — Our AI does exactly that, 24/7.</p>
              </div>

              {/* The GOAT - Brady = ATHLYNX */}
              <div className="bg-gradient-to-br from-cyan-900/30 to-slate-900 rounded-2xl p-6 border border-cyan-500/30 hover:border-cyan-400 transition-all group">
                <div className="text-4xl mb-4">🐐</div>
                <h3 className="text-cyan-400 font-bold text-xl mb-2">The Underdog</h3>
                <p className="text-slate-300 text-sm mb-4">Tom Brady was pick #199. Irrelevant. Now he's the GOAT. <span className="text-cyan-400 font-semibold">ATHLYNX</span> is our Tom Brady—the underdog becoming legendary.</p>
                <p className="text-slate-500 text-xs italic">"Everyone counted us out. That was their mistake."</p>
              </div>
            </div>

            {/* Mission & Vision */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* Mission Statement */}
              <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <h3 className="text-white font-bold text-2xl">Our Mission</h3>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  To democratize athlete success by providing every athlete—from high school to professional—with the same tools, connections, and opportunities that were once reserved for the elite few. We are the great equalizer in sports.
                </p>
              </div>

              {/* Vision Statement */}
              <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">🔮</span>
                  </div>
                  <h3 className="text-white font-bold text-2xl">Our Vision</h3>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  By 2030, ATHLYNX will be the operating system for every athlete's career—from recruitment to retirement. A world where talent is discovered, developed, and rewarded fairly, powered by AI that works for athletes, not against them.
                </p>
              </div>
            </div>

            {/* Executive Summary */}
            <div className="bg-gradient-to-r from-blue-900/30 via-slate-900 to-cyan-900/30 rounded-2xl p-8 border border-cyan-500/30 mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">📊</span>
                </div>
                <div>
                  <h3 className="text-white font-bold text-2xl">Executive Summary</h3>
                  <p className="text-cyan-400 text-sm">The $50B Opportunity</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-slate-300 leading-relaxed mb-4">
                    <span className="text-cyan-400 font-semibold">ATHLYNX</span> is a comprehensive AI-powered platform serving the $50B+ athlete services market. We combine NIL management, transfer portal intelligence, training optimization, and career planning into one unified ecosystem.
                  </p>
                  <p className="text-slate-300 leading-relaxed">
                    Backed by <span className="text-blue-400 font-semibold">Dozier Holdings Group</span>, powered by <span className="text-purple-400 font-semibold">Manus AI</span>, and built on <span className="text-green-400 font-semibold">Nebius AI Cloud</span> infrastructure with NVIDIA H200/H100 GPUs.
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center bg-slate-800/50 rounded-lg px-4 py-2">
                    <span className="text-slate-400">Target Market</span>
                    <span className="text-white font-bold">$50B+</span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-800/50 rounded-lg px-4 py-2">
                    <span className="text-slate-400">Athletes Served</span>
                    <span className="text-white font-bold">8M+ NCAA</span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-800/50 rounded-lg px-4 py-2">
                    <span className="text-slate-400">Launch Date</span>
                    <span className="text-amber-400 font-bold">Feb 1, 2026</span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-800/50 rounded-lg px-4 py-2">
                    <span className="text-slate-400">Founding Spots</span>
                    <span className="text-cyan-400 font-bold">10,000</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Community Co-Design CTA */}
            <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-2xl p-8 border border-purple-500/30 text-center">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-white font-bold text-2xl mb-2">Help Us Build YOUR Platform</h3>
              <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
                This isn't just our platform—it's YOURS. We're building ATHLYNX with the community, for the community. 
                Your feedback shapes every feature. Your voice matters. Together, we're creating the future of athlete success.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button 
                  onClick={() => toast.info('Community voting coming soon!')}
                  className="bg-purple-500 hover:bg-purple-600 text-white font-bold px-6 py-3 rounded-xl transition-all"
                >
                  🗳️ Vote on Features
                </button>
                <button 
                  onClick={() => toast.info('Feedback form coming soon!')}
                  className="bg-slate-700 hover:bg-slate-600 text-white font-bold px-6 py-3 rounded-xl transition-all border border-slate-600"
                >
                  💬 Share Feedback
                </button>
                <button 
                  onClick={() => toast.info('Discord community coming soon!')}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl transition-all"
                >
                  🎮 Join Discord
                </button>
              </div>
            </div>
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

        {/* VOTE FOR YOUR FAVORITE - Campaign Section */}
        <section className="py-20 px-4 bg-gradient-to-b from-slate-900 to-purple-950">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <img src="/community-vote-logo.png" alt="Community Vote" className="w-20 h-20 rounded-2xl shadow-lg" />
            </div>
            <div className="inline-block px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full text-white text-sm font-bold mb-6 animate-pulse">
              🗳️ HELP US DECIDE!
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              VOTE FOR YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">FAVORITE</span>
            </h2>
            <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
              We're building TWO amazing versions of ATHLYNX! Visit both sites and tell us which one you love more. Your vote shapes the future!
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Site A */}
              <a href="https://athlynx.manus.space" target="_blank" rel="noopener noreferrer" className="group">
                <div className="bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border-2 border-cyan-400/50 rounded-2xl p-8 hover:border-cyan-400 hover:scale-105 transition-all duration-300">
                  <div className="text-6xl mb-4">🅰️</div>
                  <h3 className="text-white font-bold text-2xl mb-2">SITE A</h3>
                  <p className="text-cyan-300 font-semibold">athlynx.manus.space</p>
                  <p className="text-slate-400 text-sm mt-2">Original Design • Countdown Timer</p>
                  <div className="mt-4 px-6 py-3 bg-cyan-500 text-white font-bold rounded-full group-hover:bg-cyan-400 transition-colors">
                    VISIT SITE A →
                  </div>
                </div>
              </a>
              
              {/* Site B */}
              <a href="https://athlynxai.manus.space" target="_blank" rel="noopener noreferrer" className="group">
                <div className="bg-gradient-to-br from-purple-500/20 to-pink-600/20 border-2 border-purple-400/50 rounded-2xl p-8 hover:border-purple-400 hover:scale-105 transition-all duration-300">
                  <div className="text-6xl mb-4">🅱️</div>
                  <h3 className="text-white font-bold text-2xl mb-2">SITE B</h3>
                  <p className="text-purple-300 font-semibold">athlynxai.manus.space</p>
                  <p className="text-slate-400 text-sm mt-2">New Design • Full Features</p>
                  <div className="mt-4 px-6 py-3 bg-purple-500 text-white font-bold rounded-full group-hover:bg-purple-400 transition-colors">
                    VISIT SITE B →
                  </div>
                </div>
              </a>
            </div>
            
            {/* Social Share */}
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
              <p className="text-white font-bold mb-4">📢 Share Your Vote on Social Media!</p>
              <p className="text-slate-400 text-sm mb-4">Tag us @ATHLYNX and use #ATHLYNXVote to let us know which site you prefer!</p>
              <div className="flex justify-center gap-4">
                <a href="https://twitter.com/intent/tweet?text=I%20just%20voted%20for%20my%20favorite%20ATHLYNX%20design!%20Check%20out%20both%20sites%20and%20vote%20%23ATHLYNXVote%20%40ATHLYNX" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-blue-500 text-white rounded-full text-sm font-bold hover:bg-blue-400 transition-colors">
                  🐦 Tweet Your Vote
                </a>
                <a href="https://wa.me/16014985282?text=I%20voted%20for%20my%20favorite%20ATHLYNX%20design!" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-green-500 text-white rounded-full text-sm font-bold hover:bg-green-400 transition-colors">
                  💬 WhatsApp Vote
                </a>
              </div>
            </div>
            
            <p className="text-slate-500 text-sm mt-6">Voting ends February 1, 2026 • The winning design becomes the official ATHLYNX!</p>
            
            {/* Community Feedback Form */}
            <div className="mt-12 bg-slate-800/80 rounded-2xl p-8 border border-slate-700">
              <h3 className="text-2xl font-bold text-white mb-2">💬 COMMUNITY FEEDBACK</h3>
              <p className="text-slate-400 mb-6">Help us build the perfect platform! Tell us what you think.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                <div>
                  <label className="text-cyan-400 font-semibold text-sm mb-2 block">What do you LOVE? 💚</label>
                  <textarea 
                    placeholder="Tell us what features or designs you love..."
                    className="w-full bg-slate-900 border border-slate-600 rounded-xl p-4 text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none resize-none h-24"
                  />
                </div>
                <div>
                  <label className="text-pink-400 font-semibold text-sm mb-2 block">What could be BETTER? 💡</label>
                  <textarea 
                    placeholder="Share your suggestions for improvements..."
                    className="w-full bg-slate-900 border border-slate-600 rounded-xl p-4 text-white placeholder-slate-500 focus:border-pink-400 focus:outline-none resize-none h-24"
                  />
                </div>
              </div>
              
              <div className="mt-6">
                <label className="text-amber-400 font-semibold text-sm mb-2 block">Your Email (optional - for updates)</label>
                <input 
                  type="email"
                  placeholder="your@email.com"
                  className="w-full md:w-1/2 bg-slate-900 border border-slate-600 rounded-xl p-4 text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
                />
              </div>
              
              <button 
                onClick={() => toast.success('Thank you for your feedback! 🙏')}
                className="mt-6 px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold rounded-full hover:from-cyan-400 hover:to-purple-400 transition-all shadow-lg hover:shadow-cyan-500/30"
              >
                📨 SUBMIT FEEDBACK
              </button>
              
              <p className="text-slate-500 text-xs mt-4">Your feedback helps shape ATHLYNX for athletes everywhere!</p>
            </div>
            
            {/* Discussion Teaser */}
            <div className="mt-8 p-6 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-xl border border-amber-500/30">
              <p className="text-amber-400 font-bold text-lg">🚀 COMING SOON: Community Discussion Forum</p>
              <p className="text-slate-300 text-sm mt-2">A dedicated space for athletes, coaches, and brands to discuss features, share ideas, and connect!</p>
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
                <img src="/athlynx-playbook-logo.png" alt="ATHLYNX - The Athlete's Playbook" className="h-10 rounded-lg" />
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
                <a href="https://dozier-holdingsgroup.com.mx" target="_blank" rel="noopener noreferrer" className="text-amber-400 font-semibold hover:text-amber-300 transition-colors underline decoration-amber-400/30 hover:decoration-amber-300">
                  Dozier Holdings Group, LLC →
                </a>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500 text-sm">Subsidiary:</span>
                <span className="text-cyan-400 font-semibold">Athlynx AI Corporation</span>
              </div>
              <div className="mt-4 p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                <p className="text-gray-400 text-xs">🏢 <span className="text-white font-medium">DHG Portfolio:</span> ATHLYNX • DHG Data Centers • Softmor • 9 More Companies</p>
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
                  <p className="text-amber-400 font-bold text-lg mb-2 italic">"Look Ma and Nanny, I Made It!"</p>
                  <p className="text-gray-400 text-sm max-w-xl">
                    Visionary entrepreneur and athlete advocate dedicated to revolutionizing how athletes manage their careers, 
                    NIL opportunities, and professional development through cutting-edge technology.
                  </p>
                  <p className="text-gray-500 text-xs mt-2">Dreams Do Come True 2026</p>
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
              {/* WhatsApp */}
              <a href="https://wa.me/16014985282" target="_blank" rel="noopener noreferrer" className="bg-green-600 hover:bg-green-500 p-3 rounded-full transition-colors" title="WhatsApp: +1 (601) 498-5282">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </a>
              {/* WeChat */}
              <a href="#" onClick={(e) => { e.preventDefault(); alert('WeChat ID: wxid_uv8r2ll71shb12\n\nScan QR code or search this ID in WeChat to connect!'); }} className="bg-green-500 hover:bg-green-400 p-3 rounded-full transition-colors" title="WeChat: wxid_uv8r2ll71shb12">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 01.598.082l1.584.926a.272.272 0 00.14.045c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 01-.023-.156.49.49 0 01.201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.01-.27-.027-.407-.03zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.969-.982z"/></svg>
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
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
              <div>
                <p className="text-gray-500 text-sm">Email</p>
                <p className="text-cyan-400">support@athlynx.ai</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Phone</p>
                <p className="text-cyan-400">(601) 498-5282</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">WhatsApp</p>
                <a href="https://wa.me/16014985282" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:text-green-300">+1 (601) 498-5282</a>
              </div>
              <div>
                <p className="text-gray-500 text-sm">WeChat</p>
                <p className="text-green-400">wxid_uv8r2ll71shb12</p>
              </div>
              <div className="col-span-2 md:col-span-1">
                <p className="text-gray-500 text-sm">Address</p>
                <p className="text-gray-400 text-sm">12036 Lake Portal Drive, Houston, TX 77047</p>
                <p className="text-gray-400 text-sm">831 West 28th Street, Laurel, MS 39440</p>
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
            
            {/* Legal Disclaimer */}
            <div className="mt-6 pt-6 border-t border-gray-800">
              <p className="text-gray-600 text-xs max-w-2xl mx-auto">
                <strong>DISCLAIMER:</strong> All player profiles, statistics, and NIL valuations displayed on this platform are for demonstration purposes only unless explicitly created by verified users. ATHLYNX does not claim ownership of any athlete's name, image, or likeness. Real athlete data is only displayed with the athlete's consent upon account creation. Any resemblance to real persons in demo data is coincidental.
              </p>
              <p className="text-gray-600 text-xs mt-3 max-w-2xl mx-auto">
                <strong>INVESTMENT DISCLAIMER:</strong> ATHLYNX and Dozier Holdings Group do not provide financial, legal, or investment advice. NIL valuations are estimates based on publicly available data and proprietary algorithms. Consult qualified professionals before making any financial decisions.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* VIP Code Modal */}
      {showVipModal && (
        <div className="fixed inset-0 bg-gradient-to-b from-slate-900/95 via-blue-950/95 to-slate-900/95 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-3xl p-8 max-w-md w-full border border-cyan-500/30 shadow-2xl shadow-cyan-500/20">
            {/* Logo at top */}
            <div className="flex justify-center mb-6">
              <img src="/athlynx-playbook-logo.png" alt="ATHLYNX" className="h-16 rounded-xl shadow-lg" />
            </div>
            
            <h3 className="text-white font-black text-2xl text-center mb-2">HAVE A VIP CODE?</h3>
            <p className="text-cyan-400 text-sm text-center mb-6 tracking-wider">TAP HERE TO ENTER</p>
            
            <input
              type="text"
              placeholder="Enter your VIP code"
              value={vipCode}
              onChange={(e) => setVipCode(e.target.value.toUpperCase())}
              className="w-full bg-slate-700/50 border-2 border-cyan-500/30 rounded-xl px-4 py-4 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 text-center text-xl tracking-widest mb-6 font-bold"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowVipModal(false)}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-4 rounded-xl transition-colors border border-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={handleVipSubmit}
                className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-cyan-500/30"
              >
                ENTER PORTAL
              </button>
            </div>
            
            {/* Tagline */}
            <p className="text-center text-slate-400 text-xs mt-6">The mastermind behind the champion.</p>
            <p className="text-center text-cyan-400 text-xs font-semibold">Building champions, training winners, and creating empires.</p>
          </div>
        </div>
      )}
    </div>
  );
}
