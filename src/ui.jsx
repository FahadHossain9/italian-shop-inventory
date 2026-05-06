import React, { useEffect } from "react";
import { X, ArrowUpRight, ArrowDownRight } from "lucide-react";

// ── Tone map ──────────────────────────────────────────────────────────────────
const TONES = {
  ok:       "bg-emerald-50 text-emerald-800 border-emerald-200",
  warning:  "bg-amber-50 text-amber-900 border-amber-300",
  critical: "bg-rose-50 text-rose-800 border-rose-200",
  info:     "bg-stone-100 text-stone-700 border-stone-200",
  accent:   "bg-[#fbf3df] text-[#7a5a1a] border-[#e6d2a4]",
  blue:     "bg-sky-50 text-sky-800 border-sky-200",
};

const DOTS = {
  ok:       "bg-emerald-500",
  warning:  "bg-amber-500",
  critical: "bg-rose-500",
  info:     "bg-stone-400",
  accent:   "bg-[#d4a437]",
  blue:     "bg-sky-500",
};

// ── StatusPill — with live dot indicator ──────────────────────────────────────
export const StatusPill = ({ tone, children }) => (
  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] uppercase tracking-[0.1em] font-mono border ${TONES[tone] || TONES.info}`}>
    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${DOTS[tone] || "bg-stone-400"}`} />
    {children}
  </span>
);

// ── SectionLabel ───────────────────────────────────────────────────────────────
export const SectionLabel = ({ children, accessory }) => (
  <div className="flex items-end justify-between mb-4 pb-3 border-b border-stone-200">
    <h3 className="text-[10px] uppercase tracking-[0.22em] font-mono text-stone-500 font-semibold">{children}</h3>
    {accessory}
  </div>
);

// ── Modal ──────────────────────────────────────────────────────────────────────
export const Modal = ({ open, onClose, title, eyebrow, size = "md", children, footer }) => {
  useEffect(() => {
    if (!open) return;
    const onEsc = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onEsc);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onEsc); document.body.style.overflow = prev; };
  }, [open, onClose]);
  if (!open) return null;
  const widths = { sm: "max-w-md", md: "max-w-2xl", lg: "max-w-4xl", xl: "max-w-5xl" };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-sm"
      onMouseDown={onClose}>
      <div className={`bg-white w-full ${widths[size]} max-h-[92vh] flex flex-col shadow-2xl border border-stone-200`}
        onMouseDown={(e) => e.stopPropagation()}
        style={{ boxShadow: "0 25px 60px rgba(0,0,0,0.18), 0 10px 20px rgba(0,0,0,0.1)" }}>
        <header className="px-6 py-5 border-b border-stone-200 flex items-start justify-between gap-4 bg-white">
          <div>
            {eyebrow && (
              <div className="text-[10px] uppercase tracking-[0.22em] font-mono text-stone-500 mb-1">{eyebrow}</div>
            )}
            <h2 className="font-serif text-[24px] text-stone-900 tracking-tight leading-tight"
              style={{ fontFamily: "'Fraunces', serif", fontWeight: 400 }}>{title}</h2>
          </div>
          <button onClick={onClose}
            className="p-1.5 hover:bg-stone-100 rounded-sm -mr-1.5 -mt-1.5 transition-colors" aria-label="Chiudi">
            <X className="w-4 h-4 text-stone-500" />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
        {footer && (
          <footer className="px-6 py-4 border-t border-stone-200 bg-stone-50/80 flex justify-end gap-2">
            {footer}
          </footer>
        )}
      </div>
    </div>
  );
};

// ── Form atoms ─────────────────────────────────────────────────────────────────
export const Field = ({ label, children, hint, required, className = "" }) => (
  <label className={`block ${className}`}>
    <span className="text-[10px] uppercase tracking-[0.18em] font-mono text-stone-600 font-semibold block mb-1.5 leading-snug">
      {label}{required && <span className="text-rose-500 ml-1">*</span>}
    </span>
    {children}
    {hint && <span className="text-[11px] text-stone-400 mt-1.5 block leading-relaxed">{hint}</span>}
  </label>
);

const inputCls = "w-full px-3 py-2.5 text-[13px] border border-stone-300 bg-white focus:outline-none focus:border-stone-800 focus:ring-2 focus:ring-stone-800/10 font-sans transition-colors disabled:bg-stone-50 disabled:text-stone-500";

export const Input    = ({ className = "", ...rest }) => <input    {...rest} className={`${inputCls} ${className}`} />;
export const NumInput = ({ className = "", ...rest }) => <input type="number" {...rest} className={`${inputCls} font-mono ${className}`} />;
export const Textarea = ({ className = "", rows = 3, ...rest }) => <textarea rows={rows} {...rest} className={`${inputCls} ${className}`} />;
export const Select   = ({ className = "", children, ...rest }) => <select  {...rest} className={`${inputCls} ${className}`}>{children}</select>;

// ── Buttons ────────────────────────────────────────────────────────────────────
const BTN_STYLES = {
  primary:   "bg-stone-900 text-stone-50 hover:bg-stone-700 border border-stone-900 shadow-sm hover:shadow-md",
  secondary: "border border-stone-300 bg-white text-stone-700 hover:bg-stone-50 hover:border-stone-400 shadow-sm",
  danger:    "border border-rose-300 bg-rose-50 text-rose-800 hover:bg-rose-100 shadow-sm",
  accent:    "bg-[#d4a437] text-stone-900 hover:bg-[#b8862f] border border-[#d4a437] shadow-sm hover:shadow-md",
};
export const Btn = ({ variant = "primary", className = "", children, ...rest }) => (
  <button {...rest} className={`px-3.5 py-2 text-[12px] font-semibold inline-flex items-center gap-1.5 transition-all ${BTN_STYLES[variant]} ${className}`}>
    {children}
  </button>
);

export const IconBtn = ({ tone = "neutral", title, onClick, children }) => {
  const t = {
    neutral: "hover:bg-stone-100 text-stone-500 hover:text-stone-800",
    danger:  "hover:bg-rose-50 hover:text-rose-700 text-stone-500",
    accent:  "hover:bg-[#fbf3df] hover:text-[#7a5a1a] text-stone-500",
  };
  return (
    <button onClick={onClick} title={title}
      className={`p-1.5 transition-all ${t[tone]}`} type="button">
      {children}
    </button>
  );
};

// ── Confirm dialog ─────────────────────────────────────────────────────────────
export const Confirm = ({ open, onClose, onConfirm, title, message, confirmLabel = "Elimina", danger = false }) => (
  <Modal open={open} onClose={onClose} title={title || "Conferma"} eyebrow={danger ? "⚠ Azione irreversibile" : "Conferma"} size="sm"
    footer={
      <>
        <Btn variant="secondary" onClick={onClose}>Annulla / Cancel</Btn>
        <Btn variant={danger ? "danger" : "primary"} onClick={onConfirm}>{confirmLabel}</Btn>
      </>
    }
  >
    <p className="text-[13px] text-stone-700 leading-relaxed">{message}</p>
  </Modal>
);

// ── Toast ──────────────────────────────────────────────────────────────────────
export const Toast = ({ toast }) => {
  if (!toast) return null;
  const styles = {
    ok:      "bg-stone-900 text-stone-50 border-stone-800",
    danger:  "bg-rose-600 text-white border-rose-700",
    warning: "bg-amber-500 text-stone-900 border-amber-600",
    info:    "bg-stone-900 text-stone-50 border-stone-800",
  };
  return (
    <div className="fixed bottom-6 right-6 z-[60] pointer-events-none">
      <div className={`px-5 py-3 text-[13px] font-medium border shadow-xl animate-fade-in ${styles[toast.tone] || styles.info}`}
        style={{ boxShadow: "0 8px 30px rgba(0,0,0,0.25)" }}>
        {toast.msg}
      </div>
    </div>
  );
};

// ── KV pair ────────────────────────────────────────────────────────────────────
export const KV = ({ label, children, mono }) => (
  <div>
    <div className="text-[10px] uppercase tracking-[0.18em] font-mono text-stone-400 font-semibold">{label}</div>
    <div className={`text-[13px] text-stone-900 mt-1.5 leading-snug ${mono ? "font-mono" : ""}`}>{children ?? "—"}</div>
  </div>
);

// ── KpiCard — redesigned with accent bar + shadow + colored delta ──────────────
export const KpiCard = ({ label, labelEn, value, delta, deltaType, sub, icon: Icon, accent }) => (
  <div className="bg-white border border-stone-200 shadow-sm hover:shadow-md transition-all duration-200 p-5 relative overflow-hidden group cursor-default"
    style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)" }}>
    {/* Left accent bar */}
    {accent && <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#d4a437]" />}
    {/* Ghost icon */}
    <div className="absolute -right-3 -bottom-3 opacity-[0.04] group-hover:opacity-[0.08] transition-opacity duration-300 pointer-events-none">
      {Icon && <Icon className="w-32 h-32" strokeWidth={0.75} />}
    </div>
    <div className={accent ? "pl-3" : ""}>
      <div className="text-[10px] uppercase tracking-[0.2em] font-mono text-stone-500 font-semibold">{label}</div>
      {labelEn && <div className="text-[9px] font-mono text-stone-400 mt-0.5">{labelEn}</div>}
      <div className="font-serif text-[40px] leading-none tracking-tight text-stone-900 mt-3 mb-3"
        style={{ fontFamily: "'Fraunces', serif", fontWeight: 400 }}>
        {value}
      </div>
      <div className="flex items-center gap-2">
        {delta && (
          <span className={`inline-flex items-center gap-0.5 text-[10px] font-mono font-bold px-2 py-0.5 border ${
            deltaType === "up"
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : deltaType === "down"
              ? "bg-rose-50 text-rose-700 border-rose-200"
              : "bg-stone-100 text-stone-500 border-stone-200"
          }`}>
            {deltaType === "up"   && <ArrowUpRight   className="w-3 h-3" strokeWidth={2.5} />}
            {deltaType === "down" && <ArrowDownRight className="w-3 h-3" strokeWidth={2.5} />}
            {delta}
          </span>
        )}
        {sub && <span className="text-[11px] text-stone-400 leading-tight">{sub}</span>}
      </div>
    </div>
  </div>
);

// ── Empty state ────────────────────────────────────────────────────────────────
export const Empty = ({ icon: Icon, it, en }) => (
  <div className="bg-white border border-stone-200 shadow-sm p-16 text-center">
    {Icon && (
      <div className="w-14 h-14 bg-stone-100 flex items-center justify-center mx-auto mb-4">
        <Icon className="w-7 h-7 text-stone-400" strokeWidth={1.25} />
      </div>
    )}
    <div className="text-[15px] text-stone-700 font-medium">{it}</div>
    <div className="text-[12px] text-stone-400 mt-1.5 font-mono">{en}</div>
  </div>
);
