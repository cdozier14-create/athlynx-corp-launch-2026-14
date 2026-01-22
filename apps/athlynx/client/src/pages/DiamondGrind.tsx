import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const WORKOUT_CATEGORIES = [
  { id: "strength", name: "Strength", icon: "💪", color: "from-red-500 to-orange-500" },
  { id: "speed", name: "Speed & Agility", icon: "⚡", color: "from-yellow-500 to-amber-500" },
  { id: "endurance", name: "Endurance", icon: "🏃", color: "from-green-500 to-emerald-500" },
  { id: "flexibility", name: "Flexibility", icon: "🧘", color: "from-blue-500 to-cyan-500" },
  { id: "recovery", name: "Recovery", icon: "🧊", color: "from-purple-500 to-pink-500" },
  { id: "sport", name: "Sport-Specific", icon: "🏈", color: "from-cyan-500 to-blue-500" },
];

const SAMPLE_WORKOUTS = [
  { id: 1, name: "Pro Combine Prep", duration: "45 min", difficulty: "Elite", category: "speed" },
  { id: 2, name: "NFL Strength Circuit", duration: "60 min", difficulty: "Advanced", category: "strength" },
  { id: 3, name: "Game Day Recovery", duration: "30 min", difficulty: "All Levels", category: "recovery" },
  { id: 4, name: "QB Arm Care", duration: "20 min", difficulty: "Intermediate", category: "sport" },
  { id: 5, name: "Explosive Power", duration: "40 min", difficulty: "Advanced", category: "strength" },
];

const WEEKLY_STATS = {
  workoutsCompleted: 12,
  totalMinutes: 480,
  caloriesBurned: 3200,
  streak: 7,
};

export default function DiamondGrind() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-red-900/20 to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-slate-900 to-red-900 backdrop-blur border-b border-slate-700">
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
              <span className="text-2xl">💎</span>
              <div>
                <h1 className="text-xl font-bold text-white">Diamond Grind</h1>
                <p className="text-xs text-red-400">Train Like a Champion</p>
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
        {/* Weekly Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-red-500/20 to-orange-500/20 border-red-500/30">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-white">{WEEKLY_STATS.workoutsCompleted}</p>
              <p className="text-sm text-slate-400">Workouts</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-yellow-500/20 to-amber-500/20 border-yellow-500/30">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-white">{WEEKLY_STATS.totalMinutes}</p>
              <p className="text-sm text-slate-400">Minutes</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/30">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-white">{WEEKLY_STATS.caloriesBurned}</p>
              <p className="text-sm text-slate-400">Calories</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/30">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-white">🔥 {WEEKLY_STATS.streak}</p>
              <p className="text-sm text-slate-400">Day Streak</p>
            </CardContent>
          </Card>
        </div>

        {/* Categories */}
        <h2 className="text-xl font-bold text-white mb-4">Training Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {WORKOUT_CATEGORIES.map((cat) => (
            <Card
              key={cat.id}
              className={`cursor-pointer transition-all hover:scale-105 ${
                selectedCategory === cat.id
                  ? "ring-2 ring-cyan-400 bg-slate-700"
                  : "bg-slate-800 border-slate-700"
              }`}
              onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
            >
              <CardContent className="p-4 text-center">
                <div className={`w-12 h-12 mx-auto mb-2 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center`}>
                  <span className="text-2xl">{cat.icon}</span>
                </div>
                <p className="text-white font-medium text-sm">{cat.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Workouts */}
        <h2 className="text-xl font-bold text-white mb-4">
          {selectedCategory ? `${WORKOUT_CATEGORIES.find(c => c.id === selectedCategory)?.name} Workouts` : "Featured Workouts"}
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {SAMPLE_WORKOUTS
            .filter(w => !selectedCategory || w.category === selectedCategory)
            .map((workout) => (
            <Card key={workout.id} className="bg-slate-800 border-slate-700 hover:border-red-500/50 transition-all">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">{workout.name}</h3>
                    <p className="text-sm text-slate-400">{workout.duration} • {workout.difficulty}</p>
                  </div>
                  <span className="text-2xl">
                    {WORKOUT_CATEGORIES.find(c => c.id === workout.category)?.icon}
                  </span>
                </div>
                <Button 
                  className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-400 hover:to-orange-400"
                  onClick={() => toast.success(`Starting ${workout.name}!`)}
                >
                  Start Workout
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* AI Coach */}
        <Card className="bg-gradient-to-r from-slate-800 to-slate-700 border-cyan-500/30">
          <CardContent className="p-6 flex items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-3xl">
              🤖
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white">AI Training Coach</h3>
              <p className="text-slate-400">Get personalized workout plans based on your goals, position, and performance data.</p>
            </div>
            <Button 
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-900"
              onClick={() => toast.info("AI Coach coming soon!")}
            >
              Talk to Coach
            </Button>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-700 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm">Diamond Grind - Part of the ATHLYNX Ecosystem</p>
          <p className="text-red-400 text-xs mt-1">A Dozier Holdings Group Company</p>
        </div>
      </footer>
    </div>
  );
}
