"use client";

import { useEffect, useState } from "react";

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

export default function DashboardPage() {
  const [moods, setMoods] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiInsight, setAiInsight] = useState<AiInsight | null>(null);
  const [periodPrediction, setPeriodPrediction] =
    useState<PeriodPrediction | null>(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/mood")
      .then((res) => res.json())
      .then((data) => {
        setMoods(data.data);
      })
      .catch(() => {
        setMoods([]);
      })
      .finally(() => {
        setLoading(false);
      });

    fetch("http://localhost:8080/api/ai/insight")
      .then((res) => res.json())
      .then((data) => {
        setAiInsight(data);
      })
      .catch(() => {
        setAiInsight({
          insight: "AI insight is not available right now.",
        });
      });

    fetch("http://localhost:8080/api/period/prediction")
      .then((res) => res.json())
      .then((data) => {
        setPeriodPrediction(data.prediction);
      })
      .catch(() => {
        setPeriodPrediction(null);
      });
  }, []);

  const latestMood = moods[0];

  const averageEnergy =
    moods.length > 0
      ? Math.round(
          moods.reduce((sum, item) => sum + item.energy, 0) / moods.length
        )
      : 0;

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#F2D7E8] via-[#FFDAE1] to-[#C3EDD9] text-[#3B2F3F] px-6 py-10">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-10 top-10 h-28 w-28 rounded-full bg-[#E8C4E2]/50 blur-3xl" />
        <div className="absolute right-20 top-32 h-36 w-36 rounded-full bg-[#C3EDD9]/60 blur-3xl" />
        <div className="absolute bottom-20 left-1/3 h-32 w-32 rounded-full bg-[#FFDAE1]/70 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm text-[#80657F] mb-2">✨ GlowUp AI</p>
            <h1 className="text-4xl font-bold">Dashboard 🌈</h1>
            <p className="text-[#80657F] mt-2">
              Your mood history, energy patterns, cycle phase, and small wins
              live here.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href="/tracker"
              className="w-fit rounded-2xl bg-[#B58EBC] px-5 py-3 font-semibold text-white shadow-md transition hover:scale-[1.02] hover:opacity-90"
            >
              ✨ Add mood
            </a>

            <a
              href="/period"
              className="w-fit rounded-2xl border border-[#B58EBC] bg-white/70 px-5 py-3 font-semibold text-[#3B2F3F] transition hover:scale-[1.02] hover:bg-[#F2D7E8]"
            >
              🌙 Cycle Tracker
            </a>

            <a
              href="/chat"
              className="w-fit rounded-2xl border border-[#B58EBC] bg-white/70 px-5 py-3 font-semibold text-[#3B2F3F] transition hover:scale-[1.02] hover:bg-[#F2D7E8]"
            >
              🦄 AI Chat
            </a>
          </div>
        </div>

        {loading ? (
          <div className="rounded-[2rem] bg-white/80 p-6 border border-[#E8C4E2] shadow-xl backdrop-blur-md">
            Loading your glow data...
          </div>
        ) : (
          <>
            <section className="grid gap-4 md:grid-cols-4 mb-6">
              <div className="rounded-[2rem] bg-white/80 p-6 border border-[#E8C4E2] shadow-xl backdrop-blur-md">
                <p className="text-[#80657F] text-sm mb-2">Latest mood</p>
                <h2 className="text-3xl font-bold">
                  {latestMood ? latestMood.mood : "No mood yet"}
                </h2>
                <p className="text-[#80657F] mt-2">
                  {latestMood
                    ? new Date(latestMood.created_at).toLocaleString()
                    : "Add your first mood entry."}
                </p>
              </div>

              <div className="rounded-[2rem] bg-white/80 p-6 border border-[#E8C4E2] shadow-xl backdrop-blur-md">
                <p className="text-[#80657F] text-sm mb-2">Average energy</p>
                <h2 className="text-3xl font-bold">{averageEnergy}/10</h2>
                <p className="text-[#80657F] mt-2">
                  Based on {moods.length} mood entries.
                </p>
              </div>

              <div className="rounded-[2rem] bg-white/80 p-6 border border-[#E8C4E2] shadow-xl backdrop-blur-md">
                <p className="text-[#80657F] text-sm mb-2">Cycle phase</p>

                {periodPrediction ? (
                  <>
                    <h2 className="text-xl font-bold">
                      {periodPrediction.current_phase}
                    </h2>

                    <p className="text-[#80657F] mt-2">
                      Day {periodPrediction.current_cycle_day} of{" "}
                      {periodPrediction.average_cycle_length}
                    </p>

                    <p className="text-[#80657F] text-sm mt-2">
                      Next period in{" "}
                      {periodPrediction.days_until_next_period} days
                    </p>
                  </>
                ) : (
                  <>
                    <h2 className="text-xl font-bold">No cycle data yet</h2>
                    <p className="text-[#80657F] mt-2">
                      Add your period log to see your cycle phase.
                    </p>
                  </>
                )}
              </div>

              <div className="rounded-[2rem] bg-white/80 p-6 border border-[#E8C4E2] shadow-xl backdrop-blur-md">
                <p className="text-[#80657F] text-sm mb-2">AI insight</p>
                <h2 className="text-xl font-bold">Daily insight ✨</h2>
                <p className="text-[#80657F] mt-2">
                  {aiInsight?.insight || "Loading insight..."}
                </p>
              </div>
            </section>

            {periodPrediction && (
              <section className="mb-6 rounded-[2rem] bg-white/80 p-6 border border-[#E8C4E2] shadow-xl backdrop-blur-md">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm text-[#80657F] mb-1">
                      🌙 Cycle overview
                    </p>
                    <h2 className="text-2xl font-bold">
                      You are currently in your{" "}
                      {periodPrediction.current_phase.toLowerCase()}.
                    </h2>
                    <p className="text-[#80657F] mt-2">
                      Your next period is estimated around{" "}
                      {new Date(
                        periodPrediction.next_period_date
                      ).toLocaleDateString()}
                      .
                    </p>
                  </div>

                  <a
                    href="/period"
                    className="w-fit rounded-2xl bg-[#B58EBC] px-5 py-3 font-semibold text-white shadow-md transition hover:scale-[1.02] hover:opacity-90"
                  >
                    View cycle details
                  </a>
                </div>

                <p className="mt-4 text-xs text-[#80657F]">
                  Estimate only — not medical advice.
                </p>
              </section>
            )}

            <section className="rounded-[2rem] bg-white/80 p-6 border border-[#E8C4E2] shadow-xl backdrop-blur-md">
              <h2 className="text-2xl font-bold mb-4">
                Recent mood entries 💭
              </h2>

              {moods.length === 0 ? (
                <p className="text-[#80657F]">
                  No entries yet. Go to the tracker and add one.
                </p>
              ) : (
                <div className="space-y-3">
                  {moods.map((entry) => (
                    <div
                      key={entry.id}
                      className="rounded-3xl border border-[#E8C4E2] bg-[#FFF9FD]/90 p-4 shadow-sm"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="font-semibold text-lg">{entry.mood}</p>
                          <p className="text-sm text-[#80657F]">
                            Energy: {entry.energy}/10
                          </p>
                        </div>

                        <p className="text-sm text-[#80657F]">
                          {new Date(entry.created_at).toLocaleDateString()}
                        </p>
                      </div>

                      {entry.note && (
                        <p className="mt-3 text-[#80657F]">{entry.note}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}