import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const DAILY_VERSE = {
  text: "I can do all things through Christ who strengthens me.",
  reference: "Philippians 4:13",
};

const DEVOTIONALS = [
  { id: 1, title: "Faith in the Fire", author: "Coach Tony Dungy", duration: "5 min read", category: "Perseverance" },
  { id: 2, title: "Game Day Prayer", author: "Tim Tebow", duration: "3 min read", category: "Competition" },
  { id: 3, title: "Leading with Purpose", author: "Russell Wilson", duration: "7 min read", category: "Leadership" },
  { id: 4, title: "Gratitude in Victory & Defeat", author: "Kurt Warner", duration: "4 min read", category: "Gratitude" },
];

const PRAYER_REQUESTS = [
  { id: 1, user: "Marcus J.", request: "Praying for a successful recovery from injury", prayers: 47, time: "2 hours ago" },
  { id: 2, user: "Sarah T.", request: "Guidance on my transfer decision", prayers: 32, time: "5 hours ago" },
  { id: 3, user: "Coach Williams", request: "Strength for our team this season", prayers: 89, time: "1 day ago" },
];

const COMMUNITY_EVENTS = [
  { id: 1, title: "Athletes in Action Bible Study", date: "Every Tuesday 7PM", location: "Virtual" },
  { id: 2, title: "FCA Huddle", date: "Wednesdays 6AM", location: "Team Chapel" },
  { id: 3, title: "Sunday Service - Athletes Welcome", date: "Sundays 10AM", location: "Grace Community Church" },
];

export default function Faith() {
  const [activeTab, setActiveTab] = useState<"devotional" | "prayer" | "community">("devotional");

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900/20 to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/portal">
            <div className="flex items-center gap-3 cursor-pointer">
              <span className="text-2xl">✝️</span>
              <div>
                <h1 className="text-xl font-bold text-white">Faith</h1>
                <p className="text-xs text-purple-400">Spiritual Wellness & Community</p>
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
        {/* Daily Verse */}
        <Card className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-purple-500/30 mb-8">
          <CardContent className="p-8 text-center">
            <p className="text-xs text-purple-300 uppercase tracking-wider mb-4">Verse of the Day</p>
            <p className="text-2xl md:text-3xl font-serif text-white italic mb-4">"{DAILY_VERSE.text}"</p>
            <p className="text-purple-300 font-medium">{DAILY_VERSE.reference}</p>
          </CardContent>
        </Card>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(["devotional", "prayer", "community"] as const).map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? "default" : "outline"}
              className={activeTab === tab ? "bg-purple-500" : "border-slate-600"}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "devotional" ? "📖 Devotionals" : tab === "prayer" ? "🙏 Prayer" : "👥 Community"}
            </Button>
          ))}
        </div>

        {/* Devotionals Tab */}
        {activeTab === "devotional" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white mb-4">📖 Athlete Devotionals</h2>
            {DEVOTIONALS.map((dev) => (
              <Card key={dev.id} className="bg-slate-800 border-slate-700 hover:border-purple-500/50 transition-all">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-white">{dev.title}</h3>
                      <p className="text-sm text-slate-400">By {dev.author} • {dev.duration}</p>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 mt-2 inline-block">
                        {dev.category}
                      </span>
                    </div>
                    <Button 
                      variant="outline" 
                      className="border-purple-500/50 text-purple-400"
                      onClick={() => toast.success(`Opening "${dev.title}"...`)}
                    >
                      Read
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Prayer Tab */}
        {activeTab === "prayer" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">🙏 Prayer Wall</h2>
              <Button 
                className="bg-purple-500 hover:bg-purple-400"
                onClick={() => toast.info("Share your prayer request...")}
              >
                + Share Request
              </Button>
            </div>
            {PRAYER_REQUESTS.map((prayer) => (
              <Card key={prayer.id} className="bg-slate-800 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-white mb-2">{prayer.request}</p>
                      <p className="text-sm text-slate-500">- {prayer.user} • {prayer.time}</p>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-purple-500/50 text-purple-400"
                      onClick={() => toast.success("Praying with you 🙏")}
                    >
                      🙏 {prayer.prayers}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Community Tab */}
        {activeTab === "community" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white mb-4">👥 Faith Community Events</h2>
            {COMMUNITY_EVENTS.map((event) => (
              <Card key={event.id} className="bg-slate-800 border-slate-700 hover:border-purple-500/50 transition-all">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-white">{event.title}</h3>
                      <p className="text-sm text-slate-400">{event.date} • {event.location}</p>
                    </div>
                    <Button 
                      variant="outline" 
                      className="border-purple-500/50 text-purple-400"
                      onClick={() => toast.success(`RSVP'd to ${event.title}!`)}
                    >
                      RSVP
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Chaplain Chat */}
        <Card className="bg-gradient-to-r from-slate-800 to-purple-900/30 border-purple-500/30 mt-8">
          <CardContent className="p-6 flex items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-3xl">
              🕊️
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white">Talk to a Chaplain</h3>
              <p className="text-slate-400">Connect with a team chaplain or spiritual advisor for confidential guidance and support.</p>
            </div>
            <Button 
              className="bg-purple-500 hover:bg-purple-400 text-white"
              onClick={() => toast.info("Connecting with chaplain...")}
            >
              Start Chat
            </Button>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-700 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm">Faith - Part of the ATHLYNX Ecosystem</p>
          <p className="text-purple-400 text-xs mt-1">A Dozier Holdings Group Company</p>
        </div>
      </footer>
    </div>
  );
}
