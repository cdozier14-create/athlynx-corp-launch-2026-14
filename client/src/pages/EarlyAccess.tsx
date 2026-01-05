import { useState, useEffect } from "react";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName) { alert("Please enter your full name"); return; }
    if (!email) { alert("Please enter your email"); return; }
    if (!phone) { alert("Please enter your phone number"); return; }
    if (!role) { alert("Please select your role"); return; }
    if (!sport) { alert("Please select your sport"); return; }
    alert("Thank you for signing up! You'll receive your VIP access code soon.");
  };

  const roles = ["Athlete", "Parent", "Coach", "Brand"];
  const sports = ["Baseball", "Football", "Basketball", "Soccer", "Track & Field", "Volleyball"];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-slate-50 to-white text-slate-800">
      {/* Diagonal Stripes Background - matching screenshot exactly */}
      <div className="fixed inset-0 pointer-events-none"
           style={{
             backgroundImage: `repeating-linear-gradient(
               45deg,
               rgba(100, 116, 139, 0.03) 0px,
               rgba(100, 116, 139, 0.03) 1px,
               transparent 1px,
               transparent 20px
             )`
           }}>
      </div>

      {/* STICKY HEADER - Exact match to screenshot */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        {/* Top Bar - THE FUTURE OF ATHLETE SUCCESS */}
        <div className="bg-slate-700 text-white text-center py-2 text-xs tracking-[0.2em] font-medium">
          THE FUTURE OF ATHLETE SUCCESS
        </div>
        
        {/* Main Header Row */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            {/* ATHLYNX Logo Box - Blue gradient with yellow dot */}
            <div className="relative">
              <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl px-5 py-3 flex items-center gap-3 shadow-lg">
                <img src="/athlynx-logo-icon.png" alt="ATHLYNX" className="w-8 h-8" />
                <div>
                  <h1 className="text-white font-bold text-xl tracking-wide">ATHLYNX</h1>
                  <p className="text-blue-100 text-[10px] tracking-wider">THE ATHLETE'S PLAYBOOK</p>
                </div>
              </div>
              {/* Yellow dot indicator */}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border-2 border-white"></div>
            </div>

            {/* Parent Company Badge */}
            <div className="hidden md:flex items-center gap-2 bg-slate-100 rounded-full px-5 py-2.5 border border-slate-200">
              <span className="text-blue-600 font-bold text-sm">👥</span>
              <span className="text-slate-600 text-sm font-medium">PARENT COMPANY: Dozier Holdings Group</span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg text-sm flex items-center gap-2 transition-colors shadow-md">
                <span>👥</span> Founders
              </button>
              <button className="bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold px-5 py-2.5 rounded-lg text-sm flex items-center gap-2 transition-colors">
                <span>◎</span> Portal Login
              </button>
            </div>
          </div>
        </div>

        {/* Blue Status Bar */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white py-2.5 px-4 flex items-center justify-center gap-4 text-sm font-medium">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            LIVE PLATFORM
          </span>
          <span className="text-blue-200">•</span>
          <span>HIPAA-compliant</span>
          <span className="text-blue-200">•</span>
          <span>Protecting our precious cargo</span>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="relative">
        {/* Site Updating Notice - Yellow/Amber */}
        <div className="bg-amber-50 border-b border-amber-200 py-3 px-4 text-center">
          <span className="text-amber-700 font-medium text-sm">
            ⚠️ SITE UPDATING LIVE DAILY - Please be patient with us while we add future updates and apps!
          </span>
        </div>

        {/* VIP Code Section */}
        <section className="py-16 px-4">
          <div className="max-w-md mx-auto">
            <div 
              onClick={() => setShowVipModal(true)}
              className="bg-slate-600 hover:bg-slate-500 rounded-2xl p-10 text-center cursor-pointer transition-all shadow-xl hover:shadow-2xl"
            >
              <img src="/athlynx-logo-icon.png" alt="ATHLYNX" className="w-14 h-14 mx-auto mb-5 opacity-70" />
              <h2 className="text-white font-bold text-xl mb-2 tracking-wide">HAVE A VIP CODE?</h2>
              <p className="text-slate-300 text-sm tracking-wider">TAP HERE TO ENTER</p>
            </div>
          </div>
        </section>

        {/* HEAVYWEIGHT CHAMPION Section - Blue gradient background */}
        <section className="bg-gradient-to-b from-slate-700 via-blue-900 to-slate-800 py-20 px-4 relative overflow-hidden">
          {/* Diagonal stripes overlay */}
          <div className="absolute inset-0 opacity-10"
               style={{
                 backgroundImage: `repeating-linear-gradient(45deg, white 0px, white 1px, transparent 1px, transparent 15px)`
               }}>
          </div>
          
          <div className="max-w-4xl mx-auto text-center relative">
            {/* Champion Banner - Cyan/Blue pill */}
            <div className="inline-block bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full px-8 py-3 mb-10 shadow-lg">
              <span className="text-white font-bold tracking-wider text-sm">🏆 HEAVYWEIGHT CHAMPION OF THE WORLD 🏆</span>
            </div>

            {/* DHG Crab Shield */}
            <div className="flex justify-center mb-10">
              <div className="relative">
                <div className="absolute inset-0 bg-cyan-400 blur-3xl opacity-20"></div>
                <img 
                  src="/dhg-crab-shield.jpeg" 
                  alt="DHG Crab Shield" 
                  className="relative w-36 h-36 rounded-2xl shadow-2xl border-4 border-cyan-400/30"
                />
              </div>
            </div>

            {/* THE UNDEFEATED CHAMPION */}
            <h2 className="text-cyan-400 text-2xl font-bold tracking-wider mb-10">THE UNDEFEATED CHAMPION</h2>

            {/* Stats Row - 3 boxes */}
            <div className="flex justify-center gap-6 mb-14">
              <div className="bg-slate-800/80 backdrop-blur rounded-xl px-10 py-5 border border-slate-600">
                <div className="text-4xl mb-2 text-white">∞</div>
                <div className="text-slate-400 text-sm font-bold tracking-wider">UNDEFEATED</div>
              </div>
              <div className="bg-slate-800/80 backdrop-blur rounded-xl px-10 py-5 border border-slate-600">
                <div className="text-4xl mb-2">🥊</div>
                <div className="text-slate-400 text-sm font-bold tracking-wider">KNOCKOUTS</div>
              </div>
              <div className="bg-slate-800/80 backdrop-blur rounded-xl px-10 py-5 border border-slate-600">
                <div className="text-4xl mb-2">👑</div>
                <div className="text-slate-400 text-sm font-bold tracking-wider">CHAMPION</div>
              </div>
            </div>

            {/* THE LEGENDARY TRAINER Box - with cyan corner dots */}
            <div className="relative max-w-2xl mx-auto mb-10">
              {/* Corner dots */}
              <div className="absolute -top-2 -left-2 w-4 h-4 bg-cyan-400 rounded-full"></div>
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-cyan-400 rounded-full"></div>
              <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-cyan-400 rounded-full"></div>
              <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-cyan-400 rounded-full"></div>
              
              <div className="border-2 border-cyan-400/50 rounded-2xl p-10 bg-slate-800/60 backdrop-blur">
                <div className="inline-block bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full px-6 py-2 mb-5">
                  <span className="text-white font-bold text-sm tracking-wider">THE LEGENDARY TRAINER</span>
                </div>
                <div className="flex items-center justify-center gap-4 mb-5">
                  <img src="/athlynx-logo-icon.png" alt="ATHLYNX" className="w-12 h-12" />
                  <div>
                    <h3 className="text-white font-bold text-3xl">ATHLYNX</h3>
                    <p className="text-slate-400 text-sm">THE ATHLETE'S PLAYBOOK</p>
                  </div>
                </div>
                <p className="text-slate-300 text-lg leading-relaxed">
                  The mastermind behind the champion. <span className="text-cyan-400">Building champions</span>, <span className="text-pink-400">training winners</span>, and <span className="text-cyan-400">creating empires</span>.
                </p>
              </div>
            </div>

            {/* THE EMPIRE Box - Light colored */}
            <div className="max-w-md mx-auto">
              <div className="bg-slate-200/95 backdrop-blur rounded-2xl p-6 text-slate-800 shadow-xl">
                <h4 className="text-blue-600 font-bold text-sm mb-4 tracking-wider">THE EMPIRE</h4>
                <div className="flex justify-center gap-4 mb-3">
                  <span className="text-3xl">🏆</span>
                  <span className="text-3xl">💰</span>
                  <span className="text-3xl">⏱️</span>
                  <span className="text-3xl">🏢</span>
                  <span className="text-3xl">📈</span>
                </div>
                <p className="text-slate-600 text-sm font-bold tracking-wider">PASSIVE INCOME EMPIRE</p>
              </div>
            </div>
          </div>
        </section>

        {/* 10 POWERFUL APPS Section - Light background */}
        <section className="py-16 px-4 bg-gradient-to-b from-slate-100 to-white">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-center text-blue-600 font-medium text-lg mb-10 tracking-wide">
              10 Powerful Apps. One Platform. Unlimited Potential.
            </h2>
            
            {/* Apps Grid - 5x2 */}
            <div className="grid grid-cols-5 gap-6 mb-8">
              {/* Row 1 */}
              <div className="flex flex-col items-center">
                <div className="bg-slate-700 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                  <img src="/nil-portal-icon-final.jpeg" alt="Portal" className="w-16 h-16 rounded-xl object-cover" />
                </div>
                <p className="text-slate-600 text-xs mt-3 text-center font-medium">Portal</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-slate-700 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                  <img src="/messenger-icon-final.jpeg" alt="Messenger" className="w-16 h-16 rounded-xl object-cover" />
                </div>
                <p className="text-slate-600 text-xs mt-3 text-center font-medium">Messenger</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-slate-700 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                  <img src="/diamond-grind-app-icon.png" alt="Diamond Grind" className="w-16 h-16 rounded-xl object-cover" />
                </div>
                <p className="text-slate-600 text-xs mt-3 text-center font-medium">Diamond Grind</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-slate-700 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                  <img src="/warriors-playbook-icon.png" alt="Warriors Playbook" className="w-16 h-16 rounded-xl object-cover" />
                </div>
                <p className="text-slate-600 text-xs mt-3 text-center font-medium">Warriors Playbook</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-slate-700 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                  <img src="/transfer-portal-app-icon.png" alt="Transfer Portal" className="w-16 h-16 rounded-xl object-cover" />
                </div>
                <p className="text-slate-600 text-xs mt-3 text-center font-medium">Transfer Portal</p>
              </div>
              
              {/* Row 2 */}
              <div className="flex flex-col items-center">
                <div className="bg-slate-700 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                  <img src="/nil-portal-app-icon.jpeg" alt="NIL Vault" className="w-16 h-16 rounded-xl object-cover" />
                </div>
                <p className="text-slate-600 text-xs mt-3 text-center font-medium">NIL Vault</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-slate-700 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                  <img src="/athlynx-app-icon.png" alt="AI Sales" className="w-16 h-16 rounded-xl object-cover" />
                </div>
                <p className="text-slate-600 text-xs mt-3 text-center font-medium">AI Sales</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-slate-700 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                  <img src="/faith-app-icon.png" alt="Faith" className="w-16 h-16 rounded-xl object-cover" />
                </div>
                <p className="text-slate-600 text-xs mt-3 text-center font-medium">Faith</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-slate-700 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                  <img src="/athlynx-app-icon.png" alt="AI Recruiter" className="w-16 h-16 rounded-xl object-cover" />
                </div>
                <p className="text-slate-600 text-xs mt-3 text-center font-medium">AI Recruiter</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-slate-700 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                  <img src="/athlynx-app-icon.png" alt="AI Content" className="w-16 h-16 rounded-xl object-cover" />
                </div>
                <p className="text-slate-600 text-xs mt-3 text-center font-medium">AI Content</p>
              </div>
            </div>
          </div>
        </section>

        {/* ATHLYNX Launch Section */}
        <section className="py-16 px-4 bg-gradient-to-b from-white to-slate-50">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-blue-600 text-sm font-medium tracking-wider mb-4">THE FUTURE OF ATHLETE SUCCESS</p>
            <h2 className="text-5xl font-bold text-slate-800 mb-3 tracking-tight">ATHLYNX</h2>
            <p className="text-slate-500 text-lg mb-10">THE ATHLETE'S PLAYBOOK</p>

            {/* VIP Early Access Button */}
            <button className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold px-10 py-5 rounded-xl shadow-lg mb-10 transition-all">
              <div className="text-sm tracking-wider">VIP EARLY ACCESS</div>
              <div className="text-xl font-bold">6 MONTHS FREE</div>
            </button>

            {/* Countdown Timer */}
            <div className="mb-6">
              <p className="text-slate-500 text-sm mb-4 tracking-wider">LAUNCHING IN</p>
              <div className="flex justify-center gap-4">
                <div className="bg-slate-800 text-white rounded-xl px-6 py-5 min-w-[85px]">
                  <div className="text-4xl font-bold">{timeLeft.days}</div>
                  <div className="text-xs text-slate-400 tracking-wider">DAYS</div>
                </div>
                <div className="bg-slate-800 text-white rounded-xl px-6 py-5 min-w-[85px]">
                  <div className="text-4xl font-bold">{timeLeft.hours}</div>
                  <div className="text-xs text-slate-400 tracking-wider">HRS</div>
                </div>
                <div className="bg-slate-800 text-white rounded-xl px-6 py-5 min-w-[85px]">
                  <div className="text-4xl font-bold">{timeLeft.minutes}</div>
                  <div className="text-xs text-slate-400 tracking-wider">MIN</div>
                </div>
                <div className="bg-slate-800 text-white rounded-xl px-6 py-5 min-w-[85px]">
                  <div className="text-4xl font-bold">{timeLeft.seconds}</div>
                  <div className="text-xs text-slate-400 tracking-wider">SEC</div>
                </div>
              </div>
              <p className="text-blue-600 font-medium mt-4 tracking-wider">FEBRUARY 1, 2026</p>
            </div>
          </div>
        </section>

        {/* FOUNDING MEMBER SPOTS Section */}
        <section className="py-10 px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-slate-800 rounded-2xl p-8 text-center text-white">
              <p className="text-sm text-slate-400 mb-2 tracking-wider">FOUNDING MEMBER SPOTS</p>
              <h3 className="text-4xl font-bold mb-4">LIMITED TO 10,000</h3>
              {/* Progress bar */}
              <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 w-[65%]"></div>
              </div>
            </div>
          </div>
        </section>

        {/* SIGNUP FORM Section */}
        <section className="py-10 px-4">
          <div className="max-w-lg mx-auto">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-slate-700 text-sm font-bold mb-2 tracking-wider">FULL NAME *</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full px-4 py-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-700 text-sm font-bold mb-2 tracking-wider">EMAIL ADDRESS *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-700 text-sm font-bold mb-2 tracking-wider">PHONE NUMBER *</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone Number (Required)"
                  className="w-full px-4 py-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800"
                  required
                />
              </div>
              
              {/* Role Selection */}
              <div>
                <label className="block text-slate-700 text-sm font-bold mb-3 tracking-wider">I AM A...</label>
                <div className="flex flex-wrap gap-3">
                  {roles.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`px-6 py-3 rounded-full border-2 font-medium transition-all ${
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
                <label className="block text-slate-700 text-sm font-bold mb-3 tracking-wider">PRIMARY SPORT</label>
                <div className="flex flex-wrap gap-3">
                  {sports.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSport(s)}
                      className={`px-5 py-2.5 rounded-full border-2 font-medium text-sm transition-all ${
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
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold py-4 rounded-lg shadow-lg transition-all text-lg tracking-wider"
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
        <section className="py-10 px-4">
          <div className="max-w-md mx-auto">
            <div className="bg-slate-800 rounded-2xl p-8 text-center text-white">
              <h3 className="font-bold text-xl mb-2">ALREADY A VIP MEMBER?</h3>
              <p className="text-slate-400 text-sm mb-5">Enter your access code to unlock all 6 apps</p>
              <button 
                onClick={() => setShowVipModal(true)}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-3 rounded-lg transition-colors tracking-wider"
              >
                ENTER ACCESS CODE
              </button>
            </div>
          </div>
        </section>

        {/* Preview the App Section */}
        <section className="py-10 px-4 border-t border-slate-200">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-blue-600 text-sm font-medium mb-8">Preview the App →</p>
            <div className="flex justify-center gap-10">
              <div className="flex flex-col items-center">
                <span className="text-4xl mb-3">👥</span>
                <span className="text-slate-600 text-xs">✓ Social Network</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-4xl mb-3">🤝</span>
                <span className="text-slate-600 text-xs">✓ NIL Deals</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-4xl mb-3">💬</span>
                <span className="text-slate-600 text-xs">✓ Messaging</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-4xl mb-3">📊</span>
                <span className="text-slate-600 text-xs">✓ Analytics</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-4xl mb-3">🛡️</span>
                <span className="text-slate-600 text-xs">✓ Compliance</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER - Matching screenshot exactly */}
      <footer className="bg-gradient-to-b from-slate-100 to-slate-200 pt-14 pb-10">
        <div className="max-w-6xl mx-auto px-4">
          {/* Footer Grid - 5 columns */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
            {/* ATHLYNX Column */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src="/athlynx-logo-icon.png" alt="ATHLYNX" className="w-8 h-8" />
                <span className="font-bold text-slate-800 text-lg">ATHLYNX</span>
              </div>
              <p className="text-slate-600 text-sm mb-3 leading-relaxed">
                The Complete Athlete Ecosystem. One platform for NIL deals, training, recruiting, and more.
              </p>
              <p className="text-orange-500 text-xs font-bold mb-2">
                🔥 PERPETUAL MOTION - THE PROMISE THAT NEVER STOPS
              </p>
              <p className="text-slate-500 text-xs">A Dozier Holdings Group Company</p>
              <p className="text-slate-500 text-xs">Dreams Do Come True 2026</p>
            </div>

            {/* PLATFORM Column */}
            <div>
              <h4 className="font-bold text-slate-800 mb-4 tracking-wider">PLATFORM</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="hover:text-blue-600 cursor-pointer">VIP Access</li>
                <li className="hover:text-blue-600 cursor-pointer">Athlete Dashboard</li>
                <li className="hover:text-blue-600 cursor-pointer">NIL Marketplace</li>
                <li className="hover:text-blue-600 cursor-pointer">Transfer Portal</li>
                <li className="hover:text-blue-600 cursor-pointer">Messages</li>
              </ul>
            </div>

            {/* RESOURCES Column */}
            <div>
              <h4 className="font-bold text-slate-800 mb-4 tracking-wider">RESOURCES</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="hover:text-blue-600 cursor-pointer">Founder Story</li>
                <li className="hover:text-blue-600 cursor-pointer">Founder Dedication</li>
                <li className="hover:text-blue-600 cursor-pointer">Quick Links Hub</li>
                <li className="hover:text-blue-600 cursor-pointer">Pricing</li>
                <li className="hover:text-blue-600 cursor-pointer">Store</li>
              </ul>
            </div>

            {/* APPS Column */}
            <div>
              <h4 className="font-bold text-slate-800 mb-4 tracking-wider">APPS</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="hover:text-blue-600 cursor-pointer">NIL Portal</li>
                <li className="hover:text-blue-600 cursor-pointer">Diamond Grind</li>
                <li className="hover:text-blue-600 cursor-pointer">Warriors Playbook</li>
                <li className="hover:text-blue-600 cursor-pointer">Messenger</li>
                <li className="hover:text-blue-600 cursor-pointer">All Apps</li>
              </ul>
              <h4 className="font-bold text-slate-800 mt-5 mb-3 tracking-wider">LEGAL & COMPLIANCE</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="hover:text-blue-600 cursor-pointer">Privacy Policy</li>
                <li className="hover:text-blue-600 cursor-pointer">Terms of Service</li>
                <li className="text-blue-600">legal@dozierholdingsgroup.com</li>
              </ul>
            </div>

            {/* COMPANY Column */}
            <div>
              <h4 className="font-bold text-slate-800 mb-4 tracking-wider">COMPANY</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="hover:text-blue-600 cursor-pointer">DHG Empire</li>
                <li className="hover:text-blue-600 cursor-pointer">Softmor Inc</li>
                <li className="hover:text-blue-600 cursor-pointer">Team</li>
                <li className="hover:text-blue-600 cursor-pointer">Investor Hub</li>
                <li className="hover:text-blue-600 cursor-pointer">Careers</li>
                <li className="hover:text-blue-600 cursor-pointer">Founder Story</li>
              </ul>
            </div>
          </div>

          {/* Contact Row */}
          <div className="flex flex-wrap items-center justify-between border-t border-slate-300 pt-6 mb-6">
            <div className="flex items-center gap-6 text-sm text-slate-600">
              <span>📧 cdozier14@athlynx.ai</span>
              <span>📞 +1 (601) 498-5282</span>
              <span>🌐 athlynx.ai</span>
            </div>
            <div className="flex items-center gap-4 text-slate-500 text-lg">
              <span className="cursor-pointer hover:text-blue-600">📊</span>
              <span className="cursor-pointer hover:text-blue-600">📘</span>
              <span className="cursor-pointer hover:text-blue-600">🐦</span>
              <span className="cursor-pointer hover:text-blue-600">📷</span>
              <span className="cursor-pointer hover:text-blue-600">▶️</span>
            </div>
          </div>

          {/* Chad A. Dozier Section */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">CD</div>
            <div>
              <p className="font-bold text-slate-800">Chad A. Dozier</p>
              <p className="text-slate-500 text-sm">Founder & CEO • @CDozier14</p>
            </div>
          </div>
          <p className="text-slate-500 text-sm italic mb-8">"Look Ma and Nanny, I Made It"</p>

          {/* Security & Legal Compliance */}
          <div className="border-t border-slate-300 pt-8">
            <h4 className="text-cyan-600 font-bold mb-5 flex items-center gap-2 tracking-wider">
              ◎ SECURITY & LEGAL COMPLIANCE
            </h4>
            <div className="grid md:grid-cols-3 gap-8 text-sm text-slate-600 mb-8">
              <div>
                <h5 className="font-bold text-slate-800 mb-2">HIPAA Compliant</h5>
                <p className="leading-relaxed">All athlete health data, medical records, and personal information are encrypted and stored in compliance with enterprise-grade security standards.</p>
              </div>
              <div>
                <h5 className="font-bold text-slate-800 mb-2">Data Collection</h5>
                <p className="leading-relaxed">We aggregate publicly available information from authorized sources. All web scraping complies with robots.txt and applicable laws.</p>
              </div>
              <div>
                <h5 className="font-bold text-slate-800 mb-2">Precious Cargo Protection</h5>
                <p className="leading-relaxed">Athlete data is our most valuable asset. We employ 256-bit SSL encryption, SOC 2 compliance standards, and regular security audits.</p>
              </div>
            </div>
            <p className="text-slate-500 text-xs mb-6">
              By using this platform, you acknowledge our use of AI automation and agree to our data collection practices. Platform updated daily in real-time. For questions, contact <a href="mailto:legal@dozierholdingsgroup.com" className="text-blue-600 hover:underline">legal@dozierholdingsgroup.com</a>
            </p>
          </div>

          {/* Copyright */}
          <div className="text-center text-slate-500 text-sm pt-6 border-t border-slate-300">
            © 2025-2026 Dozier Holdings Group, LLC. All Rights Reserved.
          </div>
        </div>
      </footer>

      {/* VIP Code Modal */}
      {showVipModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold text-slate-800 mb-5">Enter VIP Code</h3>
            <input
              type="text"
              value={vipCode}
              onChange={(e) => setVipCode(e.target.value)}
              placeholder="Enter your VIP access code"
              className="w-full px-4 py-4 border border-slate-300 rounded-lg mb-5 text-slate-800"
            />
            <div className="flex gap-4">
              <button
                onClick={() => setShowVipModal(false)}
                className="flex-1 px-4 py-3 border border-slate-300 rounded-lg text-slate-600 font-medium hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert("VIP Code submitted: " + vipCode);
                  setShowVipModal(false);
                }}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-500"
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
