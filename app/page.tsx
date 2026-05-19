"use client";

import { useEffect, useState } from "react";

export default function HomePage() {
  const [backendStatus, setBackendStatus] = useState("Checking backend...");

  useEffect(() => {
    fetch("http://localhost:8080/api/health")
      .then((res) => res.json())
      .then((data) => {
        setBackendStatus(`${data.app} backend status: ${data.status}`);
      })
      .catch(() => {
        setBackendStatus("Backend is not connected");
      });
  }, []);

  return (
    <main className="min-h-screen bg-[#FFF0F5] font-[Nunito,sans-serif]">
      {/* Checker top bar */}
      <div
        className="h-8 border-b-2 border-[#FF6FA8]"
        style={{
          background:
            "repeating-conic-gradient(#FFB3CC 0% 25%, #FFF0F5 0% 50%) 0 0 / 24px 24px",
        }}
      />

      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-4 bg-white border-b-2 border-[#FFD6E8]">
        <span className="text-xl font-black text-[#E0387A] tracking-tight">
          glowup ai ✦
        </span>
        <div className="flex gap-2">
          {[
            { label: "Home", href: "/" },
            { label: "Mood", href: "/tracker" },
            { label: "Cycle", href: "/period" },
            { label: "Dashboard", href: "/dashboard" },
            { label: "AI Chat", href: "/chat" },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm font-bold text-[#A0405E] px-4 py-2 rounded-full hover:bg-[#FFE0EE] transition-colors"
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>

      {/* Hero */}
      <div className="grid grid-cols-2 min-h-[420px]">
        <div className="relative bg-gradient-to-br from-[#FF6FA8] to-[#FF3D7F] px-10 py-12 flex flex-col justify-center overflow-hidden">
          <span className="absolute top-[-20px] right-[-20px] text-[120px] opacity-15 select-none">
            ✦
          </span>
          <span className="inline-block bg-white text-[#E0387A] text-xs font-black px-4 py-1.5 rounded-full mb-4 tracking-widest uppercase">
            ✦ your wellness bestie
          </span>
          <h1 className="text-5xl font-black text-white leading-tight mb-4">
            Your personal
            <br />
            <span className="text-[#FFE0EE]">glow-up</span>
            <br />
            starts here.
          </h1>
          <p className="text-white/85 text-base leading-relaxed mb-7 max-w-sm">
            Mood tracking, cycle logging, habits & AI support — all wrapped in
            one soft little system just for you.
          </p>
          <div className="flex gap-3 flex-wrap">
            <a
              href="/tracker"
              className="bg-white text-[#E0387A] text-sm font-black px-6 py-3 rounded-full no-underline shadow-[3px_3px_0_#C02860] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0_#C02860] transition-all"
            >
              ✨ Track mood
            </a>
            <a
              href="/dashboard"
              className="bg-white/20 text-white text-sm font-bold px-6 py-3 rounded-full border-2 border-white/50 no-underline hover:bg-white/30 transition-colors"
            >
              View dashboard
            </a>
          </div>
        </div>

        <div className="bg-[#FFE0EE] flex items-center justify-center p-8">
          <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
            {[
              { icon: "🌙", label: "Cycle Tracker", accent: true },
              { icon: "😊", label: "Mood Log", accent: false },
              { icon: "📊", label: "Dashboard", accent: false },
              { icon: "🦄", label: "AI Chat", accent: false, soft: true },
            ].map((card) => (
              <div
                key={card.label}
                className={`rounded-[20px] p-4 text-center border-2 shadow-[3px_3px_0] ${
                  card.accent
                    ? "bg-[#FF6FA8] border-[#E0387A] shadow-[#C02860]"
                    : card.soft
                    ? "bg-[#FFE0EE] border-[#FF6FA8] shadow-[#FFB3CC]"
                    : "bg-white border-[#FFB3CC] shadow-[#FFB3CC]"
                }`}
              >
                <div className="text-3xl mb-1.5">{card.icon}</div>
                <div
                  className={`text-xs font-black ${card.accent ? "text-white" : "text-[#A0405E]"}`}
                >
                  {card.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feature strip */}
      <div className="grid grid-cols-4 bg-white border-y-2 border-[#FFD6E8]">
        {[
          { icon: "🌸", title: "Cycle tracking", sub: "Know your phases" },
          { icon: "✨", title: "Mood logging", sub: "Energy + emotions" },
          { icon: "🤖", title: "AI insights", sub: "Personalized tips" },
          { icon: "💖", title: "Made for you", sub: "Soft & supportive" },
        ].map((feat, i) => (
          <div
            key={feat.title}
            className={`text-center px-4 py-7 ${i < 3 ? "border-r-2 border-[#FFD6E8]" : ""}`}
          >
            <div className="text-3xl mb-2">{feat.icon}</div>
            <div className="text-sm font-black text-[#3B2F3F]">
              {feat.title}
            </div>
            <div className="text-xs text-[#A0405E] mt-0.5">{feat.sub}</div>
          </div>
        ))}
      </div>

      {/* Marquee */}
      <div className="overflow-hidden bg-[#FF6FA8] py-2.5 border-y-2 border-[#E0387A]">
        <div className="flex gap-8 whitespace-nowrap animate-[marquee_18s_linear_infinite]">
          {[
            "✦ know your cycle",
            "✦ log your mood",
            "✦ talk to your AI bestie",
            "✦ track your energy",
            "✦ glow every day",
            "✦ know your cycle",
            "✦ log your mood",
            "✦ talk to your AI bestie",
            "✦ track your energy",
            "✦ glow every day",
          ].map((text, i) => (
            <span key={i} className="text-xs font-black text-white shrink-0">
              {text}
            </span>
          ))}
        </div>
      </div>

      {/* App grid */}
      <div className="px-8 py-12">
        <span className="inline-block bg-[#FFE0EE] text-[#E0387A] text-xs font-black px-4 py-1.5 rounded-full mb-3 tracking-widest uppercase">
          ✦ explore the app
        </span>
        <h2 className="text-3xl font-black text-[#3B2F3F] mb-1">
          Where do you want to start?
        </h2>
        <p className="text-[#80657F] mb-7">
          Pick a feature and begin your glow-up journey today.
        </p>

        <div className="grid grid-cols-4 gap-4">
          {[
            {
              icon: "😊",
              title: "Mood Tracker",
              sub: "Log how you feel",
              href: "/tracker",
              accent: true,
            },
            {
              icon: "🌙",
              title: "Cycle Tracker",
              sub: "Know your phases",
              href: "/period",
              accent: false,
            },
            {
              icon: "📊",
              title: "Dashboard",
              sub: "See your patterns",
              href: "/dashboard",
              accent: false,
            },
            {
              icon: "🦄",
              title: "AI Chat",
              sub: "Your growth bestie",
              href: "/chat",
              accent: false,
            },
          ].map((card) => (
            <a
              key={card.title}
              href={card.href}
              className={`rounded-3xl border-2 p-7 text-center no-underline block shadow-[4px_4px_0] transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0] ${
                card.accent
                  ? "bg-[#FF6FA8] border-[#E0387A] shadow-[#C02860] hover:shadow-[#C02860]"
                  : "bg-white border-[#FFD6E8] shadow-[#FFB3CC] hover:shadow-[#FFB3CC]"
              }`}
            >
              <div className="text-4xl mb-2.5">{card.icon}</div>
              <div
                className={`text-base font-black mb-1 ${card.accent ? "text-white" : "text-[#3B2F3F]"}`}
              >
                {card.title}
              </div>
              <div
                className={`text-xs ${card.accent ? "text-white/80" : "text-[#A0405E]"}`}
              >
                {card.sub}
              </div>
            </a>
          ))}
        </div>

        {/* Backend status */}
        <div className="mt-8 bg-white rounded-2xl border-2 border-[#FFD6E8] px-6 py-4 flex items-center gap-3 shadow-[3px_3px_0_#FFD6E8]">
          <div className="w-3 h-3 rounded-full bg-green-400 shrink-0" />
          <span className="text-sm font-bold text-[#A0405E]">
            {backendStatus}
          </span>
        </div>
      </div>

      {/* Footer checker bar */}
      <div
        className="h-8 border-t-2 border-[#FF6FA8]"
        style={{
          background:
            "repeating-conic-gradient(#FFB3CC 0% 25%, #FFF0F5 0% 50%) 0 0 / 24px 24px",
        }}
      />
      <footer className="bg-[#3B2F3F] flex items-center justify-between px-8 py-6">
        <span className="text-xl font-black text-[#FF6FA8]">glowup ai ✦</span>
        <div className="flex gap-5">
          {[
            { label: "Mood", href: "/tracker" },
            { label: "Cycle", href: "/period" },
            { label: "Dashboard", href: "/dashboard" },
            { label: "AI Chat", href: "/chat" },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-bold text-[#FFB3CC] no-underline"
            >
              {link.label}
            </a>
          ))}
        </div>
      </footer>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </main>
  );
}