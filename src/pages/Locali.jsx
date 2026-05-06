import React from "react";
import { Plus, Eye, Edit3, Trash2, MapPin, Warehouse, Thermometer, ShoppingCart } from "lucide-react";
import { useLang, tx } from "../lang.jsx";
import { IconBtn, Empty } from "../ui.jsx";
import { fmtEurShort } from "../helpers.js";

const TYPE_ICONS = {
  scaffale:    { Icon: Warehouse,   color: "bg-stone-900",  label: "Scaffali" },
  magazzino:   { Icon: Warehouse,   color: "bg-[#6b5d4f]",  label: "Magazzino" },
  frigo:       { Icon: Thermometer, color: "bg-sky-700",    label: "Frigo" },
  congelatore: { Icon: Thermometer, color: "bg-indigo-700", label: "Congelatore" },
};

export default function Locali({ locations, onView, onEdit, onCreate, onDelete }) {
  const { lang } = useLang();
  const t = (it, en) => tx(lang, it, en);
  const totalUnits = locations.reduce((s, l) => s + l.used, 0);

  return (
    <div className="p-8 bg-[#faf8f3] min-h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="text-[12px] text-stone-600 font-mono">
          {locations.length} {t("locali","areas")} · {totalUnits.toLocaleString("it-IT")} {t("pezzi totali","total units stored")}
        </div>
        <button onClick={onCreate} className="px-3 py-1.5 text-[12px] bg-stone-900 text-stone-50 hover:bg-stone-700 flex items-center gap-1.5">
          <Plus className="w-3.5 h-3.5" /> {t("Aggiungi Locale","Add Area")}
        </button>
      </div>

      {locations.length === 0 && <Empty icon={Warehouse} it="Nessun locale ancora." en="No areas yet." />}

      <div className="grid grid-cols-2 gap-4">
        {locations.map((l) => {
          const pct = (l.used / Math.max(l.capacity, 1)) * 100;
          const typeInfo = TYPE_ICONS[l.type] || TYPE_ICONS.scaffale;
          const TIcon = typeInfo.Icon;
          return (
            <div key={l.id} className="bg-white border border-stone-300 p-6 group relative">
              <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity z-10">
                <IconBtn title={t("Visualizza","View")} onClick={() => onView(l)}><Eye className="w-3.5 h-3.5" /></IconBtn>
                <IconBtn title={t("Modifica","Edit")} tone="accent" onClick={() => onEdit(l)}><Edit3 className="w-3.5 h-3.5" /></IconBtn>
                <IconBtn title={t("Elimina","Delete")} tone="danger" onClick={() => onDelete(l)}><Trash2 className="w-3.5 h-3.5" /></IconBtn>
              </div>

              <div className="flex items-start justify-between mb-5">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] uppercase tracking-[0.18em] font-mono text-stone-500">{l.id}</span>
                    <span className="w-1 h-1 rounded-full bg-stone-400" />
                    <span className="text-[10px] uppercase tracking-[0.15em] font-mono text-emerald-700 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> {t("Operativo","Active")}
                    </span>
                  </div>
                  <h3 className="font-serif text-[22px] text-stone-900 tracking-tight" style={{ fontFamily: "'Fraunces', serif", fontWeight: 400 }}>
                    {l.name}
                  </h3>
                  {l.nameEn && lang !== "it" && (
                    <div className="text-[11px] text-stone-400 font-mono mt-0.5">{l.nameEn}</div>
                  )}
                  <div className="flex items-center gap-1.5 text-[12px] text-stone-600 mt-1">
                    <MapPin className="w-3 h-3" /> {l.address}, {l.city}
                  </div>
                </div>
                <div className={`w-12 h-12 ${typeInfo.color} flex items-center justify-center flex-shrink-0`}>
                  <TIcon className="w-5 h-5 text-white" strokeWidth={1.5} />
                </div>
              </div>

              {/* Capacity bar */}
              <div className="mb-5">
                <div className="flex items-end justify-between mb-2">
                  <span className="text-[10px] uppercase tracking-[0.15em] font-mono text-stone-500">
                    {t("Utilizzo Capacità","Capacity Usage")}
                  </span>
                  <span className="text-[14px] font-mono font-semibold text-stone-900">{pct.toFixed(1)}%</span>
                </div>
                <div className="h-2 bg-stone-100 relative overflow-hidden">
                  <div className={`h-full transition-all ${pct > 80 ? "bg-rose-500" : pct > 60 ? "bg-[#d4a437]" : "bg-emerald-500"}`}
                    style={{ width: `${pct}%` }} />
                  <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_4px,rgba(0,0,0,0.04)_4px,rgba(0,0,0,0.04)_8px)] pointer-events-none" />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-stone-500 mt-1">
                  <span>{l.used.toLocaleString("it-IT")} {t("pz usati","units used")}</span>
                  <span>{l.capacity.toLocaleString("it-IT")} {t("cap","cap")}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-stone-200">
                <div>
                  <div className="text-[9px] uppercase tracking-[0.15em] font-mono text-stone-500">{t("Prodotti","Products")}</div>
                  <div className="text-[18px] font-mono font-semibold text-stone-900 mt-1">{l.products}</div>
                </div>
                <div>
                  <div className="text-[9px] uppercase tracking-[0.15em] font-mono text-stone-500">{t("Valore","Value")}</div>
                  <div className="text-[18px] font-mono font-semibold text-stone-900 mt-1">{fmtEurShort(l.value)}</div>
                </div>
                <div>
                  <div className="text-[9px] uppercase tracking-[0.15em] font-mono text-stone-500">{t("Responsabile","Manager")}</div>
                  <div className="text-[12px] text-stone-800 mt-1.5">{l.manager}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
