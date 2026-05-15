"use client";

import { useEffect, useRef, useState } from "react";

type ChatMessage = {
  id: number;
  role: "user" | "assistant";
  content: string;
  created_at: string;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/chat")
      .then((res) => res.json())
      .then((data) => {
        setMessages(data.data);
      })
      .catch(() => {
        setMessages([]);
      });
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    const trimmed = input.trim();

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
      const res = await fetch("http://localhost:8080/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: trimmed,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error("Failed to send message");
      }

      setMessages((prev) => [
        ...prev.filter((msg) => msg.id !== tempUserMessage.id),
        data.user_message,
        data.assistant_message,
      ]);
    } catch {
      const errorMessage: ChatMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: "Something went wrong. Check if your backend is running.",
        created_at: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      sendMessage();
    }
  }

  return (
    <main className="min-h-screen bg-[#FFF7F2] text-[#3B2F2F] px-6 py-8">
      <div className="mx-auto flex h-[calc(100vh-4rem)] max-w-5xl flex-col">
        <header className="mb-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-[#8B7470] mb-1">GlowUp AI</p>
            <h1 className="text-4xl font-bold">AI Chat</h1>
            <p className="text-[#6F5C58] mt-1">
              Talk to your personal growth assistant.
            </p>
          </div>

          <div className="flex gap-3">
            <a
              href="/dashboard"
              className="rounded-2xl border border-[#D99A8B] px-4 py-3 font-semibold hover:bg-[#FFF1EA]"
            >
              Dashboard
            </a>

            <a
              href="/tracker"
              className="rounded-2xl bg-[#D99A8B] px-4 py-3 font-semibold text-white hover:opacity-90"
            >
              Track mood
            </a>
          </div>
        </header>

        <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-3xl border border-[#F2D8C9] bg-white shadow-sm">
          <div className="flex-1 overflow-y-auto bg-[#FFFDFC] p-5">
            {messages.length === 0 ? (
              <div className="flex h-full items-center justify-center text-center">
                <div className="max-w-md">
                  <div className="mb-4 text-5xl">✨</div>
                  <h2 className="text-2xl font-bold mb-2">
                    Start your first check-in
                  </h2>
                  <p className="text-[#6F5C58]">
                    Try: “I feel unmotivated today” or “Help me study consistently.”
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
                      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-3xl px-5 py-3 ${
                          isUser
                            ? "bg-[#D99A8B] text-white"
                            : "bg-[#FFF1EA] text-[#3B2F2F] border border-[#F2D8C9]"
                        }`}
                      >
                        <p className="whitespace-pre-wrap leading-relaxed">
                          {message.content}
                        </p>
                      </div>
                    </div>
                  );
                })}

                {loading && (
                  <div className="flex justify-start">
                    <div className="rounded-3xl border border-[#F2D8C9] bg-[#FFF1EA] px-5 py-3 text-[#6F5C58]">
                      GlowUp AI is thinking...
                    </div>
                  </div>
                )}

                <div ref={bottomRef} />
              </div>
            )}
          </div>

          <div className="border-t border-[#F2D8C9] bg-white p-4">
            <div className="flex gap-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Tell GlowUp AI how you feel..."
                className="flex-1 rounded-2xl border border-[#F2D8C9] px-4 py-3 outline-none focus:border-[#D99A8B]"
              />

              <button
                onClick={sendMessage}
                disabled={loading}
                className="rounded-2xl bg-[#D99A8B] px-6 py-3 font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Send
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}