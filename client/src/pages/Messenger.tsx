import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

// Mock conversations data
const mockConversations = [
  { id: 1, name: "Marcus Johnson", avatar: "MJ", lastMessage: "Great game yesterday!", time: "2m ago", unread: 2, online: true },
  { id: 2, name: "Sarah Williams", avatar: "SW", lastMessage: "Let's discuss the NIL deal", time: "15m ago", unread: 0, online: true },
  { id: 3, name: "Jake Thompson", avatar: "JT", lastMessage: "Training at 6am tomorrow?", time: "1h ago", unread: 1, online: false },
  { id: 4, name: "Coach Davis", avatar: "CD", lastMessage: "Film review scheduled", time: "3h ago", unread: 0, online: false },
  { id: 5, name: "Brand Manager - Nike", avatar: "NK", lastMessage: "Contract details attached", time: "1d ago", unread: 0, online: false },
];

// Mock messages
const mockMessages: Record<number, Array<{ id: number; sender: string; content: string; time: string; isMine: boolean }>> = {
  1: [
    { id: 1, sender: "Marcus Johnson", content: "Hey! Did you see the highlights?", time: "10:30 AM", isMine: false },
    { id: 2, sender: "You", content: "Yeah! That dunk was insane 🔥", time: "10:32 AM", isMine: true },
    { id: 3, sender: "Marcus Johnson", content: "Thanks bro! Been working on my vertical", time: "10:33 AM", isMine: false },
    { id: 4, sender: "You", content: "It shows! Keep grinding 💪", time: "10:35 AM", isMine: true },
    { id: 5, sender: "Marcus Johnson", content: "Great game yesterday!", time: "10:40 AM", isMine: false },
  ],
  2: [
    { id: 1, sender: "Sarah Williams", content: "Hey! I have a brand reaching out", time: "9:00 AM", isMine: false },
    { id: 2, sender: "You", content: "That's awesome! What brand?", time: "9:05 AM", isMine: true },
    { id: 3, sender: "Sarah Williams", content: "Let's discuss the NIL deal", time: "9:10 AM", isMine: false },
  ],
  3: [
    { id: 1, sender: "Jake Thompson", content: "You hitting the gym tomorrow?", time: "8:00 AM", isMine: false },
    { id: 2, sender: "You", content: "For sure! What time?", time: "8:15 AM", isMine: true },
    { id: 3, sender: "Jake Thompson", content: "Training at 6am tomorrow?", time: "8:20 AM", isMine: false },
  ],
};

export default function Messenger() {
  const { user, isAuthenticated, loading: isLoading } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState<number | null>(1);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<typeof mockMessages[1]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedConversation) {
      setMessages(mockMessages[selectedConversation] || []);
    }
  }, [selectedConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const newMsg = {
      id: messages.length + 1,
      sender: "You",
      content: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMine: true,
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage("");
    toast.success("Message sent!");
  };

  const filteredConversations = mockConversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <img src="/messenger-icon-final.jpeg" alt="Messenger" className="w-16 h-16 mx-auto mb-4 rounded-xl" />
            <CardTitle className="text-2xl text-white">ATHLYNX Messenger</CardTitle>
            <p className="text-slate-400 mt-2">Please log in to access messaging</p>
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

  const selectedConv = mockConversations.find(c => c.id === selectedConversation);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/portal">
            <div className="flex items-center gap-3 cursor-pointer">
              <img src="/messenger-icon-final.jpeg" alt="Messenger" className="w-10 h-10 rounded-xl" />
              <div>
                <h1 className="text-white font-bold text-xl">MESSENGER</h1>
                <p className="text-cyan-400 text-xs">ATHLYNX CHAT</p>
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

      {/* Main Chat Interface */}
      <div className="max-w-7xl mx-auto h-[calc(100vh-73px)] flex">
        {/* Conversations List */}
        <div className="w-80 border-r border-slate-700 flex flex-col">
          {/* Search */}
          <div className="p-4 border-b border-slate-700">
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500"
            />
          </div>

          {/* Conversations */}
          <ScrollArea className="flex-1">
            <div className="p-2">
              {filteredConversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv.id)}
                  className={`w-full p-3 rounded-lg flex items-center gap-3 transition-colors mb-1 ${
                    selectedConversation === conv.id
                      ? "bg-cyan-600/20 border border-cyan-500/50"
                      : "hover:bg-slate-800"
                  }`}
                >
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                      {conv.avatar}
                    </div>
                    {conv.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900"></div>
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-medium">{conv.name}</span>
                      <span className="text-slate-500 text-xs">{conv.time}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-sm truncate max-w-[150px]">{conv.lastMessage}</span>
                      {conv.unread > 0 && (
                        <span className="bg-cyan-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {conv.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>

          {/* New Conversation Button */}
          <div className="p-4 border-t border-slate-700">
            <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400">
              + New Conversation
            </Button>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedConv ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-slate-700 flex items-center justify-between bg-slate-800/50">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                      {selectedConv.avatar}
                    </div>
                    {selectedConv.online && (
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-slate-800"></div>
                    )}
                  </div>
                  <div>
                    <h2 className="text-white font-medium">{selectedConv.name}</h2>
                    <p className="text-xs text-slate-400">
                      {selectedConv.online ? "Online" : "Offline"}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                    📞
                  </Button>
                  <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                    📹
                  </Button>
                  <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                    ⋯
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.isMine ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                          msg.isMine
                            ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white"
                            : "bg-slate-700 text-white"
                        }`}
                      >
                        <p>{msg.content}</p>
                        <p className={`text-xs mt-1 ${msg.isMine ? "text-blue-200" : "text-slate-400"}`}>
                          {msg.time}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="p-4 border-t border-slate-700 bg-slate-800/50">
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                    📎
                  </Button>
                  <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                    😊
                  </Button>
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400"
                  >
                    Send
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">💬</div>
                <h2 className="text-white text-xl font-bold mb-2">Select a conversation</h2>
                <p className="text-slate-400">Choose a conversation from the list to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
