import React, { useState, useRef, useEffect } from "react";
import { Search, Bell, LogOut, AlertTriangle, Clock, ShoppingBag, Package, FileText, X } from "lucide-react";
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

const TONE = {
  critical: { dot: "bg-rose-500",    bg: "bg-rose-50",    border: "border-rose-100",   text: "text-rose-700"   },
  warning:  { dot: "bg-amber-500",   bg: "bg-amber-50",   border: "border-amber-100",  text: "text-amber-700"  },
  ok:       { dot: "bg-emerald-500", bg: "bg-emerald-50", border: "border-emerald-100",text: "text-emerald-700"},
  info:     { dot: "bg-sky-500",     bg: "bg-sky-50",     border: "border-sky-100",    text: "text-sky-700"    },
  accent:   { dot: "bg-[#d4a437]",   bg: "bg-[#fdf6e3]",  border: "border-[#e8d4a0]",  text: "text-[#7a5a1a]"  },
};

function useNotifications(lang) {
  const t = (it, en) => tx(lang, it, en);
  return [
    {
      id: 1, tone: "critical", Icon: Package, unread: true,
      title: t("Scorte in esaurimento", "Stock running low"),
      desc:  t("Riso Basmati 5kg — solo 2 unità rimaste", "Riso Basmati 5kg — only 2 units left"),
      time:  t("5 min fa", "5 min ago"),
    },
    {
      id: 2, tone: "critical", Icon: Clock, unread: true,
      title: t("Scadenza imminente", "Expiry warning"),
      desc:  t("Latte UHT intero — scade in 3 giorni", "Latte UHT — expires in 3 days"),
      time:  t("12 min fa", "12 min ago"),
    },
    {
      id: 3, tone: "ok", Icon: ShoppingBag, unread: true,
      title: t("Vendita completata", "Sale completed"),
      desc:  t("Vendita VN-008 registrata — €47,80", "Sale VN-008 recorded — €47.80"),
      time:  t("1 ora fa", "1 hour ago"),
    },
    {
      id: 4, tone: "warning", Icon: Package, unread: false,
      title: t("Stock basso", "Low stock"),
      desc:  t("Olio EVO 1L — sotto la scorta minima (5 pz)", "Olio EVO 1L — below minimum stock (5 pcs)"),
      time:  t("2 ore fa", "2 hours ago"),
    },
    {
      id: 5, tone: "warning", Icon: Clock, unread: false,
      title: t("Scadenza imminente", "Expiry warning"),
      desc:  t("Mozzarella 125g — scade in 5 giorni", "Mozzarella 125g — expires in 5 days"),
      time:  t("3 ore fa", "3 hours ago"),
    },
    {
      id: 6, tone: "info", Icon: FileText, unread: false,
      title: t("Ordine in attesa", "Order pending"),
      desc:  t("PO-2024-007 — in attesa conferma fornitore", "PO-2024-007 — awaiting supplier confirmation"),
      time:  t("ieri", "yesterday"),
    },
    {
      id: 7, tone: "accent", Icon: ShoppingBag, unread: false,
      title: t("Corrispettivi del giorno", "Daily corrispettivi"),
      desc:  t("Totale giornaliero: €1.284,50 — 18 scontrini", "Daily total: €1,284.50 — 18 transactions"),
      time:  t("ieri", "yesterday"),
    },
  ];
}

export default function Topbar({ title, eyebrow, alertCount = 0, onLogout }) {
  const { lang, setLang } = useLang();
  const [notifOpen, setNotifOpen]   = useState(false);
  const [readIds,   setReadIds]     = useState(new Set());
  const bellRef = useRef(null);

  const notifications = useNotifications(lang);
  const unreadCount   = notifications.filter(n => n.unread && !readIds.has(n.id)).length;

  // Close on outside click
  useEffect(() => {
    if (!notifOpen) return;
    const handler = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target)) setNotifOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [notifOpen]);

  const markAllRead = () => setReadIds(new Set(notifications.map(n => n.id)));

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

        {/* Bell + notification panel */}
        <div className="relative" ref={bellRef}>
          <button
            onClick={() => setNotifOpen(v => !v)}
            className={`relative w-9 h-9 border bg-white flex items-center justify-center transition-colors ${
              notifOpen ? "border-stone-400 bg-stone-50" : "border-stone-300 hover:bg-stone-50"
            }`}
          >
            <Bell className="w-4 h-4 text-stone-700" strokeWidth={1.75}/>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-600 text-white text-[9px] font-mono rounded-full flex items-center justify-center leading-none">
                {unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-[360px] bg-white border border-stone-200 shadow-xl z-50"
              style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)" }}>

              {/* Panel header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-semibold text-stone-900">
                    {tx(lang, "Notifiche", "Notifications")}
                  </span>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 bg-rose-100 text-rose-700 text-[10px] font-mono font-bold rounded">
                      {unreadCount} {tx(lang, "nuove", "new")}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button onClick={markAllRead}
                      className="text-[11px] font-mono text-stone-400 hover:text-stone-700 transition-colors">
                      {tx(lang, "Segna tutte lette", "Mark all read")}
                    </button>
                  )}
                  <button onClick={() => setNotifOpen(false)}
                    className="p-1 hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors">
                    <X className="w-3.5 h-3.5"/>
                  </button>
                </div>
              </div>

              {/* Notification list */}
              <div className="max-h-[400px] overflow-y-auto divide-y divide-stone-50">
                {notifications.map((n) => {
                  const isRead = readIds.has(n.id) || !n.unread;
                  const tone   = TONE[n.tone] || TONE.info;
                  const Icon   = n.Icon;
                  return (
                    <div key={n.id}
                      onClick={() => setReadIds(prev => new Set([...prev, n.id]))}
                      className={`flex gap-3 px-4 py-3.5 cursor-pointer transition-colors hover:bg-stone-50 ${
                        !isRead ? "bg-stone-50/60" : ""
                      }`}>
                      {/* Icon */}
                      <div className={`w-8 h-8 flex items-center justify-center flex-shrink-0 mt-0.5 border ${tone.bg} ${tone.border}`}>
                        <Icon className={`w-3.5 h-3.5 ${tone.text}`} strokeWidth={2}/>
                      </div>
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <span className={`text-[12px] font-semibold leading-snug ${isRead ? "text-stone-600" : "text-stone-900"}`}>
                            {n.title}
                          </span>
                          {!isRead && (
                            <span className="w-2 h-2 bg-sky-500 rounded-full flex-shrink-0 mt-1"/>
                          )}
                        </div>
                        <p className="text-[11px] text-stone-500 leading-relaxed mt-0.5 truncate">{n.desc}</p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className={`inline-block w-1.5 h-1.5 rounded-full ${tone.dot}`}/>
                          <span className="text-[10px] font-mono text-stone-400">{n.time}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Panel footer */}
              <div className="px-4 py-2.5 border-t border-stone-100 bg-stone-50/60">
                <span className="text-[11px] font-mono text-stone-400">
                  {notifications.length} {tx(lang, "notifiche totali", "total notifications")}
                  {" · "}
                  {tx(lang, "aggiornato ora", "updated just now")}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Language toggle with flags */}
        <div className="flex items-center border border-stone-300 bg-white overflow-hidden">
          {LANGS.map(({ id, label, Flags, title: tip }) => (
            <button key={id} onClick={() => setLang(id)} title={tip}
              className={`flex items-center gap-1.5 px-3 py-2 text-[10px] font-mono font-semibold uppercase tracking-wider border-r last:border-r-0 border-stone-300 transition-colors ${
                lang === id ? "bg-stone-900 text-stone-50" : "text-stone-600 hover:bg-stone-50"
              }`}>
              <Flags/>{label}
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
          {onLogout && (
            <button onClick={onLogout} title={tx(lang, "Esci", "Log out")}
              className="ml-1 w-8 h-8 flex items-center justify-center border border-stone-200 bg-white hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 text-stone-400 transition-all">
              <LogOut className="w-3.5 h-3.5" strokeWidth={2}/>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
