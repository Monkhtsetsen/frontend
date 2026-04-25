"use client";
import {useState} from "react";
const moods=[
{ emoji: "😊", label: "Happy" },
  { emoji: "😐", label: "Okay" },
  { emoji: "😫", label: "Tired" },
  { emoji: "😔", label: "Sad" },
  { emoji: "😤", label: "Stressed" },
  { emoji: "✨", label: "Motivated" },
];
export default function TrackerPage(){
    const [selectedMood, setSelectedMood]=useState("");
    const [energy, setEnergy]=useState(5);
    const [note, setNote]=useState("");
    const [message, setMessage]=useState("");
    //send data to backend to save in database
    async function saveMood(){
        if(!selectedMood){
            setMessage("Pick a mood first.");
            return;
        }
        const res = await fetch("http://localhost:8000/api/mood", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                mood: selectedMood,
                energy: energy,
                note: note,
            }),
        });
        const data = await res.json();
        if(res.ok){
            setMessage(data.message);
            setSelectedMood("");
            setEnergy(5);
            setNote("");

        }else{
            setMessage("Error saving mood. Try again.");
        }
    }
    return(
         <main className="min-h-screen bg-[#FFF7F2] text-[#3B2F2F] px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm text-[#8B7470] mb-2">GlowUp AI</p>

        <h1 className="text-4xl font-bold mb-3">Mood Tracker</h1>

        <p className="text-[#6F5C58] mb-8">
          Tell the app how you feel today. Later, AI will use this to give better
          advice.
        </p>

        <section className="rounded-3xl bg-white p-6 shadow-sm border border-[#F2D8C9]">
          <h2 className="text-xl font-semibold mb-4">How are you feeling?</h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
            {moods.map((mood) => (
              <button
                key={mood.label}
                onClick={() => setSelectedMood(mood.label)}
                className={`rounded-2xl border p-4 text-left transition ${
                  selectedMood === mood.label
                    ? "border-[#D99A8B] bg-[#FFF1EA]"
                    : "border-[#F2D8C9] bg-white hover:bg-[#FFF7F2]"
                }`}
              >
                <div className="text-3xl mb-2">{mood.emoji}</div>
                <div className="font-medium">{mood.label}</div>
              </button>
            ))}
          </div>

  <div className="mb-6">
            <label className="font-medium block mb-2">
              Energy level: {energy}/10
            </label>

            <input
              type="range"
              min="1"
              max="10"
              value={energy}
              onChange={(e) => setEnergy(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="mb-6">
            <label className="font-medium block mb-2">Small note</label>

            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Today I feel..."
              className="w-full min-h-32 rounded-2xl border border-[#F2D8C9] p-4 outline-none focus:border-[#D99A8B]"
            />
          </div>

          <button
            onClick={saveMood}
            className="rounded-2xl bg-[#D99A8B] px-6 py-3 font-semibold text-white hover:opacity-90"
          >
            Save mood
          </button>

          {message && <p className="mt-4 text-[#8B7470]">{message}</p>}
        </section>
      </div>
    </main>
  );
}