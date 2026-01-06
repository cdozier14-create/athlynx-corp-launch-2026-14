import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ShoppingBag, Search, Filter, DollarSign, Tag, Star, 
  Plus, Heart, Eye, MessageSquare, Verified, TrendingUp
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Link } from "wouter";
import { toast } from "sonner";

const CATEGORIES = [
  { key: "all", label: "All", icon: ShoppingBag },
  { key: "nil_deal", label: "NIL Deals", icon: DollarSign },
  { key: "merch", label: "Merchandise", icon: Tag },
  { key: "service", label: "Services", icon: Star },
  { key: "training", label: "Training", icon: TrendingUp },
  { key: "coaching", label: "Coaching", icon: MessageSquare },
  { key: "appearance", label: "Appearances", icon: Eye },
];

// Sample listings for demo
const SAMPLE_LISTINGS = [
  {
    id: 1,
    title: "Social Media Shoutout",
    description: "Get a personalized shoutout on my Instagram (50K followers)",
    category: "nil_deal",
    price: "150.00",
    seller: { name: "Jake Thompson", verified: true, rating: 4.9 },
    image: "📱",
    views: 234,
  },
  {
    id: 2,
    title: "Custom Training Program",
    description: "8-week personalized baseball training program with video analysis",
    category: "training",
    price: "299.00",
    seller: { name: "Coach Martinez", verified: true, rating: 5.0 },
    image: "⚾",
    views: 567,
  },
  {
    id: 3,
    title: "Signed Jersey",
    description: "Authentic game-worn jersey, signed with certificate of authenticity",
    category: "merch",
    price: "450.00",
    seller: { name: "Marcus Williams", verified: true, rating: 4.8 },
    image: "👕",
    views: 892,
  },
  {
    id: 4,
    title: "1-on-1 Pitching Session",
    description: "2-hour private pitching session with video breakdown",
    category: "coaching",
    price: "175.00",
    seller: { name: "Tyler Reed", verified: false, rating: 4.7 },
    image: "🎯",
    views: 345,
  },
  {
    id: 5,
    title: "Brand Ambassador Package",
    description: "Full brand ambassador deal: 3 posts, 5 stories, 1 reel per month",
    category: "nil_deal",
    price: "2500.00",
    seller: { name: "Sarah Chen", verified: true, rating: 4.9 },
    image: "🌟",
    views: 1203,
  },
  {
    id: 6,
    title: "Meet & Greet Experience",
    description: "30-minute private meet and greet with photos and autographs",
    category: "appearance",
    price: "500.00",
    seller: { name: "Chris Johnson", verified: true, rating: 5.0 },
    image: "🤝",
    views: 678,
  },
];

export default function Marketplace() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newListing, setNewListing] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
  });

  const { data: listings } = trpc.marketplace.listings.useQuery({
    category: selectedCategory === "all" ? undefined : selectedCategory,
  });
  const createListingMutation = trpc.marketplace.create.useMutation();

  const displayListings = listings?.length ? listings : SAMPLE_LISTINGS;
  const filteredListings = displayListings.filter((listing: any) => {
    if (selectedCategory !== "all" && listing.category !== selectedCategory) return false;
    if (searchQuery && !listing.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleCreateListing = async () => {
    if (!user) {
      toast.error("Please sign in to create a listing");
      return;
    }
    if (!newListing.title || !newListing.category || !newListing.price) {
      toast.error("Please fill in all required fields");
      return;
    }
    try {
      await createListingMutation.mutateAsync({
        title: newListing.title,
        description: newListing.description,
        category: newListing.category as any,
        price: newListing.price,
      });
      toast.success("Listing created successfully!");
      setIsCreateOpen(false);
      setNewListing({ title: "", description: "", category: "", price: "" });
    } catch (error) {
      toast.error("Failed to create listing");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">NIL Marketplace</span>
            </div>
          </Link>
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search listings..."
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/portal">
              <Button variant="ghost" className="text-white hover:bg-white/10">Portal</Button>
            </Link>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-amber-500 to-orange-500">
                  <Plus className="w-4 h-4 mr-2" /> Sell
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-900 border-white/10 text-white">
                <DialogHeader>
                  <DialogTitle>Create Listing</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <Label>Title *</Label>
                    <Input
                      value={newListing.title}
                      onChange={(e) => setNewListing({ ...newListing, title: e.target.value })}
                      placeholder="What are you selling?"
                      className="bg-white/10 border-white/20 mt-1"
                    />
                  </div>
                  <div>
                    <Label>Category *</Label>
                    <Select
                      value={newListing.category}
                      onValueChange={(value) => setNewListing({ ...newListing, category: value })}
                    >
                      <SelectTrigger className="bg-white/10 border-white/20 mt-1">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-white/10">
                        {CATEGORIES.filter(c => c.key !== "all").map((cat) => (
                          <SelectItem key={cat.key} value={cat.key}>{cat.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Price (USD) *</Label>
                    <Input
                      type="number"
                      value={newListing.price}
                      onChange={(e) => setNewListing({ ...newListing, price: e.target.value })}
                      placeholder="0.00"
                      className="bg-white/10 border-white/20 mt-1"
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={newListing.description}
                      onChange={(e) => setNewListing({ ...newListing, description: e.target.value })}
                      placeholder="Describe what you're offering..."
                      className="bg-white/10 border-white/20 mt-1"
                      rows={4}
                    />
                  </div>
                  <Button
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500"
                    onClick={handleCreateListing}
                    disabled={createListingMutation.isPending}
                  >
                    {createListingMutation.isPending ? "Creating..." : "Create Listing"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      {/* Categories */}
      <div className="border-b border-white/10 bg-black/10">
        <div className="container mx-auto px-4">
          <div className="flex gap-2 py-4 overflow-x-auto">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <Button
                  key={cat.key}
                  variant={selectedCategory === cat.key ? "default" : "ghost"}
                  className={selectedCategory === cat.key 
                    ? "bg-amber-500 text-white" 
                    : "text-white/70 hover:text-white hover:bg-white/10"
                  }
                  onClick={() => setSelectedCategory(cat.key)}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {cat.label}
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Active Listings", value: "2,450+", icon: ShoppingBag },
            { label: "Total Sales", value: "$1.2M+", icon: DollarSign },
            { label: "Verified Sellers", value: "850+", icon: Verified },
            { label: "Avg. Rating", value: "4.8★", icon: Star },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <Card key={i} className="bg-white/5 border-white/10">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-white/50 text-sm">{stat.label}</p>
                    <p className="text-white font-bold text-xl">{stat.value}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Listings Grid */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            {selectedCategory === "all" ? "All Listings" : CATEGORIES.find(c => c.key === selectedCategory)?.label}
          </h2>
          <div className="flex items-center gap-2">
            <Button variant="ghost" className="text-white/70 hover:text-white">
              <Filter className="w-4 h-4 mr-2" /> Filter
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredListings.map((listing: any) => (
            <Card
              key={listing.id}
              className="bg-white/5 border-white/10 hover:bg-white/10 transition-all cursor-pointer group overflow-hidden"
            >
              <CardContent className="p-0">
                <div className="aspect-video bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center text-6xl group-hover:scale-105 transition-transform">
                  {listing.image || "📦"}
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/50 text-xs">
                      {CATEGORIES.find(c => c.key === listing.category)?.label}
                    </Badge>
                    <Button variant="ghost" size="icon" className="text-white/50 hover:text-red-400 -mt-1 -mr-2">
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>
                  <h3 className="text-white font-semibold mb-1 line-clamp-1">{listing.title}</h3>
                  <p className="text-white/50 text-sm mb-3 line-clamp-2">{listing.description}</p>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500" />
                    <span className="text-white/70 text-sm">{listing.seller?.name || "Seller"}</span>
                    {listing.seller?.verified && (
                      <Verified className="w-4 h-4 text-blue-400" />
                    )}
                    {listing.seller?.rating && (
                      <span className="text-amber-400 text-sm">★ {listing.seller.rating}</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-white">${listing.price}</span>
                    <span className="text-white/50 text-sm flex items-center gap-1">
                      <Eye className="w-4 h-4" /> {listing.views || 0}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500">
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {filteredListings.length === 0 && (
          <div className="text-center py-16">
            <ShoppingBag className="w-16 h-16 text-white/30 mx-auto mb-4" />
            <h3 className="text-white text-xl mb-2">No listings found</h3>
            <p className="text-white/50 mb-6">Try adjusting your search or filters</p>
          </div>
        )}
      </main>

      {/* CTA */}
      <section className="bg-black/30 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Monetize Your Brand?</h2>
          <p className="text-white/70 mb-8 max-w-2xl mx-auto">
            Join thousands of athletes selling NIL deals, merchandise, and services on the ATHLYNX Marketplace.
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-amber-500 to-orange-500"
              onClick={() => setIsCreateOpen(true)}
            >
              <Plus className="w-5 h-5 mr-2" /> Start Selling
            </Button>
            <Link href="/pricing">
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                View Plans
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
