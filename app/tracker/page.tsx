"use client";

import { useState } from "react";
import { LangProvider, LangToggle, useLang } from "@/app/lang";

function TrackerContent() {
  const { t } = useLang();
  const [selectedMood, setSelectedMood] = useState("");
  const [energy, setEnergy] = useState(5);
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");

  const moods = [
    { emoji: "😊", labelKey: "moodHappy", color: "bg-[#FFE0EE] border-[#FF6FA8]" },
    { emoji: "😐", labelKey: "moodOkay",  color: "bg-[#FFF8E1] border-[#FFD54F]" },
    { emoji: "😫", labelKey: "moodTired", color: "bg-[#E8EAF6] border-[#7986CB]" },
    { emoji: "😔", labelKey: "moodSad",   color: "bg-[#E3F2FD] border-[#64B5F6]" },
    { emoji: "😤", labelKey: "moodStressed", color: "bg-[#FCE4EC] border-[#F06292]" },
    { emoji: "✨", labelKey: "moodMotivated", color: "bg-[#E8F5E9] border-[#66BB6A]" },
  ];

  async function saveMood() {
    if (!selectedMood) { setMessage(t("trackerNoMood") as string); return; }
    const res = await fetch("http://localhost:8080/api/mood", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mood: selectedMood, energy, note }),
    });
    if (res.ok) {
      setMessage(t("trackerSaved") as string);
      setSelectedMood(""); setEnergy(5); setNote("");
    } else {
      setMessage(t("trackerError") as string);
    }
  }

  const energyEmoji = energy <= 2 ? "🪫" : energy <= 5 ? "⚡" : energy <= 8 ? "🔥" : "⚡✨";

  return (
    <main className="min-h-screen bg-[#FFF0F5] font-[Nunito,sans-serif]">
      <div className="h-8 border-b-2 border-[#FF6FA8]"
        style={{ background: "repeating-conic-gradient(#FFB3CC 0% 25%, #FFF0F5 0% 50%) 0 0 / 24px 24px" }} />

      <nav className="flex items-center justify-between px-8 py-4 bg-white border-b-2 border-[#FFD6E8]">
        <a href="/" className="text-xl font-black text-[#E0387A] tracking-tight no-underline">{t("appName")}</a>
        <div className="flex items-center gap-2">
          {([["navDashboard","/dashboard"],["navCycle","/period"],["navAiChat","/chat"]] as [any,string][]).map(([key,href]) => (
            <a key={key} href={href} className="text-sm font-bold text-[#A0405E] px-4 py-2 rounded-full hover:bg-[#FFE0EE] transition-colors no-underline">{t(key)}</a>
          ))}
          <LangToggle />
        </div>
      </nav>

      <div className="px-8 py-10 max-w-3xl mx-auto">
        <div className="mb-8">
          <span className="inline-block bg-[#FFE0EE] text-[#E0387A] text-xs font-black px-4 py-1.5 rounded-full mb-3 tracking-widest uppercase">{t("trackerTag")}</span>
          <h1 className="text-4xl font-black text-[#3B2F3F] mb-2">{t("trackerTitle")}</h1>
          <p className="text-[#80657F] text-base">{t("trackerSub")}</p>
        </div>

        <div className="bg-white rounded-[2rem] border-2 border-[#FFD6E8] p-6 mb-5 shadow-[4px_4px_0_#FFD6E8]">
          <h2 className="text-lg font-black text-[#3B2F3F] mb-4">{t("trackerPickVibe")}</h2>
          <div className="grid grid-cols-3 gap-3 mb-6">
            {moods.map((mood) => {
              const label = t(mood.labelKey as any) as string;
              return (
                <button key={mood.labelKey} onClick={() => setSelectedMood(label)}
                  className={`rounded-2xl border-2 p-5 text-left transition-all font-[Nunito,sans-serif] ${mood.color} ${selectedMood===label?"shadow-[3px_3px_0_#FF6FA8] scale-[1.02]":"shadow-[2px_2px_0_#FFD6E8] hover:scale-[1.01]"}`}>
                  <div className="text-4xl mb-2">{mood.emoji}</div>
                  <div className="font-black text-sm text-[#3B2F3F]">{label}</div>
                </button>
              );
            })}
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="font-black text-[#3B2F3F]">{t("trackerEnergy")}</label>
              <span className="text-lg font-black text-[#E0387A] bg-[#FFE0EE] px-3 py-1 rounded-full">{energyEmoji} {energy}/10</span>
            </div>
            <input type="range" min="1" max="10" value={energy} onChange={(e) => setEnergy(Number(e.target.value))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer"
              style={{ background: `linear-gradient(to right,#FF6FA8 0%,#FF6FA8 ${((energy-1)/9)*100}%,#FFD6E8 ${((energy-1)/9)*100}%,#FFD6E8 100%)`, WebkitAppearance:"none" }} />
            <div className="flex justify-between text-xs text-[#A0405E] mt-1 font-bold">
              <span>{t("trackerEnergyLow")}</span><span>{t("trackerEnergyHigh")}</span>
            </div>
          </div>

          <div className="mb-6">
            <label className="font-black text-[#3B2F3F] block mb-2">{t("trackerNote")}</label>
            <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder={t("trackerNotePlaceholder") as string}
              className="w-full min-h-32 rounded-2xl border-2 border-[#FFD6E8] px-4 py-3 text-[#3B2F3F] font-semibold outline-none focus:border-[#FF6FA8] placeholder:text-[#C9A8B8] bg-[#FFFAFA] resize-none font-[Nunito,sans-serif] text-sm" />
          </div>

          <button onClick={saveMood}
            className="w-full rounded-2xl bg-[#FF6FA8] text-white font-black py-4 text-base shadow-[4px_4px_0_#C02860] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0_#C02860] transition-all border-none cursor-pointer font-[Nunito,sans-serif]">
            {t("trackerSave")}
          </button>
          {message && <p className="mt-4 text-[#E0387A] font-bold text-sm bg-[#FFE0EE] px-4 py-3 rounded-2xl">{message}</p>}
        </div>

        <div className="grid grid-cols-3 gap-4">
          {([["🌙","trackerNavCycle","/period"],["📊","trackerNavDash","/dashboard"],["🦄","trackerNavChat","/chat"]] as [string,any,string][]).map(([icon,key,href]) => (
            <a key={key} href={href} className="bg-white rounded-2xl border-2 border-[#FFD6E8] p-5 text-center no-underline shadow-[3px_3px_0_#FFD6E8] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0_#FFD6E8] transition-all">
              <div className="text-3xl mb-2">{icon}</div>
              <div className="text-xs font-black text-[#A0405E]">{t(key)}</div>
            </a>
          ))}
        </div>
      </div>
      <style>{`input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:22px;height:22px;border-radius:50%;background:#FF6FA8;border:3px solid white;box-shadow:0 0 0 2px #FF6FA8;cursor:pointer;}`}</style>
    </main>
  );
}

export default function TrackerPage() {
  return <LangProvider><TrackerContent /></LangProvider>;
}