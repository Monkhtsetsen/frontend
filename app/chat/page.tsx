"use client";

import { useEffect, useRef, useState } from "react";

type ChatMessage = {
  id: number;
  role: "user" | "assistant";
  content: string;
  created_at: string;
};

const starterPrompts = [
  "I feel unmotivated today 😔",
  "Help me track my energy better ✨",
  "What should I do in my luteal phase? 🌙",
  "I need a mood boost 🌸",
];

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/ai/chat")
      .then((res) => res.json())
      .then((data) => setMessages(data.data))
      .catch(() => setMessages([]));
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(text?: string) {
    const trimmed = (text || input).trim();
    if (!trimmed || loading) return;
    setLoading(true);
    setInput("");

    const tempUserMessage: ChatMessage = {
      id: Date.now(),
      role: "user",
      content: trimmed,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMessage]);

    try {
      const res = await fetch("http://localhost:8080/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error("Failed");
      setMessages((prev) => [
        ...prev.filter((msg) => msg.id !== tempUserMessage.id),
        data.user_message,
        data.assistant_message,
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: "Something went wrong. Check if your backend is running. 🌸",
          created_at: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") sendMessage();
  }

  return (
    <main
      className="min-h-screen bg-[#FFF0F5] font-[Nunito,sans-serif] flex flex-col"
      style={{ height: "100vh" }}
    >
      <div
        className="h-8 border-b-2 border-[#FF6FA8] shrink-0"
        style={{
          background:
            "repeating-conic-gradient(#FFB3CC 0% 25%, #FFF0F5 0% 50%) 0 0 / 24px 24px",
        }}
      />

      <nav className="flex items-center justify-between px-8 py-4 bg-white border-b-2 border-[#FFD6E8] shrink-0">
        <a href="/" className="text-xl font-black text-[#E0387A] tracking-tight no-underline">
          glowup ai ✦
        </a>
        <div className="flex gap-2">
          {[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Mood", href: "/tracker" },
            { label: "Cycle", href: "/period" },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm font-bold text-[#A0405E] px-4 py-2 rounded-full hover:bg-[#FFE0EE] transition-colors no-underline"
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>

      <div className="flex flex-1 min-h-0 px-8 py-6 gap-5 max-w-6xl w-full mx-auto">
        {/* Sidebar */}
        <div className="w-64 shrink-0 flex flex-col gap-4">
          <div className="bg-white rounded-[2rem] border-2 border-[#FFD6E8] p-5 shadow-[4px_4px_0_#FFD6E8]">
            <div className="text-4xl mb-3">🦄</div>
            <h2 className="text-lg font-black text-[#3B2F3F] mb-1">
              AI Chat
            </h2>
            <p className="text-xs font-semibold text-[#80657F]">
              Your personal growth assistant. Talk about your mood, cycle,
              energy — anything.
            </p>
          </div>

          <div className="bg-[#FFE0EE] rounded-[2rem] border-2 border-[#FFB3CC] p-4">
            <p className="text-xs font-black text-[#E0387A] uppercase tracking-widest mb-3">
              ✦ Try asking
            </p>
            <div className="space-y-2">
              {starterPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  className="w-full text-left text-xs font-bold text-[#A0405E] bg-white border-2 border-[#FFD6E8] px-3 py-2.5 rounded-2xl hover:bg-[#FFE0EE] hover:border-[#FF6FA8] transition-all font-[Nunito,sans-serif] cursor-pointer"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 min-h-0 flex flex-col bg-white rounded-[2rem] border-2 border-[#FFD6E8] shadow-[4px_4px_0_#FFD6E8] overflow-hidden">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6">
            {messages.length === 0 ? (
              <div className="flex h-full items-center justify-center text-center">
                <div className="max-w-sm">
                  <div className="text-6xl mb-4">✨</div>
                  <h2 className="text-2xl font-black text-[#3B2F3F] mb-2">
                    Start your first check-in
                  </h2>
                  <p className="text-[#80657F] font-semibold text-sm">
                    Try one of the starter prompts on the left, or type
                    anything below.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => {
                  const isUser = message.role === "user";
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isUser ? "justify-end" : "justify-start"} items-end gap-2`}
                    >
                      {!isUser && (
                        <div className="w-8 h-8 rounded-full bg-[#FF6FA8] flex items-center justify-center text-white text-sm shrink-0 mb-1">
                          🦄
                        </div>
                      )}
                      <div
                        className={`max-w-[75%] rounded-3xl px-5 py-3 ${
                          isUser
                            ? "bg-[#FF6FA8] text-white rounded-br-lg"
                            : "bg-[#FFE0EE] text-[#3B2F3F] border-2 border-[#FFB3CC] rounded-bl-lg"
                        }`}
                      >
                        <p className="whitespace-pre-wrap leading-relaxed text-sm font-semibold">
                          {message.content}
                        </p>
                        <p
                          className={`text-xs mt-1.5 font-bold ${isUser ? "text-white/60" : "text-[#A0405E]"}`}
                        >
                          {new Date(message.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      {isUser && (
                        <div className="w-8 h-8 rounded-full bg-[#FFE0EE] border-2 border-[#FFB3CC] flex items-center justify-center text-sm shrink-0 mb-1">
                          😊
                        </div>
                      )}
                    </div>
                  );
                })}

                {loading && (
                  <div className="flex justify-start items-end gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#FF6FA8] flex items-center justify-center text-white text-sm shrink-0">
                      🦄
                    </div>
                    <div className="bg-[#FFE0EE] border-2 border-[#FFB3CC] rounded-3xl rounded-bl-lg px-5 py-3">
                      <div className="flex gap-1.5 items-center">
                        <div className="w-2 h-2 rounded-full bg-[#FF6FA8] animate-bounce" style={{ animationDelay: "0ms" }} />
                        <div className="w-2 h-2 rounded-full bg-[#FF6FA8] animate-bounce" style={{ animationDelay: "150ms" }} />
                        <div className="w-2 h-2 rounded-full bg-[#FF6FA8] animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={bottomRef} />
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t-2 border-[#FFE0EE] bg-white p-4">
            <div className="flex gap-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Tell GlowUp AI how you feel..."
                className="flex-1 rounded-2xl border-2 border-[#FFD6E8] px-5 py-3 outline-none focus:border-[#FF6FA8] text-sm font-semibold text-[#3B2F3F] placeholder:text-[#C9A8B8] font-[Nunito,sans-serif]"
              />
              <button
                onClick={() => sendMessage()}
                disabled={loading}
                className="rounded-2xl bg-[#FF6FA8] text-white font-black px-6 py-3 text-sm border-none cursor-pointer shadow-[3px_3px_0_#C02860] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0_#C02860] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-x-0 disabled:translate-y-0 font-[Nunito,sans-serif]"
              >
                Send ✦
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}