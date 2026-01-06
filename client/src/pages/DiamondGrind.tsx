import { useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

// Mock workout data
const mockWorkouts = [
  { id: 1, name: "Morning Cardio", type: "cardio", duration: 45, calories: 450, completed: true, date: "2026-01-05" },
  { id: 2, name: "Upper Body Strength", type: "strength", duration: 60, calories: 380, completed: true, date: "2026-01-04" },
  { id: 3, name: "Speed Training", type: "agility", duration: 30, calories: 320, completed: true, date: "2026-01-03" },
  { id: 4, name: "Leg Day", type: "strength", duration: 75, calories: 520, completed: false, date: "2026-01-06" },
];

const weeklyStats = {
  workoutsCompleted: 5,
  totalMinutes: 285,
  caloriesBurned: 2450,
  streak: 7,
};

const achievements = [
  { id: 1, name: "First Workout", icon: "🏃", unlocked: true },
  { id: 2, name: "7 Day Streak", icon: "🔥", unlocked: true },
  { id: 3, name: "1000 Calories", icon: "💪", unlocked: true },
  { id: 4, name: "Early Bird", icon: "🌅", unlocked: true },
  { id: 5, name: "Iron Will", icon: "🏋️", unlocked: false },
  { id: 6, name: "Marathon", icon: "🏅", unlocked: false },
];

export default function DiamondGrind() {
  const { user, isAuthenticated, loading: isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<"dashboard" | "workouts" | "progress" | "achievements">("dashboard");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-cyan-400 border-t-transparent"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-slate-800 border-slate-700">
          <CardHeader className="text-center">
            <img src="/diamond-grind-app-icon.png" alt="Diamond Grind" className="w-16 h-16 mx-auto mb-4 rounded-xl" />
            <CardTitle className="text-2xl text-white">Diamond Grind</CardTitle>
            <p className="text-slate-400 mt-2">Please log in to access training</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <a href="/api/auth/login" className="block">
              <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold py-3">
                Login with Manus
              </Button>
            </a>
            <Link href="/">
              <Button variant="outline" className="w-full border-slate-600 text-slate-300 hover:bg-slate-700">
                Back to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/portal">
            <div className="flex items-center gap-3 cursor-pointer">
              <img src="/diamond-grind-app-icon.png" alt="Diamond Grind" className="w-10 h-10 rounded-xl" />
              <div>
                <h1 className="text-white font-bold text-xl">DIAMOND GRIND</h1>
                <p className="text-cyan-400 text-xs">ELITE TRAINING</p>
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/portal">
              <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                ← Back to Portal
              </Button>
            </Link>
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
              {user?.name?.charAt(0) || "A"}
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 flex gap-1">
          {[
            { id: "dashboard", label: "Dashboard" },
            { id: "workouts", label: "Workouts" },
            { id: "progress", label: "Progress" },
            { id: "achievements", label: "Achievements" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === tab.id
                  ? "text-cyan-400 border-b-2 border-cyan-400"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            {/* Weekly Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-blue-600 to-cyan-500 border-0">
                <CardContent className="p-6 text-center">
                  <p className="text-blue-100 text-sm">Workouts This Week</p>
                  <p className="text-white text-4xl font-bold mt-2">{weeklyStats.workoutsCompleted}</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-purple-600 to-pink-500 border-0">
                <CardContent className="p-6 text-center">
                  <p className="text-purple-100 text-sm">Total Minutes</p>
                  <p className="text-white text-4xl font-bold mt-2">{weeklyStats.totalMinutes}</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-orange-500 to-red-500 border-0">
                <CardContent className="p-6 text-center">
                  <p className="text-orange-100 text-sm">Calories Burned</p>
                  <p className="text-white text-4xl font-bold mt-2">{weeklyStats.caloriesBurned.toLocaleString()}</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-green-500 to-emerald-500 border-0">
                <CardContent className="p-6 text-center">
                  <p className="text-green-100 text-sm">Day Streak 🔥</p>
                  <p className="text-white text-4xl font-bold mt-2">{weeklyStats.streak}</p>
                </CardContent>
              </Card>
            </div>

            {/* Today's Workout */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  💪 Today's Workout
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-700/50 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-white text-xl font-bold">Leg Day</h3>
                      <p className="text-slate-400">Strength Training • 75 min</p>
                    </div>
                    <Button className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400">
                      Start Workout
                    </Button>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-6">
                    <div className="text-center">
                      <p className="text-slate-400 text-sm">Exercises</p>
                      <p className="text-white font-bold text-lg">8</p>
                    </div>
                    <div className="text-center">
                      <p className="text-slate-400 text-sm">Est. Calories</p>
                      <p className="text-white font-bold text-lg">520</p>
                    </div>
                    <div className="text-center">
                      <p className="text-slate-400 text-sm">Difficulty</p>
                      <p className="text-orange-400 font-bold text-lg">Hard</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Workouts */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  📊 Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockWorkouts.filter(w => w.completed).map((workout) => (
                    <div key={workout.id} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          workout.type === "cardio" ? "bg-red-500/20 text-red-400" :
                          workout.type === "strength" ? "bg-blue-500/20 text-blue-400" :
                          "bg-green-500/20 text-green-400"
                        }`}>
                          {workout.type === "cardio" ? "🏃" : workout.type === "strength" ? "🏋️" : "⚡"}
                        </div>
                        <div>
                          <p className="text-white font-medium">{workout.name}</p>
                          <p className="text-slate-400 text-sm">{workout.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-medium">{workout.duration} min</p>
                        <p className="text-cyan-400 text-sm">{workout.calories} cal</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "workouts" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-white text-2xl font-bold">Workout Library</h2>
              <Button className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400">
                + Create Workout
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: "HIIT Cardio", duration: "30 min", difficulty: "Hard", icon: "🔥" },
                { name: "Upper Body", duration: "45 min", difficulty: "Medium", icon: "💪" },
                { name: "Lower Body", duration: "50 min", difficulty: "Hard", icon: "🦵" },
                { name: "Core Crusher", duration: "20 min", difficulty: "Medium", icon: "🎯" },
                { name: "Full Body", duration: "60 min", difficulty: "Hard", icon: "⚡" },
                { name: "Recovery", duration: "30 min", difficulty: "Easy", icon: "🧘" },
              ].map((workout, i) => (
                <Card key={i} className="bg-slate-800 border-slate-700 hover:border-cyan-400 transition-colors cursor-pointer">
                  <CardContent className="p-6">
                    <div className="text-4xl mb-4">{workout.icon}</div>
                    <h3 className="text-white font-bold text-lg">{workout.name}</h3>
                    <p className="text-slate-400 text-sm mt-1">{workout.duration}</p>
                    <div className="flex justify-between items-center mt-4">
                      <span className={`text-sm px-2 py-1 rounded ${
                        workout.difficulty === "Easy" ? "bg-green-500/20 text-green-400" :
                        workout.difficulty === "Medium" ? "bg-yellow-500/20 text-yellow-400" :
                        "bg-red-500/20 text-red-400"
                      }`}>
                        {workout.difficulty}
                      </span>
                      <Button size="sm" variant="outline" className="border-cyan-400 text-cyan-400 hover:bg-cyan-400/10">
                        Start
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === "progress" && (
          <div className="space-y-6">
            <h2 className="text-white text-2xl font-bold">Your Progress</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Weekly Goal Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-400">Workouts (5/7)</span>
                      <span className="text-cyan-400">71%</span>
                    </div>
                    <Progress value={71} className="h-3" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-400">Minutes (285/300)</span>
                      <span className="text-cyan-400">95%</span>
                    </div>
                    <Progress value={95} className="h-3" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-400">Calories (2450/3000)</span>
                      <span className="text-cyan-400">82%</span>
                    </div>
                    <Progress value={82} className="h-3" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Monthly Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                      <p className="text-3xl font-bold text-white">23</p>
                      <p className="text-slate-400 text-sm">Workouts</p>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                      <p className="text-3xl font-bold text-white">1,140</p>
                      <p className="text-slate-400 text-sm">Minutes</p>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                      <p className="text-3xl font-bold text-white">9.8K</p>
                      <p className="text-slate-400 text-sm">Calories</p>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                      <p className="text-3xl font-bold text-cyan-400">A+</p>
                      <p className="text-slate-400 text-sm">Grade</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "achievements" && (
          <div className="space-y-6">
            <h2 className="text-white text-2xl font-bold">Achievements</h2>
            <p className="text-slate-400">Unlock achievements by completing workouts and reaching milestones!</p>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {achievements.map((achievement) => (
                <Card
                  key={achievement.id}
                  className={`border-slate-700 ${
                    achievement.unlocked
                      ? "bg-gradient-to-br from-cyan-600/20 to-blue-600/20 border-cyan-500/50"
                      : "bg-slate-800/50 opacity-50"
                  }`}
                >
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-2">{achievement.icon}</div>
                    <p className={`font-medium ${achievement.unlocked ? "text-white" : "text-slate-500"}`}>
                      {achievement.name}
                    </p>
                    {achievement.unlocked && (
                      <p className="text-cyan-400 text-xs mt-1">✓ Unlocked</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
