import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const DEALS = [
  { id: 1, brand: "Nike", type: "Apparel", value: "$50,000", status: "Active", startDate: "Jan 2025", endDate: "Dec 2025" },
  { id: 2, brand: "Gatorade", type: "Endorsement", value: "$25,000", status: "Active", startDate: "Mar 2025", endDate: "Mar 2026" },
  { id: 3, brand: "Local Car Dealer", type: "Appearance", value: "$5,000", status: "Completed", startDate: "Nov 2025", endDate: "Nov 2025" },
  { id: 4, brand: "Protein Brand", type: "Social Media", value: "$8,000", status: "Pending", startDate: "Feb 2026", endDate: "Aug 2026" },
];

const EARNINGS_SUMMARY = {
  totalEarnings: 88000,
  activeDeals: 3,
  pendingDeals: 1,
  completedDeals: 5,
};

const UPCOMING_OBLIGATIONS = [
  { id: 1, brand: "Nike", task: "Instagram Post - New Cleats", dueDate: "Jan 10, 2026", status: "Due Soon" },
  { id: 2, brand: "Gatorade", task: "Video Testimonial", dueDate: "Jan 15, 2026", status: "Upcoming" },
  { id: 3, brand: "Local Car Dealer", task: "Autograph Session", dueDate: "Jan 20, 2026", status: "Upcoming" },
];

export default function NILVault() {
  const [filter, setFilter] = useState<"all" | "active" | "pending" | "completed">("all");

  const filteredDeals = DEALS.filter(d => filter === "all" || d.status.toLowerCase() === filter);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-emerald-900/20 to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-slate-900 to-emerald-900 backdrop-blur border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Queen of the Ball Logo */}
            <Link href="/">
              <div className="relative cursor-pointer group">
                <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 rounded-xl px-3 py-2 shadow-xl hover:shadow-cyan-500/30 transition-all border border-cyan-400/30">
                  <img 
                    src="/athlynx-playbook-logo.png" 
                    alt="ATHLYNX - The Athlete's Playbook" 
                    className="h-8 md:h-10 rounded-lg shadow-lg group-hover:scale-105 transition-all duration-300"
                  />
                </div>
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full border border-slate-900 animate-pulse"></div>
              </div>
            </Link>
            
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔐</span>
              <div>
                <h1 className="text-xl font-bold text-white">NIL Vault</h1>
                <p className="text-xs text-emerald-400">Deal Management & Contracts</p>
              </div>
            </div>
          </div>
          <Link href="/portal">
            <Button variant="outline" size="sm" className="border-slate-600">
              ← Back to Portal
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Earnings Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-emerald-500/20 to-green-500/20 border-emerald-500/30">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-white">${(EARNINGS_SUMMARY.totalEarnings / 1000).toFixed(0)}K</p>
              <p className="text-sm text-slate-400">Total Earnings</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-emerald-400">{EARNINGS_SUMMARY.activeDeals}</p>
              <p className="text-sm text-slate-400">Active Deals</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-yellow-400">{EARNINGS_SUMMARY.pendingDeals}</p>
              <p className="text-sm text-slate-400">Pending</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-slate-400">{EARNINGS_SUMMARY.completedDeals}</p>
              <p className="text-sm text-slate-400">Completed</p>
            </CardContent>
          </Card>
        </div>

        {/* Deals */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">💼 My Deals</h2>
          <div className="flex gap-2">
            {(["all", "active", "pending", "completed"] as const).map((f) => (
              <Button
                key={f}
                size="sm"
                variant={filter === f ? "default" : "outline"}
                className={filter === f ? "bg-emerald-500" : "border-slate-600"}
                onClick={() => setFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-4 mb-8">
          {filteredDeals.map((deal) => (
            <Card key={deal.id} className="bg-slate-800 border-slate-700 hover:border-emerald-500/50 transition-all">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-slate-700 flex items-center justify-center text-xl">
                      {deal.brand[0]}
                    </div>
                    <div>
                      <h3 className="font-bold text-white">{deal.brand}</h3>
                      <p className="text-sm text-slate-400">{deal.type} • {deal.startDate} - {deal.endDate}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-emerald-400">{deal.value}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      deal.status === "Active" ? "bg-emerald-500/20 text-emerald-400" :
                      deal.status === "Pending" ? "bg-yellow-500/20 text-yellow-400" :
                      "bg-slate-600 text-slate-400"
                    }`}>
                      {deal.status}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Upcoming Obligations */}
        <h2 className="text-xl font-bold text-white mb-4">📅 Upcoming Obligations</h2>
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {UPCOMING_OBLIGATIONS.map((task) => (
            <Card key={task.id} className="bg-slate-800 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    task.status === "Due Soon" ? "bg-red-500/20 text-red-400" : "bg-slate-600 text-slate-400"
                  }`}>
                    {task.status}
                  </span>
                  <span className="text-xs text-slate-500">{task.dueDate}</span>
                </div>
                <h3 className="font-bold text-white mb-1">{task.brand}</h3>
                <p className="text-sm text-slate-400">{task.task}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* AI Contract Review */}
        <Card className="bg-gradient-to-r from-slate-800 to-emerald-900/30 border-emerald-500/30">
          <CardContent className="p-6 flex items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center text-3xl">
              🤖
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white">AI Contract Review</h3>
              <p className="text-slate-400">Upload any NIL contract and get instant AI analysis of terms, red flags, and negotiation tips.</p>
            </div>
            <Button 
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-900"
              onClick={() => toast.info("AI Contract Review coming soon!")}
            >
              Upload Contract
            </Button>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-700 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm">NIL Vault - Part of the ATHLYNX Ecosystem</p>
          <p className="text-emerald-400 text-xs mt-1">A Dozier Holdings Group Company</p>
        </div>
      </footer>
    </div>
  );
}
