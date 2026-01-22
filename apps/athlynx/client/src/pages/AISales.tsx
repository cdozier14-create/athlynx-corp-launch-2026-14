import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const BRAND_MATCHES = [
  { id: 1, brand: "Under Armour", match: 94, category: "Apparel", potential: "$75,000", status: "Hot Lead" },
  { id: 2, brand: "Chipotle", match: 87, category: "Food & Beverage", potential: "$25,000", status: "Interested" },
  { id: 3, brand: "State Farm", match: 82, category: "Insurance", potential: "$50,000", status: "New Match" },
  { id: 4, brand: "Beats by Dre", match: 79, category: "Electronics", potential: "$40,000", status: "New Match" },
  { id: 5, brand: "Red Bull", match: 76, category: "Energy", potential: "$35,000", status: "Contacted" },
];

const OUTREACH_STATS = {
  sent: 45,
  opened: 38,
  replied: 12,
  deals: 3,
};

const TEMPLATES = [
  { id: 1, name: "Initial Outreach", uses: 234, successRate: "32%" },
  { id: 2, name: "Follow-Up", uses: 156, successRate: "28%" },
  { id: 3, name: "Value Proposition", uses: 89, successRate: "41%" },
  { id: 4, name: "Closing Pitch", uses: 67, successRate: "52%" },
];

export default function AISales() {
  const [selectedBrand, setSelectedBrand] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900/20 to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/portal">
            <div className="flex items-center gap-3 cursor-pointer">
              <span className="text-2xl">🤖</span>
              <div>
                <h1 className="text-xl font-bold text-white">AI Sales</h1>
                <p className="text-xs text-blue-400">Brand Deal Automation</p>
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
        {/* Outreach Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-blue-400">{OUTREACH_STATS.sent}</p>
              <p className="text-sm text-slate-400">Emails Sent</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-cyan-400">{OUTREACH_STATS.opened}</p>
              <p className="text-sm text-slate-400">Opened</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-green-400">{OUTREACH_STATS.replied}</p>
              <p className="text-sm text-slate-400">Replied</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-500/30">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-white">{OUTREACH_STATS.deals}</p>
              <p className="text-sm text-slate-400">Deals Closed</p>
            </CardContent>
          </Card>
        </div>

        {/* AI Brand Matches */}
        <h2 className="text-xl font-bold text-white mb-4">🎯 AI Brand Matches</h2>
        <p className="text-slate-400 mb-4">Our AI analyzes your profile, audience, and engagement to find perfect brand partners.</p>
        
        <div className="space-y-4 mb-8">
          {BRAND_MATCHES.map((brand) => (
            <Card 
              key={brand.id} 
              className={`bg-slate-800 border-slate-700 hover:border-blue-500/50 transition-all cursor-pointer ${
                selectedBrand === brand.id ? "ring-2 ring-blue-400" : ""
              }`}
              onClick={() => setSelectedBrand(selectedBrand === brand.id ? null : brand.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-xl font-bold text-white">
                        {brand.brand[0]}
                      </div>
                      <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-xs font-bold text-white">
                        {brand.match}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-white">{brand.brand}</h3>
                      <p className="text-sm text-slate-400">{brand.category}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        brand.status === "Hot Lead" ? "bg-red-500/20 text-red-400" :
                        brand.status === "Interested" ? "bg-yellow-500/20 text-yellow-400" :
                        brand.status === "Contacted" ? "bg-blue-500/20 text-blue-400" :
                        "bg-slate-600 text-slate-400"
                      }`}>
                        {brand.status}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-cyan-400">{brand.potential}</p>
                    <p className="text-xs text-slate-500">Potential Value</p>
                    <Button 
                      size="sm" 
                      className="mt-2 bg-blue-500 hover:bg-blue-400"
                      onClick={(e) => {
                        e.stopPropagation();
                        toast.success(`AI drafting outreach to ${brand.brand}...`);
                      }}
                    >
                      AI Outreach
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Email Templates */}
        <h2 className="text-xl font-bold text-white mb-4">📧 AI Email Templates</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {TEMPLATES.map((template) => (
            <Card key={template.id} className="bg-slate-800 border-slate-700 hover:border-blue-500/50 transition-all">
              <CardContent className="p-4">
                <h3 className="font-bold text-white mb-2">{template.name}</h3>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">{template.uses} uses</span>
                  <span className="text-green-400">{template.successRate} success</span>
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full mt-3 border-blue-500/50 text-blue-400"
                  onClick={() => toast.info(`Opening ${template.name} template...`)}
                >
                  Use Template
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* AI Pitch Generator */}
        <Card className="bg-gradient-to-r from-slate-800 to-blue-900/30 border-blue-500/30">
          <CardContent className="p-6 flex items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-3xl">
              ✨
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white">AI Pitch Generator</h3>
              <p className="text-slate-400">Generate personalized pitches for any brand based on your unique value proposition and their marketing goals.</p>
            </div>
            <Button 
              className="bg-blue-500 hover:bg-blue-400 text-white"
              onClick={() => toast.info("AI Pitch Generator coming soon!")}
            >
              Generate Pitch
            </Button>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-700 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm">AI Sales - Part of the ATHLYNX Ecosystem</p>
          <p className="text-blue-400 text-xs mt-1">A Dozier Holdings Group Company</p>
        </div>
      </footer>
    </div>
  );
}
