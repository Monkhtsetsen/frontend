"use client";
import {useEffect, useState} from "react";
type MoodEntry={
    id: number;
    mood: string;
    energy: number;
    note: string | null;
    created_at: string;
};
type AiInsight={
    insight: string;
    average_energy?: number;
    entries_analyzed?: number;
}
export default function DashboardPage(){
    const [moods, setMoods]=useState<MoodEntry[]>([]);
    const [loading, setloading]=useState(true);
        const [aiInsight, setAiInsight]=useState<AiInsight | null>(null);
    
    useEffect(()=>{
        fetch("http://localhost:8000/api/mood")
        .then((res)=> res.json())
        .then((data)=>{
            setMoods(data.data);
        })
        .catch(()=>{
            setMoods([]);
        })
        .finally(()=>{
            setloading(false);
        });
        fetch("http://localhost:8000/api/ai/insight")
        .then((res)=> res.json())
        .then((data)=>{
            setAiInsight(data);
        })
        .catch(()=>{
            setAiInsight({
                insight: "AI insight is not available right now."
,            });
        });
    },[]);
    const latestMood = moods[0];
  const averageEnergy =
    moods.length > 0
      ? Math.round(
          moods.reduce((sum, item) => sum + item.energy, 0) / moods.length
        )
      : 0;

 return (
    <main className="min-h-screen bg-[#FFF7F2] text-[#3B2F2F] px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm text-[#8B7470] mb-2">GlowUp AI</p>
            <h1 className="text-4xl font-bold">Dashboard</h1>
            <p className="text-[#6F5C58] mt-2">
              Your mood history, energy patterns, and small wins live here.
            </p>
          </div>

          <a
            href="/tracker"
            className="w-fit rounded-2xl bg-[#D99A8B] px-5 py-3 font-semibold text-white hover:opacity-90"
          >
            Add mood
          </a>
        </div>

        {loading ? (
          <div className="rounded-3xl bg-white p-6 border border-[#F2D8C9]">
            Loading your glow data...
          </div>
        ) : (
          <>
            <section className="grid gap-4 md:grid-cols-3 mb-6">
              <div className="rounded-3xl bg-white p-6 border border-[#F2D8C9] shadow-sm">
                <p className="text-[#8B7470] text-sm mb-2">Latest mood</p>
                <h2 className="text-3xl font-bold">
                  {latestMood ? latestMood.mood : "No mood yet"}
                </h2>
                <p className="text-[#6F5C58] mt-2">
                  {latestMood
                    ? new Date(latestMood.created_at).toLocaleString()
                    : "Add your first mood entry."}
                </p>
              </div>

              <div className="rounded-3xl bg-white p-6 border border-[#F2D8C9] shadow-sm">
                <p className="text-[#8B7470] text-sm mb-2">Average energy</p>
                <h2 className="text-3xl font-bold">{averageEnergy}/10</h2>
                <p className="text-[#6F5C58] mt-2">
                  Based on {moods.length} mood entries.
                </p>
              </div>

              <div className="rounded-3xl bg-white p-6 border border-[#F2D8C9] shadow-sm">
                <p className="text-[#8B7470] text-sm mb-2">AI insight</p>
                <h2 className="text-xl font-bold">Daily insight ✨</h2>
                <p className="text-[#6F5C58] mt-2">
                  {aiInsight?.insight || "Loading insight..."}
                </p>
              </div>
            </section>

            <section className="rounded-3xl bg-white p-6 border border-[#F2D8C9] shadow-sm">
              <h2 className="text-2xl font-bold mb-4">Recent mood entries</h2>

              {moods.length === 0 ? (
                <p className="text-[#6F5C58]">
                  No entries yet. Go to the tracker and add one.
                </p>
              ) : (
                <div className="space-y-3">
                  {moods.map((entry) => (
                    <div
                      key={entry.id}
                      className="rounded-2xl border border-[#F2D8C9] bg-[#FFF7F2] p-4"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="font-semibold text-lg">{entry.mood}</p>
                          <p className="text-sm text-[#8B7470]">
                            Energy: {entry.energy}/10
                          </p>
                        </div>

                        <p className="text-sm text-[#8B7470]">
                          {new Date(entry.created_at).toLocaleDateString()}
                        </p>
                      </div>

                      {entry.note && (
                        <p className="mt-3 text-[#6F5C58]">{entry.note}</p>
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