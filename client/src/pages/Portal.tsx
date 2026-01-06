import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

// App icons data
const apps = [
  { id: "portal", name: "Portal", icon: "/nil-portal-icon-final.jpeg", href: "/portal", active: true, badge: "LIVE" },
  { id: "messenger", name: "Messenger", icon: "/messenger-icon-final.jpeg", href: "/messenger", active: true, badge: "LIVE" },
  { id: "diamond-grind", name: "Diamond Grind", icon: "/diamond-grind-app-icon.png", href: "/diamond-grind", active: true, badge: "ELITE" },
  { id: "music", name: "ATHLYNX Music", icon: "/nil-portal-icon-final.jpeg", href: "/music", active: true, badge: "NEW" },
  { id: "marketplace", name: "NIL Marketplace", icon: "/nil-portal-app-icon.jpeg", href: "/marketplace", active: true, badge: "$$$" },
  { id: "stories", name: "Stories & Reels", icon: "/nil-portal-icon-final.jpeg", href: "/stories", active: true, badge: "HOT" },
  { id: "ai-agents", name: "AI Team", icon: "/athlynx-app-icon.png", href: "/ai", active: true, badge: "AI" },
  { id: "pricing", name: "Pro Plans", icon: "/athlynx-app-icon.png", href: "/pricing", active: true, badge: "$$$" },
  { id: "faith", name: "Faith", icon: "/faith-app-icon.png", href: "/faith", active: false, badge: "BLESSED" },
  { id: "warriors-playbook", name: "Warriors Playbook", icon: "/warriors-playbook-icon.png", href: "/warriors-playbook", active: false, badge: "NEW" },
];

// Mock trending content (Barstool style)
const trendingContent = [
  { id: 1, type: "highlight", title: "🔥 INSANE DUNK! Marcus Johnson throws down the hammer", views: "125K", likes: "8.2K", comments: "1.2K", thumbnail: "🏀" },
  { id: 2, type: "news", title: "💰 BREAKING: Top recruit signs $2M NIL deal", views: "89K", likes: "5.1K", comments: "890", thumbnail: "💵" },
  { id: 3, type: "training", title: "💪 Diamond Grind: Elite QB workout routine revealed", views: "67K", likes: "4.3K", comments: "567", thumbnail: "🏈" },
  { id: 4, type: "drama", title: "🎭 Coach goes VIRAL after epic halftime speech", views: "234K", likes: "15K", comments: "3.2K", thumbnail: "🎤" },
];

// Mock athlete rankings (On3 style)
const athleteRankings = [
  { rank: 1, name: "Marcus Johnson", sport: "Basketball", rating: 98, change: "+2", school: "Duke", nilValue: "$3.2M" },
  { rank: 2, name: "Jake Thompson", sport: "Football", rating: 97, change: "0", school: "Alabama", nilValue: "$2.8M" },
  { rank: 3, name: "Sarah Williams", sport: "Softball", rating: 96, change: "+5", school: "Oklahoma", nilValue: "$1.5M" },
  { rank: 4, name: "Chris Davis", sport: "Baseball", rating: 95, change: "-1", school: "Vanderbilt", nilValue: "$1.2M" },
  { rank: 5, name: "Emma Rodriguez", sport: "Soccer", rating: 94, change: "+3", school: "UNC", nilValue: "$980K" },
];

// Social platforms for linking
const socialPlatforms = [
  { id: "instagram", name: "Instagram", icon: "📸", color: "from-pink-500 to-purple-500", connected: false },
  { id: "facebook", name: "Facebook", icon: "📘", color: "from-blue-600 to-blue-500", connected: false },
  { id: "twitter", name: "X (Twitter)", icon: "🐦", color: "from-slate-700 to-slate-600", connected: false },
  { id: "linkedin", name: "LinkedIn", icon: "💼", color: "from-blue-700 to-blue-600", connected: false },
  { id: "tiktok", name: "TikTok", icon: "🎵", color: "from-pink-600 to-cyan-400", connected: false },
  { id: "youtube", name: "YouTube", icon: "📺", color: "from-red-600 to-red-500", connected: false },
];

export default function Portal() {
  const { user, isAuthenticated, loading: isLoading } = useAuth();
  const [newPostContent, setNewPostContent] = useState("");
  const [activeTab, setActiveTab] = useState<"feed" | "trending" | "rankings" | "connect" | "apps">("feed");
  const [connectedPlatforms, setConnectedPlatforms] = useState<string[]>([]);

  // Fetch feed
  const { data: feedPosts, refetch: refetchFeed } = trpc.feed.list.useQuery(
    { limit: 20, offset: 0 },
    { enabled: isAuthenticated }
  );

  // Create post mutation
  const createPost = trpc.feed.create.useMutation({
    onSuccess: () => {
      toast.success("Post created! 🔥");
      setNewPostContent("");
      refetchFeed();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create post");
    },
  });

  const handleCreatePost = () => {
    if (!newPostContent.trim()) {
      toast.error("Please enter some content");
      return;
    }
    createPost.mutate({
      content: newPostContent,
      postType: "text",
      visibility: "public",
    });
  };

  const handleConnectPlatform = (platformId: string) => {
    if (connectedPlatforms.includes(platformId)) {
      setConnectedPlatforms(connectedPlatforms.filter(p => p !== platformId));
      toast.success("Account disconnected");
    } else {
      setConnectedPlatforms([...connectedPlatforms, platformId]);
      toast.success("Account connected! Your followers will be imported shortly 🚀");
    }
  };

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
            <img src="/athlynx-logo-icon.png" alt="ATHLYNX" className="w-16 h-16 mx-auto mb-4" />
            <CardTitle className="text-2xl text-white">Welcome to ATHLYNX Portal</CardTitle>
            <p className="text-slate-400 mt-2">The Ultimate Athlete Ecosystem</p>
            <p className="text-cyan-400 text-sm mt-1">Perfect Game + Hudl + On3 + Barstool = ATHLYNX</p>
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
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer">
              <img src="/athlynx-logo-icon.png" alt="ATHLYNX" className="w-10 h-10" />
              <div>
                <h1 className="text-white font-bold text-xl">ATHLYNX</h1>
                <p className="text-cyan-400 text-xs">THE ATHLETE'S PLAYBOOK</p>
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/messenger">
              <Button variant="ghost" className="text-slate-300 hover:text-white relative">
                💬
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center">3</span>
              </Button>
            </Link>
            <Button variant="ghost" className="text-slate-300 hover:text-white relative">
              🔔
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-500 rounded-full text-[10px] flex items-center justify-center">5</span>
            </Button>
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
              {user?.name?.charAt(0) || "A"}
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-slate-800 border-b border-slate-700 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 flex gap-1">
          {[
            { id: "feed", label: "📰 Feed", icon: "📰" },
            { id: "trending", label: "🔥 Trending", icon: "🔥" },
            { id: "rankings", label: "🏆 Rankings", icon: "🏆" },
            { id: "connect", label: "🔗 Connect", icon: "🔗" },
            { id: "apps", label: "📱 Apps", icon: "📱" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-3 font-medium transition-colors whitespace-nowrap ${
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
        {/* Feed Tab - Social like FB but better */}
        {activeTab === "feed" && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Feed */}
            <div className="lg:col-span-2 space-y-6">
              {/* Create Post */}
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                      {user?.name?.charAt(0) || "A"}
                    </div>
                    <div className="flex-1">
                      <Textarea
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                        placeholder="What's happening in your athletic journey? 🏆"
                        className="bg-slate-900 border-slate-600 text-white placeholder:text-slate-500 min-h-[80px]"
                      />
                      <div className="flex justify-between items-center mt-3">
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-cyan-400">📷</Button>
                          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-cyan-400">🎥</Button>
                          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-cyan-400">🏆</Button>
                          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-cyan-400">📊</Button>
                          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-cyan-400">📍</Button>
                        </div>
                        <Button
                          onClick={handleCreatePost}
                          disabled={createPost.isPending}
                          className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400"
                        >
                          {createPost.isPending ? "Posting..." : "Post 🚀"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Feed Posts */}
              {feedPosts && feedPosts.length > 0 ? (
                feedPosts.map((post: any) => (
                  <Card key={post.id} className="bg-slate-800 border-slate-700 hover:border-slate-600 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                          A
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-white font-bold">Athlete</span>
                            <span className="text-cyan-400 text-xs">✓ Verified</span>
                            <span className="text-slate-500 text-sm">
                              • {new Date(post.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-slate-200 text-lg">{post.content}</p>
                          <div className="flex gap-6 mt-4 pt-3 border-t border-slate-700">
                            <button className="flex items-center gap-2 text-slate-400 hover:text-red-400 transition-colors">
                              ❤️ <span>{post.likesCount}</span>
                            </button>
                            <button className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors">
                              💬 <span>{post.commentsCount}</span>
                            </button>
                            <button className="flex items-center gap-2 text-slate-400 hover:text-green-400 transition-colors">
                              🔄 <span>{post.sharesCount}</span>
                            </button>
                            <button className="flex items-center gap-2 text-slate-400 hover:text-yellow-400 transition-colors ml-auto">
                              🔖 Save
                            </button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="p-8 text-center">
                    <div className="text-6xl mb-4">🏟️</div>
                    <h3 className="text-white text-xl font-bold mb-2">Your Feed is Empty</h3>
                    <p className="text-slate-400">Start following athletes and brands to see their updates!</p>
                    <Button className="mt-4 bg-gradient-to-r from-blue-600 to-cyan-500">
                      Discover Athletes
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Profile Card */}
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                      {user?.name?.charAt(0) || "A"}
                    </div>
                    <h3 className="text-white font-bold mt-3">{user?.name || "Athlete"}</h3>
                    <p className="text-cyan-400 text-sm">VIP Member</p>
                    <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                      <div>
                        <p className="text-white font-bold">0</p>
                        <p className="text-slate-500 text-xs">Posts</p>
                      </div>
                      <div>
                        <p className="text-white font-bold">0</p>
                        <p className="text-slate-500 text-xs">Followers</p>
                      </div>
                      <div>
                        <p className="text-white font-bold">0</p>
                        <p className="text-slate-500 text-xs">Following</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="bg-gradient-to-br from-cyan-600/20 to-blue-600/20 border-cyan-500/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white text-sm flex items-center gap-2">
                    📊 Your NIL Value
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-cyan-400">$0</p>
                  <p className="text-slate-400 text-sm mt-1">Complete your profile to get valued!</p>
                  <Progress value={25} className="mt-3 h-2" />
                  <p className="text-slate-500 text-xs mt-1">Profile 25% complete</p>
                </CardContent>
              </Card>

              {/* Suggested Athletes */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white text-sm">🌟 Athletes to Follow</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {athleteRankings.slice(0, 3).map((athlete) => (
                    <div key={athlete.rank} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {athlete.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">{athlete.name}</p>
                          <p className="text-slate-500 text-xs">{athlete.sport}</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="border-cyan-400 text-cyan-400 hover:bg-cyan-400/10 text-xs h-7">
                        Follow
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Trending Tab - Barstool Style */}
        {activeTab === "trending" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-white text-2xl font-bold">🔥 Trending Now</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="border-slate-600 text-slate-300">All</Button>
                <Button variant="outline" size="sm" className="border-slate-600 text-slate-300">Highlights</Button>
                <Button variant="outline" size="sm" className="border-slate-600 text-slate-300">News</Button>
                <Button variant="outline" size="sm" className="border-slate-600 text-slate-300">Drama</Button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {trendingContent.map((content) => (
                <Card key={content.id} className="bg-slate-800 border-slate-700 hover:border-cyan-400 transition-all cursor-pointer group">
                  <CardContent className="p-0">
                    <div className="aspect-video bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-6xl group-hover:scale-105 transition-transform">
                      {content.thumbnail}
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          content.type === "highlight" ? "bg-cyan-500/20 text-cyan-400" :
                          content.type === "news" ? "bg-green-500/20 text-green-400" :
                          content.type === "training" ? "bg-purple-500/20 text-purple-400" :
                          "bg-orange-500/20 text-orange-400"
                        }`}>
                          {content.type.toUpperCase()}
                        </span>
                      </div>
                      <h3 className="text-white font-bold text-lg group-hover:text-cyan-400 transition-colors">
                        {content.title}
                      </h3>
                      <div className="flex items-center gap-4 mt-3 text-slate-400 text-sm">
                        <span>👁️ {content.views}</span>
                        <span>❤️ {content.likes}</span>
                        <span>💬 {content.comments}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Rankings Tab - On3 Style */}
        {activeTab === "rankings" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-white text-2xl font-bold">🏆 Athlete Rankings</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="border-cyan-400 text-cyan-400">All Sports</Button>
                <Button variant="outline" size="sm" className="border-slate-600 text-slate-300">Football</Button>
                <Button variant="outline" size="sm" className="border-slate-600 text-slate-300">Basketball</Button>
                <Button variant="outline" size="sm" className="border-slate-600 text-slate-300">Baseball</Button>
              </div>
            </div>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-0">
                <table className="w-full">
                  <thead className="bg-slate-700/50">
                    <tr>
                      <th className="text-left text-slate-400 text-sm font-medium p-4">Rank</th>
                      <th className="text-left text-slate-400 text-sm font-medium p-4">Athlete</th>
                      <th className="text-left text-slate-400 text-sm font-medium p-4">Sport</th>
                      <th className="text-left text-slate-400 text-sm font-medium p-4">Rating</th>
                      <th className="text-left text-slate-400 text-sm font-medium p-4">Change</th>
                      <th className="text-left text-slate-400 text-sm font-medium p-4">NIL Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {athleteRankings.map((athlete) => (
                      <tr key={athlete.rank} className="border-t border-slate-700 hover:bg-slate-700/50 transition-colors cursor-pointer">
                        <td className="p-4">
                          <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                            athlete.rank === 1 ? "bg-yellow-500 text-black" :
                            athlete.rank === 2 ? "bg-slate-400 text-black" :
                            athlete.rank === 3 ? "bg-orange-600 text-white" :
                            "bg-slate-700 text-white"
                          }`}>
                            {athlete.rank}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                              {athlete.name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-white font-medium">{athlete.name}</p>
                              <p className="text-slate-500 text-sm">{athlete.school}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-slate-300">{athlete.sport}</td>
                        <td className="p-4">
                          <span className="text-cyan-400 font-bold">{athlete.rating}</span>
                        </td>
                        <td className="p-4">
                          <span className={`${
                            athlete.change.startsWith("+") ? "text-green-400" :
                            athlete.change.startsWith("-") ? "text-red-400" :
                            "text-slate-400"
                          }`}>
                            {athlete.change}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-green-400 font-bold">{athlete.nilValue}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Connect Tab - Social Integration */}
        {activeTab === "connect" && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-white text-2xl font-bold">🔗 Connect Your Accounts</h2>
              <p className="text-slate-400 mt-2">Link your social media to import followers and grow your ATHLYNX presence</p>
            </div>

            <div className="grid gap-4">
              {socialPlatforms.map((platform) => {
                const isConnected = connectedPlatforms.includes(platform.id);
                return (
                  <Card key={platform.id} className={`border-slate-700 ${isConnected ? "bg-green-900/20 border-green-500/50" : "bg-slate-800"}`}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${platform.color} flex items-center justify-center text-2xl`}>
                            {platform.icon}
                          </div>
                          <div>
                            <p className="text-white font-bold">{platform.name}</p>
                            <p className="text-slate-400 text-sm">
                              {isConnected ? "✓ Connected - Importing followers..." : "Connect to import your followers"}
                            </p>
                          </div>
                        </div>
                        <Button
                          onClick={() => handleConnectPlatform(platform.id)}
                          variant={isConnected ? "outline" : "default"}
                          className={isConnected 
                            ? "border-green-500 text-green-400 hover:bg-green-500/10" 
                            : "bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400"
                          }
                        >
                          {isConnected ? "Disconnect" : "Connect"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Card className="bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border-cyan-500/30">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-3">🚀</div>
                <h3 className="text-white font-bold text-lg">Why Connect?</h3>
                <p className="text-slate-300 mt-2">
                  Import your existing followers, cross-post content, and grow your audience across all platforms from one place. 
                  <span className="text-cyan-400 font-bold"> Once they're here, they never leave!</span>
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Apps Tab */}
        {activeTab === "apps" && (
          <div>
            <h2 className="text-white text-2xl font-bold mb-2">ATHLYNX Apps</h2>
            <p className="text-cyan-400 mb-8">10 Powerful Apps. One Platform. Unlimited Potential.</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {apps.map((app) => (
                <Link key={app.id} href={app.active ? app.href : "#"}>
                  <Card
                    className={`bg-slate-800 border-slate-700 hover:border-cyan-400 transition-all cursor-pointer relative overflow-hidden ${
                      !app.active && "opacity-60"
                    }`}
                    onClick={() => !app.active && toast.info(`${app.name} coming soon!`)}
                  >
                    {/* Badge */}
                    <div className={`absolute top-2 right-2 text-xs px-2 py-0.5 rounded font-bold ${
                      app.badge === "LIVE" ? "bg-green-500 text-white" :
                      app.badge === "ELITE" ? "bg-purple-500 text-white" :
                      app.badge === "NEW" ? "bg-cyan-500 text-white" :
                      app.badge === "HOT" ? "bg-orange-500 text-white" :
                      app.badge === "$$$" ? "bg-green-600 text-white" :
                      app.badge === "AI" ? "bg-blue-500 text-white" :
                      "bg-yellow-500 text-black"
                    }`}>
                      {app.badge}
                    </div>
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-xl overflow-hidden">
                        <img
                          src={app.icon}
                          alt={app.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/athlynx-logo-icon.png";
                          }}
                        />
                      </div>
                      <p className="text-white font-medium">{app.name}</p>
                      {!app.active && (
                        <span className="text-xs text-slate-500 mt-1 block">Coming Soon</span>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-700 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm">
            © 2025-2026 Dozier Holdings Group, LLC. All Rights Reserved.
          </p>
          <p className="text-cyan-400 text-xs mt-2">
            ATHLYNX - THE ATHLETE'S PLAYBOOK | Perfect Game + Hudl + On3 + Barstool = 🔥
          </p>
        </div>
      </footer>
    </div>
  );
}
