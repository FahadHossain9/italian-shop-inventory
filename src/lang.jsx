import React, { createContext, useContext, useState } from "react";

// ── Language context ─────────────────────────────────────────────────────────
// lang values: "it" | "en" | "bilingual"
// bilingual → Italian label on top, English in small grey beneath

const LangContext = createContext({ lang: "bilingual", setLang: () => {} });

export const LangProvider = ({ children, initialLang = "bilingual" }) => {
  const [lang, setLang] = useState(initialLang);
  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {children}
    </LangContext.Provider>
  );
};

export const useLang = () => useContext(LangContext);

// ── T — inline bilingual text component ─────────────────────────────────────
// Use inside JSX: <T it="Prodotti" en="Products" />
export const T = ({ it, en, className = "" }) => {
  const { lang } = useLang();
  if (lang === "en") return <span className={className}>{en}</span>;
  if (lang === "it") return <span className={className}>{it}</span>;
  // bilingual: show Italian + small English hint
  return (
    <span className={className}>
      {it}
      <span
        className="ml-1 opacity-40 font-normal normal-case tracking-normal"
        style={{ fontSize: "0.82em" }}
      >
        / {en}
      </span>
    </span>
  );
};

// ── BiLabel — form field label with English subtitle in bilingual mode ───────
// Use as a form label where the secondary language lives on its own line
export const BiLabel = ({ it, en }) => {
  const { lang } = useLang();
  if (lang === "en") return <>{en}</>;
  if (lang === "it") return <>{it}</>;
  return (
    <>
      {it}
      <span
        className="block text-stone-400 font-normal normal-case mt-0"
        style={{ fontSize: "0.78em", letterSpacing: "0.02em" }}
      >
        {en}
      </span>
    </>
  );
};

// ── tx — plain string helper (for attributes: placeholder, title, etc.) ──────
// Usage: tx(lang, "Cerca…", "Search…")
export const tx = (lang, it, en) => (lang === "en" ? en : it);
