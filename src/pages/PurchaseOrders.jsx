import React from "react";
import { Plus, Eye, Edit3, Trash2, ShoppingCart, DollarSign, Truck, Clock } from "lucide-react";
import { useLang, tx } from "../lang.jsx";
import { StatusPill, KpiCard, IconBtn } from "../ui.jsx";
import { fmtEur, fmtEurShort, fmtDateIT } from "../helpers.js";

const STATUS_TONE = { ricevuto: "ok", "in transito": "accent", "in attesa": "warning", bozza: "info", annullato: "critical" };

export default function PurchaseOrders({ purchaseOrders, onView, onEdit, onCreate, onDelete }) {
  const { lang } = useLang();
  const t = (it, en) => tx(lang, it, en);

  const openOrders  = purchaseOrders.filter((p) => p.status !== "ricevuto" && p.status !== "annullato");
  const inTransit   = purchaseOrders.filter((p) => p.status === "in transito");
  const totalOpen   = openOrders.reduce((s, p) => s + p.total, 0);
  const totalAll    = purchaseOrders.reduce((s, p) => s + p.total, 0);

  return (
    <div className="p-8 bg-[#faf8f3] min-h-full">
      <div className="grid grid-cols-4 gap-4 mb-6">
        <KpiCard label={t("Ordini Aperti","Open Orders")} labelEn={lang==="bilingual"?"Open Orders":undefined}
          value={openOrders.length} delta="" deltaType="flat" sub={t("da ricevere","to receive")} icon={ShoppingCart} accent />
        <KpiCard label={t("Spesa Aperta","Open Spend")} value={fmtEurShort(totalOpen)}
          delta="" deltaType="flat" sub={t("ordini in corso","orders in progress")} icon={DollarSign} />
        <KpiCard label={t("In Transito","In Transit")} value={inTransit.length}
          delta={t("in arrivo","arriving soon")} deltaType="flat" sub={t("consegne attese","expected deliveries")} icon={Truck} />
        <KpiCard label={t("Tempo Medio","Avg Lead Time")} value="2,8gg"
          delta="-0,4gg" deltaType="up" sub={t("ultimi 30 giorni","last 30 days")} icon={Clock} />
      </div>

      <div className="bg-white border border-stone-300">
        <div className="px-6 py-4 border-b border-stone-300 flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-[0.18em] font-mono text-stone-500">{t("Approvvigionamento","Procurement")}</div>
            <h3 className="font-serif text-[20px] text-stone-900 tracking-tight" style={{ fontFamily: "'Fraunces', serif", fontWeight: 400 }}>
              {t("Ordini di Acquisto","Purchase Orders")}
            </h3>
          </div>
          <button onClick={onCreate} className="px-3 py-1.5 text-[12px] bg-stone-900 text-stone-50 hover:bg-stone-700 flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5" /> {t("Nuovo Ordine","New Order")}
          </button>
        </div>

        <table className="w-full">
          <thead className="bg-stone-50 border-b border-stone-300">
            <tr>
              {[t("N° Ordine","Order #"), t("Fornitore","Supplier"), t("Articoli","Items"),
                t("Totale","Total"), t("Data Ordine","Order Date"),
                t("Consegna Attesa","Expected"), t("Stato","Status"), ""].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-[10px] uppercase tracking-[0.15em] font-mono text-stone-600 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {purchaseOrders.length === 0 && (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-[12px] text-stone-500 font-mono">
                {t("Nessun ordine. Clicca \"Nuovo Ordine\" per iniziare.","No orders yet. Click \"New Order\" to start.")}
              </td></tr>
            )}
            {purchaseOrders.map((po) => (
              <tr key={po.id} className="border-b border-stone-100 hover:bg-stone-50/60 group">
                <td className="px-4 py-3 text-[12px] font-mono text-stone-900 font-medium">{po.id}</td>
                <td className="px-4 py-3 text-[13px] text-stone-800 max-w-[180px] truncate">{po.supplier}</td>
                <td className="px-4 py-3 text-[11px] font-mono text-stone-600">{po.items} SKU</td>
                <td className="px-4 py-3 text-[13px] font-mono font-semibold text-stone-900">{fmtEur(po.total)}</td>
                <td className="px-4 py-3 text-[11px] font-mono text-stone-600">{fmtDateIT(po.created)}</td>
                <td className="px-4 py-3 text-[11px] font-mono text-stone-600">{po.expected === "—" ? "—" : fmtDateIT(po.expected)}</td>
                <td className="px-4 py-3"><StatusPill tone={STATUS_TONE[po.status] || "info"}>{po.status}</StatusPill></td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <IconBtn title={t("Visualizza","View")} onClick={() => onView(po)}><Eye className="w-3.5 h-3.5" /></IconBtn>
                    <IconBtn title={t("Modifica","Edit")} tone="accent" onClick={() => onEdit(po)}><Edit3 className="w-3.5 h-3.5" /></IconBtn>
                    <IconBtn title={t("Elimina","Delete")} tone="danger" onClick={() => onDelete(po)}><Trash2 className="w-3.5 h-3.5" /></IconBtn>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-stone-50 border-t border-stone-300">
            <tr>
              <td colSpan={3} className="px-4 py-3 text-[11px] uppercase tracking-wider font-mono text-stone-600">
                {t("Totale tutti gli ordini","Total all orders")}
              </td>
              <td className="px-4 py-3 text-[14px] font-mono font-semibold text-stone-900">{fmtEur(totalAll)}</td>
              <td colSpan={4} />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
