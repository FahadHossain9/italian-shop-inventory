import React from "react";
import { Search, Bell, LogOut } from "lucide-react";
import { useLang, tx } from "../lang.jsx";

const FlagIT = () => (
  <svg viewBox="0 0 3 2" className="w-4 h-[11px] flex-shrink-0 rounded-[1px]">
    <rect width="1" height="2" fill="#009246"/>
    <rect x="1" width="1" height="2" fill="#FFF"/>
    <rect x="2" width="1" height="2" fill="#CE2B37"/>
  </svg>
);

const FlagGB = () => (
  <svg viewBox="0 0 60 40" className="w-4 h-[11px] flex-shrink-0 rounded-[1px]">
    <rect width="60" height="40" fill="#012169"/>
    <path d="M0,0 L60,40 M60,0 L0,40" stroke="white" strokeWidth="9"/>
    <path d="M0,0 L60,40 M60,0 L0,40" stroke="#C8102E" strokeWidth="5"/>
    <rect x="25" y="0" width="10" height="40" fill="white"/>
    <rect x="0"  y="15" width="60" height="10" fill="white"/>
    <rect x="27" y="0" width="6"  height="40" fill="#C8102E"/>
    <rect x="0"  y="17" width="60" height="6"  fill="#C8102E"/>
  </svg>
);

const LANGS = [
  { id: "it", label: "IT", Flags: () => <FlagIT />, title: "Solo Italiano" },
  { id: "en", label: "EN", Flags: () => <FlagGB />, title: "English Only"  },
];

export default function Topbar({ title, eyebrow, alertCount = 0, onLogout }) {
  const { lang, setLang } = useLang();

  return (
    <header className="bg-[#faf8f3] border-b border-stone-300 px-8 py-5 flex items-center justify-between sticky top-0 z-10">
      <div>
        <div className="text-[10px] uppercase tracking-[0.22em] font-mono text-stone-500">{eyebrow}</div>
        <h1 className="font-serif text-[28px] text-stone-900 leading-tight mt-0.5 tracking-tight"
          style={{ fontFamily: "'Fraunces', serif", fontWeight: 400 }}>
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" strokeWidth={1.75}/>
          <input
            type="text"
            placeholder={tx(lang, "Cerca SKU, prodotto, fornitore…", "Search SKU, product, supplier…")}
            className="bg-white border border-stone-300 pl-9 pr-4 py-2 w-64 text-[13px] focus:outline-none focus:border-[#d4a437] focus:ring-1 focus:ring-[#d4a437] font-sans placeholder:text-stone-400"
          />
        </div>

        {/* Alert bell */}
        <button className="relative w-9 h-9 border border-stone-300 bg-white hover:bg-stone-50 flex items-center justify-center">
          <Bell className="w-4 h-4 text-stone-700" strokeWidth={1.75}/>
          {alertCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-600 text-white text-[9px] font-mono rounded-full flex items-center justify-center">
              {alertCount}
            </span>
          )}
        </button>

        {/* Language toggle with flags */}
        <div className="flex items-center border border-stone-300 bg-white overflow-hidden">
          {LANGS.map(({ id, label, Flags, title: tip }) => (
            <button
              key={id}
              onClick={() => setLang(id)}
              title={tip}
              className={`flex items-center gap-1.5 px-3 py-2 text-[10px] font-mono font-semibold uppercase tracking-wider border-r last:border-r-0 border-stone-300 transition-colors ${
                lang === id ? "bg-stone-900 text-stone-50" : "text-stone-600 hover:bg-stone-50"
              }`}
            >
              <Flags/>
              {label}
            </button>
          ))}
        </div>

        {/* Owner + logout */}
        <div className="flex items-center gap-2 pl-3 border-l border-stone-300">
          <div className="w-8 h-8 bg-gradient-to-br from-[#d4a437] to-[#8c6a1a] flex items-center justify-center text-[11px] font-mono font-semibold text-white flex-shrink-0">
            RA
          </div>
          <div className="leading-tight">
            <div className="text-[12px] font-medium text-stone-900">Rahman Ali</div>
            <div className="text-[10px] text-stone-500 font-mono uppercase tracking-wider">
              {tx(lang, "Titolare", "Owner")}
            </div>
          </div>

          {/* Logout */}
          {onLogout && (
            <button
              onClick={onLogout}
              title={tx(lang, "Esci", "Log out")}
              className="ml-1 w-8 h-8 flex items-center justify-center border border-stone-200 bg-white hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 text-stone-400 transition-all"
            >
              <LogOut className="w-3.5 h-3.5" strokeWidth={2}/>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
