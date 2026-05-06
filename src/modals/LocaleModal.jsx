import React, { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { Modal, Field, Input, NumInput, Select, Btn, KV } from "../ui.jsx";
import { nextId } from "../helpers.js";
import { useLang, tx, BiLabel } from "../lang.jsx";

const TYPES = [
  { value: "scaffale",    it: "Scaffali",    en: "Shelves"     },
  { value: "magazzino",   it: "Magazzino",   en: "Back Storage"},
  { value: "frigo",       it: "Frigo",       en: "Fridge"      },
  { value: "congelatore", it: "Congelatore", en: "Freezer"     },
];
const BLANK = { id: "", name: "", nameEn: "", city: "Milano", address: "Via Padova 104", capacity: 2000, used: 0, products: 0, value: 0, manager: "Rahman Ali", type: "scaffale" };

export default function LocaleModal({ open, mode, initial, locations, onClose, onSave }) {
  const { lang } = useLang();
  const t = (it, en) => tx(lang, it, en);
  const isView   = mode === "view";
  const isCreate = mode === "create";
  const [form,   setForm]   = useState(BLANK);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!open) return;
    setErrors({});
    if (isCreate) setForm({ ...BLANK, id: nextId(locations || [], "WH", 2) });
    else if (initial) setForm({ ...BLANK, ...initial });
  }, [open, mode, initial]);

  const clrErr = (k) => setErrors((e) => { const n = { ...e }; delete n[k]; return n; });
  const set = (k, v) => { setForm((f) => ({ ...f, [k]: v })); clrErr(k); };

  const submit = (e) => {
    e?.preventDefault?.();
    const errs = {};
    if (!form.id.trim())                      errs.id       = t("ID obbligatorio", "ID is required");
    if (!form.name.trim())                    errs.name     = t("Nome obbligatorio", "Name is required");
    if (!+form.capacity || +form.capacity < 1) errs.capacity = t("Capacità deve essere > 0", "Capacity must be > 0");
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSave({ ...form, capacity: +form.capacity || 0, used: +form.used || 0, products: +form.products || 0, value: +form.value || 0 }, isCreate);
  };

  if (isView) {
    const pct = (form.used / Math.max(form.capacity, 1)) * 100;
    return (
      <Modal open={open} onClose={onClose} title={form.name} eyebrow={`${form.id} · ${form.city}`} size="md"
        footer={<Btn variant="primary" onClick={onClose}>{t("Chiudi","Close")}</Btn>}>
        <div className="grid grid-cols-2 gap-5">
          <KV label="ID" mono>{form.id}</KV>
          <KV label={t("Tipo","Type")}>{form.type}</KV>
          <KV label={t("Nome IT","Italian Name")}>{form.name}</KV>
          <KV label={t("Nome EN","English Name")}>{form.nameEn || "—"}</KV>
          <KV label={t("Indirizzo","Address")}>{form.address}, {form.city}</KV>
          <KV label={t("Responsabile","Manager")}>{form.manager}</KV>
          <KV label={t("Capacità","Capacity")} mono>{form.capacity.toLocaleString("it-IT")}</KV>
          <KV label={t("Occupato","Used")} mono>{form.used.toLocaleString("it-IT")}</KV>
          <KV label={t("Utilizzo","Usage")} mono>{pct.toFixed(1)}%</KV>
          <KV label={t("Prodotti","Products")} mono>{form.products}</KV>
        </div>
      </Modal>
    );
  }

  return (
    <Modal open={open} onClose={onClose}
      title={isCreate ? t("Nuovo Locale","New Area") : t("Modifica Locale","Edit Area")}
      eyebrow={isCreate ? t("Aggiungi","Add") : form.id} size="md"
      footer={
        <>
          <Btn variant="secondary" onClick={onClose}>{t("Annulla","Cancel")}</Btn>
          <Btn variant="primary" onClick={submit}><Save className="w-3.5 h-3.5" />{isCreate ? t("Crea","Create") : t("Salva","Save")}</Btn>
        </>
      }
    >
      <form onSubmit={submit} className="grid grid-cols-2 gap-4">
        <Field label={<BiLabel it="ID" en="ID" />} required error={errors.id}>
          <Input value={form.id} onChange={(e) => set("id", e.target.value)} disabled={!isCreate} className="font-mono" error={!!errors.id} />
        </Field>
        <Field label={<BiLabel it="Tipo Locale" en="Area Type" />}>
          <Select value={form.type} onChange={(e) => set("type", e.target.value)}>
            {TYPES.map((tp) => <option key={tp.value} value={tp.value}>{t(tp.it, tp.en)}</option>)}
          </Select>
        </Field>
        <Field label={<BiLabel it="Nome (Italiano)" en="Name (Italian)" />} required error={errors.name} className="col-span-2">
          <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Es. Scaffali Principali" error={!!errors.name} />
        </Field>
        <Field label={<BiLabel it="Nome (Inglese)" en="Name (English)" />} className="col-span-2">
          <Input value={form.nameEn} onChange={(e) => set("nameEn", e.target.value)} placeholder="e.g. Main Shelves" />
        </Field>
        <Field label={<BiLabel it="Indirizzo" en="Address" />}>
          <Input value={form.address} onChange={(e) => set("address", e.target.value)} />
        </Field>
        <Field label={<BiLabel it="Responsabile" en="Manager" />}>
          <Input value={form.manager} onChange={(e) => set("manager", e.target.value)} />
        </Field>
        <Field label={<BiLabel it="Capacità (pz)" en="Capacity (units)" />} required error={errors.capacity}>
          <NumInput min={1} value={form.capacity} onChange={(e) => set("capacity", e.target.value)} error={!!errors.capacity} />
        </Field>
        <Field label={<BiLabel it="Occupato (pz)" en="Used (units)" />}>
          <NumInput min={0} value={form.used} onChange={(e) => set("used", e.target.value)} />
        </Field>
      </form>
    </Modal>
  );
}
