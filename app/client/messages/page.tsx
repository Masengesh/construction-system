"use client";

import { useEffect, useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Send, User, Circle, Paperclip, Search } from "lucide-react";

interface Contact {
  id: string;
  name: string;
  role: string;
  avatar: string;
  online: boolean;
  lastMessage?: string;
  lastTime?: string;
}

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  senderName: string;
  content: string;
  read: boolean;
  createdAt: string;
}

export default function ClientMessagesPage() {
  const [contacts] = useState<Contact[]>([
    { id: "a1", name: "Admin", role: "Admin", avatar: "A", online: true },
    { id: "m1", name: "Site Manager", role: "Project Manager", avatar: "S", online: true },
    { id: "s1", name: "Support", role: "Technical Support", avatar: "T", online: false },
  ]);

  const [selectedContact, setSelectedContact] = useState<Contact>(contacts[0]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const getCurrentUserId = () => {
    try {
      const stored = typeof window !== "undefined" ? localStorage.getItem("user") : null;
      if (stored) return JSON.parse(stored).id;
    } catch {}
    return "3";
  };
  const currentUserId = getCurrentUserId();

  useEffect(() => {
    const timer = setTimeout(() => {
      fetch(`/api/messages?currentUserId=${currentUserId}&otherUserId=${selectedContact.id}`)
        .then((res) => res.json())
        .then((data) => setMessages(data))
        .catch(() => {})
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [selectedContact.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || sending) return;
    setSending(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: currentUserId,
          receiverId: selectedContact.id,
          senderName: "You",
          content: newMessage.trim(),
        }),
      });
      if (res.ok) {
        const sent = await res.json();
        setMessages((prev) => [...prev, sent]);
        setNewMessage("");
      }
    } catch {
      const optimistic = {
        id: `temp-${Date.now()}`,
        senderId: currentUserId,
        receiverId: selectedContact.id,
        senderName: "You",
        content: newMessage.trim(),
        read: false,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, optimistic]);
      setNewMessage("");
    } finally {
      setSending(false);
    }
  };

  const filteredContacts = contacts.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  };

  const formatDateHeader = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const getContactAvatarColor = (name: string) => {
    const colors = ["bg-primary-500", "bg-construction-orange", "bg-purple-500", "bg-construction-green"];
    return colors[name.charCodeAt(0) % colors.length];
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        <p className="text-gray-600 mt-1">Communicate with your project team</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-220px)] min-h-[500px]">
        <Card className="flex flex-col p-0 overflow-hidden">
          <div className="p-4 border-b">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-thin">
            {filteredContacts.map((contact) => (
              <button
                key={contact.id}
                onClick={() => setSelectedContact(contact)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors border-l-4 ${
                  selectedContact.id === contact.id
                    ? "bg-primary-50 border-l-primary-500"
                    : "hover:bg-gray-50 border-l-transparent"
                }`}
              >
                <div className="relative shrink-0">
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center text-white font-bold ${getContactAvatarColor(contact.name)}`}>
                    {contact.avatar}
                  </div>
                  {contact.online && <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <p className="font-medium text-gray-900 truncate">{contact.name}</p>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{contact.role}</p>
                </div>
              </button>
            ))}
            {filteredContacts.length === 0 && (
              <p className="text-center text-gray-500 py-8 text-sm">No contacts found</p>
            )}
          </div>
        </Card>

        <Card className="lg:col-span-2 flex flex-col p-0 overflow-hidden">
          <div className="px-6 py-4 border-b flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${getContactAvatarColor(selectedContact.name)}`}>
              {selectedContact.avatar}
            </div>
            <div>
              <p className="font-semibold text-gray-900">{selectedContact.name}</p>
              <p className="text-xs text-gray-500">{selectedContact.role} • <span className="text-emerald-500">Online</span></p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4 scrollbar-thin">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-200 border-t-primary-600"></div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-center">
                <div>
                  <div className="text-4xl mb-3">💬</div>
                  <p className="text-gray-500">No messages yet. Start the conversation!</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {(() => {
                  const groups: { date: string; messages: Message[] }[] = [];
                  messages.forEach((msg) => {
                    const dateLabel = formatDateHeader(msg.createdAt);
                    const last = groups[groups.length - 1];
                    if (last && last.date === dateLabel) {
                      last.messages.push(msg);
                    } else {
                      groups.push({ date: dateLabel, messages: [msg] });
                    }
                  });
                  return groups.map((group) => (
                    <div key={group.date}>
                      <div className="flex items-center justify-center my-4">
                        <span className="bg-gray-100 text-gray-500 text-xs px-3 py-1 rounded-full">{group.date}</span>
                      </div>
                      {group.messages.map((msg) => {
                        const isMine = msg.senderId === currentUserId;
                        return (
                          <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"} mb-2`}>
                            <div
                              className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                                isMine
                                  ? "bg-primary-600 text-white rounded-br-sm"
                                  : "bg-gray-100 text-gray-800 rounded-bl-sm"
                              }`}
                            >
                              {!isMine && (
                                <p className="text-xs font-semibold text-primary-600 mb-1">{msg.senderName}</p>
                              )}
                              <p className="text-sm leading-relaxed">{msg.content}</p>
                              <p className={`text-xs mt-1 ${isMine ? "text-primary-200" : "text-gray-500"}`}>
                                {formatTime(msg.createdAt)}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ));
                })()}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          <div className="px-6 py-4 border-t bg-white">
            <div className="flex items-center gap-3">
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Paperclip className="w-5 h-5" />
              </button>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSend())}
                placeholder={`Message ${selectedContact.name}...`}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <button
                onClick={handleSend}
                disabled={!newMessage.trim() || sending}
                className="p-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {sending ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
