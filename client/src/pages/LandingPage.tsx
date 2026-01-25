import { useState, useEffect } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ChevronRight, Play, Trophy, Users, Globe, TrendingUp, Heart, Zap, Star, Award, Target, Crown, Rocket } from "lucide-react";

export default function LandingPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [sport, setSport] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [showVerification, setShowVerification] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [vipCode, setVipCode] = useState("");
  const [showVipCodeForm, setShowVipCodeForm] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 7,
    hours: 5,
    minutes: 0,
    seconds: 21,
  });

  useEffect(() => {
    document.title = "ATHLYNX: The Perfect Storm - The Athlete's Playbook";
  }, []);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        }
        if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        }
        if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Send verification code
  const sendCode = trpc.verification.sendCode.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        setShowVerification(true);
        toast.success("Verification code sent! Check your email and phone.");
      } else {
        toast.error(data.error || "Failed to send code");
      }
      setIsSubmitting(false);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to send code");
      setIsSubmitting(false);
    },
  });

  // Verify code
  const verify = trpc.verification.verifyCode.useMutation({
    onSuccess: async (data) => {
      if (data.valid) {
        await joinWaitlist.mutateAsync({
          fullName,
          email,
          phone,
          role: role.toLowerCase() as "athlete" | "parent" | "coach" | "brand",
          sport,
        });
      } else {
        toast.error(data.error || "Invalid code");
        setIsSubmitting(false);
      }
    },
    onError: (error) => {
      toast.error(error.message || "Verification failed");
      setIsSubmitting(false);
    },
  });

  // Join waitlist
  const joinWaitlist = trpc.waitlist.join.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        setSubmitted(true);
        toast.success("🎉 Welcome to ATHLYNX! Check your email for your VIP code!");
        setFullName("");
        setEmail("");
        setPhone("");
        setRole("");
        setSport("");
        setVerificationCode("");
        setShowVerification(false);
      } else {
        toast.error(data.error || "Something went wrong");
      }
      setIsSubmitting(false);
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong");
      setIsSubmitting(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone || !role || !sport) {
      toast.error("Please fill in all fields");
      return;
    }
    setIsSubmitting(true);
    sendCode.mutate({ email, phone });
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationCode) {
      toast.error("Please enter the verification code");
      return;
    }
    setIsSubmitting(true);
    verify.mutate({ email, code: verificationCode });
  };

  const apps = [
    { name: "Portal", image: "/apps/portal.png", badge: "LIVE" },
    { name: "Messenger", image: "/apps/messenger.png", badge: "LIVE" },
    { name: "Diamond Grind", image: "/apps/diamond-grind.png", badge: "NEW" },
    { name: "Warriors Playbook", image: "/apps/warriors-playbook.png", badge: "HOT" },
    { name: "Transfer Portal", image: "/apps/transfer-portal.png", badge: "ELITE" },
    { name: "NIL Vault", image: "/apps/nil-vault.png", badge: "$$$" },
    { name: "AI Sales", image: "/apps/ai-sales.png", badge: "AI" },
    { name: "Faith", image: "/apps/faith.png", badge: "BLESSED" },
    { name: "AI Recruiter", image: "/apps/ai-recruiter.png", badge: "AI" },
    { name: "AI Content", image: "/apps/ai-content.png", badge: "AI" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 text-white overflow-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-slate-900/95 to-blue-950/95 backdrop-blur border-b border-cyan-500/20">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center font-bold">
              ⚡
            </div>
            <span className="font-black text-lg">ATHLYNX</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs bg-cyan-500 text-slate-900 px-3 py-1 rounded-full font-bold">
              LIVE PLATFORM
            </span>
            <span className="text-xs bg-green-500 text-slate-900 px-3 py-1 rounded-full font-bold">
              HIPAA-COMPLIANT
            </span>
            <Button variant="outline" size="sm" className="border-cyan-400 text-cyan-400 hover:bg-cyan-400/10">
              Portal Login
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 via-transparent to-transparent pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
            THE FUTURE OF ATHLETE SUCCESS
          </h1>
          
          <p className="text-xl text-slate-300 mb-8">
            🏢 PARENT COMPANY: Dozier Holdings Group
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold">
              👥 Founders
            </Button>
            <Button size="lg" variant="outline" className="border-cyan-400 text-cyan-400 hover:bg-cyan-400/10">
              ◎ Portal Login
            </Button>
          </div>

          <div className="bg-white/5 border border-cyan-400/30 rounded-2xl p-6 backdrop-blur">
            <p className="text-cyan-400 font-bold mb-2">HAVE A VIP CODE?</p>
            <p className="text-slate-300">TAP HERE TO ENTER</p>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-20 px-4 border-t border-cyan-500/20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-cyan-400 font-bold mb-2">🎬</p>
            <h2 className="text-4xl font-black mb-4">THE VISION</h2>
            <p className="text-cyan-400 text-lg">DREAMS DO COME TRUE</p>
          </div>

          <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 rounded-2xl p-12 text-center">
            <p className="text-6xl mb-4">🎥</p>
            <p className="text-slate-300">Video content coming soon</p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 border-t border-cyan-500/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-black text-center mb-12">THE EMPIRE</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: "🏆", label: "PASSIVE INCOME", value: "EMPIRE" },
              { icon: "💰", label: "12 Companies", value: "" },
              { icon: "🌍", label: "Global Reach", value: "" },
              { icon: "📈", label: "Infinite Potential", value: "" },
            ].map((stat, idx) => (
              <div key={idx} className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 rounded-xl p-6 text-center hover:border-cyan-400/60 transition-all">
                <p className="text-3xl mb-2">{stat.icon}</p>
                <p className="text-sm text-slate-300">{stat.label}</p>
                {stat.value && <p className="font-bold text-cyan-400">{stat.value}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10 Apps Section */}
      <section className="py-20 px-4 border-t border-cyan-500/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-black text-center mb-4">10 Powerful Apps</h2>
          <p className="text-center text-cyan-400 text-lg mb-12">One Platform. Unlimited Potential.</p>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {apps.map((app, idx) => (
              <div key={idx} className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 rounded-xl p-6 text-center hover:border-cyan-400/60 transition-all">
                <img src={app.image} alt={app.name} className="w-full h-32 object-cover rounded-lg mb-3" />
                <p className="font-bold text-sm mb-2">{app.name}</p>
                <span className="inline-block bg-blue-500 text-white text-xs px-3 py-1 rounded-full font-bold">{app.badge}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Countdown Section */}
      <section className="py-20 px-4 border-t border-cyan-500/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-black mb-4">LAUNCHING IN</h2>
          <p className="text-cyan-400 text-lg mb-8">FEBRUARY 1, 2026</p>
          
          <div className="grid grid-cols-4 gap-4 mb-8">
            {[
              { value: timeLeft.days, label: "DAYS" },
              { value: timeLeft.hours, label: "HRS" },
              { value: timeLeft.minutes, label: "MIN" },
              { value: timeLeft.seconds, label: "SEC" },
            ].map((item, idx) => (
              <div key={idx} className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 rounded-xl p-6">
                <p className="text-3xl font-black text-cyan-400">{String(item.value).padStart(2, "0")}</p>
                <p className="text-xs text-slate-400 mt-2">{item.label}</p>
              </div>
            ))}
          </div>

          <p className="text-cyan-400 font-bold text-lg">FOUNDING MEMBER SPOTS</p>
          <p className="text-slate-300">LIMITED TO 10,000</p>
        </div>
      </section>

      {/* VIP Waitlist Form */}
      <section className="py-20 px-4 border-t border-cyan-500/20">
        <div className="max-w-2xl mx-auto">
          <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 rounded-2xl p-8">
            <h2 className="text-3xl font-black text-center mb-2">JOIN THE VIP WAITLIST</h2>
            <p className="text-center text-cyan-400 mb-8">Get early access to all 10 apps</p>

            {submitted ? (
              <div className="text-center py-8">
                <p className="text-2xl mb-2">🎉</p>
                <p className="text-xl font-bold text-cyan-400">Welcome to ATHLYNX!</p>
                <p className="text-slate-300 mt-2">Check your email for your VIP code</p>
              </div>
            ) : (
              <form onSubmit={showVerification ? handleVerify : handleSubmit} className="space-y-4">
                {!showVerification ? (
                  <>
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:border-cyan-400 focus:outline-none"
                      required
                    />
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:border-cyan-400 focus:outline-none"
                      required
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number (with country code)"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:border-cyan-400 focus:outline-none"
                      required
                    />
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-cyan-400 focus:outline-none"
                      required
                    >
                      <option value="">Select Your Role</option>
                      <option value="athlete">Athlete</option>
                      <option value="parent">Parent</option>
                      <option value="coach">Coach</option>
                      <option value="brand">Brand</option>
                    </select>
                    <select
                      value={sport}
                      onChange={(e) => setSport(e.target.value)}
                      className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-cyan-400 focus:outline-none"
                      required
                    >
                      <option value="">Select Your Sport</option>
                      <option value="baseball">Baseball</option>
                      <option value="football">Football</option>
                      <option value="basketball">Basketball</option>
                      <option value="soccer">Soccer</option>
                    </select>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-3"
                    >
                      {isSubmitting ? "SENDING CODE..." : "CLAIM MY VIP SPOT"}
                    </Button>
                  </>
                ) : (
                  <>
                    <input
                      type="text"
                      placeholder="Enter verification code"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:border-cyan-400 focus:outline-none"
                      required
                    />
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-3"
                    >
                      {isSubmitting ? "VERIFYING..." : "VERIFY & JOIN"}
                    </Button>
                  </>
                )}
              </form>
            )}

            <p className="text-xs text-slate-400 text-center mt-6">
              By signing up, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </section>

      {/* VIP Code Entry */}
      <section className="py-20 px-4 border-t border-cyan-500/20">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-black mb-4">ALREADY A VIP MEMBER?</h2>
          <p className="text-slate-300 mb-6">Enter your access code to unlock all 6 apps</p>
          
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter VIP Code"
              value={vipCode}
              onChange={(e) => setVipCode(e.target.value)}
              className="flex-1 bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:border-cyan-400 focus:outline-none"
            />
            <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold">
              Enter VIP Code
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-cyan-500/20 py-12 px-4">
        <div className="max-w-6xl mx-auto text-center text-slate-400 text-sm">
          <p className="mb-4">Made with ❤️ by Dozier Holdings Group, LLC</p>
          <div className="flex flex-wrap justify-center gap-6 text-xs">
            <a href="#" className="hover:text-cyan-400">Home</a>
            <a href="#" className="hover:text-cyan-400">About Us</a>
            <a href="#" className="hover:text-cyan-400">Features</a>
            <a href="#" className="hover:text-cyan-400">Pricing</a>
            <a href="#" className="hover:text-cyan-400">Contact</a>
            <a href="#" className="hover:text-cyan-400">Privacy Policy</a>
            <a href="#" className="hover:text-cyan-400">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
// Force rebuild 1769384533
