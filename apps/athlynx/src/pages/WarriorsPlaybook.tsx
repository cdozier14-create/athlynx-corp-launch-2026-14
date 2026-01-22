import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const PLAYBOOK_SECTIONS = [
  { id: "offense", name: "Offense", icon: "🏈", plays: 45 },
  { id: "defense", name: "Defense", icon: "🛡️", plays: 38 },
  { id: "special", name: "Special Teams", icon: "⚡", plays: 22 },
  { id: "situational", name: "Situational", icon: "🎯", plays: 31 },
];

const FILM_SESSIONS = [
  { id: 1, title: "Week 12 vs Alabama", date: "Nov 23, 2025", duration: "2:45:00", notes: 12 },
  { id: 2, title: "Self Scout - Red Zone", date: "Nov 20, 2025", duration: "1:30:00", notes: 8 },
  { id: 3, title: "Opponent Tendencies", date: "Nov 18, 2025", duration: "1:15:00", notes: 15 },
];

const GAME_PREP = [
  { id: 1, opponent: "LSU Tigers", date: "Jan 11, 2026", status: "In Progress", completion: 65 },
  { id: 2, opponent: "Georgia Bulldogs", date: "Jan 18, 2026", status: "Not Started", completion: 0 },
];

export default function WarriorsPlaybook() {
  const [activeSection, setActiveSection] = useState("offense");

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-amber-900/20 to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/portal">
            <div className="flex items-center gap-3 cursor-pointer">
              <span className="text-2xl">⚔️</span>
              <div>
                <h1 className="text-xl font-bold text-white">Warriors Playbook</h1>
                <p className="text-xs text-amber-400">Strategy & Film Study</p>
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
        {/* Playbook Sections */}
        <h2 className="text-xl font-bold text-white mb-4">📖 Playbook</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {PLAYBOOK_SECTIONS.map((section) => (
            <Card
              key={section.id}
              className={`cursor-pointer transition-all hover:scale-105 ${
                activeSection === section.id
                  ? "ring-2 ring-amber-400 bg-amber-900/30"
                  : "bg-slate-800 border-slate-700"
              }`}
              onClick={() => setActiveSection(section.id)}
            >
              <CardContent className="p-6 text-center">
                <span className="text-4xl mb-2 block">{section.icon}</span>
                <h3 className="text-lg font-bold text-white">{section.name}</h3>
                <p className="text-amber-400 text-sm">{section.plays} Plays</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Play Viewer */}
        <Card className="bg-slate-800 border-slate-700 mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">
                {PLAYBOOK_SECTIONS.find(s => s.id === activeSection)?.name} Plays
              </h3>
              <Button 
                className="bg-amber-500 hover:bg-amber-400 text-slate-900"
                onClick={() => toast.info("Drawing board coming soon!")}
              >
                + New Play
              </Button>
            </div>
            <div className="aspect-video bg-slate-900 rounded-lg flex items-center justify-center border border-slate-600">
              <div className="text-center">
                <span className="text-6xl mb-4 block">🏟️</span>
                <p className="text-slate-400">Select a play to view diagram</p>
                <p className="text-xs text-slate-500 mt-2">AI-powered play analysis available</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Film Sessions */}
        <h2 className="text-xl font-bold text-white mb-4">🎬 Film Sessions</h2>
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {FILM_SESSIONS.map((session) => (
            <Card key={session.id} className="bg-slate-800 border-slate-700 hover:border-amber-500/50 transition-all">
              <CardContent className="p-4">
                <h3 className="font-bold text-white mb-1">{session.title}</h3>
                <p className="text-sm text-slate-400 mb-3">{session.date} • {session.duration}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-amber-400">{session.notes} notes</span>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="border-amber-500/50 text-amber-400 hover:bg-amber-500/20"
                    onClick={() => toast.success(`Opening ${session.title}`)}
                  >
                    Watch
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Game Prep */}
        <h2 className="text-xl font-bold text-white mb-4">🎯 Game Prep</h2>
        <div className="space-y-4 mb-8">
          {GAME_PREP.map((game) => (
            <Card key={game.id} className="bg-slate-800 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-white">{game.opponent}</h3>
                    <p className="text-sm text-slate-400">{game.date}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${game.status === "In Progress" ? "text-amber-400" : "text-slate-500"}`}>
                      {game.status}
                    </p>
                    <div className="w-32 h-2 bg-slate-700 rounded-full mt-2">
                      <div 
                        className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                        style={{ width: `${game.completion}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* AI Scout */}
        <Card className="bg-gradient-to-r from-slate-800 to-amber-900/30 border-amber-500/30">
          <CardContent className="p-6 flex items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-3xl">
              🤖
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white">AI Scout Assistant</h3>
              <p className="text-slate-400">Get AI-powered opponent analysis, tendency reports, and game plan suggestions.</p>
            </div>
            <Button 
              className="bg-amber-500 hover:bg-amber-400 text-slate-900"
              onClick={() => toast.info("AI Scout coming soon!")}
            >
              Analyze Opponent
            </Button>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-700 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm">Warriors Playbook - Part of the ATHLYNX Ecosystem</p>
          <p className="text-amber-400 text-xs mt-1">A Dozier Holdings Group Company</p>
        </div>
      </footer>
    </div>
  );
}
