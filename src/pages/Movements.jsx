import React, { useState, useMemo } from "react";
import { Search, Plus, ArrowDown, ArrowUp, ArrowLeftRight, Edit3, AlertTriangle } from "lucide-react";
import { useLang, tx } from "../lang.jsx";
import { StatusPill, KpiCard } from "../ui.jsx";
import { Activity } from "lucide-react";

const TYPE_MAP = {
  in:       { it: "Carico",     en: "Stock In",    tone: "ok",       Icon: ArrowDown      },
  out:      { it: "Scarico",    en: "Stock Out",   tone: "warning",  Icon: ArrowUp        },
  adjust:   { it: "Rettifica",  en: "Adjustment",  tone: "info",     Icon: Edit3          },
  scaduto:  { it: "Scaduto",    en: "Expired",     tone: "critical", Icon: AlertTriangle  },
  transfer: { it: "Trasferimento", en: "Transfer", tone: "accent",   Icon: ArrowLeftRight },
};

export default function Movements({ movements, onCreate }) {
  const { lang } = useLang();
  const t = (it, en) => tx(lang, it, en);

  const [typeFilter, setType]   = useState("all");
  const [search,     setSearch] = useState("");

  const todayIn  = movements.filter((m) => m.type === "in"  && m.time.startsWith("2026-05-03")).reduce((s, m) => s + m.qty, 0);
  const todayOut = movements.filter((m) => (m.type === "out" || m.type === "scaduto") && m.time.startsWith("2026-05-03")).reduce((s, m) => s + m.qty, 0);

  const filtered = useMemo(() => {
    let list = movements;
    if (typeFilter !== "all") list = list.filter((m) => m.type === typeFilter);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((m) => (m.product || "").toLowerCase().includes(q) || (m.sku || "").toLowerCase().includes(q) || (m.ref || "").toLowerCase().includes(q));
    }
    return list;
  }, [movements, typeFilter, search]);

  return (
    <div className="p-8 bg-[#faf8f3] min-h-full">
      <div className="grid grid-cols-4 gap-4 mb-6">
        <KpiCard label={t("Entrate Oggi","Today's Inbound")} labelEn={lang==="bilingual"?"Today's Inbound":undefined}
          value={todayIn} delta="+pz" deltaType="up" sub={t("unità ricevute","units received")} icon={ArrowDown} accent />
        <KpiCard label={t("Uscite Oggi","Today's Outbound")} value={todayOut} delta="" deltaType="flat"
          sub={t("unità vendute/eliminate","sold/removed")} icon={ArrowUp} />
        <KpiCard label={t("Saldo Netto","Net Balance")} value={`${todayIn - todayOut >= 0 ? "+" : ""}${todayIn - todayOut}`}
          delta="" deltaType={todayIn >= todayOut ? "up" : "down"} sub={t("ultime 24 ore","last 24 hrs")} icon={Activity} />
        <KpiCard label={t("Movimenti Totali","Total Movements")} value={movements.length}
          delta="" deltaType="flat" sub={t("nel registro","in log")} icon={ArrowLeftRight} />
      </div>

      <div className="bg-white border border-stone-300">
        <div className="px-6 py-4 border-b border-stone-300 flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-[0.18em] font-mono text-stone-500">{t("Registro Audit","Audit Log")}</div>
            <h3 className="font-serif text-[20px] text-stone-900 tracking-tight" style={{ fontFamily: "'Fraunces', serif", fontWeight: 400 }}>
              {t("Registro Movimenti","Stock Movements Log")}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder={t("Cerca SKU, riferimento…","Search SKU, ref…")}
                className="pl-8 pr-3 py-1.5 text-[12px] border border-stone-300 bg-white focus:outline-none focus:border-stone-700 w-48" />
            </div>
            <select value={typeFilter} onChange={(e) => setType(e.target.value)}
              className="px-3 py-1.5 text-[12px] border border-stone-300 bg-white focus:outline-none focus:border-stone-700 font-mono">
              <option value="all">{t("Tutti i tipi","All types")}</option>
              {Object.entries(TYPE_MAP).map(([k, v]) => (
                <option key={k} value={k}>{t(v.it, v.en)}</option>
              ))}
            </select>
            <button onClick={onCreate} className="px-3 py-1.5 text-[12px] bg-stone-900 text-stone-50 hover:bg-stone-700 flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5" /> {t("Inserimento Manuale","Manual Entry")}
            </button>
          </div>
        </div>

        <table className="w-full">
          <thead className="bg-stone-50 border-b border-stone-300">
            <tr>
              {[t("Tipo","Type"), t("ID Movimento","Movement ID"), t("Prodotto","Product"), "SKU",
                t("Quantità","Qty"), t("Riferimento","Reference"), t("Locale","Location"),
                t("Utente","User"), t("Data e Ora","Timestamp")].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-[10px] uppercase tracking-[0.15em] font-mono text-stone-600 font-medium whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={9} className="px-4 py-8 text-center text-[12px] text-stone-500 font-mono">
                {t("Nessun movimento corrisponde al filtro.","No movements match the filter.")}
              </td></tr>
            )}
            {filtered.map((m) => {
              const tm = TYPE_MAP[m.type] || TYPE_MAP.adjust;
              const TIcon = tm.Icon;
              const qtyColor = m.type === "in" ? "text-emerald-700" : m.type === "out" || m.type === "scaduto" ? "text-rose-700" : m.type === "adjust" ? "text-stone-700" : "text-[#b8862f]";
              const qtyPrefix = m.type === "in" ? "+" : (m.type === "out" || m.type === "scaduto") ? "−" : m.type === "adjust" ? (m.qty >= 0 ? "+" : "") : "↔";
              return (
                <tr key={m.id} className="border-b border-stone-100 hover:bg-stone-50/60">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <TIcon className="w-3.5 h-3.5 text-stone-500" strokeWidth={2} />
                      <StatusPill tone={tm.tone}>{t(tm.it, tm.en)}</StatusPill>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[11px] font-mono text-stone-600">{m.id}</td>
                  <td className="px-4 py-3 text-[12px] text-stone-900 max-w-[180px] truncate">{m.product}</td>
                  <td className="px-4 py-3 text-[11px] font-mono text-stone-500">{m.sku}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[13px] font-mono font-semibold ${qtyColor}`}>
                      {qtyPrefix}{Math.abs(m.qty)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[11px] font-mono text-stone-700">{m.ref}</td>
                  <td className="px-4 py-3 text-[11px] font-mono text-stone-700">{m.location}</td>
                  <td className="px-4 py-3 text-[11px] text-stone-700">{m.user}</td>
                  <td className="px-4 py-3 text-[11px] font-mono text-stone-500">{m.time}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
