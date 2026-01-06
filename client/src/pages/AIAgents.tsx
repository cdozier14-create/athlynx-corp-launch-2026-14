import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Send, Sparkles, Dumbbell, GraduationCap, Video, DollarSign, Target, Calendar, ArrowLeft, Zap } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Link } from "wouter";

const AI_AGENTS = [
  {
    type: "wizard",
    name: "AI Wizard",
    icon: Sparkles,
    color: "from-purple-500 to-pink-500",
    description: "Your personal guide to ATHLYNX",
    creditCost: 0,
    greeting: "Hey there! I'm your ATHLYNX Wizard. I can help you navigate the platform, answer questions, and get you started on your journey. What would you like to know?",
  },
  {
    type: "trainer",
    name: "AI Trainer",
    icon: Dumbbell,
    color: "from-green-500 to-emerald-500",
    description: "Personalized workout plans & tracking",
    creditCost: 5,
    greeting: "Ready to grind! I'm your personal AI Trainer. I'll create custom workout plans, track your progress, and push you to be your best. What's your training goal today?",
  },
  {
    type: "recruiter",
    name: "AI Recruiter",
    icon: GraduationCap,
    color: "from-blue-500 to-cyan-500",
    description: "College recruitment strategy",
    creditCost: 10,
    greeting: "Let's get you recruited! I'm your AI Recruiter, here to help with college selection, coach outreach, and building your recruitment strategy. What level are you targeting?",
  },
  {
    type: "content",
    name: "AI Content Creator",
    icon: Video,
    color: "from-orange-500 to-red-500",
    description: "Generate posts & highlight reels",
    creditCost: 5,
    greeting: "Time to build your brand! I'm your AI Content Creator. I'll help you craft engaging posts, captions, and content strategies. What kind of content do you want to create?",
  },
  {
    type: "sales",
    name: "AI Sales Agent",
    icon: DollarSign,
    color: "from-amber-500 to-yellow-500",
    description: "NIL deal negotiation & brand outreach",
    creditCost: 10,
    greeting: "Let's get that bag! I'm your AI Sales Agent, specializing in NIL deals and brand partnerships. I'll help you understand your value and negotiate like a pro. What's your NIL situation?",
  },
  {
    type: "coach",
    name: "AI Coach",
    icon: Target,
    color: "from-rose-500 to-pink-500",
    description: "Game strategy & performance analysis",
    creditCost: 5,
    greeting: "Game time! I'm your AI Coach. I'll help with strategy, analyze your performance, and sharpen your mental game. What aspect of your game do you want to improve?",
  },
  {
    type: "manager",
    name: "AI Manager",
    icon: Calendar,
    color: "from-indigo-500 to-purple-500",
    description: "Schedule & career management",
    creditCost: 5,
    greeting: "Let's get organized! I'm your AI Manager. I'll help with scheduling, career planning, and keeping your athletic journey on track. What do you need help managing?",
  },
];

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AIAgents() {
  const { user } = useAuth();
  const [selectedAgent, setSelectedAgent] = useState<typeof AI_AGENTS[0] | null>(null);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: credits } = trpc.credits.balance.useQuery(undefined, { enabled: !!user });
  const startSessionMutation = trpc.ai.startSession.useMutation();
  const chatMutation = trpc.ai.chat.useMutation();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSelectAgent = async (agent: typeof AI_AGENTS[0]) => {
    if (!user) {
      window.location.href = "/early-access";
      return;
    }

    setSelectedAgent(agent);
    setMessages([{ role: "assistant", content: agent.greeting }]);

    try {
      const result = await startSessionMutation.mutateAsync({
        agentType: agent.type as any,
      });
      setSessionId(result.sessionId);
    } catch (error) {
      console.error("Failed to start session:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || !sessionId || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const result = await chatMutation.mutateAsync({
        sessionId,
        message: userMessage,
      });

      if (result.success && result.response) {
        setMessages(prev => [...prev, { role: "assistant", content: result.response! }]);
      } else {
        setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I couldn't process that. Please try again." }]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: "assistant", content: "An error occurred. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (selectedAgent) {
    const Icon = selectedAgent.icon;
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex flex-col">
        {/* Chat Header */}
        <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm p-4">
          <div className="container mx-auto flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setSelectedAgent(null);
                setSessionId(null);
                setMessages([]);
              }}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${selectedAgent.color} flex items-center justify-center`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">{selectedAgent.name}</h1>
              <p className="text-sm text-white/60">{selectedAgent.description}</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/50">
                <Zap className="w-3 h-3 mr-1" />
                {credits?.balance || 0} credits
              </Badge>
            </div>
          </div>
        </header>

        {/* Chat Messages */}
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="container mx-auto max-w-3xl space-y-4">
            {messages.map((message, i) => (
              <div
                key={i}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.role === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-white/10 text-white border border-white/10"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/10 text-white border border-white/10 rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Chat Input */}
        <div className="border-t border-white/10 bg-black/20 backdrop-blur-sm p-4">
          <div className="container mx-auto max-w-3xl flex gap-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50"
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
              className={`bg-gradient-to-r ${selectedAgent.color}`}
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
          {selectedAgent.creditCost > 0 && (
            <p className="text-center text-white/50 text-sm mt-2">
              Each message costs {selectedAgent.creditCost} credits
            </p>
          )}
        </div>
      </div>
    );
  }

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
            {user && (
              <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/50">
                <Zap className="w-3 h-3 mr-1" />
                {credits?.balance || 0} credits
              </Badge>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 text-center">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-6">
          <Bot className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
          Your Personal <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">AI Team</span>
        </h1>
        <p className="text-xl text-white/70 max-w-2xl mx-auto">
          7 specialized AI agents working 24/7 to help you succeed. Choose your assistant and start chatting.
        </p>
      </section>

      {/* Agent Grid */}
      <section className="container mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {AI_AGENTS.map((agent) => {
            const Icon = agent.icon;
            return (
              <Card
                key={agent.type}
                className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all cursor-pointer group"
                onClick={() => handleSelectAgent(agent)}
              >
                <CardHeader>
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${agent.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <CardTitle className="text-white flex items-center justify-between">
                    {agent.name}
                    {agent.creditCost === 0 ? (
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/50">FREE</Badge>
                    ) : (
                      <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/50">
                        {agent.creditCost} credits
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="text-white/60">{agent.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className={`w-full bg-gradient-to-r ${agent.color} hover:opacity-90`}>
                    Start Chat
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Features */}
      <section className="bg-black/30 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white text-center mb-8">Why Use AI Agents?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { title: "24/7 Availability", desc: "Get help anytime, anywhere. Your AI team never sleeps." },
              { title: "Personalized Advice", desc: "AI learns your goals and provides tailored recommendations." },
              { title: "Expert Knowledge", desc: "Access to training, recruiting, and business expertise instantly." },
            ].map((feature, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                <p className="text-white/60">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
