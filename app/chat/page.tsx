"use client";

import { useEffect, useRef, useState } from "react";
import { LangProvider, LangToggle, useLang } from "@/app/lang";

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

function ChatContent() {
  const { t } = useLang();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

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
          content: t("chatError"),
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
    <main className="min-h-screen bg-[#FFF0F5] flex flex-col font-[Nunito,sans-serif]">

      {/* Top bar */}
      <nav className="flex items-center justify-between px-8 py-4 bg-white border-b-2 border-[#FFD6E8]">
        <a
          href="/"
          className="text-xl font-black text-[#E0387A] no-underline"
        >
          {t("appName")}
        </a>

        <div className="flex gap-2 items-center">
          <a href="/dashboard" className="text-sm font-bold px-3 py-2">
            {t("navDashboard")}
          </a>

          <a href="/tracker" className="text-sm font-bold px-3 py-2">
            {t("navMood")}
          </a>

          <a href="/period" className="text-sm font-bold px-3 py-2">
            {t("navCycle")}
          </a>

          {/* 🔥 LANGUAGE BUTTON */}
          <LangToggle />
        </div>
      </nav>

      {/* Chat area */}
      <div className="flex flex-1 max-w-5xl mx-auto w-full px-6 py-6 gap-5">

        {/* Sidebar */}
        <div className="w-64 hidden md:flex flex-col gap-4">
          <div className="bg-white p-5 rounded-3xl border">
            <h2 className="font-bold">{t("chatTitle")}</h2>
            <p className="text-sm text-gray-500">
              {t("chatSubtitle")}
            </p>
          </div>

          <div className="bg-pink-100 p-4 rounded-3xl">
            <p className="font-bold mb-2">Try:</p>
            {starterPrompts.map((p) => (
              <button
                key={p}
                onClick={() => sendMessage(p)}
                className="block text-left text-sm mb-2 bg-white p-2 rounded-xl w-full"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Chat box */}
        <div className="flex-1 flex flex-col bg-white rounded-3xl border overflow-hidden">

          {/* messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {messages.length === 0 ? (
              <div className="text-center text-gray-400 mt-20">
                {t("chatEmpty")}
              </div>
            ) : (
              messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${
                    m.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`px-4 py-2 rounded-2xl max-w-[70%] ${
                      m.role === "user"
                        ? "bg-pink-500 text-white"
                        : "bg-pink-100"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))
            )}

            {loading && (
              <div className="text-gray-400">AI is thinking...</div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* input */}
          <div className="border-t p-4 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t("chatPlaceholder")}
              className="flex-1 border rounded-xl px-4 py-2"
            />

            <button
              onClick={() => sendMessage()}
              className="bg-pink-500 text-white px-4 py-2 rounded-xl"
            >
              {t("chatSend")}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function ChatPage() {
  return (
    <LangProvider>
      <ChatContent />
    </LangProvider>
  );
}