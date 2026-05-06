import React from "react";
import { Plus, Eye, Edit3, Trash2, Mail, Phone, Star, MessageCircle } from "lucide-react";
import { useLang, tx } from "../lang.jsx";
import { IconBtn, Empty } from "../ui.jsx";
import { fmtEurShort } from "../helpers.js";
import { Truck } from "lucide-react";

export default function Suppliers({ suppliers, onView, onEdit, onCreate, onDelete }) {
  const { lang } = useLang();
  const t = (it, en) => tx(lang, it, en);

  return (
    <div className="p-8 bg-[#faf8f3] min-h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="text-[12px] text-stone-600 font-mono">
          {suppliers.length} {t("fornitori","suppliers")} · {suppliers.reduce((s, x) => s + x.products, 0)} {t("prodotti forniti","products sourced")}
        </div>
        <button onClick={onCreate} className="px-3 py-1.5 text-[12px] bg-stone-900 text-stone-50 hover:bg-stone-700 flex items-center gap-1.5">
          <Plus className="w-3.5 h-3.5" /> {t("Aggiungi Fornitore","Add Supplier")}
        </button>
      </div>

      {suppliers.length === 0 && <Empty icon={Truck} it="Nessun fornitore ancora." en="No suppliers yet." />}

      <div className="grid grid-cols-2 gap-4">
        {suppliers.map((s) => (
          <div key={s.id} className="bg-white border border-stone-300 p-5 hover:border-stone-400 transition-colors group relative">
            {/* Actions */}
            <div className="absolute top-3 right-3 flex items-center gap-1">
              <IconBtn title={t("Visualizza","View")} onClick={() => onView(s)}><Eye className="w-3.5 h-3.5" /></IconBtn>
              <IconBtn title={t("Modifica","Edit")} tone="accent" onClick={() => onEdit(s)}><Edit3 className="w-3.5 h-3.5" /></IconBtn>
              <IconBtn title={t("Elimina","Delete")} tone="danger" onClick={() => onDelete(s)}><Trash2 className="w-3.5 h-3.5" /></IconBtn>
            </div>

            {/* Header */}
            <div className="flex items-start justify-between mb-4 pr-24">
              <div>
                <div className="text-[10px] uppercase tracking-[0.18em] font-mono text-stone-500 mb-1">{s.id} · {s.city}</div>
                <h3 className="font-serif text-[18px] text-stone-900 tracking-tight leading-tight" style={{ fontFamily: "'Fraunces', serif", fontWeight: 400 }}>{s.name}</h3>
                <div className="text-[12px] text-stone-600 mt-1">{s.contact}</div>
                {s.piva && <div className="text-[10px] font-mono text-stone-400 mt-0.5">P.IVA {s.piva}</div>}
              </div>
              <div className="flex items-center gap-1 px-2 py-1 bg-[#fbf3df] border border-[#e6d2a4] flex-shrink-0">
                <Star className="w-3 h-3 fill-[#d4a437] text-[#d4a437]" strokeWidth={1} />
                <span className="text-[12px] font-mono font-semibold text-[#7a5a1a]">{s.rating}</span>
              </div>
            </div>

            {/* Contacts */}
            <div className="grid grid-cols-2 gap-2 text-[11px] mb-4 pb-4 border-b border-stone-200">
              <div className="flex items-center gap-1.5 text-stone-600">
                <Mail className="w-3 h-3 flex-shrink-0" />
                <span className="font-mono truncate">{s.email}</span>
              </div>
              <div className="flex items-center gap-1.5 text-stone-600">
                <Phone className="w-3 h-3 flex-shrink-0" />
                <span className="font-mono">{s.phone}</span>
              </div>
              {s.whatsapp && (
                <div className="flex items-center gap-1.5 col-span-2">
                  <MessageCircle className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                  <a href={`https://wa.me/${s.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noreferrer"
                    className="font-mono text-emerald-700 hover:text-emerald-900 hover:underline">
                    WhatsApp: {s.whatsapp}
                  </a>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-2">
              {[
                { it: "Prodotti",    en: "Products",    val: s.products },
                { it: "Spesa Tot.",  en: "Total Spend", val: fmtEurShort(s.totalSpend) },
                { it: "Consegna",    en: "Lead Time",   val: s.leadTime },
                { it: "Pagamento",   en: "Terms",       val: s.paymentTerms },
              ].map((item) => (
                <div key={item.it}>
                  <div className="text-[9px] uppercase tracking-[0.15em] font-mono text-stone-500">{t(item.it, item.en)}</div>
                  <div className="text-[13px] font-mono font-semibold text-stone-900 mt-0.5 leading-tight">{item.val}</div>
                </div>
              ))}
            </div>

            {/* Last order */}
            <div className="mt-3 pt-3 border-t border-stone-100 flex justify-between text-[11px] text-stone-500 font-mono">
              <span>{t("Ultimo ordine","Last order")}: {s.lastOrder}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
