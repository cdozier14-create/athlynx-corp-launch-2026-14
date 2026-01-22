import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const SCHOOL_INTERESTS = [
  { id: 1, school: "University of Texas", conference: "SEC", interest: "High", lastContact: "2 days ago", position: "QB" },
  { id: 2, school: "Ohio State", conference: "Big Ten", interest: "Medium", lastContact: "1 week ago", position: "QB" },
  { id: 3, school: "Alabama", conference: "SEC", interest: "High", lastContact: "3 days ago", position: "QB" },
  { id: 4, school: "USC", conference: "Big Ten", interest: "Medium", lastContact: "5 days ago", position: "QB" },
  { id: 5, school: "Georgia", conference: "SEC", interest: "Watching", lastContact: "2 weeks ago", position: "QB" },
];

const RECRUITING_TIMELINE = [
  { id: 1, event: "Official Visit - Texas", date: "Jan 15, 2026", status: "Scheduled" },
  { id: 2, event: "Phone Call - Coach Saban", date: "Jan 10, 2026", status: "Completed" },
  { id: 3, event: "Unofficial Visit - Ohio State", date: "Jan 20, 2026", status: "Pending" },
  { id: 4, event: "Commitment Deadline", date: "Feb 1, 2026", status: "Upcoming" },
];

const PROFILE_STRENGTH = {
  overall: 87,
  highlights: 92,
  academics: 78,
  social: 85,
  references: 90,
};

export default function AIRecruiter() {
  const [selectedSchool, setSelectedSchool] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-orange-900/20 to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/portal">
            <div className="flex items-center gap-3 cursor-pointer">
              <span className="text-2xl">🎯</span>
              <div>
                <h1 className="text-xl font-bold text-white">AI Recruiter</h1>
                <p className="text-xs text-orange-400">Recruiting Automation & Tracking</p>
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
        {/* Profile Strength */}
        <Card className="bg-gradient-to-r from-orange-900/30 to-amber-900/30 border-orange-500/30 mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">📊 Recruiting Profile Strength</h2>
              <div className="text-3xl font-bold text-orange-400">{PROFILE_STRENGTH.overall}%</div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(PROFILE_STRENGTH).filter(([k]) => k !== 'overall').map(([key, value]) => (
                <div key={key}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-400 capitalize">{key}</span>
                    <span className="text-white">{value}%</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full">
                    <div 
                      className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"
                      style={{ width: `${value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* School Interests */}
        <h2 className="text-xl font-bold text-white mb-4">🏫 Schools Interested</h2>
        <div className="space-y-4 mb-8">
          {SCHOOL_INTERESTS.map((school) => (
            <Card 
              key={school.id} 
              className={`bg-slate-800 border-slate-700 hover:border-orange-500/50 transition-all cursor-pointer ${
                selectedSchool === school.id ? "ring-2 ring-orange-400" : ""
              }`}
              onClick={() => setSelectedSchool(selectedSchool === school.id ? null : school.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-xl font-bold text-white">
                      {school.school[0]}
                    </div>
                    <div>
                      <h3 className="font-bold text-white">{school.school}</h3>
                      <p className="text-sm text-slate-400">{school.conference} • Looking for {school.position}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-sm px-3 py-1 rounded-full ${
                      school.interest === "High" ? "bg-green-500/20 text-green-400" :
                      school.interest === "Medium" ? "bg-yellow-500/20 text-yellow-400" :
                      "bg-slate-600 text-slate-400"
                    }`}>
                      {school.interest} Interest
                    </span>
                    <p className="text-xs text-slate-500 mt-2">Last contact: {school.lastContact}</p>
                  </div>
                </div>
                {selectedSchool === school.id && (
                  <div className="mt-4 pt-4 border-t border-slate-700 flex gap-2">
                    <Button size="sm" className="bg-orange-500 hover:bg-orange-400" onClick={(e) => { e.stopPropagation(); toast.success("AI drafting message..."); }}>
                      AI Message
                    </Button>
                    <Button size="sm" variant="outline" className="border-orange-500/50 text-orange-400" onClick={(e) => { e.stopPropagation(); toast.info("Scheduling visit..."); }}>
                      Schedule Visit
                    </Button>
                    <Button size="sm" variant="outline" className="border-slate-600" onClick={(e) => { e.stopPropagation(); toast.info("Viewing school profile..."); }}>
                      View School
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Timeline */}
        <h2 className="text-xl font-bold text-white mb-4">📅 Recruiting Timeline</h2>
        <div className="space-y-4 mb-8">
          {RECRUITING_TIMELINE.map((event, index) => (
            <div key={event.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className={`w-4 h-4 rounded-full ${
                  event.status === "Completed" ? "bg-green-500" :
                  event.status === "Scheduled" ? "bg-orange-500" :
                  "bg-slate-600"
                }`} />
                {index < RECRUITING_TIMELINE.length - 1 && <div className="w-0.5 h-full bg-slate-700 my-1" />}
              </div>
              <Card className="flex-1 bg-slate-800 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-white">{event.event}</h3>
                      <p className="text-sm text-slate-400">{event.date}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      event.status === "Completed" ? "bg-green-500/20 text-green-400" :
                      event.status === "Scheduled" ? "bg-orange-500/20 text-orange-400" :
                      "bg-slate-600 text-slate-400"
                    }`}>
                      {event.status}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* AI Coach Finder */}
        <Card className="bg-gradient-to-r from-slate-800 to-orange-900/30 border-orange-500/30">
          <CardContent className="p-6 flex items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-3xl">
              🤖
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white">AI School Matcher</h3>
              <p className="text-slate-400">Find your perfect school match based on your academics, athletics, location preferences, and NIL potential.</p>
            </div>
            <Button 
              className="bg-orange-500 hover:bg-orange-400 text-white"
              onClick={() => toast.info("AI School Matcher coming soon!")}
            >
              Find My Match
            </Button>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-700 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm">AI Recruiter - Part of the ATHLYNX Ecosystem</p>
          <p className="text-orange-400 text-xs mt-1">A Dozier Holdings Group Company</p>
        </div>
      </footer>
    </div>
  );
}
