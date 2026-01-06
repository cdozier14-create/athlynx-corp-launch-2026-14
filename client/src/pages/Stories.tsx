import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Play, Pause, Volume2, VolumeX, Heart, MessageCircle, Share2, 
  Plus, X, ChevronLeft, ChevronRight, Camera, Video, Sparkles,
  Music, Eye, Clock, Upload
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Link } from "wouter";
import { toast } from "sonner";

// Sample stories for demo
const SAMPLE_STORIES = [
  { id: 1, user: "Jake T.", avatar: "🏈", hasNew: true, viewed: false },
  { id: 2, user: "Sarah C.", avatar: "⚾", hasNew: true, viewed: false },
  { id: 3, user: "Marcus W.", avatar: "🏀", hasNew: true, viewed: true },
  { id: 4, user: "Tyler R.", avatar: "⚽", hasNew: false, viewed: true },
  { id: 5, user: "Coach M.", avatar: "🎯", hasNew: true, viewed: false },
  { id: 6, user: "Diamond G.", avatar: "💎", hasNew: true, viewed: false },
];

// Sample reels for demo
const SAMPLE_REELS = [
  {
    id: 1,
    user: "Jake Thompson",
    avatar: "🏈",
    verified: true,
    description: "Game day highlights 🔥 #football #highlights",
    likes: 12500,
    comments: 234,
    shares: 89,
    music: "Champions Anthem - ATHLYNX",
    thumbnail: "🏈",
  },
  {
    id: 2,
    user: "Sarah Chen",
    avatar: "⚾",
    verified: true,
    description: "Perfect pitch sequence 🎯 #baseball #pitching",
    likes: 8900,
    comments: 156,
    shares: 67,
    music: "Grind Season - Diamond Grind",
    thumbnail: "⚾",
  },
  {
    id: 3,
    user: "Marcus Williams",
    avatar: "🏀",
    verified: true,
    description: "Dunk compilation 💪 #basketball #dunks",
    likes: 23400,
    comments: 567,
    shares: 234,
    music: "Beast Mode - Workout Warriors",
    thumbnail: "🏀",
  },
  {
    id: 4,
    user: "Tyler Reed",
    avatar: "⚽",
    verified: false,
    description: "Skills training session ⚽ #soccer #skills",
    likes: 5600,
    comments: 89,
    shares: 34,
    music: "Rise Up - Athlete Beats",
    thumbnail: "⚽",
  },
];

export default function Stories() {
  const { user } = useAuth();
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [activeReelIndex, setActiveReelIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createType, setCreateType] = useState<"story" | "reel">("story");
  const [newContent, setNewContent] = useState({ caption: "", file: null as File | null });

  const { data: stories } = trpc.stories.list.useQuery();
  const { data: reels } = trpc.reels.list.useQuery();
  const createStoryMutation = trpc.stories.create.useMutation();
  const createReelMutation = trpc.reels.create.useMutation();

  const displayStories: any[] = stories?.length ? stories : SAMPLE_STORIES;
  const displayReels: any[] = reels?.length ? reels : SAMPLE_REELS;

  const handleCreateContent = async () => {
    if (!user) {
      toast.error("Please sign in to create content");
      return;
    }
    toast.success(`${createType === "story" ? "Story" : "Reel"} created! (Demo mode)`);
    setIsCreateOpen(false);
    setNewContent({ caption: "", file: null });
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Stories & Reels</span>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/portal">
              <Button variant="ghost" className="text-white hover:bg-white/10">Portal</Button>
            </Link>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-pink-500 to-rose-500">
                  <Plus className="w-4 h-4 mr-2" /> Create
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-900 border-white/10 text-white">
                <DialogHeader>
                  <DialogTitle>Create Content</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant={createType === "story" ? "default" : "outline"}
                      className={createType === "story" ? "bg-pink-500" : "border-white/20"}
                      onClick={() => setCreateType("story")}
                    >
                      <Camera className="w-4 h-4 mr-2" /> Story
                    </Button>
                    <Button
                      variant={createType === "reel" ? "default" : "outline"}
                      className={createType === "reel" ? "bg-pink-500" : "border-white/20"}
                      onClick={() => setCreateType("reel")}
                    >
                      <Video className="w-4 h-4 mr-2" /> Reel
                    </Button>
                  </div>
                  <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center">
                    <Upload className="w-12 h-12 text-white/50 mx-auto mb-4" />
                    <p className="text-white/70 mb-2">
                      Drop your {createType === "story" ? "photo or video" : "video"} here
                    </p>
                    <p className="text-white/50 text-sm mb-4">
                      {createType === "story" ? "Stories disappear after 24 hours" : "Reels are permanent"}
                    </p>
                    <Button variant="outline" className="border-white/20">
                      Choose File
                    </Button>
                  </div>
                  <div>
                    <Textarea
                      value={newContent.caption}
                      onChange={(e) => setNewContent({ ...newContent, caption: e.target.value })}
                      placeholder={createType === "story" ? "Add a caption..." : "Write a description..."}
                      className="bg-white/10 border-white/20"
                      rows={3}
                    />
                  </div>
                  <Button
                    className="w-full bg-gradient-to-r from-pink-500 to-rose-500"
                    onClick={handleCreateContent}
                  >
                    Post {createType === "story" ? "Story" : "Reel"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      {/* Stories Row */}
      <section className="border-b border-white/10 bg-black/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex gap-4 overflow-x-auto pb-2">
            {/* Add Story */}
            <div
              className="flex-shrink-0 cursor-pointer"
              onClick={() => {
                setCreateType("story");
                setIsCreateOpen(true);
              }}
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-500/20 to-rose-500/20 border-2 border-dashed border-pink-500/50 flex items-center justify-center mb-2">
                <Plus className="w-8 h-8 text-pink-400" />
              </div>
              <p className="text-white/70 text-xs text-center">Add Story</p>
            </div>

            {/* Stories */}
            {displayStories.map((story: any, i: number) => (
              <div
                key={story.id}
                className="flex-shrink-0 cursor-pointer"
                onClick={() => setActiveStoryIndex(i)}
              >
                <div className={`w-20 h-20 rounded-full p-0.5 ${
                  story.hasNew && !story.viewed
                    ? "bg-gradient-to-br from-pink-500 to-rose-500"
                    : "bg-white/20"
                }`}>
                  <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-3xl">
                    {story.avatar}
                  </div>
                </div>
                <p className="text-white/70 text-xs text-center mt-2 truncate w-20">{story.user}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reels Section */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Trending Reels</h2>
          <Button variant="ghost" className="text-white/70 hover:text-white">
            See All
          </Button>
        </div>

        {/* Reels Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {displayReels.map((reel: any, i: number) => (
            <Card
              key={reel.id}
              className="bg-white/5 border-white/10 overflow-hidden cursor-pointer group"
              onClick={() => setActiveReelIndex(i)}
            >
              <CardContent className="p-0 relative aspect-[9/16]">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-rose-500/20 flex items-center justify-center text-6xl">
                  {reel.thumbnail}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                
                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Play className="w-8 h-8 text-white ml-1" />
                  </div>
                </div>

                {/* Info */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-sm">
                      {reel.avatar}
                    </div>
                    <span className="text-white font-medium text-sm">{reel.user}</span>
                    {reel.verified && (
                      <Badge className="bg-blue-500/20 text-blue-400 border-0 text-xs px-1">✓</Badge>
                    )}
                  </div>
                  <p className="text-white/80 text-sm line-clamp-2">{reel.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-white/60 text-xs">
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3" /> {formatNumber(reel.likes)}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" /> {formatNumber(reel.comments)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      {/* Story Viewer Modal */}
      {activeStoryIndex !== null && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white z-10"
            onClick={() => setActiveStoryIndex(null)}
          >
            <X className="w-6 h-6" />
          </Button>

          {/* Navigation */}
          {activeStoryIndex > 0 && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 text-white"
              onClick={() => setActiveStoryIndex(activeStoryIndex - 1)}
            >
              <ChevronLeft className="w-8 h-8" />
            </Button>
          )}
          {activeStoryIndex < displayStories.length - 1 && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 text-white"
              onClick={() => setActiveStoryIndex(activeStoryIndex + 1)}
            >
              <ChevronRight className="w-8 h-8" />
            </Button>
          )}

          {/* Story Content */}
          <div className="w-full max-w-md aspect-[9/16] bg-gradient-to-br from-pink-500/20 to-rose-500/20 rounded-2xl overflow-hidden relative">
            {/* Progress bars */}
            <div className="absolute top-4 left-4 right-4 flex gap-1">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                  <div className={`h-full bg-white ${i === 0 ? "w-full" : "w-0"}`} />
                </div>
              ))}
            </div>

            {/* User info */}
            <div className="absolute top-10 left-4 right-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-xl">
                {displayStories[activeStoryIndex]?.avatar}
              </div>
              <div>
                <p className="text-white font-medium">{displayStories[activeStoryIndex]?.user}</p>
                <p className="text-white/50 text-xs flex items-center gap-1">
                  <Clock className="w-3 h-3" /> 2h ago
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="absolute inset-0 flex items-center justify-center text-8xl">
              {displayStories[activeStoryIndex]?.avatar}
            </div>

            {/* Actions */}
            <div className="absolute bottom-4 left-4 right-4">
              <Input
                placeholder="Send message..."
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
            </div>
          </div>
        </div>
      )}

      {/* Create CTA */}
      <section className="bg-black/30 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Share Your Journey</h2>
          <p className="text-white/70 mb-8 max-w-2xl mx-auto">
            Create stories and reels to showcase your training, highlights, and daily life as an athlete.
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-pink-500 to-rose-500"
              onClick={() => {
                setCreateType("story");
                setIsCreateOpen(true);
              }}
            >
              <Camera className="w-5 h-5 mr-2" /> Create Story
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
              onClick={() => {
                setCreateType("reel");
                setIsCreateOpen(true);
              }}
            >
              <Video className="w-5 h-5 mr-2" /> Create Reel
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
