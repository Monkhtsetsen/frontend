"use client";

import { useEffect, useState } from "react";

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
  "Cramps",
  "Headache",
  "Bloating",
  "Acne",
  "Back pain",
  "Tender breasts",
  "Fatigue",
  "Cravings",
];

const moodsList = ["Calm", "Happy", "Emotional", "Anxious", "Irritated", "Tired"];

function getPhaseColor(phase?: string) {
  if (!phase) return "from-[#F8C8D8] to-[#D99A8B]";
  if (phase.toLowerCase().includes("menstrual")) return "from-[#E87A9A] to-[#D94A73]";
  if (phase.toLowerCase().includes("follicular")) return "from-[#F6C6A8] to-[#E6A06F]";
  if (phase.toLowerCase().includes("ovulation")) return "from-[#B8E6D1] to-[#69C7A0]";
  if (phase.toLowerCase().includes("luteal")) return "from-[#D9C2FF] to-[#A98BE8]";
  return "from-[#F8C8D8] to-[#D99A8B]";
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
    const entriesRes = await fetch("http://localhost:8080/api/period");
    const entriesData = await entriesRes.json();
    setEntries(entriesData.data);

    const predictionRes = await fetch("http://localhost:8080/api/period/prediction");
    const predictionData = await predictionRes.json();
    setPrediction(predictionData.prediction);
  }

  useEffect(() => {
    loadPeriodData().catch(() => {
      setMessage("Could not load cycle data.");
    });
  }, []);

  function toggleSymptom(symptom: string) {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((item) => item !== symptom)
        : [...prev, symptom]
    );
  }

  async function savePeriod() {
    if (!startDate) {
      setMessage("Start date is required.");
      return;
    }

    const res = await fetch("http://localhost:8080/api/period", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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

    setMessage("Cycle log saved.");
    setStartDate("");
    setEndDate("");
    setFlow("medium");
    setSelectedSymptoms([]);
    setSelectedMood("");
    setNotes("");

    await loadPeriodData();
  }

  const cycleLength = prediction?.average_cycle_length || 28;
  const cycleDay = prediction?.current_cycle_day || 1;
  const progress = Math.min((cycleDay / cycleLength) * 100, 100);

  const circumference = 2 * Math.PI * 92;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const phaseGradient = getPhaseColor(prediction?.current_phase);

  return (
    <main className="min-h-screen bg-[#FFF7F2] text-[#3B2F2F] px-5 py-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm text-[#8B7470] mb-1">GlowUp AI</p>
            <h1 className="text-4xl font-bold">Cycle Tracker</h1>
            <p className="text-[#6F5C58] mt-2">
              Track your period, symptoms, mood, and cycle estimate.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href="/dashboard"
              className="rounded-2xl border border-[#D99A8B] px-4 py-3 font-semibold hover:bg-[#FFF1EA]"
            >
              Dashboard
            </a>

            <a
              href="/chat"
              className="rounded-2xl bg-[#D99A8B] px-4 py-3 font-semibold text-white hover:opacity-90"
            >
              AI Chat
            </a>
          </div>
        </header>

        <section className="grid gap-5 lg:grid-cols-[1fr_1.1fr]">
          <div className="space-y-5">
            <div className={`rounded-[2rem] bg-gradient-to-br ${phaseGradient} p-1 shadow-sm`}>
              <div className="rounded-[1.8rem] bg-white/90 p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-5 h-60 w-60">
                    <svg className="h-full w-full -rotate-90" viewBox="0 0 220 220">
                      <circle
                        cx="110"
                        cy="110"
                        r="92"
                        stroke="#F2D8C9"
                        strokeWidth="18"
                        fill="none"
                      />
                      <circle
                        cx="110"
                        cy="110"
                        r="92"
                        stroke="url(#cycleGradient)"
                        strokeWidth="18"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                      />
                      <defs>
                        <linearGradient id="cycleGradient" x1="0" x2="1" y1="0" y2="1">
                          <stop offset="0%" stopColor="#D99A8B" />
                          <stop offset="100%" stopColor="#E87A9A" />
                        </linearGradient>
                      </defs>
                    </svg>

                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <p className="text-sm text-[#8B7470]">Cycle day</p>
                      <h2 className="text-6xl font-bold">{cycleDay}</h2>
                      <p className="mt-1 text-sm font-medium text-[#6F5C58]">
                        of {cycleLength} days
                      </p>
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold">
                    {prediction?.current_phase || "No cycle data yet"}
                  </h2>

                  <p className="mt-2 max-w-md text-[#6F5C58]">
                    {prediction
                      ? `Your next period is estimated in ${prediction.days_until_next_period} days.`
                      : "Add your last period start date to generate your cycle estimate."}
                  </p>

                  <p className="mt-3 text-xs text-[#8B7470]">
                    Estimate only — not medical advice.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl bg-white p-5 border border-[#F2D8C9] shadow-sm">
                <p className="text-sm text-[#8B7470]">Next period</p>
                <p className="mt-1 text-xl font-bold">
                  {prediction
                    ? new Date(prediction.next_period_date).toLocaleDateString()
                    : "Not enough data"}
                </p>
              </div>

              <div className="rounded-3xl bg-white p-5 border border-[#F2D8C9] shadow-sm">
                <p className="text-sm text-[#8B7470]">Average cycle</p>
                <p className="mt-1 text-xl font-bold">
                  {prediction ? `${prediction.average_cycle_length} days` : "28 days default"}
                </p>
              </div>

              <div className="rounded-3xl bg-white p-5 border border-[#F2D8C9] shadow-sm">
                <p className="text-sm text-[#8B7470]">Latest period</p>
                <p className="mt-1 text-xl font-bold">
                  {prediction
                    ? new Date(prediction.latest_period_start).toLocaleDateString()
                    : "No log yet"}
                </p>
              </div>

              <div className="rounded-3xl bg-white p-5 border border-[#F2D8C9] shadow-sm">
                <p className="text-sm text-[#8B7470]">Prediction confidence</p>
                <p className="mt-1 text-xl font-bold">
                  {prediction && prediction.cycles_used > 1
                    ? "Personalized"
                    : "Basic estimate"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] bg-white p-6 border border-[#F2D8C9] shadow-sm">
            <h2 className="text-2xl font-bold mb-1">Log cycle</h2>
            <p className="text-[#6F5C58] mb-5">
              Add period dates, flow, symptoms, and mood.
            </p>

            <div className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="font-medium block mb-2">Period start</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full rounded-2xl border border-[#F2D8C9] px-4 py-3 outline-none focus:border-[#D99A8B]"
                  />
                </div>

                <div>
                  <label className="font-medium block mb-2">Period end</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full rounded-2xl border border-[#F2D8C9] px-4 py-3 outline-none focus:border-[#D99A8B]"
                  />
                </div>
              </div>

              <div>
                <label className="font-medium block mb-3">Flow</label>
                <div className="grid grid-cols-3 gap-3">
                  {["light", "medium", "heavy"].map((item) => (
                    <button
                      key={item}
                      onClick={() => setFlow(item)}
                      className={`rounded-2xl border px-4 py-3 capitalize transition ${
                        flow === item
                          ? "border-[#D99A8B] bg-[#FFF1EA] font-semibold"
                          : "border-[#F2D8C9] hover:bg-[#FFF7F2]"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-medium block mb-3">Symptoms</label>
                <div className="flex flex-wrap gap-2">
                  {symptomsList.map((symptom) => (
                    <button
                      key={symptom}
                      onClick={() => toggleSymptom(symptom)}
                      className={`rounded-full border px-4 py-2 text-sm transition ${
                        selectedSymptoms.includes(symptom)
                          ? "border-[#D99A8B] bg-[#FFF1EA] font-semibold"
                          : "border-[#F2D8C9] hover:bg-[#FFF7F2]"
                      }`}
                    >
                      {symptom}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-medium block mb-3">Mood</label>
                <div className="flex flex-wrap gap-2">
                  {moodsList.map((item) => (
                    <button
                      key={item}
                      onClick={() => setSelectedMood(item)}
                      className={`rounded-full border px-4 py-2 text-sm transition ${
                        selectedMood === item
                          ? "border-[#D99A8B] bg-[#FFF1EA] font-semibold"
                          : "border-[#F2D8C9] hover:bg-[#FFF7F2]"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-medium block mb-2">Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Anything you want to remember..."
                  className="min-h-24 w-full rounded-2xl border border-[#F2D8C9] px-4 py-3 outline-none focus:border-[#D99A8B]"
                />
              </div>

              <button
                onClick={savePeriod}
                className="w-full rounded-2xl bg-[#D99A8B] px-5 py-3 font-semibold text-white hover:opacity-90"
              >
                Save cycle log
              </button>

              {message && <p className="text-[#8B7470]">{message}</p>}
            </div>
          </div>
        </section>

        <section className="mt-5 rounded-[2rem] bg-white p-6 border border-[#F2D8C9] shadow-sm">
          <h2 className="text-2xl font-bold mb-4">Recent cycle logs</h2>

          {entries.length === 0 ? (
            <p className="text-[#6F5C58]">No period logs yet.</p>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="rounded-3xl border border-[#F2D8C9] bg-[#FFF7F2] p-4"
                >
                  <p className="font-semibold">
                    {new Date(entry.start_date).toLocaleDateString()}
                    {entry.end_date
                      ? ` - ${new Date(entry.end_date).toLocaleDateString()}`
                      : ""}
                  </p>

                  <p className="mt-1 text-sm text-[#8B7470]">
                    Flow: {entry.flow || "Not set"}
                  </p>

                  {entry.symptoms && (
                    <p className="mt-3 text-[#6F5C58]">
                      Symptoms: {entry.symptoms}
                    </p>
                  )}

                  {entry.mood && (
                    <p className="mt-1 text-[#6F5C58]">Mood: {entry.mood}</p>
                  )}

                  {entry.notes && (
                    <p className="mt-1 text-[#6F5C58]">Notes: {entry.notes}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}