"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

type Language = "en" | "mn";

type LangContextType = {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
};

const translations: Record<Language, Record<string, string>> = {
  en: {
    appName: "SyncHer",

    navDashboard: "Dashboard",
    navCycle: "Cycle",
    navAiChat: "AI Chat",
    navMood: "Mood",
 periodTag: "Cycle Tracker",
  periodTitle: "Your cycle, your power.",
  periodSubtitle:
    "Track your period, symptoms, mood, and cycle estimate.",

  periodLoadError: "Could not load cycle data.",
  periodStartRequired: "Start date is required 🌸",
  periodSaveError: "Could not save period entry.",
  periodSaved: "Cycle log saved! ✨",
    trackerTag: "Mood Tracker",
    trackerTitle: "How are you feeling today?",
    trackerSub: "Track your emotions and energy.",

    trackerPickVibe: "Pick your vibe",

    moodHappy: "Happy",
    moodOkay: "Okay",
    moodTired: "Tired",
    moodSad: "Sad",
    moodStressed: "Stressed",
    moodMotivated: "Motivated",

    trackerEnergy: "Energy",
    trackerEnergyLow: "Low",
    trackerEnergyHigh: "High",

    trackerNote: "Notes",
    trackerNotePlaceholder: "Write your thoughts...",

    trackerSave: "Save Mood",

    trackerSaved: "Mood saved!",
    trackerError: "Something went wrong.",
    trackerNoMood: "Please select a mood.",

    trackerNavCycle: "Cycle",
    trackerNavDash: "Dashboard",
    trackerNavChat: "Chat",

    chatTitle: "AI Chat",
    chatSubtitle:
      "Your personal growth assistant. Talk about your mood, cycle, energy — anything.",

    chatEmpty: "Start your first conversation ✨",

    chatPlaceholder: "Tell GlowUp AI how you feel...",

    chatSend: "Send",

    chatError:
      "Something went wrong. Check if your backend is running.",
  },

  mn: {
    appName: "SyncHer",

    navDashboard: "Хянах самбар",
    navCycle: "Мөчлөг",
    navAiChat: "AI чат",
    navMood: "Сэтгэл зүй",

    trackerTag: "Mood Tracker",
    trackerTitle: "Өнөөдөр ямар байна?",
    trackerSub: "Сэтгэл хөдлөл ба энергиэ тэмдэглээрэй.",

    trackerPickVibe: "Өнөөдөр ямархуу байна?",

    moodHappy: "Жаргалтай",
    moodOkay: "Зүгээрдээ",
    moodTired: "Ядарсан",
    moodSad: "Гунигтай",
    moodStressed: "Стресстэй",
    moodMotivated: "Урамтай",

    trackerEnergy: "Энерги",
    trackerEnergyLow: "Бага",
    trackerEnergyHigh: "Их",

    trackerNote: "Тэмдэглэл",
    trackerNotePlaceholder: "Сонин сайхан юу байна???",

    trackerSave: "Хадгалах",

    trackerSaved: "Амжилттай хадгаллаа!",
    trackerError: "Алдаа гарлаа.",
    trackerNoMood: "Mood сонгоно уу.",

    trackerNavCycle: "Мөчлөг",
    trackerNavDash: "Самбар",
    trackerNavChat: "Чат",
 periodTag: "Мөчлөг хянагч",
  periodTitle: "Таны мөчлөг, таны хүч.",
  periodSubtitle:
    "Сарын тэмдэг, шинж тэмдэг, mood болон мөчлөгөө тэмдэглээрэй.",

  periodLoadError: "Мөчлөгийн мэдээлэл ачаалж чадсангүй.",
  periodStartRequired:
    "Эхлэх өдрөө сонгоно уу 🌸",
  periodSaveError:
    "Мөчлөг хадгалах үед алдаа гарлаа.",
  periodSaved: "Амжилттай хадгаллаа ✨",
    chatTitle: "AI чат",
    chatSubtitle:
      "Сэтгэл санаа, сарын тэмдэг, энергийн талаар AI-тай ярилцаарай.",

    chatEmpty: "Анхны чат аа эхлүүлээрэй ✨",

    chatPlaceholder: "SyncHer AI-д юу мэдэрч байгаагаа бичээрэй...",

    chatSend: "Илгээх",

    chatError:
      "Алдаа гарлаа. Backend ажиллаж байгаа эсэхийг шалгана уу.",
  },
};

const LangContext = createContext<LangContextType | null>(null);

export function LangProvider({
  children,
}: {
  children: ReactNode;
}) {

  // 🔥 localStorage-аас хэл уншина
  const [lang, setLang] = useState<Language>("en");

  useEffect(() => {
    const savedLang = localStorage.getItem("lang") as Language | null;

    if (savedLang) {
      setLang(savedLang);
    }
  }, []);

  // 🔥 хэл солигдоход хадгална
  useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);

  function t(key: string) {
    return translations[lang][key] || key;
  }

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const context = useContext(LangContext);

  if (!context) {
    throw new Error("useLang must be used inside LangProvider");
  }

  return context;
}

export function LangToggle() {
  const { lang, setLang } = useLang();

  return (
    <button
      onClick={() =>
        setLang(lang === "en" ? "mn" : "en")
      }
      className="rounded-full bg-[#FFE0EE] px-4 py-2 text-sm font-bold text-[#E0387A] hover:bg-[#FFD6E8] transition-colors"
    >
      {lang === "en" ? "MN" : "EN"}
    </button>
  );
}