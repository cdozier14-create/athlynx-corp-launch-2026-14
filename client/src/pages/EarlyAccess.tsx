import { useState, useEffect } from "react";
import { Link } from "wouter";

export default function EarlyAccess() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [sport, setSport] = useState("");
  const [vipCode, setVipCode] = useState("");
  const [showVipModal, setShowVipModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    document.title = "ATHLYNX 2026!! - The Athlete's Playbook";
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) { alert("Please select your role"); return; }
    if (!sport) { alert("Please select your sport"); return; }
    setSubmitted(true);
    alert("Thank you for signing up! You'll receive your VIP access code soon.");
  };

  const roles = ["Athlete", "Parent", "Coach", "Brand"];
  const sports = ["Baseball", "Football", "Basketball", "Soccer", "Track & Field", "Volleyball"];

  const apps = [
    { name: "Portal", icon: "/nil-portal-icon-final.jpeg", color: "from-slate-600 to-slate-700" },
    { name: "Messenger", icon: "/messenger-icon-final.jpeg", color: "from-blue-500 to-blue-600" },
    { name: "Diamond Grind", icon: "/diamond-grind-app-icon.png", color: "from-cyan-400 to-blue-500" },
    { name: "Warriors Playbook", icon: "/warriors-playbook-icon.png", color: "from-slate-600 to-slate-700" },
    { name: "Transfer Portal", icon: "/transfer-portal-app-icon.png", color: "from-slate-600 to-slate-700" },
    { name: "NIL Vault", icon: "/nil-portal-app-icon.jpeg", color: "from-slate-600 to-slate-700" },
    { name: "AI Sales", icon: "/athlynx-app-icon.png", color: "from-slate-600 to-slate-700" },
    { name: "Faith", icon: "/faith-app-icon.png", color: "from-slate-600 to-slate-700" },
    { name: "AI Recruiter", icon: "/athlynx-app-icon.png", color: "from-slate-600 to-slate-700" },
    { name: "AI Content", icon: "/athlynx-app-icon.png", color: "from-slate-600 to-slate-700" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-slate-50 to-white">
      {/* Diagonal Stripes Background */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none"
           style={{
             backgroundImage: `repeating-linear-gradient(
               45deg,
               #1e3a5f 0px,
               #1e3a5f 1px,
               transparent 1px,
               transparent 20px
             )`
           }}>
      </div>

      {/* STICKY HEADER */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm">
        {/* Top Bar - THE FUTURE OF ATHLETE SUCCESS */}
        <div className="bg-slate-800 text-white text-center py-1.5 text-xs tracking-widest font-medium">
          THE FUTURE OF ATHLETE SUCCESS
        </div>
        
        {/* Main Header */}
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo Box */}
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-400 rounded-xl px-4 py-2 flex items-center gap-2 shadow-lg relative">
              <img src="/athlynx-logo-icon.png" alt="ATHLYNX" className="w-8 h-8" />
              <div>
                <h1 className="text-white font-bold text-lg tracking-wide">ATHLYNX</h1>
                <p className="text-blue-100 text-[10px] tracking-wider">THE ATHLETE'S PLAYBOOK</p>
              </div>
              {/* Yellow dot indicator */}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full"></div>
            </div>
          </div>

          {/* Parent Company Badge */}
          <div className="hidden md:flex items-center gap-2 bg-slate-100 rounded-full px-4 py-2">
            <span className="text-slate-500 text-xs">👥</span>
            <span className="text-slate-600 text-sm font-medium">PARENT COMPANY: Dozier Holdings Group</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg text-sm flex items-center gap-1 transition-colors">
              👥 Founders
            </button>
            <button className="bg-white border-2 border-blue-500 text-blue-500 hover:bg-blue-50 font-semibold px-4 py-2 rounded-lg text-sm flex items-center gap-1 transition-colors">
              ◎ Portal Login
            </button>
          </div>
        </div>

        {/* Blue Status Bar */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white py-2 px-4 flex items-center justify-center gap-4 text-sm">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            LIVE PLATFORM
          </span>
          <span>•</span>
          <span>HIPAA-compliant</span>
          <span>•</span>
          <span>Protecting our precious cargo</span>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="relative">
        {/* Site Updating Notice */}
        <div className="bg-amber-50 border-b border-amber-200 py-2 px-4 text-center">
          <span className="text-amber-600 font-medium text-sm">
            ⚠️ SITE UPDATING LIVE DAILY - Please be patient with us while we add future updates and apps!
          </span>
        </div>

        {/* VIP Code Section */}
        <section className="py-12 px-4">
          <div className="max-w-md mx-auto">
            <div 
              onClick={() => setShowVipModal(true)}
              className="bg-slate-700 hover:bg-slate-600 rounded-2xl p-8 text-center cursor-pointer transition-colors shadow-xl"
            >
              <img src="/athlynx-logo-icon.png" alt="ATHLYNX" className="w-12 h-12 mx-auto mb-4 opacity-60" />
              <h2 className="text-white font-bold text-xl mb-1">HAVE A VIP CODE?</h2>
              <p className="text-slate-400 text-sm">TAP HERE TO ENTER</p>
            </div>
          </div>
        </section>

        {/* HEAVYWEIGHT CHAMPION Section */}
        <section className="bg-gradient-to-b from-slate-800 via-blue-900 to-slate-900 py-16 px-4 relative overflow-hidden">
          {/* Diagonal stripes overlay */}
          <div className="absolute inset-0 opacity-5"
               style={{
                 backgroundImage: `repeating-linear-gradient(45deg, white 0px, white 1px, transparent 1px, transparent 15px)`
               }}>
          </div>
          
          <div className="max-w-4xl mx-auto text-center relative">
            {/* Champion Banner */}
            <div className="inline-block bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full px-8 py-3 mb-8 shadow-lg">
              <span className="text-white font-bold tracking-wider">🏆 HEAVYWEIGHT CHAMPION OF THE WORLD 🏆</span>
            </div>

            {/* DHG Crab Shield */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-cyan-400 blur-3xl opacity-20"></div>
                <img 
                  src="/dhg-crab-shield.jpeg" 
                  alt="DHG Crab Shield" 
                  className="relative w-32 h-32 rounded-2xl shadow-2xl"
                />
              </div>
            </div>

            {/* THE UNDEFEATED CHAMPION */}
            <h2 className="text-cyan-400 text-2xl font-bold tracking-wider mb-8">THE UNDEFEATED CHAMPION</h2>

            {/* Stats Row */}
            <div className="flex justify-center gap-4 mb-12">
              <div className="bg-slate-800/80 backdrop-blur rounded-xl px-8 py-4 border border-slate-700">
                <div className="text-3xl mb-1">∞</div>
                <div className="text-slate-400 text-sm font-medium">UNDEFEATED</div>
              </div>
              <div className="bg-slate-800/80 backdrop-blur rounded-xl px-8 py-4 border border-slate-700">
                <div className="text-3xl mb-1">🥊</div>
                <div className="text-slate-400 text-sm font-medium">KNOCKOUTS</div>
              </div>
              <div className="bg-slate-800/80 backdrop-blur rounded-xl px-8 py-4 border border-slate-700">
                <div className="text-3xl mb-1">👑</div>
                <div className="text-slate-400 text-sm font-medium">CHAMPION</div>
              </div>
            </div>

            {/* THE LEGENDARY TRAINER Box */}
            <div className="relative max-w-2xl mx-auto">
              {/* Corner dots */}
              <div className="absolute -top-2 -left-2 w-4 h-4 bg-cyan-400 rounded-full"></div>
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-cyan-400 rounded-full"></div>
              <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-cyan-400 rounded-full"></div>
              <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-cyan-400 rounded-full"></div>
              
              <div className="border-2 border-cyan-400/50 rounded-2xl p-8 bg-slate-800/50 backdrop-blur">
                <div className="inline-block bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full px-6 py-2 mb-4">
                  <span className="text-white font-bold text-sm">THE LEGENDARY TRAINER</span>
                </div>
                <div className="flex items-center justify-center gap-3 mb-4">
                  <img src="/athlynx-logo-icon.png" alt="ATHLYNX" className="w-10 h-10" />
                  <div>
                    <h3 className="text-white font-bold text-2xl">ATHLYNX</h3>
                    <p className="text-slate-400 text-sm">THE ATHLETE'S PLAYBOOK</p>
                  </div>
                </div>
                <p className="text-slate-300 text-lg">
                  The mastermind behind the champion. <span className="text-cyan-400">Building champions</span>, <span className="text-pink-400">training winners</span>, and <span className="text-cyan-400">creating empires</span>.
                </p>
              </div>
            </div>

            {/* THE EMPIRE Box */}
            <div className="mt-8 max-w-md mx-auto">
              <div className="bg-slate-200/90 backdrop-blur rounded-2xl p-6 text-slate-800">
                <h4 className="text-blue-600 font-bold text-sm mb-3">THE EMPIRE</h4>
                <div className="flex justify-center gap-3 mb-2">
                  <span className="text-2xl">🏆</span>
                  <span className="text-2xl">💰</span>
                  <span className="text-2xl">⏱️</span>
                  <span className="text-2xl">🏢</span>
                  <span className="text-2xl">📈</span>
                </div>
                <p className="text-slate-600 text-sm font-medium">PASSIVE INCOME EMPIRE</p>
              </div>
            </div>
          </div>
        </section>

        {/* 10 POWERFUL APPS Section */}
        <section className="py-16 px-4 bg-gradient-to-b from-slate-100 to-white">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-center text-blue-600 font-medium text-lg mb-8">
              10 Powerful Apps. One Platform. Unlimited Potential.
            </h2>
            
            <div className="grid grid-cols-5 gap-4 mb-8">
              {apps.map((app, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className="bg-slate-200 rounded-2xl p-3 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                    <img 
                      src={app.icon} 
                      alt={app.name} 
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                  </div>
                  <p className="text-slate-600 text-xs mt-2 text-center font-medium">{app.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ATHLYNX Launch Section */}
        <section className="py-16 px-4 bg-gradient-to-b from-white to-slate-50">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-blue-600 text-sm font-medium tracking-wider mb-4">THE FUTURE OF ATHLETE SUCCESS</p>
            <h2 className="text-5xl font-bold text-slate-800 mb-2 tracking-tight">ATHLYNX</h2>
            <p className="text-slate-500 text-lg mb-8">THE ATHLETE'S PLAYBOOK</p>

            {/* VIP Early Access Button */}
            <button className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold px-8 py-4 rounded-xl shadow-lg mb-8 transition-all">
              <div className="text-sm">VIP EARLY ACCESS</div>
              <div className="text-lg">6 MONTHS FREE</div>
            </button>

            {/* Countdown Timer */}
            <div className="mb-4">
              <p className="text-slate-500 text-sm mb-3">LAUNCHING IN</p>
              <div className="flex justify-center gap-3">
                <div className="bg-slate-800 text-white rounded-xl px-6 py-4 min-w-[80px]">
                  <div className="text-3xl font-bold">{timeLeft.days}</div>
                  <div className="text-xs text-slate-400">DAYS</div>
                </div>
                <div className="bg-slate-800 text-white rounded-xl px-6 py-4 min-w-[80px]">
                  <div className="text-3xl font-bold">{timeLeft.hours}</div>
                  <div className="text-xs text-slate-400">HRS</div>
                </div>
                <div className="bg-slate-800 text-white rounded-xl px-6 py-4 min-w-[80px]">
                  <div className="text-3xl font-bold">{timeLeft.minutes}</div>
                  <div className="text-xs text-slate-400">MIN</div>
                </div>
                <div className="bg-slate-800 text-white rounded-xl px-6 py-4 min-w-[80px]">
                  <div className="text-3xl font-bold">{timeLeft.seconds}</div>
                  <div className="text-xs text-slate-400">SEC</div>
                </div>
              </div>
              <p className="text-blue-600 font-medium mt-3">FEBRUARY 1, 2026</p>
            </div>
          </div>
        </section>

        {/* FOUNDING MEMBER SPOTS Section */}
        <section className="py-8 px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-slate-800 rounded-2xl p-6 text-center text-white">
              <p className="text-sm text-slate-400 mb-1">FOUNDING MEMBER SPOTS</p>
              <h3 className="text-3xl font-bold mb-3">LIMITED TO 10,000</h3>
              {/* Progress bar */}
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 w-[65%]"></div>
              </div>
            </div>
          </div>
        </section>

        {/* SIGNUP FORM Section */}
        <section className="py-8 px-4">
          <div className="max-w-lg mx-auto">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-700 text-sm font-medium mb-1">FULL NAME *</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-700 text-sm font-medium mb-1">EMAIL ADDRESS *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-700 text-sm font-medium mb-1">PHONE NUMBER *</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone Number (Required)"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  required
                />
              </div>
              
              {/* Role Selection */}
              <div>
                <label className="block text-slate-700 text-sm font-medium mb-2">I AM A...</label>
                <div className="flex flex-wrap gap-2">
                  {roles.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`px-6 py-2 rounded-full border-2 font-medium transition-all ${
                        role === r
                          ? "bg-blue-600 border-blue-600 text-white"
                          : "bg-white border-slate-300 text-slate-600 hover:border-blue-400"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sport Selection */}
              <div>
                <label className="block text-slate-700 text-sm font-medium mb-2">PRIMARY SPORT</label>
                <div className="flex flex-wrap gap-2">
                  {sports.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSport(s)}
                      className={`px-4 py-2 rounded-full border-2 font-medium text-sm transition-all ${
                        sport === s
                          ? "bg-blue-600 border-blue-600 text-white"
                          : "bg-white border-slate-300 text-slate-600 hover:border-blue-400"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold py-4 rounded-lg shadow-lg transition-all"
              >
                CLAIM MY VIP SPOT
              </button>
              
              <p className="text-center text-slate-500 text-xs">
                No credit card required. By signing up, you agree to receive updates about ATHLYNX.
              </p>
              <p className="text-center text-slate-600 text-sm">
                Join athletes from 500+ schools already on the waitlist
              </p>
              <p className="text-center text-blue-600 text-sm font-medium">
                SEC • ACC • Big Ten • Big 12 • Pac-12
              </p>
            </form>
          </div>
        </section>

        {/* ALREADY A VIP MEMBER Section */}
        <section className="py-8 px-4">
          <div className="max-w-md mx-auto">
            <div className="bg-slate-800 rounded-2xl p-6 text-center text-white">
              <h3 className="font-bold text-lg mb-1">ALREADY A VIP MEMBER?</h3>
              <p className="text-slate-400 text-sm mb-4">Enter your access code to unlock all 6 apps</p>
              <button 
                onClick={() => setShowVipModal(true)}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2 rounded-lg transition-colors"
              >
                ENTER ACCESS CODE
              </button>
            </div>
          </div>
        </section>

        {/* Preview the App Section */}
        <section className="py-8 px-4 border-t border-slate-200">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-blue-600 text-sm font-medium mb-6">Preview the App →</p>
            <div className="flex justify-center gap-8">
              <div className="flex flex-col items-center">
                <span className="text-3xl mb-2">👥</span>
                <span className="text-slate-600 text-xs">✓ Social Network</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-3xl mb-2">🤝</span>
                <span className="text-slate-600 text-xs">✓ NIL Deals</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-3xl mb-2">💬</span>
                <span className="text-slate-600 text-xs">✓ Messaging</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-3xl mb-2">📊</span>
                <span className="text-slate-600 text-xs">✓ Analytics</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-3xl mb-2">🛡️</span>
                <span className="text-slate-600 text-xs">✓ Compliance</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-gradient-to-b from-slate-100 to-slate-200 pt-12 pb-8">
        <div className="max-w-6xl mx-auto px-4">
          {/* Footer Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-8">
            {/* ATHLYNX Column */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src="/athlynx-logo-icon.png" alt="ATHLYNX" className="w-8 h-8" />
                <span className="font-bold text-slate-800">ATHLYNX</span>
              </div>
              <p className="text-slate-600 text-sm mb-2">
                The Complete Athlete Ecosystem. One platform for NIL deals, training, recruiting, and more.
              </p>
              <p className="text-orange-500 text-xs font-bold mb-1">
                🔥 PERPETUAL MOTION - THE PROMISE THAT NEVER STOPS
              </p>
              <p className="text-slate-500 text-xs">A Dozier Holdings Group Company</p>
              <p className="text-slate-500 text-xs">Dreams Do Come True 2026</p>
            </div>

            {/* PLATFORM Column */}
            <div>
              <h4 className="font-bold text-slate-800 mb-3">PLATFORM</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>VIP Access</li>
                <li>Athlete Dashboard</li>
                <li>NIL Marketplace</li>
                <li>Transfer Portal</li>
                <li>Messages</li>
              </ul>
            </div>

            {/* RESOURCES Column */}
            <div>
              <h4 className="font-bold text-slate-800 mb-3">RESOURCES</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>Founder Story</li>
                <li>Founder Dedication</li>
                <li>Quick Links Hub</li>
                <li>Pricing</li>
                <li>Store</li>
              </ul>
            </div>

            {/* APPS Column */}
            <div>
              <h4 className="font-bold text-slate-800 mb-3">APPS</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>NIL Portal</li>
                <li>Diamond Grind</li>
                <li>Warriors Playbook</li>
                <li>Messenger</li>
                <li>All Apps</li>
              </ul>
              <h4 className="font-bold text-slate-800 mt-4 mb-2">LEGAL & COMPLIANCE</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>legal@dozierholdingsgroup.com</li>
              </ul>
            </div>

            {/* COMPANY Column */}
            <div>
              <h4 className="font-bold text-slate-800 mb-3">COMPANY</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>DHG Empire</li>
                <li>Softmor Inc</li>
                <li>Team</li>
                <li>Investor Hub</li>
                <li>Careers</li>
                <li>Founder Story</li>
              </ul>
            </div>
          </div>

          {/* Contact Row */}
          <div className="flex flex-wrap items-center justify-between border-t border-slate-300 pt-6 mb-6">
            <div className="flex items-center gap-4 text-sm text-slate-600">
              <span>📧 cdozier14@athlynx.ai</span>
              <span>📞 +1 (601) 498-5282</span>
              <span>🌐 athlynx.ai</span>
            </div>
            <div className="flex items-center gap-3">
              {/* Social Icons */}
              <span className="text-slate-500">📊</span>
              <span className="text-slate-500">📘</span>
              <span className="text-slate-500">🐦</span>
              <span className="text-slate-500">📷</span>
              <span className="text-slate-500">▶️</span>
            </div>
          </div>

          {/* Chad A. Dozier Section */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">CD</div>
            <div>
              <p className="font-bold text-slate-800">Chad A. Dozier</p>
              <p className="text-slate-500 text-sm">Founder & CEO • @CDozier14</p>
            </div>
          </div>
          <p className="text-slate-500 text-sm italic mb-6">"Look Ma and Nanny, I Made It"</p>

          {/* Security & Legal Compliance */}
          <div className="border-t border-slate-300 pt-6">
            <h4 className="text-cyan-600 font-bold mb-4 flex items-center gap-2">
              ◎ SECURITY & LEGAL COMPLIANCE
            </h4>
            <div className="grid md:grid-cols-3 gap-6 text-sm text-slate-600 mb-6">
              <div>
                <h5 className="font-bold text-slate-800 mb-1">HIPAA Compliant</h5>
                <p>All athlete health data, medical records, and personal information are encrypted and stored in compliance with enterprise-grade security standards.</p>
              </div>
              <div>
                <h5 className="font-bold text-slate-800 mb-1">Data Collection</h5>
                <p>We aggregate publicly available information from authorized sources. All web scraping complies with robots.txt and applicable laws.</p>
              </div>
              <div>
                <h5 className="font-bold text-slate-800 mb-1">Precious Cargo Protection</h5>
                <p>Athlete data is our most valuable asset. We employ 256-bit SSL encryption, SOC 2 compliance standards, and regular security audits.</p>
              </div>
            </div>
            <p className="text-slate-500 text-xs mb-4">
              By using this platform, you acknowledge our use of AI automation and agree to our data collection practices. Platform updated daily in real-time. For questions, contact <a href="mailto:legal@dozierholdingsgroup.com" className="text-blue-600">legal@dozierholdingsgroup.com</a>
            </p>
          </div>

          {/* Copyright */}
          <div className="text-center text-slate-500 text-sm pt-4 border-t border-slate-300">
            © 2025-2026 Dozier Holdings Group, LLC. All Rights Reserved.
          </div>
        </div>
      </footer>

      {/* VIP Code Modal */}
      {showVipModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-slate-800 mb-4">Enter VIP Code</h3>
            <input
              type="text"
              value={vipCode}
              onChange={(e) => setVipCode(e.target.value)}
              placeholder="Enter your VIP access code"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowVipModal(false)}
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert("VIP Code submitted: " + vipCode);
                  setShowVipModal(false);
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-bold"
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
