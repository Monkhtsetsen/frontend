"use client";

import { useEffect, useState } from "react";
import { LangProvider, LangToggle, useLang } from "@/app/lang";

function HomeContent() {
  const { t } = useLang();
  const [backendStatus, setBackendStatus] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/api/health")
      .then((res) => res.json())
      .then((data) => setBackendStatus(`${data.app}: ${data.status}`))
      .catch(() => setBackendStatus("Backend is not connected"));
  }, []);

  const marqueeItems = t("homeMarquee") as unknown as string[];

  return (
    <main className="min-h-screen bg-[#FFF0F5] font-[Nunito,sans-serif]">
      <div className="h-8 border-b-2 border-[#FF6FA8]"
        style={{ background: "repeating-conic-gradient(#FFB3CC 0% 25%, #FFF0F5 0% 50%) 0 0 / 24px 24px" }} />

      <nav className="flex items-center justify-between px-8 py-4 bg-white border-b-2 border-[#FFD6E8]">
        <span className="text-xl font-black text-[#E0387A] tracking-tight">{t("appName")}</span>
        <div className="flex items-center gap-2 flex-wrap">
          {([["navHome","/"],["navMood","/tracker"],["navCycle","/period"],["navDashboard","/dashboard"],["navAiChat","/chat"]] as [any,string][]).map(([key,href]) => (
            <a key={key} href={href} className="text-sm font-bold text-[#A0405E] px-4 py-2 rounded-full hover:bg-[#FFE0EE] transition-colors no-underline">
              {t(key)}
            </a>
          ))}
          <LangToggle />
        </div>
      </nav>

      <div className="grid grid-cols-2 min-h-[420px]">
        <div className="relative bg-gradient-to-br from-[#FF6FA8] to-[#FF3D7F] px-10 py-12 flex flex-col justify-center overflow-hidden">
          <span className="absolute top-[-20px] right-[-20px] text-[120px] opacity-15 select-none">✦</span>
          <span className="inline-block bg-white text-[#E0387A] text-xs font-black px-4 py-1.5 rounded-full mb-4 tracking-widest uppercase">{t("homeTag")}</span>
          <h1 className="text-5xl font-black text-white leading-tight mb-4">
            {t("homeTitle1")}<br /><span className="text-[#FFE0EE]">{t("homeTitle2")}</span><br />{t("homeTitle3")}
          </h1>
          <p className="text-white/85 text-base leading-relaxed mb-7 max-w-sm">{t("homeSub")}</p>
          <div className="flex gap-3 flex-wrap">
            <a href="/tracker" className="bg-white text-[#E0387A] text-sm font-black px-6 py-3 rounded-full no-underline shadow-[3px_3px_0_#C02860] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0_#C02860] transition-all">{t("homeBtnTrack")}</a>
            <a href="/dashboard" className="bg-white/20 text-white text-sm font-bold px-6 py-3 rounded-full border-2 border-white/50 no-underline hover:bg-white/30 transition-colors">{t("homeBtnDash")}</a>
          </div>
        </div>
        <div className="bg-[#FFE0EE] flex items-center justify-center p-8">
          <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
            {([["🌙","homeCardCycle",true,false],["😊","homeCardMood",false,false],["📊","homeCardDash",false,false],["🦄","homeCardChat",false,true]] as [string,any,boolean,boolean][]).map(([icon,key,accent,soft]) => (
              <div key={key} className={`rounded-[20px] p-4 text-center border-2 shadow-[3px_3px_0] ${accent?"bg-[#FF6FA8] border-[#E0387A] shadow-[#C02860]":soft?"bg-[#FFE0EE] border-[#FF6FA8] shadow-[#FFB3CC]":"bg-white border-[#FFB3CC] shadow-[#FFB3CC]"}`}>
                <div className="text-3xl mb-1.5">{icon}</div>
                <div className={`text-xs font-black ${accent?"text-white":"text-[#A0405E]"}`}>{t(key)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 bg-white border-y-2 border-[#FFD6E8]">
        {([["🌸","homeFeat1Title","homeFeat1Sub"],["✨","homeFeat2Title","homeFeat2Sub"],["🤖","homeFeat3Title","homeFeat3Sub"],["💖","homeFeat4Title","homeFeat4Sub"]] as [string,any,any][]).map(([icon,tKey,sKey],i) => (
          <div key={tKey} className={`text-center px-4 py-7 ${i<3?"border-r-2 border-[#FFD6E8]":""}`}>
            <div className="text-3xl mb-2">{icon}</div>
            <div className="text-sm font-black text-[#3B2F3F]">{t(tKey)}</div>
            <div className="text-xs text-[#A0405E] mt-0.5">{t(sKey)}</div>
          </div>
        ))}
      </div>

      <div className="overflow-hidden bg-[#FF6FA8] py-2.5 border-y-2 border-[#E0387A]">
        <div className="flex gap-8 whitespace-nowrap animate-[marquee_18s_linear_infinite]">
          {[...marqueeItems,...marqueeItems].map((text,i) => (
            <span key={i} className="text-xs font-black text-white shrink-0">{text}</span>
          ))}
        </div>
      </div>

      <div className="px-8 py-12">
        <span className="inline-block bg-[#FFE0EE] text-[#E0387A] text-xs font-black px-4 py-1.5 rounded-full mb-3 tracking-widest uppercase">{t("homeSectionTag")}</span>
        <h2 className="text-3xl font-black text-[#3B2F3F] mb-1">{t("homeSectionTitle")}</h2>
        <p className="text-[#80657F] mb-7">{t("homeSectionSub")}</p>
        <div className="grid grid-cols-4 gap-4">
          {([["😊","homeCard1Title","homeCard1Sub","/tracker",true],["🌙","homeCard2Title","homeCard2Sub","/period",false],["📊","homeCard3Title","homeCard3Sub","/dashboard",false],["🦄","homeCard4Title","homeCard4Sub","/chat",false]] as [string,any,any,string,boolean][]).map(([icon,tKey,sKey,href,accent]) => (
            <a key={tKey} href={href} className={`rounded-3xl border-2 p-7 text-center no-underline block shadow-[4px_4px_0] transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0] ${accent?"bg-[#FF6FA8] border-[#E0387A] shadow-[#C02860] hover:shadow-[#C02860]":"bg-white border-[#FFD6E8] shadow-[#FFB3CC] hover:shadow-[#FFB3CC]"}`}>
              <div className="text-4xl mb-2.5">{icon}</div>
              <div className={`text-base font-black mb-1 ${accent?"text-white":"text-[#3B2F3F]"}`}>{t(tKey)}</div>
              <div className={`text-xs ${accent?"text-white/80":"text-[#A0405E]"}`}>{t(sKey)}</div>
            </a>
          ))}
        </div>
        <div className="mt-8 bg-white rounded-2xl border-2 border-[#FFD6E8] px-6 py-4 flex items-center gap-3 shadow-[3px_3px_0_#FFD6E8]">
          <div className="w-3 h-3 rounded-full bg-green-400 shrink-0" />
          <span className="text-sm font-bold text-[#A0405E]">{backendStatus || (t("homeBackend") as string)}</span>
        </div>
      </div>

      <div className="h-8 border-t-2 border-[#FF6FA8]"
        style={{ background: "repeating-conic-gradient(#FFB3CC 0% 25%, #FFF0F5 0% 50%) 0 0 / 24px 24px" }} />
      <footer className="bg-[#3B2F3F] flex items-center justify-between px-8 py-6">
        <span className="text-xl font-black text-[#FF6FA8]">{t("appName")}</span>
        <div className="flex gap-5">
          {([["navMood","/tracker"],["navCycle","/period"],["navDashboard","/dashboard"],["navAiChat","/chat"]] as [any,string][]).map(([key,href]) => (
            <a key={key} href={href} className="text-sm font-bold text-[#FFB3CC] no-underline">{t(key)}</a>
          ))}
        </div>
      </footer>
      <style>{`@keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}`}</style>
    </main>
  );
}

export default function HomePage() {
  return <LangProvider><HomeContent /></LangProvider>;
}