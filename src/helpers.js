// ============================================================================
// Helpers — formatting, stock logic, dates, CSV
// ============================================================================

// ── Euro formatting ──────────────────────────────────────────────────────────
export const fmtEur = (n) =>
  "€ " +
  Number(n || 0).toLocaleString("it-IT", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export const fmtEurShort = (n) => {
  if (n >= 1000) return "€" + (n / 1000).toFixed(1) + "k";
  return "€" + Number(n || 0).toFixed(0);
};

// ── Stock status ─────────────────────────────────────────────────────────────
export const getStockStatus = (p) => {
  if (p.stock === 0) return { label: "esaurito",  labelEn: "out of stock", tone: "critical" };
  if (p.stock < p.reorder) return { label: "scorta bassa", labelEn: "low stock",   tone: "warning"  };
  return { label: "ok", labelEn: "ok", tone: "ok" };
};

// ── Expiry helpers ────────────────────────────────────────────────────────────
export const daysUntilExpiry = (dateStr) => {
  if (!dateStr) return null;
  const diff = new Date(dateStr) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

export const expiryTone = (days) => {
  if (days === null) return null;
  if (days <= 0)  return "critical";
  if (days <= 3)  return "critical";
  if (days <= 7)  return "warning";
  return "ok";
};

// ── Date helpers ──────────────────────────────────────────────────────────────
export const todayStr = () => new Date().toISOString().slice(0, 10);

export const nowStamp = () => {
  const d = new Date();
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
};

// Format date as Italian dd/mm/yyyy for display
export const fmtDateIT = (str) => {
  if (!str || str === "—") return str;
  const [y, m, d] = str.split("-");
  if (!y || !m || !d) return str;
  return `${d}/${m}/${y}`;
};

// ── ID generator ──────────────────────────────────────────────────────────────
export const nextId = (list, prefix, padLen = 4) => {
  const re = new RegExp("^" + prefix.replace("-", "\\-") + "-?(\\d+)$");
  const nums = list
    .map((x) => { const m = re.exec(String(x.id || "")); return m ? parseInt(m[1], 10) : 0; })
    .filter(Boolean);
  const max = nums.length ? Math.max(...nums) : 0;
  return `${prefix}-${String(max + 1).padStart(padLen, "0")}`;
};

// ── CSV export ────────────────────────────────────────────────────────────────
const csvEsc = (v) => {
  const s = String(v ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export const downloadCsv = (filename, headers, rows) => {
  const csv = [headers.join(","), ...rows.map((r) => r.map(csvEsc).join(","))].join("\n");
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" }); // BOM for Excel IT
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

// ── IVA badge color ───────────────────────────────────────────────────────────
export const ivaTone = (rate) => {
  if (rate === 4)  return "bg-emerald-50 text-emerald-800 border-emerald-200";
  if (rate === 10) return "bg-sky-50 text-sky-800 border-sky-200";
  return "bg-stone-100 text-stone-700 border-stone-300";  // 22%
};

// ── Movement delta helper ─────────────────────────────────────────────────────
// Returns signed delta that this movement applies to product stock
export const movementDelta = (type, qty) => {
  if (type === "in")      return  Math.abs(qty);
  if (type === "out")     return -Math.abs(qty);
  if (type === "scaduto") return -Math.abs(qty);
  if (type === "adjust")  return  qty; // signed
  return 0; // transfer: net-zero
};
