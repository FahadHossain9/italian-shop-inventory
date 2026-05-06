import React, { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { Modal, Field, Input, NumInput, Select, Btn, KV } from "../ui.jsx";
import { fmtEur, todayStr, nextId } from "../helpers.js";
import { useLang, tx, BiLabel } from "../lang.jsx";

const STATUSES = ["bozza", "in attesa", "in transito", "ricevuto", "annullato"];
const BLANK = { id: "", supplier: "", items: 1, total: 0, status: "bozza", created: "", expected: "" };

export default function PurchaseOrderModal({ open, mode, initial, suppliers, purchaseOrders, onClose, onSave }) {
  const { lang } = useLang();
  const t = (it, en) => tx(lang, it, en);
  const isView   = mode === "view";
  const isCreate = mode === "create";
  const [form, setForm] = useState(BLANK);

  useEffect(() => {
    if (!open) return;
    if (isCreate) setForm({ ...BLANK, id: nextId(purchaseOrders || [], "OA-2026"), supplier: suppliers?.[0]?.name || "", created: todayStr() });
    else if (initial) setForm({ ...BLANK, ...initial });
  }, [open, mode, initial]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const submit = (e) => {
    e?.preventDefault?.();
    if (!form.supplier.trim()) return alert(t("Seleziona il fornitore.","Select a supplier."));
    onSave({ ...form, items: +form.items || 0, total: +form.total || 0 }, isCreate);
  };

  if (isView) {
    return (
      <Modal open={open} onClose={onClose} title={form.id} eyebrow={form.supplier} size="md"
        footer={<Btn variant="primary" onClick={onClose}>{t("Chiudi","Close")}</Btn>}>
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
        <Field label={<BiLabel it="Fornitore" en="Supplier" />} required className="col-span-2">
          <Select value={form.supplier} onChange={(e) => set("supplier", e.target.value)}>
            <option value="">{t("— Seleziona fornitore —","— Select supplier —")}</option>
            {(suppliers || []).map((s) => <option key={s.id} value={s.name}>{s.name}</option>)}
          </Select>
        </Field>
        <Field label={<BiLabel it="N° Articoli (SKU)" en="Item Count (SKU)" />}>
          <NumInput min={1} value={form.items} onChange={(e) => set("items", e.target.value)} />
        </Field>
        <Field label={<BiLabel it="Totale (€)" en="Total (€)" />}>
          <NumInput min={0} step="0.01" value={form.total} onChange={(e) => set("total", e.target.value)} />
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
