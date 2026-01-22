import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const CONTENT_TYPES = [
  { id: "instagram", name: "Instagram Post", icon: "📸", color: "from-pink-500 to-purple-500" },
  { id: "twitter", name: "X/Twitter Post", icon: "🐦", color: "from-blue-400 to-cyan-500" },
  { id: "tiktok", name: "TikTok Script", icon: "🎵", color: "from-red-500 to-pink-500" },
  { id: "linkedin", name: "LinkedIn Post", icon: "💼", color: "from-blue-600 to-blue-400" },
  { id: "youtube", name: "YouTube Script", icon: "▶️", color: "from-red-600 to-red-400" },
  { id: "email", name: "Email Newsletter", icon: "📧", color: "from-green-500 to-emerald-500" },
];

const RECENT_CONTENT = [
  { id: 1, type: "Instagram", title: "Game Day Hype Post", date: "2 hours ago", engagement: "2.4K likes" },
  { id: 2, type: "TikTok", title: "Training Day BTS", date: "Yesterday", engagement: "45K views" },
  { id: 3, type: "X/Twitter", title: "Thank You Fans", date: "2 days ago", engagement: "892 retweets" },
];

const TEMPLATES = [
  { id: 1, name: "Game Day Hype", category: "Sports", uses: 1234 },
  { id: 2, name: "NIL Deal Announcement", category: "Business", uses: 567 },
  { id: 3, name: "Training Motivation", category: "Fitness", uses: 890 },
  { id: 4, name: "Thank You Message", category: "Personal", uses: 432 },
  { id: 5, name: "Transfer Announcement", category: "News", uses: 321 },
  { id: 6, name: "Brand Partnership", category: "Business", uses: 654 },
];

export default function AIContent() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [generatedContent, setGeneratedContent] = useState("");

  const handleGenerate = () => {
    if (!selectedType) {
      toast.error("Please select a content type first!");
      return;
    }
    toast.success("AI generating content...");
    // Simulate AI generation
    setTimeout(() => {
      const type = CONTENT_TYPES.find(t => t.id === selectedType);
      setGeneratedContent(`🔥 [AI Generated ${type?.name}]\n\nGame day energy hits different! 💪\n\nPut in the work, trust the process, and let the results speak for themselves. \n\nShoutout to my team, my coaches, and everyone who believed in me from day one. This is just the beginning! 🏆\n\n#ATHLYNX #GameDay #NIL #Blessed #WorkHard`);
      toast.success("Content generated!");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-pink-900/20 to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/portal">
            <div className="flex items-center gap-3 cursor-pointer">
              <span className="text-2xl">✨</span>
              <div>
                <h1 className="text-xl font-bold text-white">AI Content</h1>
                <p className="text-xs text-pink-400">Content Creation Studio</p>
              </div>
            </div>
          </Link>
          <Link href="/portal">
            <Button variant="outline" size="sm" className="border-slate-600">
              ← Back to Portal
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Content Type Selector */}
        <h2 className="text-xl font-bold text-white mb-4">📱 Select Platform</h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-8">
          {CONTENT_TYPES.map((type) => (
            <Card
              key={type.id}
              className={`cursor-pointer transition-all hover:scale-105 ${
                selectedType === type.id
                  ? "ring-2 ring-pink-400"
                  : "bg-slate-800 border-slate-700"
              }`}
              onClick={() => setSelectedType(type.id)}
            >
              <CardContent className={`p-4 text-center ${selectedType === type.id ? `bg-gradient-to-br ${type.color} bg-opacity-20` : ""}`}>
                <span className="text-3xl mb-2 block">{type.icon}</span>
                <p className="text-sm text-white font-medium">{type.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* AI Generator */}
        <Card className="bg-slate-800 border-slate-700 mb-8">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold text-white mb-4">🤖 AI Content Generator</h3>
            <Textarea
              placeholder="Describe what you want to post about... (e.g., 'Game day post for our rivalry matchup against State')"
              className="bg-slate-900 border-slate-600 text-white mb-4 min-h-[100px]"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <div className="flex gap-2 mb-4">
              <Button 
                className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-400 hover:to-purple-400"
                onClick={handleGenerate}
              >
                ✨ Generate Content
              </Button>
              <Button variant="outline" className="border-slate-600" onClick={() => { setPrompt(""); setGeneratedContent(""); }}>
                Clear
              </Button>
            </div>
            
            {generatedContent && (
              <div className="bg-slate-900 rounded-lg p-4 border border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-pink-400">Generated Content</span>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="border-pink-500/50 text-pink-400"
                    onClick={() => { navigator.clipboard.writeText(generatedContent); toast.success("Copied to clipboard!"); }}
                  >
                    📋 Copy
                  </Button>
                </div>
                <p className="text-white whitespace-pre-wrap">{generatedContent}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Templates */}
        <h2 className="text-xl font-bold text-white mb-4">📝 Popular Templates</h2>
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {TEMPLATES.map((template) => (
            <Card key={template.id} className="bg-slate-800 border-slate-700 hover:border-pink-500/50 transition-all cursor-pointer">
              <CardContent className="p-4">
                <h3 className="font-bold text-white mb-1">{template.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">{template.category}</span>
                  <span className="text-xs text-pink-400">{template.uses} uses</span>
                </div>
                <Button 
                  size="sm" 
                  className="w-full mt-3 bg-pink-500/20 text-pink-400 hover:bg-pink-500/30"
                  onClick={() => toast.success(`Using "${template.name}" template...`)}
                >
                  Use Template
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Content */}
        <h2 className="text-xl font-bold text-white mb-4">📊 Recent Content Performance</h2>
        <div className="space-y-4 mb-8">
          {RECENT_CONTENT.map((content) => (
            <Card key={content.id} className="bg-slate-800 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-white">{content.title}</h3>
                    <p className="text-sm text-slate-400">{content.type} • {content.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-pink-400 font-medium">{content.engagement}</p>
                    <Button size="sm" variant="outline" className="mt-2 border-slate-600 text-xs">
                      View Analytics
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* AI Image Generator */}
        <Card className="bg-gradient-to-r from-slate-800 to-pink-900/30 border-pink-500/30">
          <CardContent className="p-6 flex items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-3xl">
              🎨
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white">AI Image Generator</h3>
              <p className="text-slate-400">Create stunning graphics, thumbnails, and promotional images powered by AI.</p>
            </div>
            <Button 
              className="bg-pink-500 hover:bg-pink-400 text-white"
              onClick={() => toast.info("AI Image Generator coming soon!")}
            >
              Create Image
            </Button>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-700 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm">AI Content - Part of the ATHLYNX Ecosystem</p>
          <p className="text-pink-400 text-xs mt-1">A Dozier Holdings Group Company</p>
        </div>
      </footer>
    </div>
  );
}
