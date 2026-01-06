import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Music, Play, Pause, SkipBack, SkipForward, Volume2, Heart, 
  Plus, Search, Mic, Radio, ListMusic, Shuffle, Repeat, 
  ChevronRight, Clock, TrendingUp
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Link } from "wouter";

// Sample playlists for demo
const FEATURED_PLAYLISTS = [
  { id: 1, title: "Game Day Hype", cover: "🔥", tracks: 25, category: "hype", color: "from-red-500 to-orange-500" },
  { id: 2, title: "Pre-Workout Energy", cover: "💪", tracks: 30, category: "workout", color: "from-green-500 to-emerald-500" },
  { id: 3, title: "Focus Mode", cover: "🎯", tracks: 20, category: "focus", color: "from-blue-500 to-cyan-500" },
  { id: 4, title: "Cool Down Vibes", cover: "🧘", tracks: 18, category: "cooldown", color: "from-purple-500 to-pink-500" },
  { id: 5, title: "Warm Up Mix", cover: "🏃", tracks: 22, category: "warmup", color: "from-amber-500 to-yellow-500" },
  { id: 6, title: "Victory Lap", cover: "🏆", tracks: 15, category: "hype", color: "from-indigo-500 to-purple-500" },
];

const TRENDING_TRACKS = [
  { id: 1, title: "Champions Anthem", artist: "ATHLYNX Originals", duration: "3:45", plays: "2.5M" },
  { id: 2, title: "Grind Season", artist: "Diamond Grind", duration: "4:12", plays: "1.8M" },
  { id: 3, title: "Rise Up", artist: "Athlete Beats", duration: "3:28", plays: "1.5M" },
  { id: 4, title: "No Days Off", artist: "Training Mode", duration: "3:55", plays: "1.2M" },
  { id: 5, title: "Beast Mode", artist: "Workout Warriors", duration: "4:05", plays: "980K" },
];

const PODCASTS = [
  { id: 1, title: "The Recruiting Game", host: "Coach Johnson", episodes: 45, cover: "🎙️" },
  { id: 2, title: "NIL Insider", host: "Sports Business Weekly", episodes: 32, cover: "💰" },
  { id: 3, title: "Mental Game Mastery", host: "Dr. Sarah Chen", episodes: 28, cover: "🧠" },
  { id: 4, title: "Diamond Grind Podcast", host: "ATHLYNX", episodes: 50, cover: "⚾" },
];

export default function MusicPage() {
  const { user } = useAuth();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(TRENDING_TRACKS[0]);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: myPlaylists } = trpc.music.myPlaylists.useQuery(undefined, { enabled: !!user });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                <Music className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">ATHLYNX Music</span>
            </div>
          </Link>
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search songs, artists, podcasts..."
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/portal">
              <Button variant="ghost" className="text-white hover:bg-white/10">Portal</Button>
            </Link>
            {!user && (
              <Link href="/pricing">
                <Button className="bg-gradient-to-r from-green-500 to-emerald-500">Subscribe</Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r border-white/10 bg-black/20 min-h-[calc(100vh-73px)] p-4 hidden lg:block">
          <nav className="space-y-2">
            <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10">
              <Music className="w-4 h-4 mr-3" /> Browse
            </Button>
            <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10">
              <Radio className="w-4 h-4 mr-3" /> Radio
            </Button>
            <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10">
              <Mic className="w-4 h-4 mr-3" /> Podcasts
            </Button>
          </nav>

          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white/70 text-sm font-semibold">YOUR LIBRARY</h3>
              <Button variant="ghost" size="icon" className="text-white/50 hover:text-white">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <nav className="space-y-2">
              <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10">
                <Heart className="w-4 h-4 mr-3" /> Liked Songs
              </Button>
              <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10">
                <ListMusic className="w-4 h-4 mr-3" /> My Playlists
              </Button>
            </nav>

            {myPlaylists && myPlaylists.length > 0 && (
              <div className="mt-4 space-y-1">
                {myPlaylists.slice(0, 5).map((playlist: any) => (
                  <Button
                    key={playlist.id}
                    variant="ghost"
                    className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10 text-sm"
                  >
                    {playlist.title}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 pb-32">
          <Tabs defaultValue="browse" className="w-full">
            <TabsList className="bg-white/10 mb-8">
              <TabsTrigger value="browse" className="data-[state=active]:bg-green-500">Browse</TabsTrigger>
              <TabsTrigger value="podcasts" className="data-[state=active]:bg-green-500">Podcasts</TabsTrigger>
              <TabsTrigger value="playlists" className="data-[state=active]:bg-green-500">My Playlists</TabsTrigger>
            </TabsList>

            <TabsContent value="browse">
              {/* Featured Playlists */}
              <section className="mb-10">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Featured Playlists</h2>
                  <Button variant="ghost" className="text-white/70 hover:text-white">
                    See All <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {FEATURED_PLAYLISTS.map((playlist) => (
                    <Card
                      key={playlist.id}
                      className="bg-white/5 border-white/10 hover:bg-white/10 transition-all cursor-pointer group overflow-hidden"
                    >
                      <CardContent className="p-4">
                        <div className={`aspect-square rounded-lg bg-gradient-to-br ${playlist.color} flex items-center justify-center text-4xl mb-3 group-hover:scale-105 transition-transform`}>
                          {playlist.cover}
                        </div>
                        <h3 className="text-white font-semibold truncate">{playlist.title}</h3>
                        <p className="text-white/50 text-sm">{playlist.tracks} tracks</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>

              {/* Trending Tracks */}
              <section className="mb-10">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-green-400" />
                    Trending Now
                  </h2>
                </div>
                <div className="bg-white/5 rounded-xl border border-white/10">
                  {TRENDING_TRACKS.map((track, i) => (
                    <div
                      key={track.id}
                      className="flex items-center gap-4 p-4 hover:bg-white/5 cursor-pointer border-b border-white/5 last:border-0"
                      onClick={() => {
                        setCurrentTrack(track);
                        setIsPlaying(true);
                      }}
                    >
                      <span className="text-white/50 w-6 text-center">{i + 1}</span>
                      <div className="w-12 h-12 rounded bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                        <Music className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-medium">{track.title}</h4>
                        <p className="text-white/50 text-sm">{track.artist}</p>
                      </div>
                      <span className="text-white/50 text-sm">{track.plays} plays</span>
                      <span className="text-white/50 text-sm">{track.duration}</span>
                      <Button variant="ghost" size="icon" className="text-white/50 hover:text-white">
                        <Heart className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </section>

              {/* Categories */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-6">Browse by Category</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { name: "Workout", color: "from-red-500 to-orange-500", icon: "💪" },
                    { name: "Focus", color: "from-blue-500 to-cyan-500", icon: "🎯" },
                    { name: "Hype", color: "from-purple-500 to-pink-500", icon: "🔥" },
                    { name: "Recovery", color: "from-green-500 to-teal-500", icon: "🧘" },
                  ].map((cat) => (
                    <Card
                      key={cat.name}
                      className={`bg-gradient-to-br ${cat.color} border-0 cursor-pointer hover:scale-105 transition-transform`}
                    >
                      <CardContent className="p-6 flex items-center justify-between">
                        <span className="text-white font-bold text-xl">{cat.name}</span>
                        <span className="text-3xl">{cat.icon}</span>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            </TabsContent>

            <TabsContent value="podcasts">
              <section>
                <h2 className="text-2xl font-bold text-white mb-6">Sports Podcasts</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {PODCASTS.map((podcast) => (
                    <Card
                      key={podcast.id}
                      className="bg-white/5 border-white/10 hover:bg-white/10 transition-all cursor-pointer"
                    >
                      <CardContent className="p-6">
                        <div className="w-full aspect-square rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-6xl mb-4">
                          {podcast.cover}
                        </div>
                        <h3 className="text-white font-bold text-lg mb-1">{podcast.title}</h3>
                        <p className="text-white/50 text-sm mb-2">{podcast.host}</p>
                        <Badge className="bg-white/10 text-white/70">{podcast.episodes} episodes</Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            </TabsContent>

            <TabsContent value="playlists">
              {user ? (
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">My Playlists</h2>
                    <Button className="bg-gradient-to-r from-green-500 to-emerald-500">
                      <Plus className="w-4 h-4 mr-2" /> Create Playlist
                    </Button>
                  </div>
                  {myPlaylists && myPlaylists.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {myPlaylists.map((playlist: any) => (
                        <Card
                          key={playlist.id}
                          className="bg-white/5 border-white/10 hover:bg-white/10 transition-all cursor-pointer"
                        >
                          <CardContent className="p-4">
                            <div className="aspect-square rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-3">
                              <ListMusic className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-white font-semibold truncate">{playlist.title}</h3>
                            <p className="text-white/50 text-sm">{playlist.tracksCount} tracks</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <ListMusic className="w-16 h-16 text-white/30 mx-auto mb-4" />
                      <h3 className="text-white text-xl mb-2">No playlists yet</h3>
                      <p className="text-white/50 mb-6">Create your first playlist to get started</p>
                      <Button className="bg-gradient-to-r from-green-500 to-emerald-500">
                        <Plus className="w-4 h-4 mr-2" /> Create Playlist
                      </Button>
                    </div>
                  )}
                </section>
              ) : (
                <div className="text-center py-16">
                  <Music className="w-16 h-16 text-white/30 mx-auto mb-4" />
                  <h3 className="text-white text-xl mb-2">Sign in to create playlists</h3>
                  <p className="text-white/50 mb-6">Save your favorite tracks and create custom playlists</p>
                  <Link href="/early-access">
                    <Button className="bg-gradient-to-r from-green-500 to-emerald-500">Get Started</Button>
                  </Link>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* Player Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-xl border-t border-white/10 p-4">
        <div className="container mx-auto flex items-center gap-6">
          {/* Current Track */}
          <div className="flex items-center gap-4 w-1/4">
            <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
              <Music className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="text-white font-medium">{currentTrack.title}</h4>
              <p className="text-white/50 text-sm">{currentTrack.artist}</p>
            </div>
            <Button variant="ghost" size="icon" className="text-white/50 hover:text-red-400">
              <Heart className="w-5 h-5" />
            </Button>
          </div>

          {/* Controls */}
          <div className="flex-1 flex flex-col items-center">
            <div className="flex items-center gap-4 mb-2">
              <Button variant="ghost" size="icon" className="text-white/50 hover:text-white">
                <Shuffle className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-white hover:text-white">
                <SkipBack className="w-5 h-5" />
              </Button>
              <Button
                size="icon"
                className="w-10 h-10 rounded-full bg-white text-black hover:scale-105 transition-transform"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </Button>
              <Button variant="ghost" size="icon" className="text-white hover:text-white">
                <SkipForward className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-white/50 hover:text-white">
                <Repeat className="w-4 h-4" />
              </Button>
            </div>
            <div className="w-full max-w-md flex items-center gap-2">
              <span className="text-white/50 text-xs">0:00</span>
              <div className="flex-1 h-1 bg-white/20 rounded-full">
                <div className="w-1/3 h-full bg-green-500 rounded-full" />
              </div>
              <span className="text-white/50 text-xs">{currentTrack.duration}</span>
            </div>
          </div>

          {/* Volume */}
          <div className="w-1/4 flex items-center justify-end gap-2">
            <Volume2 className="w-5 h-5 text-white/50" />
            <div className="w-24 h-1 bg-white/20 rounded-full">
              <div className="w-2/3 h-full bg-white rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
