"use client";

import { useEffect, useState } from "react";

import { LangProvider, LangToggle, useLang } from "@/app/lang";
type MoodEntry = {
  id: number;
  mood: string;
  energy: number;
  note: string | null;
  created_at: string;
};

type AiInsight = {
  insight: string;
  average_energy?: number;
  entries_analyzed?: number;
};

type PeriodPrediction = {
  latest_period_start: string;
  average_cycle_length: number;
  next_period_date: string;
  days_until_next_period: number;
  current_cycle_day: number;
  current_phase: string;
  cycles_used: number;
  note: string;
};

const moodEmojis: Record<string, string> = {
  Happy: "😊",
  Okay: "😐",
  Tired: "😫",
  Sad: "😔",
  Stressed: "😤",
  Motivated: "✨",
};

export default function DashboardPage() {
  const [moods, setMoods] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiInsight, setAiInsight] = useState<AiInsight | null>(null);
  const [periodPrediction, setPeriodPrediction] =
    useState<PeriodPrediction | null>(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/mood")
      .then((res) => res.json())
      .then((data) => setMoods(data.data || []))
      .catch(() => setMoods([]))
      .finally(() => setLoading(false));

    fetch("http://localhost:8080/api/ai/insight")
      .then((res) => res.json())
      .then((data) => setAiInsight(data))
      .catch(() =>
        setAiInsight({ insight: "AI insight is not available right now." })
      );

    fetch("http://localhost:8080/api/period/prediction")
      .then((res) => res.json())
      .then((data) => setPeriodPrediction(data.prediction))
      .catch(() => setPeriodPrediction(null));
  }, []);

  const latestMood = moods[0];
  const averageEnergy =
    moods.length > 0
      ? Math.round(moods.reduce((sum, item) => sum + item.energy, 0) / moods.length)
      : 0;

  return (
    <main className="min-h-screen bg-[#FFF0F5] font-[Nunito,sans-serif]">
      <div
        className="h-8 border-b-2 border-[#FF6FA8]"
        style={{
          background:
            "repeating-conic-gradient(#FFB3CC 0% 25%, #FFF0F5 0% 50%) 0 0 / 24px 24px",
        }}
      />

      <nav className="flex items-center justify-between px-8 py-4 bg-white border-b-2 border-[#FFD6E8]">
        <a href="/" className="text-xl font-black text-[#E0387A] tracking-tight no-underline">
          glowup ai ✦
        </a>
        <div className="flex gap-2">
          {[
            { label: "✨ Add mood", href: "/tracker", primary: true },
            { label: "🌙 Cycle", href: "/period", primary: false },
            { label: "🦄 AI Chat", href: "/chat", primary: false },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={`text-sm font-bold px-4 py-2 rounded-full no-underline transition-colors ${
                item.primary
                  ? "bg-[#FF6FA8] text-white hover:bg-[#E0387A]"
                  : "text-[#A0405E] hover:bg-[#FFE0EE]"
              }`}
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>

      <div className="px-8 py-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <span className="inline-block bg-[#FFE0EE] text-[#E0387A] text-xs font-black px-4 py-1.5 rounded-full mb-3 tracking-widest uppercase">
            ✦ GlowUp AI
          </span>
          <h1 className="text-4xl font-black text-[#3B2F3F] mb-2">
            Dashboard 🌈
          </h1>
          <p className="text-[#80657F]">
            Your mood history, energy patterns, cycle phase, and small wins live
            here.
          </p>
        </div>

        {loading ? (
          <div className="bg-white rounded-[2rem] border-2 border-[#FFD6E8] p-8 text-center">
            <div className="text-4xl mb-3 animate-bounce">✨</div>
            <p className="font-bold text-[#A0405E]">Loading your glow data...</p>
          </div>
        ) : (
          <>
            {/* Stats cards */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              {/* Latest mood */}
              <div className="bg-white rounded-[2rem] border-2 border-[#FFD6E8] p-6 shadow-[4px_4px_0_#FFD6E8]">
                <p className="text-xs font-black text-[#A0405E] uppercase tracking-widest mb-3">
                  Latest mood
                </p>
                <div className="text-4xl mb-1">
                  {latestMood ? moodEmojis[latestMood.mood] || "🌸" : "🌸"}
                </div>
                <h2 className="text-2xl font-black text-[#3B2F3F]">
                  {latestMood ? latestMood.mood : "No mood yet"}
                </h2>
                <p className="text-xs text-[#A0405E] mt-2 font-bold">
                  {latestMood
                    ? new Date(latestMood.created_at).toLocaleString()
                    : "Add your first entry"}
                </p>
              </div>

              {/* Average energy */}
              <div className="bg-[#FF6FA8] rounded-[2rem] border-2 border-[#E0387A] p-6 shadow-[4px_4px_0_#C02860]">
                <p className="text-xs font-black text-white/80 uppercase tracking-widest mb-3">
                  Average energy
                </p>
                <div className="text-4xl mb-1">⚡</div>
                <h2 className="text-2xl font-black text-white">
                  {averageEnergy}/10
                </h2>
                <p className="text-xs text-white/80 mt-2 font-bold">
                  Based on {moods.length} entries
                </p>
              </div>

              {/* Cycle phase */}
              <div className="bg-white rounded-[2rem] border-2 border-[#FFD6E8] p-6 shadow-[4px_4px_0_#FFD6E8]">
                <p className="text-xs font-black text-[#A0405E] uppercase tracking-widest mb-3">
                  Cycle phase
                </p>
                <div className="text-4xl mb-1">🌙</div>
                {periodPrediction ? (
                  <>
                    <h2 className="text-lg font-black text-[#3B2F3F] leading-tight">
                      {periodPrediction.current_phase}
                    </h2>
                    <p className="text-xs text-[#A0405E] mt-2 font-bold">
                      Day {periodPrediction.current_cycle_day} of{" "}
                      {periodPrediction.average_cycle_length} · next in{" "}
                      {periodPrediction.days_until_next_period}d
                    </p>
                  </>
                ) : (
                  <>
                    <h2 className="text-lg font-black text-[#3B2F3F]">
                      No data yet
                    </h2>
                    <p className="text-xs text-[#A0405E] mt-2 font-bold">
                      Add period log to see phase
                    </p>
                  </>
                )}
              </div>

              {/* AI insight */}
              <div className="bg-[#FFE0EE] rounded-[2rem] border-2 border-[#FFB3CC] p-6 shadow-[4px_4px_0_#FFB3CC]">
                <p className="text-xs font-black text-[#A0405E] uppercase tracking-widest mb-3">
                  AI insight
                </p>
                <div className="text-4xl mb-1">🦄</div>
                <h2 className="text-sm font-black text-[#3B2F3F] leading-relaxed">
                  {aiInsight?.insight || "Loading insight..."}
                </h2>
              </div>
            </div>

            {/* Cycle overview banner */}
            {periodPrediction && (
              <div className="mb-6 bg-white rounded-[2rem] border-2 border-[#FFD6E8] p-6 shadow-[4px_4px_0_#FFD6E8]">
                <div className="flex items-center justify-between gap-6">
                  <div>
                    <span className="inline-block bg-[#FFE0EE] text-[#E0387A] text-xs font-black px-3 py-1 rounded-full mb-2 uppercase tracking-widest">
                      🌙 Cycle overview
                    </span>
                    <h2 className="text-2xl font-black text-[#3B2F3F] mb-1">
                      You&apos;re in your{" "}
                      <span className="text-[#E0387A]">
                        {periodPrediction.current_phase.toLowerCase()}
                      </span>
                      .
                    </h2>
                    <p className="text-[#80657F] font-semibold">
                      Next period estimated around{" "}
                      <strong className="text-[#3B2F3F]">
                        {new Date(
                          periodPrediction.next_period_date
                        ).toLocaleDateString()}
                      </strong>
                    </p>
                    <p className="text-xs text-[#A0405E] mt-2 font-bold">
                      Estimate only — not medical advice.
                    </p>
                  </div>
                  <a
                    href="/period"
                    className="shrink-0 bg-[#FF6FA8] text-white font-black px-6 py-3 rounded-2xl no-underline shadow-[3px_3px_0_#C02860] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0_#C02860] transition-all whitespace-nowrap"
                  >
                    View cycle details
                  </a>
                </div>
              </div>
            )}

            {/* Mood entries */}
            <div className="bg-white rounded-[2rem] border-2 border-[#FFD6E8] p-6 shadow-[4px_4px_0_#FFD6E8]">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-2xl font-black text-[#3B2F3F]">
                  Recent mood entries 💭
                </h2>
                <a
                  href="/tracker"
                  className="text-sm font-black text-[#E0387A] bg-[#FFE0EE] px-4 py-2 rounded-full no-underline hover:bg-[#FFD0E8] transition-colors"
                >
                  + Add entry
                </a>
              </div>

              {moods.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-5xl mb-3">🌸</div>
                  <p className="font-bold text-[#A0405E]">
                    No entries yet. Go to the tracker and add one.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {moods.map((entry) => (
                    <div
                      key={entry.id}
                      className="rounded-2xl border-2 border-[#FFE0EE] bg-[#FFFAFA] p-4 hover:border-[#FFB3CC] transition-colors"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">
                            {moodEmojis[entry.mood] || "🌸"}
                          </span>
                          <div>
                            <p className="font-black text-[#3B2F3F]">
                              {entry.mood}
                            </p>
                            <p className="text-xs text-[#A0405E] font-bold">
                              Energy: {entry.energy}/10
                            </p>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-[#A0405E] bg-[#FFE0EE] px-3 py-1 rounded-full shrink-0">
                          {new Date(entry.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      {entry.note && (
                        <p className="mt-2 text-sm text-[#80657F] font-semibold pl-11">
                          {entry.note}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}