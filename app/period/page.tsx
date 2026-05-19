"use client";

import { useEffect, useState } from "react";

import { LangProvider, LangToggle, useLang } from "@/app/lang";
type PeriodEntry = {
  id: number;
  start_date: string;
  end_date: string | null;
  flow: string | null;
  symptoms: string | null;
  mood: string | null;
  notes: string | null;
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

const symptomsList = [
  "Cramps", "Headache", "Bloating", "Acne",
  "Back pain", "Tender breasts", "Fatigue", "Cravings",
];

const moodsList = ["Calm", "Happy", "Emotional", "Anxious", "Irritated", "Tired"];

const phaseInfo: Record<string, { color: string; bg: string; emoji: string; desc: string }> = {
  menstrual: { color: "#E0387A", bg: "#FFE0EE", emoji: "🌺", desc: "Rest and restore" },
  follicular: { color: "#FF8C00", bg: "#FFF3E0", emoji: "🌱", desc: "Energy is rising" },
  ovulation: { color: "#2E7D32", bg: "#E8F5E9", emoji: "🌟", desc: "Peak energy time" },
  luteal: { color: "#6A1B9A", bg: "#F3E5F5", emoji: "🌙", desc: "Wind down gently" },
};

function getPhaseInfo(phase?: string) {
  if (!phase) return phaseInfo.menstrual;
  const key = Object.keys(phaseInfo).find((k) => phase.toLowerCase().includes(k));
  return phaseInfo[key || "menstrual"];
}

export default function PeriodPage() {
  const [entries, setEntries] = useState<PeriodEntry[]>([]);
  const [prediction, setPrediction] = useState<PeriodPrediction | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [flow, setFlow] = useState("medium");
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [selectedMood, setSelectedMood] = useState("");
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");

  async function loadPeriodData() {
    const entriesRes = await fetch("/api/period");
    const entriesData = await entriesRes.json();
    setEntries(Array.isArray(entriesData.data) ? entriesData.data : []);

    const predictionRes = await fetch("/api/period/prediction");
    const predictionData = await predictionRes.json();
    setPrediction(predictionData.prediction);
  }

  useEffect(() => {
    loadPeriodData().catch(() => setMessage("Could not load cycle data."));
  }, []);

  function toggleSymptom(symptom: string) {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]
    );
  }

  async function savePeriod() {
    if (!startDate) {
      setMessage("Start date is required 🌸");
      return;
    }
    const res = await fetch("/api/period", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        start_date: startDate,
        end_date: endDate || null,
        flow,
        symptoms: selectedSymptoms.join(", "),
        mood: selectedMood,
        notes,
      }),
    });
    if (!res.ok) {
      setMessage("Could not save period entry.");
      return;
    }
    setMessage("Cycle log saved! ✨");
    setStartDate(""); setEndDate(""); setFlow("medium");
    setSelectedSymptoms([]); setSelectedMood(""); setNotes("");
    await loadPeriodData();
  }

  const cycleLength = prediction?.average_cycle_length || 28;
  const cycleDay = prediction?.current_cycle_day || 1;
  const progress = Math.min((cycleDay / cycleLength) * 100, 100);
  const circumference = 2 * Math.PI * 92;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  const phase = getPhaseInfo(prediction?.current_phase);

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
            { label: "Dashboard", href: "/dashboard" },
            { label: "Mood", href: "/tracker" },
            { label: "AI Chat", href: "/chat" },
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

      <div className="px-8 py-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <span className="inline-block bg-[#FFE0EE] text-[#E0387A] text-xs font-black px-4 py-1.5 rounded-full mb-3 tracking-widest uppercase">
            🌙 cycle tracker
          </span>
          <h1 className="text-4xl font-black text-[#3B2F3F] mb-2">
            Your cycle, your power.
          </h1>
          <p className="text-[#80657F]">
            Track your period, symptoms, mood, and cycle estimate.
          </p>
        </div>

        <div className="grid grid-cols-[1fr_1.1fr] gap-5">
          {/* Left column */}
          <div className="space-y-5">
            {/* Cycle ring */}
            <div
              className="rounded-[2rem] border-2 p-1"
              style={{ borderColor: phase.color, background: phase.bg }}
            >
              <div className="rounded-[1.8rem] bg-white/95 p-7">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-5 h-60 w-60">
                    <svg className="h-full w-full -rotate-90" viewBox="0 0 220 220">
                      <circle cx="110" cy="110" r="92" stroke="#FFD6E8" strokeWidth="16" fill="none" />
                      <circle
                        cx="110" cy="110" r="92"
                        stroke={phase.color}
                        strokeWidth="16" fill="none"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl mb-1">{phase.emoji}</span>
                      <p className="text-xs font-black text-[#A0405E] uppercase tracking-wider">Cycle day</p>
                      <h2 className="text-5xl font-black" style={{ color: phase.color }}>{cycleDay}</h2>
                      <p className="text-sm font-bold text-[#80657F]">of {cycleLength} days</p>
                    </div>
                  </div>
                  <h2 className="text-xl font-black text-[#3B2F3F] mb-1">
                    {prediction?.current_phase || "No cycle data yet"}
                  </h2>
                  <p className="text-sm font-bold" style={{ color: phase.color }}>
                    {phase.desc}
                  </p>
                  <p className="mt-2 text-sm text-[#80657F] font-semibold max-w-xs">
                    {prediction
                      ? `Your next period is estimated in ${prediction.days_until_next_period} days.`
                      : "Add your last period start date to generate your cycle estimate."}
                  </p>
                  <p className="mt-2 text-xs text-[#A0405E] font-bold">
                    Estimate only — not medical advice.
                  </p>
                </div>
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  label: "Next period",
                  value: prediction
                    ? new Date(prediction.next_period_date).toLocaleDateString()
                    : "Not enough data",
                  icon: "📅",
                },
                {
                  label: "Average cycle",
                  value: prediction ? `${prediction.average_cycle_length} days` : "28 days",
                  icon: "🔄",
                },
                {
                  label: "Latest period",
                  value: prediction
                    ? new Date(prediction.latest_period_start).toLocaleDateString()
                    : "No log yet",
                  icon: "🌺",
                },
                {
                  label: "Prediction",
                  value:
                    prediction && prediction.cycles_used > 1 ? "Personalized" : "Basic estimate",
                  icon: "✨",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white rounded-2xl border-2 border-[#FFD6E8] p-4 shadow-[3px_3px_0_#FFD6E8]"
                >
                  <p className="text-xs font-black text-[#A0405E] uppercase tracking-wider mb-1">
                    {stat.icon} {stat.label}
                  </p>
                  <p className="text-base font-black text-[#3B2F3F]">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right column - form */}
          <div className="bg-white rounded-[2rem] border-2 border-[#FFD6E8] p-6 shadow-[4px_4px_0_#FFD6E8]">
            <h2 className="text-2xl font-black text-[#3B2F3F] mb-1">Log cycle</h2>
            <p className="text-[#80657F] text-sm font-semibold mb-5">
              Add period dates, flow, symptoms, and mood.
            </p>

            <div className="space-y-5">
              {/* Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-black text-[#3B2F3F] text-sm block mb-2">
                    Period start
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full rounded-2xl border-2 border-[#FFD6E8] px-4 py-3 outline-none focus:border-[#FF6FA8] text-sm font-bold text-[#3B2F3F] font-[Nunito,sans-serif]"
                  />
                </div>
                <div>
                  <label className="font-black text-[#3B2F3F] text-sm block mb-2">
                    Period end
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full rounded-2xl border-2 border-[#FFD6E8] px-4 py-3 outline-none focus:border-[#FF6FA8] text-sm font-bold text-[#3B2F3F] font-[Nunito,sans-serif]"
                  />
                </div>
              </div>

              {/* Flow */}
              <div>
                <label className="font-black text-[#3B2F3F] text-sm block mb-2">Flow</label>
                <div className="grid grid-cols-3 gap-2">
                  {["light", "medium", "heavy"].map((item) => (
                    <button
                      key={item}
                      onClick={() => setFlow(item)}
                      className={`rounded-2xl py-2.5 text-sm font-black capitalize transition-all border-2 font-[Nunito,sans-serif] ${
                        flow === item
                          ? "bg-[#FF6FA8] border-[#E0387A] text-white shadow-[2px_2px_0_#C02860]"
                          : "border-[#FFD6E8] text-[#A0405E] hover:bg-[#FFE0EE]"
                      }`}
                    >
                      {item === "light" ? "🩸 Light" : item === "medium" ? "🩸🩸 Medium" : "🩸🩸🩸 Heavy"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Symptoms */}
              <div>
                <label className="font-black text-[#3B2F3F] text-sm block mb-2">Symptoms</label>
                <div className="flex flex-wrap gap-2">
                  {symptomsList.map((symptom) => (
                    <button
                      key={symptom}
                      onClick={() => toggleSymptom(symptom)}
                      className={`rounded-full border-2 px-3 py-1.5 text-xs font-black transition-all font-[Nunito,sans-serif] ${
                        selectedSymptoms.includes(symptom)
                          ? "bg-[#FF6FA8] border-[#E0387A] text-white"
                          : "border-[#FFD6E8] text-[#A0405E] hover:bg-[#FFE0EE]"
                      }`}
                    >
                      {symptom}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mood */}
              <div>
                <label className="font-black text-[#3B2F3F] text-sm block mb-2">Mood</label>
                <div className="flex flex-wrap gap-2">
                  {moodsList.map((item) => (
                    <button
                      key={item}
                      onClick={() => setSelectedMood(item)}
                      className={`rounded-full border-2 px-3 py-1.5 text-xs font-black transition-all font-[Nunito,sans-serif] ${
                        selectedMood === item
                          ? "bg-[#FFE0EE] border-[#FF6FA8] text-[#E0387A]"
                          : "border-[#FFD6E8] text-[#A0405E] hover:bg-[#FFE0EE]"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="font-black text-[#3B2F3F] text-sm block mb-2">Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Anything you want to remember..."
                  className="min-h-20 w-full rounded-2xl border-2 border-[#FFD6E8] px-4 py-3 outline-none focus:border-[#FF6FA8] text-sm font-semibold text-[#3B2F3F] placeholder:text-[#C9A8B8] bg-[#FFFAFA] resize-none font-[Nunito,sans-serif]"
                />
              </div>

              <button
                onClick={savePeriod}
                className="w-full rounded-2xl bg-[#FF6FA8] text-white font-black py-4 text-base border-none cursor-pointer shadow-[4px_4px_0_#C02860] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0_#C02860] transition-all font-[Nunito,sans-serif]"
              >
                Save cycle log 🌙
              </button>

              {message && (
                <p className="text-[#E0387A] font-bold text-sm bg-[#FFE0EE] px-4 py-3 rounded-2xl">
                  {message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Cycle logs */}
        <div className="mt-5 bg-white rounded-[2rem] border-2 border-[#FFD6E8] p-6 shadow-[4px_4px_0_#FFD6E8]">
          <h2 className="text-2xl font-black text-[#3B2F3F] mb-5">
            Recent cycle logs 📋
          </h2>
          {entries?.length === 0 ? (
            <div className="text-center py-10">
              <div className="text-4xl mb-3">🌺</div>
              <p className="font-bold text-[#A0405E]">No period logs yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {entries?.map((entry) => (
                <div
                  key={entry.id}
                  className="rounded-2xl border-2 border-[#FFE0EE] bg-[#FFFAFA] p-4"
                >
                  <p className="font-black text-[#3B2F3F] mb-1">
                    🌺{" "}
                    {new Date(entry.start_date).toLocaleDateString()}
                    {entry.end_date
                      ? ` — ${new Date(entry.end_date).toLocaleDateString()}`
                      : ""}
                  </p>
                  <p className="text-xs font-bold text-[#A0405E] mb-2">
                    Flow: {entry.flow || "Not set"}
                  </p>
                  {entry.symptoms && (
                    <div className="flex flex-wrap gap-1 mb-1">
                      {entry.symptoms.split(", ").map((s) => (
                        <span
                          key={s}
                          className="text-xs bg-[#FFE0EE] text-[#E0387A] font-bold px-2 py-0.5 rounded-full"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                  {entry.mood && (
                    <p className="text-xs font-bold text-[#80657F]">
                      Mood: {entry.mood}
                    </p>
                  )}
                  {entry.notes && (
                    <p className="text-xs text-[#80657F] mt-1 font-semibold">
                      {entry.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}