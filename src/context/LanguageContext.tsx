"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Lang, translations } from "@/lib/translations";

interface LanguageContextType {
  lang: Lang;
  toggleLang: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "de",
  toggleLang: () => {},
  t: (key) => key,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("de"); // default: German

  useEffect(() => {
    const saved = localStorage.getItem("elbe_lang") as Lang | null;
    if (saved === "en" || saved === "de") setLang(saved);
  }, []);

  const toggleLang = () => {
    setLang((prev) => {
      const next: Lang = prev === "en" ? "de" : "en";
      localStorage.setItem("elbe_lang", next);
      return next;
    });
  };

  const t = (key: string): string => {
    return (translations[lang] as Record<string, string>)[key] ?? key;
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

/** Shorthand hook: returns the t() translation function directly. */
export function useT() {
  const { t } = useContext(LanguageContext);
  return t;
}
