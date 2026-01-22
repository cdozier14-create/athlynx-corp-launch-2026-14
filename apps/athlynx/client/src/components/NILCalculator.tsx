import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, TrendingUp, Star, Sparkles, DollarSign } from "lucide-react";

interface ValuationResult {
  lowEstimate: number;
  highEstimate: number;
  factors: {
    name: string;
    impact: string;
    score: number;
  }[];
}

const sports = [
  { value: "football", label: "Football", multiplier: 1.5 },
  { value: "basketball", label: "Basketball", multiplier: 1.4 },
  { value: "baseball", label: "Baseball", multiplier: 1.2 },
  { value: "soccer", label: "Soccer", multiplier: 1.1 },
  { value: "volleyball", label: "Volleyball", multiplier: 1.0 },
  { value: "track", label: "Track & Field", multiplier: 0.9 },
  { value: "swimming", label: "Swimming", multiplier: 0.95 },
  { value: "golf", label: "Golf", multiplier: 1.3 },
  { value: "tennis", label: "Tennis", multiplier: 1.15 },
  { value: "other", label: "Other Sport", multiplier: 0.85 },
];

const divisions = [
  { value: "d1", label: "Division I", multiplier: 2.0 },
  { value: "d2", label: "Division II", multiplier: 1.3 },
  { value: "d3", label: "Division III", multiplier: 1.0 },
  { value: "naia", label: "NAIA", multiplier: 1.1 },
  { value: "juco", label: "JUCO", multiplier: 0.9 },
  { value: "highschool", label: "High School", multiplier: 0.7 },
];

export default function NILCalculator() {
  const [instagramFollowers, setInstagramFollowers] = useState("");
  const [tiktokFollowers, setTiktokFollowers] = useState("");
  const [twitterFollowers, setTwitterFollowers] = useState("");
  const [sport, setSport] = useState("");
  const [division, setDivision] = useState("");
  const [engagementRate, setEngagementRate] = useState("");
  const [result, setResult] = useState<ValuationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const calculateNILValue = () => {
    setIsCalculating(true);
    setShowResult(false);

    // Simulate AI processing
    setTimeout(() => {
      const igFollowers = parseInt(instagramFollowers) || 0;
      const ttFollowers = parseInt(tiktokFollowers) || 0;
      const twFollowers = parseInt(twitterFollowers) || 0;
      const engagement = parseFloat(engagementRate) || 3;

      const sportData = sports.find(s => s.value === sport) || { multiplier: 1 };
      const divisionData = divisions.find(d => d.value === division) || { multiplier: 1 };

      // Base value calculation
      const totalFollowers = igFollowers + ttFollowers + twFollowers;
      const baseValue = totalFollowers * 0.01; // $0.01 per follower base

      // Engagement multiplier (higher engagement = more value)
      const engagementMultiplier = engagement > 5 ? 1.5 : engagement > 3 ? 1.2 : 1.0;

      // Platform weighting (Instagram most valuable for NIL)
      const platformScore = (igFollowers * 1.2 + ttFollowers * 1.0 + twFollowers * 0.8) / Math.max(totalFollowers, 1);

      // Final calculation
      const rawValue = baseValue * sportData.multiplier * divisionData.multiplier * engagementMultiplier * platformScore;
      
      const lowEstimate = Math.round(rawValue * 0.7);
      const highEstimate = Math.round(rawValue * 1.3);

      const factors = [
        {
          name: "Social Reach",
          impact: totalFollowers > 100000 ? "High" : totalFollowers > 10000 ? "Medium" : "Growing",
          score: Math.min(100, Math.round(totalFollowers / 1000)),
        },
        {
          name: "Sport Demand",
          impact: sportData.multiplier > 1.3 ? "Premium" : sportData.multiplier > 1 ? "Strong" : "Standard",
          score: Math.round(sportData.multiplier * 50),
        },
        {
          name: "Division Level",
          impact: divisionData.multiplier > 1.5 ? "Elite" : divisionData.multiplier > 1 ? "Competitive" : "Developing",
          score: Math.round(divisionData.multiplier * 40),
        },
        {
          name: "Engagement Quality",
          impact: engagement > 5 ? "Excellent" : engagement > 3 ? "Good" : "Average",
          score: Math.round(engagementMultiplier * 60),
        },
      ];

      setResult({ lowEstimate, highEstimate, factors });
      setIsCalculating(false);
      setShowResult(true);
    }, 2000);
  };

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
    return `$${value}`;
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 border-2 border-cyan-400/30 shadow-2xl overflow-hidden">
        <CardHeader className="text-center pb-2">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="p-2 bg-cyan-400/20 rounded-full">
              <Calculator className="w-6 h-6 text-cyan-400" />
            </div>
            <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
          </div>
          <CardTitle className="text-2xl font-black text-white">
            AI NIL Value Calculator
          </CardTitle>
          <p className="text-cyan-400 text-sm">Powered by ATHLYNX AI</p>
        </CardHeader>

        <CardContent className="space-y-4 p-6">
          {/* Social Media Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-slate-300 text-xs">Instagram Followers</Label>
              <Input
                type="number"
                placeholder="e.g., 50000"
                value={instagramFollowers}
                onChange={(e) => setInstagramFollowers(e.target.value)}
                className="bg-slate-800 border-slate-600 text-white"
              />
            </div>
            <div>
              <Label className="text-slate-300 text-xs">TikTok Followers</Label>
              <Input
                type="number"
                placeholder="e.g., 100000"
                value={tiktokFollowers}
                onChange={(e) => setTiktokFollowers(e.target.value)}
                className="bg-slate-800 border-slate-600 text-white"
              />
            </div>
            <div>
              <Label className="text-slate-300 text-xs">X/Twitter Followers</Label>
              <Input
                type="number"
                placeholder="e.g., 25000"
                value={twitterFollowers}
                onChange={(e) => setTwitterFollowers(e.target.value)}
                className="bg-slate-800 border-slate-600 text-white"
              />
            </div>
          </div>

          {/* Sport & Division */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-slate-300 text-xs">Sport</Label>
              <Select value={sport} onValueChange={setSport}>
                <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                  <SelectValue placeholder="Select sport" />
                </SelectTrigger>
                <SelectContent>
                  {sports.map((s) => (
                    <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-slate-300 text-xs">Division</Label>
              <Select value={division} onValueChange={setDivision}>
                <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                  <SelectValue placeholder="Select division" />
                </SelectTrigger>
                <SelectContent>
                  {divisions.map((d) => (
                    <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Engagement Rate */}
          <div>
            <Label className="text-slate-300 text-xs">Average Engagement Rate (%)</Label>
            <Input
              type="number"
              step="0.1"
              placeholder="e.g., 4.5"
              value={engagementRate}
              onChange={(e) => setEngagementRate(e.target.value)}
              className="bg-slate-800 border-slate-600 text-white"
            />
          </div>

          {/* Calculate Button */}
          <Button
            onClick={calculateNILValue}
            disabled={isCalculating || !sport || !division}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-6 text-lg"
          >
            {isCalculating ? (
              <span className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                AI Analyzing...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Calculate My NIL Value
              </span>
            )}
          </Button>

          {/* Results */}
          {showResult && result && (
            <div className="mt-6 p-6 bg-gradient-to-br from-green-900/50 to-emerald-900/50 rounded-2xl border border-green-400/30 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center mb-4">
                <p className="text-green-400 text-sm font-medium mb-2">YOUR ESTIMATED NIL VALUE</p>
                <div className="flex items-center justify-center gap-2">
                  <DollarSign className="w-8 h-8 text-green-400" />
                  <span className="text-4xl font-black text-white">
                    {formatCurrency(result.lowEstimate)} - {formatCurrency(result.highEstimate)}
                  </span>
                </div>
                <p className="text-slate-400 text-xs mt-2">Annual NIL earning potential</p>
              </div>

              {/* Factor Breakdown */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                {result.factors.map((factor, index) => (
                  <div key={index} className="bg-slate-800/50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-slate-400 text-xs">{factor.name}</span>
                      <span className={`text-xs font-bold ${
                        factor.impact === "High" || factor.impact === "Premium" || factor.impact === "Elite" || factor.impact === "Excellent"
                          ? "text-green-400"
                          : factor.impact === "Medium" || factor.impact === "Strong" || factor.impact === "Competitive" || factor.impact === "Good"
                          ? "text-amber-400"
                          : "text-slate-400"
                      }`}>
                        {factor.impact}
                      </span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-cyan-400 to-green-400 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${Math.min(100, factor.score)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="mt-6 text-center">
                <p className="text-slate-300 text-sm mb-3">
                  Ready to maximize your NIL potential?
                </p>
                <Button className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold">
                  <Star className="w-4 h-4 mr-2" />
                  Join ATHLYNX VIP
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
