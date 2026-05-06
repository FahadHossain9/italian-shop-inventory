import React, { useState, useEffect } from "react";
import { Save, Printer } from "lucide-react";
import { Modal, Field, Input, NumInput, Select, Btn, KV } from "../ui.jsx";
import { fmtEur, todayStr, nextId } from "../helpers.js";
import { useLang, tx, BiLabel } from "../lang.jsx";

function printOrdine(po) {
  const html = `<!DOCTYPE html><html lang="it"><head><meta charset="UTF-8"/>
  <title>Ordine ${po.id}</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:'Courier New',monospace;font-size:12px;color:#111;padding:32px 40px;max-width:680px;margin:0 auto}
    .header{border-bottom:2px solid #111;padding-bottom:14px;margin-bottom:20px}
    .shop{font-size:20px;font-weight:bold;letter-spacing:0.05em}
    .sub{font-size:11px;color:#555;margin-top:3px}
    .title{font-size:15px;font-weight:bold;text-transform:uppercase;letter-spacing:0.12em;margin:20px 0 4px}
    .meta{display:grid;grid-template-columns:1fr 1fr;gap:8px 24px;margin:16px 0}
    .kv{display:flex;flex-direction:column;gap:2px}
    .kv-label{font-size:9px;text-transform:uppercase;letter-spacing:0.14em;color:#777}
    .kv-val{font-size:13px;font-weight:bold}
    .divider{border-top:1px solid #ccc;margin:18px 0}
    .total-row{display:flex;justify-content:space-between;font-size:15px;font-weight:bold;margin-top:12px;padding-top:12px;border-top:2px solid #111}
    .status{display:inline-block;padding:2px 10px;border:1px solid #111;font-size:10px;text-transform:uppercase;letter-spacing:0.1em;margin-top:4px}
    .footer{margin-top:40px;font-size:10px;color:#999;text-align:center}
    .sig{margin-top:48px;display:grid;grid-template-columns:1fr 1fr;gap:40px}
    .sig-line{border-top:1px solid #555;padding-top:6px;font-size:10px;color:#666;text-align:center}
    @media print{body{padding:20px}}
  </style></head><body>
  <div class="header">
    <div class="shop">AL BAZAR DI MILANO</div>
    <div class="sub">Via Padova 104 · 20127 Milano · P.IVA 12345678901</div>
  </div>
  <div class="title">Ordine di Acquisto</div>
  <div class="status">${po.status}</div>
  <div class="meta">
    <div class="kv"><span class="kv-label">N° Ordine</span><span class="kv-val">${po.id}</span></div>
    <div class="kv"><span class="kv-label">Data Ordine</span><span class="kv-val">${po.created}</span></div>
    <div class="kv"><span class="kv-label">Fornitore</span><span class="kv-val">${po.supplier}</span></div>
    <div class="kv"><span class="kv-label">Consegna Attesa</span><span class="kv-val">${po.expected || "—"}</span></div>
    <div class="kv"><span class="kv-label">N° Articoli (SKU)</span><span class="kv-val">${po.items}</span></div>
  </div>
  <div class="divider"></div>
  <div class="total-row"><span>Totale Ordine</span><span>${fmtEur(po.total)}</span></div>
  <div class="sig">
    <div class="sig-line">Firma Responsabile Acquisti</div>
    <div class="sig-line">Timbro e Firma Fornitore</div>
  </div>
  <div class="footer">Documento generato da Al Bazar Shop Manager · ${new Date().toLocaleDateString("it-IT")}</div>
  </body></html>`;
  const win = window.open("", "_blank", "width=720,height=900");
  if (win) { win.document.write(html); win.document.close(); win.print(); }
}

const STATUSES = ["bozza", "in attesa", "in transito", "ricevuto", "annullato"];
const BLANK = { id: "", supplier: "", items: 1, total: 0, status: "bozza", created: "", expected: "" };

export default function PurchaseOrderModal({ open, mode, initial, suppliers, purchaseOrders, onClose, onSave }) {
  const { lang } = useLang();
  const t = (it, en) => tx(lang, it, en);
  const isView   = mode === "view";
  const isCreate = mode === "create";
  const [form,   setForm]   = useState(BLANK);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!open) return;
    setErrors({});
    if (isCreate) setForm({ ...BLANK, id: nextId(purchaseOrders || [], "OA-2026"), supplier: suppliers?.[0]?.name || "", created: todayStr() });
    else if (initial) setForm({ ...BLANK, ...initial });
  }, [open, mode, initial]);

  const clrErr = (k) => setErrors((e) => { const n = { ...e }; delete n[k]; return n; });
  const set = (k, v) => { setForm((f) => ({ ...f, [k]: v })); clrErr(k); };

  const submit = (e) => {
    e?.preventDefault?.();
    const errs = {};
    if (!form.supplier.trim())            errs.supplier = t("Fornitore obbligatorio", "Supplier is required");
    if (!+form.items || +form.items < 1)  errs.items    = t("Almeno 1 articolo", "At least 1 item");
    if (+form.total < 0)                  errs.total    = t("Totale non valido", "Invalid total");
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSave({ ...form, items: +form.items || 0, total: +form.total || 0 }, isCreate);
  };

  if (isView) {
    return (
      <Modal open={open} onClose={onClose} title={form.id} eyebrow={form.supplier} size="md"
        footer={
          <>
            <Btn variant="secondary" onClick={() => printOrdine(form)}>
              <Printer className="w-3.5 h-3.5" /> {t("Stampa Ordine","Print Order")}
            </Btn>
            <Btn variant="primary" onClick={onClose}>{t("Chiudi","Close")}</Btn>
          </>
        }>
        <div className="grid grid-cols-2 gap-5">
          <KV label={t("N° Ordine","Order #")} mono>{form.id}</KV>
          <KV label={t("Stato","Status")}>{form.status}</KV>
          <KV label={t("Fornitore","Supplier")}>{form.supplier}</KV>
          <KV label={t("Articoli","Items")} mono>{form.items} SKU</KV>
          <KV label={t("Data Ordine","Order Date")} mono>{form.created}</KV>
          <KV label={t("Consegna Attesa","Expected")} mono>{form.expected || "—"}</KV>
          <KV label={t("Totale","Total")} mono>{fmtEur(form.total)}</KV>
        </div>
      </Modal>
    );
  }

  return (
    <Modal open={open} onClose={onClose}
      title={isCreate ? t("Nuovo Ordine di Acquisto","New Purchase Order") : t("Modifica Ordine","Edit Order")}
      eyebrow={isCreate ? t("Crea","Create") : t("Modifica","Edit")} size="md"
      footer={
        <>
          <Btn variant="secondary" onClick={onClose}>{t("Annulla","Cancel")}</Btn>
          {!isCreate && (
            <Btn variant="secondary" onClick={() => printOrdine(form)}>
              <Printer className="w-3.5 h-3.5" /> {t("Stampa","Print")}
            </Btn>
          )}
          <Btn variant="primary" onClick={submit}><Save className="w-3.5 h-3.5" />{isCreate ? t("Crea Ordine","Create Order") : t("Salva","Save")}</Btn>
        </>
      }
    >
      <form onSubmit={submit} className="grid grid-cols-2 gap-4">
        <Field label={<BiLabel it="N° Ordine" en="Order Number" />} required>
          <Input value={form.id} onChange={(e) => set("id", e.target.value)} disabled={!isCreate} />
        </Field>
        <Field label={<BiLabel it="Stato" en="Status" />}>
          <Select value={form.status} onChange={(e) => set("status", e.target.value)}>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </Select>
        </Field>
        <Field label={<BiLabel it="Fornitore" en="Supplier" />} required error={errors.supplier} className="col-span-2">
          <Select value={form.supplier} onChange={(e) => set("supplier", e.target.value)} error={!!errors.supplier}>
            <option value="">{t("— Seleziona fornitore —","— Select supplier —")}</option>
            {(suppliers || []).map((s) => <option key={s.id} value={s.name}>{s.name}</option>)}
          </Select>
        </Field>
        <Field label={<BiLabel it="N° Articoli (SKU)" en="Item Count (SKU)" />} required error={errors.items}>
          <NumInput min={1} value={form.items} onChange={(e) => set("items", e.target.value)} error={!!errors.items} />
        </Field>
        <Field label={<BiLabel it="Totale (€)" en="Total (€)" />} error={errors.total}>
          <NumInput min={0} step="0.01" value={form.total} onChange={(e) => set("total", e.target.value)} error={!!errors.total} />
        </Field>
        <Field label={<BiLabel it="Data Ordine" en="Order Date" />}>
          <Input type="date" value={form.created} onChange={(e) => set("created", e.target.value)} />
        </Field>
        <Field label={<BiLabel it="Consegna Attesa" en="Expected Delivery" />}>
          <Input type="date" value={form.expected === "—" ? "" : form.expected} onChange={(e) => set("expected", e.target.value)} />
        </Field>
      </form>
    </Modal>
  );
}
