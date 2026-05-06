import React, { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { Modal, Field, Input, NumInput, Btn, KV } from "../ui.jsx";
import { todayStr, nextId } from "../helpers.js";
import { useLang, tx, BiLabel } from "../lang.jsx";

const BLANK = { id: "", name: "", contact: "", email: "", phone: "", whatsapp: "", city: "", piva: "", products: 0, totalSpend: 0, rating: 4.5, leadTime: "", lastOrder: "", paymentTerms: "" };

export default function SupplierModal({ open, mode, initial, suppliers, onClose, onSave }) {
  const { lang } = useLang();
  const t = (it, en) => tx(lang, it, en);
  const isView   = mode === "view";
  const isCreate = mode === "create";
  const [form,   setForm]   = useState(BLANK);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!open) return;
    setErrors({});
    if (isCreate) setForm({ ...BLANK, id: nextId(suppliers || [], "SUP", 2), lastOrder: todayStr() });
    else if (initial) setForm({ ...BLANK, ...initial });
  }, [open, mode, initial]);

  const clrErr = (k) => setErrors((e) => { const n = { ...e }; delete n[k]; return n; });
  const set = (k, v) => { setForm((f) => ({ ...f, [k]: v })); clrErr(k); };

  const submit = (e) => {
    e?.preventDefault?.();
    const errs = {};
    if (!form.id.trim())   errs.id   = t("ID obbligatorio", "ID is required");
    if (!form.name.trim()) errs.name = t("Ragione sociale obbligatoria", "Company name is required");
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSave({ ...form, products: +form.products || 0, totalSpend: +form.totalSpend || 0, rating: +form.rating || 0 }, isCreate);
  };

  if (isView) {
    return (
      <Modal open={open} onClose={onClose} title={form.name} eyebrow={`${form.id} · ${form.city}`} size="lg"
        footer={<Btn variant="primary" onClick={onClose}>{t("Chiudi","Close")}</Btn>}>
        <div className="grid grid-cols-3 gap-5">
          <KV label="ID" mono>{form.id}</KV>
          <KV label={t("Città","City")}>{form.city}</KV>
          <KV label="P.IVA" mono>{form.piva || "—"}</KV>
          <KV label={t("Contatto","Contact")}>{form.contact}</KV>
          <KV label="Email" mono>{form.email}</KV>
          <KV label="Telefono" mono>{form.phone}</KV>
          <KV label="WhatsApp" mono>{form.whatsapp || "—"}</KV>
          <KV label={t("Prodotti","Products")} mono>{form.products}</KV>
          <KV label={t("Valutazione","Rating")} mono>{form.rating} / 5</KV>
          <KV label={t("Tempi Consegna","Lead Time")}>{form.leadTime}</KV>
          <KV label={t("Termini Pagamento","Payment Terms")}>{form.paymentTerms}</KV>
          <KV label={t("Ultimo Ordine","Last Order")} mono>{form.lastOrder}</KV>
        </div>
      </Modal>
    );
  }

  return (
    <Modal open={open} onClose={onClose}
      title={isCreate ? t("Nuovo Fornitore","New Supplier") : t("Modifica Fornitore","Edit Supplier")}
      eyebrow={isCreate ? t("Aggiungi","Add") : form.id} size="lg"
      footer={
        <>
          <Btn variant="secondary" onClick={onClose}>{t("Annulla","Cancel")}</Btn>
          <Btn variant="primary" onClick={submit}><Save className="w-3.5 h-3.5" />{isCreate ? t("Crea Fornitore","Create Supplier") : t("Salva","Save")}</Btn>
        </>
      }
    >
      <form onSubmit={submit} className="grid grid-cols-2 gap-4">
        <Field label={<BiLabel it="ID Fornitore" en="Supplier ID" />} required error={errors.id}>
          <Input value={form.id} onChange={(e) => set("id", e.target.value)} disabled={!isCreate} error={!!errors.id} />
        </Field>
        <Field label={<BiLabel it="Città" en="City" />}>
          <Input value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="Milano" />
        </Field>
        <Field label={<BiLabel it="Ragione Sociale" en="Company Name" />} required error={errors.name} className="col-span-2">
          <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Es. Milano Ingrosso Alimentari S.r.l." error={!!errors.name} />
        </Field>
        <Field label={<BiLabel it="Persona di Contatto" en="Contact Person" />}>
          <Input value={form.contact} onChange={(e) => set("contact", e.target.value)} />
        </Field>
        <Field label="Partita IVA (P.IVA)">
          <Input value={form.piva} onChange={(e) => set("piva", e.target.value)} placeholder="IT00000000000" className="font-mono" />
        </Field>
        <Field label="Email">
          <Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
        </Field>
        <Field label={<BiLabel it="Telefono" en="Phone" />}>
          <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+39 02 1234 5678" className="font-mono" />
        </Field>
        <Field label="WhatsApp" hint={t("Opzionale — per ordini rapidi","Optional — for quick orders")}>
          <Input value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} placeholder="+39 333 1234 567" className="font-mono" />
        </Field>
        <Field label={<BiLabel it="Tempi di Consegna" en="Lead Time" />}>
          <Input value={form.leadTime} onChange={(e) => set("leadTime", e.target.value)} placeholder="Es. 2–3 giorni" />
        </Field>
        <Field label={<BiLabel it="Termini di Pagamento" en="Payment Terms" />}>
          <Input value={form.paymentTerms} onChange={(e) => set("paymentTerms", e.target.value)} placeholder="Es. 30 giorni, Contanti" />
        </Field>
        <Field label={<BiLabel it="N° Prodotti Forniti" en="Products Supplied" />}>
          <NumInput min={0} value={form.products} onChange={(e) => set("products", e.target.value)} />
        </Field>
        <Field label={<BiLabel it="Valutazione (0–5)" en="Rating (0–5)" />}>
          <NumInput min={0} max={5} step="0.1" value={form.rating} onChange={(e) => set("rating", e.target.value)} />
        </Field>
      </form>
    </Modal>
  );
}
