import React, { useState } from "react";
import {
  BookOpen, Zap, Calendar, Grid, ChevronDown, ChevronRight,
  ArrowRight, Package, ArrowLeftRight, ShoppingBag, Truck,
  BarChart3, Settings, MapPin, ShoppingCart, CheckCircle, AlertTriangle,
  LayoutDashboard,
} from "lucide-react";
import { useLang, tx } from "../lang.jsx";

// ─────────────────────────────────────────────────────────────────────────────
// SVG ILLUSTRATIONS
// ─────────────────────────────────────────────────────────────────────────────

const IlluProducts = () => (
  <svg viewBox="0 0 240 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <rect width="240" height="180" fill="#f8f4ef" />
    {/* Shelf back panel */}
    <rect x="18" y="14" width="130" height="148" rx="3" fill="white" stroke="#e8e0d5" strokeWidth="1.5" />
    {/* Shelf dividers */}
    <rect x="18" y="62" width="130" height="2.5" fill="#e8e0d5" />
    <rect x="18" y="110" width="130" height="2.5" fill="#e8e0d5" />
    {/* Bottom base */}
    <rect x="14" y="158" width="138" height="6" rx="2" fill="#e8e0d5" />
    {/* Products — top shelf */}
    <rect x="26" y="20" width="22" height="38" rx="2" fill="#d4a437" opacity="0.9" />
    <rect x="52" y="24" width="17" height="34" rx="2" fill="#1a1a1a" opacity="0.75" />
    <rect x="73" y="20" width="24" height="38" rx="2" fill="#6b5d4f" opacity="0.65" />
    <rect x="101" y="23" width="18" height="35" rx="2" fill="#2d6a4f" opacity="0.7" />
    {/* Products — mid shelf */}
    <rect x="26" y="68" width="20" height="36" rx="2" fill="#1a1a1a" opacity="0.55" />
    <rect x="50" y="70" width="26" height="34" rx="2" fill="#d4a437" opacity="0.55" />
    <rect x="80" y="67" width="18" height="37" rx="2" fill="#6b5d4f" opacity="0.75" />
    <rect x="102" y="69" width="20" height="35" rx="2" fill="#c9b8a4" opacity="0.9" />
    {/* Products — bottom shelf */}
    <rect x="28" y="116" width="24" height="34" rx="2" fill="#d4a437" opacity="0.4" />
    <rect x="56" y="118" width="19" height="32" rx="2" fill="#1a1a1a" opacity="0.35" />
    <rect x="79" y="115" width="22" height="35" rx="2" fill="#6b5d4f" opacity="0.45" />
    {/* Floating product card */}
    <rect x="162" y="30" width="64" height="80" rx="5" fill="white" stroke="#d4a437" strokeWidth="1.5"
      style={{ filter: "drop-shadow(0 6px 18px rgba(0,0,0,0.12))" }} />
    {/* Card product icon area */}
    <rect x="170" y="38" width="48" height="30" rx="3" fill="#f8f4ef" />
    <rect x="181" y="44" width="14" height="18" rx="2" fill="#d4a437" opacity="0.7" />
    <rect x="197" y="47" width="10" height="15" rx="2" fill="#1a1a1a" opacity="0.5" />
    {/* Card text lines */}
    <rect x="170" y="74" width="40" height="5" rx="2.5" fill="#1a1a1a" opacity="0.8" />
    <rect x="170" y="83" width="28" height="4" rx="2" fill="#e8e0d5" />
    {/* Price */}
    <rect x="170" y="98" width="22" height="6" rx="3" fill="#d4a437" opacity="0.25" />
    <text x="172" y="104" fontSize="6" fill="#b8862f" fontFamily="monospace" fontWeight="700">€ 2,49</text>
    {/* Plus badge */}
    <circle cx="218" cy="36" r="12" fill="#1a1a1a" />
    <line x1="218" y1="30" x2="218" y2="42" stroke="white" strokeWidth="2" strokeLinecap="round" />
    <line x1="212" y1="36" x2="224" y2="36" stroke="white" strokeWidth="2" strokeLinecap="round" />
    {/* SKU label at top */}
    <rect x="26" y="153" width="45" height="10" rx="2" fill="#f8f4ef" stroke="#e8e0d5" strokeWidth="1" />
    <text x="28" y="161" fontSize="6" fill="#9ca3af" fontFamily="monospace">SKU-1001</text>
  </svg>
);

const IlluMovement = () => (
  <svg viewBox="0 0 240 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <rect width="240" height="180" fill="#f8f4ef" />
    {/* Road / ground line */}
    <rect x="0" y="130" width="240" height="50" fill="#f0ebe3" />
    <rect x="0" y="128" width="240" height="3" fill="#e8e0d5" />
    {/* Dashed center line */}
    {[0,1,2,3,4,5].map(i => (
      <rect key={i} x={10 + i * 40} y="132" width="20" height="2" rx="1" fill="#d4a437" opacity="0.4" />
    ))}
    {/* TRUCK BODY */}
    <rect x="12" y="88" width="85" height="42" rx="3" fill="#1a1a1a" />
    {/* Truck cab */}
    <rect x="82" y="98" width="28" height="32" rx="2" fill="#2d2d2d" />
    {/* Windshield */}
    <rect x="85" y="101" width="22" height="14" rx="2" fill="#bfdbfe" opacity="0.8" />
    {/* Wheels */}
    <circle cx="38" cy="133" r="10" fill="#1a1a1a" />
    <circle cx="38" cy="133" r="5" fill="#6b7280" />
    <circle cx="87" cy="133" r="10" fill="#1a1a1a" />
    <circle cx="87" cy="133" r="5" fill="#6b7280" />
    {/* Truck text */}
    <text x="26" y="114" fontSize="9" fill="white" fontFamily="monospace" fontWeight="600" opacity="0.9">DDT</text>
    <text x="22" y="124" fontSize="7" fill="#d4a437" fontFamily="monospace">2026-05-06</text>
    {/* Arrow */}
    <line x1="118" y1="105" x2="148" y2="105" stroke="#d4a437" strokeWidth="2.5" strokeLinecap="round" />
    <polyline points="143,99 150,105 143,111" stroke="#d4a437" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    {/* Warehouse shelf */}
    <rect x="155" y="60" width="72" height="70" rx="3" fill="white" stroke="#e8e0d5" strokeWidth="1.5" />
    <rect x="155" y="90" width="72" height="2" fill="#e8e0d5" />
    <rect x="151" y="125" width="80" height="6" rx="2" fill="#e8e0d5" />
    {/* Boxes on shelf */}
    <rect x="162" y="66" width="18" height="20" rx="2" fill="#d4a437" opacity="0.7" />
    <rect x="183" y="68" width="15" height="18" rx="2" fill="#1a1a1a" opacity="0.5" />
    <rect x="202" y="65" width="17" height="21" rx="2" fill="#6b5d4f" opacity="0.6" />
    <rect x="162" y="96" width="22" height="24" rx="2" fill="#2d6a4f" opacity="0.6" />
    <rect x="188" y="97" width="16" height="23" rx="2" fill="#d4a437" opacity="0.4" />
    {/* New box being added glow */}
    <rect x="153" y="58" width="20" height="24" rx="2" fill="#d4a437" opacity="0.2"
      stroke="#d4a437" strokeWidth="1.5" strokeDasharray="3,2" />
    <text x="156" y="73" fontSize="7" fill="#d4a437" fontFamily="monospace">NEW</text>
    {/* Checkmark badge */}
    <circle cx="215" cy="68" r="12" fill="#059669" />
    <polyline points="209,68 213,72 221,64" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

const IlluSale = () => (
  <svg viewBox="0 0 240 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <rect width="240" height="180" fill="#f8f4ef" />
    {/* Customer silhouette */}
    <circle cx="32" cy="55" r="18" fill="#e8e0d5" />
    <circle cx="32" cy="48" r="8" fill="#c9b8a4" />
    <path d="M16 72 Q32 62 48 72" fill="#c9b8a4" />
    {/* Shopping basket */}
    <rect x="18" y="80" width="28" height="22" rx="3" fill="#1a1a1a" opacity="0.8" />
    <path d="M22 80 Q32 68 42 80" stroke="#1a1a1a" strokeWidth="2" fill="none" strokeLinecap="round" />
    {/* Items in basket */}
    <rect x="21" y="86" width="7" height="10" rx="1" fill="#d4a437" opacity="0.9" />
    <rect x="30" y="86" width="6" height="10" rx="1" fill="white" opacity="0.8" />
    <rect x="38" y="86" width="6" height="10" rx="1" fill="#d4a437" opacity="0.5" />
    {/* Arrow */}
    <line x1="60" y1="100" x2="92" y2="100" stroke="#d4a437" strokeWidth="2.5" strokeLinecap="round" />
    <polyline points="87,94 94,100 87,106" stroke="#d4a437" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    {/* Cash register / POS terminal */}
    <rect x="100" y="70" width="50" height="65" rx="4" fill="white" stroke="#e8e0d5" strokeWidth="1.5"
      style={{ filter: "drop-shadow(0 4px 14px rgba(0,0,0,0.1))" }} />
    <rect x="106" y="76" width="38" height="24" rx="3" fill="#1a1a1a" />
    <text x="125" y="90" textAnchor="middle" fontSize="9" fill="#d4a437" fontFamily="monospace" fontWeight="700">€ 12,45</text>
    <text x="125" y="99" textAnchor="middle" fontSize="6" fill="#9ca3af" fontFamily="monospace">TOTALE</text>
    {/* Keypad dots */}
    {[0,1,2,3,4,5,6,7,8].map(i => (
      <circle key={i} cx={112 + (i % 3) * 13} cy={113 + Math.floor(i / 3) * 8} r="2.5" fill="#e8e0d5" />
    ))}
    {/* Contante button */}
    <rect x="106" y="126" width="38" height="6" rx="3" fill="#059669" opacity="0.2" />
    <text x="125" y="131" textAnchor="middle" fontSize="6" fill="#059669" fontFamily="monospace" fontWeight="600">CONTANTE</text>
    {/* Receipt emerging */}
    <rect x="117" y="132" width="16" height="32" rx="1" fill="white" stroke="#e8e0d5" strokeWidth="1"
      style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.08))" }} />
    {[0,1,2,3,4].map(i => (
      <rect key={i} x="119" y={136 + i * 5} width={i % 2 === 0 ? 12 : 8} height="2" rx="1" fill="#e8e0d5" />
    ))}
    {/* Channel badges */}
    <rect x="166" y="80" width="60" height="18" rx="9" fill="#ecfdf5" stroke="#a7f3d0" strokeWidth="1" />
    <text x="196" y="93" textAnchor="middle" fontSize="8" fill="#059669" fontFamily="monospace" fontWeight="600">Contante</text>
    <rect x="166" y="104" width="60" height="18" rx="9" fill="#eff6ff" stroke="#bfdbfe" strokeWidth="1" />
    <text x="196" y="117" textAnchor="middle" fontSize="8" fill="#2563eb" fontFamily="monospace" fontWeight="600">POS/Carta</text>
    <rect x="166" y="128" width="60" height="18" rx="9" fill="#fdf4ff" stroke="#e9d5ff" strokeWidth="1" />
    <text x="196" y="141" textAnchor="middle" fontSize="8" fill="#7c3aed" fontFamily="monospace" fontWeight="600">Buoni Pasto</text>
    <rect x="166" y="152" width="60" height="18" rx="9" fill="#fff1f2" stroke="#fecdd3" strokeWidth="1" />
    <text x="196" y="165" textAnchor="middle" fontSize="8" fill="#e11d48" fontFamily="monospace" fontWeight="600">Satispay</text>
  </svg>
);

const IlluSupplier = () => (
  <svg viewBox="0 0 240 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <rect width="240" height="180" fill="#f8f4ef" />
    {/* Business card */}
    <rect x="20" y="30" width="135" height="90" rx="6" fill="white" stroke="#e8e0d5" strokeWidth="1.5"
      style={{ filter: "drop-shadow(0 4px 16px rgba(0,0,0,0.1))" }} />
    {/* Card header strip */}
    <rect x="20" y="30" width="135" height="26" rx="6" fill="#1a1a1a" />
    <rect x="20" y="44" width="135" height="12" fill="#1a1a1a" />
    <text x="32" y="48" fontSize="9" fill="white" fontFamily="monospace" fontWeight="600">Milano Ingrosso Alim.</text>
    <text x="32" y="57" fontSize="7" fill="#d4a437" fontFamily="monospace">SUP-01 · Milano</text>
    {/* Contact info */}
    <circle cx="38" cy="78" r="10" fill="#f8f4ef" />
    <circle cx="38" cy="74" r="4" fill="#c9b8a4" />
    <path d="M29 86 Q38 81 47 86" fill="#c9b8a4" />
    <rect x="52" y="70" width="90" height="5" rx="2.5" fill="#1a1a1a" opacity="0.7" />
    <rect x="52" y="79" width="65" height="4" rx="2" fill="#e8e0d5" />
    <rect x="52" y="87" width="78" height="4" rx="2" fill="#e8e0d5" />
    {/* Star rating */}
    {[0,1,2,3,4].map(i => (
      <polygon key={i}
        points={`${32 + i * 16},104 ${34 + i * 16},110 ${40 + i * 16},110 ${35.5 + i * 16},114 ${37.5 + i * 16},120 ${32 + i * 16},116 ${26.5 + i * 16},120 ${28.5 + i * 16},114 ${24 + i * 16},110 ${30 + i * 16},110`}
        fill={i < 4 ? "#d4a437" : "#e8e0d5"} transform={`scale(0.55) translate(${-i * 8}, 80)`} />
    ))}
    {/* Stars drawn simply */}
    {[0,1,2,3].map(i => (
      <circle key={i} cx={30 + i * 14} cy="112" r="5" fill="#d4a437" opacity="0.9" />
    ))}
    <circle cx={86} cy="112" r="5" fill="#e8e0d5" />
    <text x="98" y="116" fontSize="8" fill="#6b7280" fontFamily="monospace">4.7 / 5</text>
    {/* WhatsApp chat bubble */}
    <rect x="168" y="30" width="58" height="50" rx="8" fill="#25d366"
      style={{ filter: "drop-shadow(0 4px 12px rgba(37,211,102,0.3))" }} />
    <rect x="168" y="70" width="16" height="10" rx="2" fill="#25d366" />
    <text x="197" y="52" textAnchor="middle" fontSize="16" fill="white">💬</text>
    <text x="197" y="68" textAnchor="middle" fontSize="7" fill="white" fontFamily="monospace" fontWeight="600">WhatsApp</text>
    <text x="197" y="76" textAnchor="middle" fontSize="6" fill="rgba(255,255,255,0.8)" fontFamily="monospace">ordine rapido</text>
    {/* Lead time badge */}
    <rect x="168" y="95" width="58" height="24" rx="4" fill="white" stroke="#e8e0d5" strokeWidth="1" />
    <text x="197" y="106" textAnchor="middle" fontSize="7" fill="#6b7280" fontFamily="monospace">Consegna</text>
    <text x="197" y="115" textAnchor="middle" fontSize="8" fill="#1a1a1a" fontFamily="monospace" fontWeight="700">2–3 giorni</text>
    {/* Delivery truck icon */}
    <rect x="168" y="130" width="58" height="38" rx="4" fill="white" stroke="#e8e0d5" strokeWidth="1" />
    <rect x="174" y="137" width="30" height="18" rx="2" fill="#1a1a1a" opacity="0.7" />
    <rect x="200" y="141" width="16" height="14" rx="1" fill="#2d2d2d" opacity="0.6" />
    <circle cx="181" cy="158" r="5" fill="#1a1a1a" opacity="0.6" />
    <circle cx="210" cy="158" r="5" fill="#1a1a1a" opacity="0.6" />
    <text x="187" y="144" fontSize="6" fill="white" fontFamily="monospace">DDT</text>
  </svg>
);

const IlluReports = () => (
  <svg viewBox="0 0 240 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <rect width="240" height="180" fill="#f8f4ef" />
    {/* Chart background card */}
    <rect x="14" y="20" width="212" height="140" rx="6" fill="white" stroke="#e8e0d5" strokeWidth="1.5"
      style={{ filter: "drop-shadow(0 4px 14px rgba(0,0,0,0.08))" }} />
    {/* Y-axis gridlines */}
    {[0,1,2,3].map(i => (
      <line key={i} x1="50" y1={50 + i * 28} x2="216" y2={50 + i * 28}
        stroke="#f0ebe3" strokeWidth="1" strokeDasharray="4,3" />
    ))}
    {/* Y-axis labels */}
    {["€9k","€6k","€3k","€0"].map((label, i) => (
      <text key={i} x="44" y={54 + i * 28} textAnchor="end" fontSize="8" fill="#9ca3af" fontFamily="monospace">{label}</text>
    ))}
    {/* Revenue bars (dark) */}
    {[
      { x: 58,  h: 58, rev: true  },
      { x: 88,  h: 50, rev: true  },
      { x: 118, h: 62, rev: true  },
      { x: 148, h: 78, rev: true  },
      { x: 178, h: 84, rev: true  },
    ].map((b, i) => (
      <rect key={i} x={b.x} y={134 - b.h} width="15" height={b.h} rx="2" fill="#1a1a1a" opacity="0.85" />
    ))}
    {/* Cost bars (gold) */}
    {[
      { x: 73,  h: 30 },
      { x: 103, h: 25 },
      { x: 133, h: 31 },
      { x: 163, h: 39 },
      { x: 193, h: 42 },
    ].map((b, i) => (
      <rect key={i} x={b.x} y={134 - b.h} width="15" height={b.h} rx="2" fill="#d4a437" opacity="0.8" />
    ))}
    {/* Trend line */}
    <polyline
      points="65,100 95,94 125,88 155,72 188,68"
      stroke="#059669" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    {/* Trend dots */}
    {[[65,100],[95,94],[125,88],[155,72],[188,68]].map(([x,y], i) => (
      <circle key={i} cx={x} cy={y} r="3.5" fill="white" stroke="#059669" strokeWidth="2" />
    ))}
    {/* Month labels */}
    {["Gen","Feb","Mar","Apr","Mag"].map((m, i) => (
      <text key={i} x={65 + i * 30} y="148" textAnchor="middle" fontSize="8" fill="#9ca3af" fontFamily="monospace">{m}</text>
    ))}
    {/* Legend */}
    <rect x="55" y="26" width="8" height="8" rx="1" fill="#1a1a1a" opacity="0.85" />
    <text x="67" y="33" fontSize="8" fill="#6b7280" fontFamily="monospace">Ricavi</text>
    <rect x="110" y="26" width="8" height="8" rx="1" fill="#d4a437" opacity="0.8" />
    <text x="122" y="33" fontSize="8" fill="#6b7280" fontFamily="monospace">Costi</text>
    <circle cx="168" cy="30" r="4" fill="white" stroke="#059669" strokeWidth="2" />
    <text x="176" y="33" fontSize="8" fill="#6b7280" fontFamily="monospace">Margine</text>
    {/* Margin callout */}
    <rect x="174" y="50" width="48" height="32" rx="4" fill="#ecfdf5" stroke="#a7f3d0" strokeWidth="1.5"
      style={{ filter: "drop-shadow(0 2px 8px rgba(5,150,105,0.15))" }} />
    <text x="198" y="65" textAnchor="middle" fontSize="10" fill="#059669" fontFamily="serif" fontWeight="700">51.4%</text>
    <text x="198" y="76" textAnchor="middle" fontSize="7" fill="#6b7280" fontFamily="monospace">margine</text>
  </svg>
);

const IlluWorkflow = () => (
  <svg viewBox="0 0 600 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
    <rect width="600" height="200" fill="#f8f4ef" rx="8" />
    {/* Timeline line */}
    <line x1="60" y1="80" x2="540" y2="80" stroke="#e8e0d5" strokeWidth="2" />
    {/* Phase nodes */}
    {[
      { x: 100, label: "Mattina", time: "08:00 – 11:00", color: "#d4a437", fill: "#fbf3df" },
      { x: 300, label: "Mezzogiorno", time: "11:00 – 16:00", color: "#1a1a1a", fill: "#f0ebe3" },
      { x: 500, label: "Sera / Chiusura", time: "16:00 – 20:00", color: "#059669", fill: "#ecfdf5" },
    ].map((phase) => (
      <g key={phase.x}>
        <circle cx={phase.x} cy="80" r="18" fill={phase.fill} stroke={phase.color} strokeWidth="2.5" />
        <text x={phase.x} y="85" textAnchor="middle" fontSize="11" fill={phase.color} fontFamily="serif" fontWeight="700">
          {phase.x === 100 ? "☀" : phase.x === 300 ? "◑" : "☽"}
        </text>
        <text x={phase.x} y="56" textAnchor="middle" fontSize="10" fill="#1a1a1a" fontFamily="monospace" fontWeight="700">
          {phase.label}
        </text>
        <text x={phase.x} y="44" textAnchor="middle" fontSize="8" fill="#9ca3af" fontFamily="monospace">
          {phase.time}
        </text>
      </g>
    ))}
    {/* Arrow connectors */}
    <polyline points="120,80 168,80" stroke="#e8e0d5" strokeWidth="1.5" />
    <polyline points="165,75 172,80 165,85" stroke="#e8e0d5" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <polyline points="320,80 368,80" stroke="#e8e0d5" strokeWidth="1.5" />
    <polyline points="365,75 372,80 365,85" stroke="#e8e0d5" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    {/* Morning tasks */}
    {["Controlla scadenze", "Ricevi consegne DDT", "Aggiorna lo stock"].map((task, i) => (
      <g key={i}>
        <circle cx="22" cy={108 + i * 24} r="4" fill="#d4a437" opacity="0.7" />
        <text x="32" y={113 + i * 24} fontSize="9" fill="#6b5d4f" fontFamily="sans-serif">{task}</text>
      </g>
    ))}
    {/* Day tasks */}
    {["Registra le vendite", "Gestisci WhatsApp", "Riordina se scorta bassa"].map((task, i) => (
      <g key={i}>
        <circle cx="222" cy={108 + i * 24} r="4" fill="#1a1a1a" opacity="0.5" />
        <text x="232" y={113 + i * 24} fontSize="9" fill="#6b5d4f" fontFamily="sans-serif">{task}</text>
      </g>
    ))}
    {/* Evening tasks */}
    {["Chiudi la cassa", "Corrispettivi telematici", "Ordina dai fornitori"].map((task, i) => (
      <g key={i}>
        <circle cx="422" cy={108 + i * 24} r="4" fill="#059669" opacity="0.7" />
        <text x="432" y={113 + i * 24} fontSize="9" fill="#6b5d4f" fontFamily="sans-serif">{task}</text>
      </g>
    ))}
  </svg>
);

// ─────────────────────────────────────────────────────────────────────────────
// STEP DATA
// ─────────────────────────────────────────────────────────────────────────────

const STEPS = [
  {
    num: "01",
    colorBg: "#fbf3df",
    colorBorder: "#e6d2a4",
    colorNum: "#b8862f",
    icon: Package,
    titleIt: "Aggiungi i tuoi prodotti",
    titleEn: "Add your products",
    descIt: "Vai su Prodotti → Aggiungi Prodotto. Inserisci nome, codice SKU, fornitore, prezzo, aliquota IVA e quantità in stock. Per i prodotti a scadenza, imposta la data di scadenza — il sistema ti avviserà automaticamente.",
    descEn: "Go to Products → Add Product. Enter name, SKU code, supplier, price, VAT rate and stock quantity. For perishables, set the expiry date — the system will automatically alert you.",
    page: "products",
    Illu: IlluProducts,
    tips: ["Scansiona il codice a barre per trovare prodotti velocemente", "Usa la categoria per filtrare rapidamente"],
  },
  {
    num: "02",
    colorBg: "#f0f9f4",
    colorBorder: "#a7f3d0",
    colorNum: "#059669",
    icon: ArrowLeftRight,
    titleIt: "Registra le consegne (DDT)",
    titleEn: "Record deliveries (DDT)",
    descIt: "Quando arriva merce dal fornitore, vai su Movimenti → Nuovo Movimento → tipo Carico. Seleziona il prodotto, inserisci la quantità e il numero DDT (documento di trasporto). Il magazzino si aggiorna automaticamente.",
    descEn: "When goods arrive from a supplier, go to Movements → New Movement → type Stock In. Select the product, enter quantity and DDT number (delivery note). The warehouse updates automatically.",
    page: "movements",
    Illu: IlluMovement,
    tips: ["Il numero DDT è sul documento cartaceo del camionista", "Usa 'Scaduto' per smaltire merce avariata"],
  },
  {
    num: "03",
    colorBg: "#eff6ff",
    colorBorder: "#bfdbfe",
    colorNum: "#2563eb",
    icon: ShoppingBag,
    titleIt: "Registra le vendite",
    titleEn: "Record sales",
    descIt: "Vai su Vendite → Nuova Vendita. Seleziona i prodotti venduti, inserisci le quantità, scegli il metodo di pagamento (Contante, POS, Buoni Pasto, Satispay). Il sistema decrementa il magazzino e calcola l'IVA automaticamente.",
    descEn: "Go to Sales → New Sale. Select the products sold, enter quantities, choose payment method (Cash, POS, Meal Vouchers, Satispay). The system decrements stock and calculates VAT automatically.",
    page: "vendite",
    Illu: IlluSale,
    tips: ["'Salva & Stampa' emette il Documento Commerciale", "I corrispettivi giornalieri sono visibili in cima alla pagina"],
  },
  {
    num: "04",
    colorBg: "#fdf4ff",
    colorBorder: "#e9d5ff",
    colorNum: "#7c3aed",
    icon: Truck,
    titleIt: "Gestisci i fornitori",
    titleEn: "Manage suppliers",
    descIt: "In Fornitori trovi tutti i tuoi fornitori con contatti, P.IVA, tempi di consegna e link WhatsApp diretto. Quando lo stock scende sotto il minimo, il sistema ti suggerisce di riordinare — clicca WhatsApp per inviare l'ordine istantaneamente.",
    descEn: "In Suppliers you'll find all your suppliers with contacts, VAT numbers, lead times and direct WhatsApp link. When stock drops below minimum, the system suggests reordering — click WhatsApp to send the order instantly.",
    page: "suppliers",
    Illu: IlluSupplier,
    tips: ["Salva il numero WhatsApp del fornitore per ordini veloci", "Il rating ti aiuta a scegliere il fornitore migliore"],
  },
  {
    num: "05",
    colorBg: "#ecfdf5",
    colorBorder: "#a7f3d0",
    colorNum: "#059669",
    icon: BarChart3,
    titleIt: "Controlla i report",
    titleEn: "Check reports",
    descIt: "In Report trovi l'analisi completa: ricavi vs costi degli ultimi 6 mesi, margine lordo, prodotti più venduti e salute del magazzino. Il cruscotto ti mostra gli alert di scorta bassa e prodotti in scadenza ogni giorno.",
    descEn: "In Reports you'll find full analysis: revenue vs costs for last 6 months, gross margin, top-selling products and inventory health. The dashboard shows low stock alerts and expiring products every day.",
    page: "reports",
    Illu: IlluReports,
    tips: ["Il cruscotto è il primo posto da controllare ogni mattina", "Esporta i dati CSV da Prodotti per il commercialista"],
  },
];

const FAQ_ITEMS = [
  {
    q: "Come faccio ad emettere lo scontrino fiscale?",
    qEn: "How do I issue a fiscal receipt?",
    a: "Questo software gestisce il magazzino e le vendite. Per emettere il Documento Commerciale Fiscale obbligatorio (che ha sostituito lo scontrino dal 2020), devi collegare un Registratore Telematico (RT) abilitato come SumUp, Cassa in Cloud o Agicash. Il nostro sistema è compatibile con tutti i principali RT sul mercato italiano.",
    aEn: "This software manages inventory and sales. To issue the mandatory Fiscal Commercial Document (which replaced receipts since 2020), you need to connect a certified RT like SumUp, Cassa in Cloud or Agicash. Our system is compatible with all major Italian RT devices.",
  },
  {
    q: "I dati si salvano automaticamente?",
    qEn: "Is data saved automatically?",
    a: "In questa versione demo i dati si resettano al ricaricamento della pagina. In produzione, tutti i dati vengono salvati su database con backup automatico giornaliero. Puoi sempre scaricare un backup manuale da Impostazioni → Backup & Ripristino.",
    aEn: "In this demo version data resets on page reload. In production, all data is saved to a database with automatic daily backup. You can always download a manual backup from Settings → Backup & Restore.",
  },
  {
    q: "Come funzionano i Corrispettivi Telematici?",
    qEn: "How do Corrispettivi Telematici work?",
    a: "Dal 2020 tutti i commercianti italiani devono trasmettere i corrispettivi (totali di vendita per aliquota IVA) all'Agenzia delle Entrate. Vai su Vendite per vedere il riepilogo IVA del giorno, poi trasmettilo tramite il tuo RT (Registratore Telematico). Il termine è ogni giorno lavorativo entro le 24:00.",
    aEn: "Since 2020 all Italian merchants must transmit corrispettivi (sales totals by VAT rate) to Agenzia delle Entrate. Go to Sales to see today's VAT summary, then transmit it via your RT device. The deadline is each business day by midnight.",
  },
  {
    q: "Come gestisco i prodotti a scadenza?",
    qEn: "How do I manage expiring products?",
    a: "Quando aggiungi un prodotto, imposta la data di scadenza nel campo 'Data Scadenza'. Il cruscotto mostrerà automaticamente tutti i prodotti che scadono nei prossimi 7 giorni. Per smaltire merce scaduta, usa il tipo di movimento 'Scaduto' — questo decrementa il magazzino e tiene traccia delle perdite.",
    aEn: "When adding a product, set the expiry date in the 'Expiry Date' field. The dashboard will automatically show all products expiring within 7 days. To dispose of expired goods, use movement type 'Expired' — this decrements stock and tracks losses.",
  },
  {
    q: "Posso usare l'app su tablet o smartphone?",
    qEn: "Can I use the app on tablet or smartphone?",
    a: "L'app è ottimizzata per desktop e tablet (almeno 10 pollici). Per uso al bancone, consigliamo un tablet da 10-13 pollici montato su supporto. Versioni mobile ottimizzate sono pianificate per un futuro aggiornamento.",
    aEn: "The app is optimized for desktop and tablet (at least 10 inches). For counter use, we recommend a 10-13 inch tablet on a stand. Mobile-optimized versions are planned for a future update.",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function Help({ onNavigate }) {
  const { lang } = useLang();
  const t = (it, en) => tx(lang, it, en);
  const [activeTab, setActiveTab] = useState("guida");
  const [openFaq, setOpenFaq] = useState(null);

  const TABS = [
    { id: "guida",    Icon: Zap,      it: "Guida Rapida",        en: "Quick Start"      },
    { id: "workflow", Icon: Calendar, it: "Workflow Giornaliero", en: "Daily Workflow"   },
    { id: "funzioni", Icon: Grid,     it: "Funzionalità",        en: "Features"         },
    { id: "faq",      Icon: BookOpen, it: "FAQ",                  en: "FAQ"              },
  ];

  return (
    <div className="p-8 bg-[#f8f4ef] min-h-full space-y-6">

      {/* ── Hero banner ──────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-[#1a1a1a] p-8 shadow-lg"
        style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.18)" }}>
        {/* Decorative grid */}
        <div className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: "repeating-linear-gradient(0deg,#fff 0,#fff 1px,transparent 1px,transparent 40px),repeating-linear-gradient(90deg,#fff 0,#fff 1px,transparent 1px,transparent 40px)" }} />
        {/* Gold accent circle */}
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #d4a437, transparent 70%)" }} />
        <div className="relative">
          <div className="text-[10px] uppercase tracking-[0.25em] font-mono text-[#d4a437] mb-3">
            {t("Centro Assistenza", "Help Center")} · Al Bazar di Milano
          </div>
          <h1 className="font-serif text-[36px] text-white leading-tight mb-3"
            style={{ fontFamily: "'Fraunces', serif", fontWeight: 400 }}>
            {t("Come usare il gestionale", "How to use the shop manager")}
          </h1>
          <p className="text-stone-400 text-[14px] max-w-xl leading-relaxed">
            {t(
              "Tutto quello che ti serve per gestire il tuo negozio al meglio — prodotti, movimenti, vendite, fornitori e report.",
              "Everything you need to manage your shop — products, movements, sales, suppliers and reports."
            )}
          </p>
          <div className="flex gap-3 mt-5">
            {["Italiano ✓", "English ✓", "Bilingue ✓"].map(label => (
              <span key={label} className="px-3 py-1.5 text-[11px] font-mono border border-stone-700 text-stone-400">
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tab navigation ───────────────────────────────────────────────────── */}
      <div className="flex gap-1 bg-white border border-stone-200 p-1 shadow-sm w-fit">
        {TABS.map(({ id, Icon, it, en }) => (
          <button key={id} onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-[12px] font-medium transition-all ${
              activeTab === id
                ? "bg-stone-900 text-stone-50 shadow-sm"
                : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
            }`}>
            <Icon className="w-3.5 h-3.5" />
            {t(it, en)}
          </button>
        ))}
      </div>

      {/* ════════════════════════════════════════════════════════════════════════
          TAB 1 — GUIDA RAPIDA
      ════════════════════════════════════════════════════════════════════════ */}
      {activeTab === "guida" && (
        <div className="space-y-5">
          <div className="text-[13px] text-stone-600 font-medium">
            {t("5 passi per iniziare a usare il gestionale", "5 steps to start using the shop manager")}
          </div>
          <div className="grid grid-cols-1 gap-5">
            {STEPS.map((step, idx) => {
              const StepIcon = step.icon;
              const Illu = step.Illu;
              return (
                <div key={step.num}
                  className="bg-white border border-stone-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group"
                  style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                  <div className="grid grid-cols-[280px_1fr] min-h-[220px]">
                    {/* Illustration panel */}
                    <div className="relative overflow-hidden border-r border-stone-100"
                      style={{ background: step.colorBg }}>
                      <Illu />
                      {/* Step number overlay */}
                      <div className="absolute top-4 left-4">
                        <span className="text-[48px] font-mono font-black leading-none opacity-10"
                          style={{ color: step.colorNum }}>
                          {step.num}
                        </span>
                      </div>
                    </div>

                    {/* Content panel */}
                    <div className="p-7 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 flex items-center justify-center"
                            style={{ background: step.colorBg, border: `1.5px solid ${step.colorBorder}` }}>
                            <StepIcon className="w-4 h-4" style={{ color: step.colorNum }} strokeWidth={1.75} />
                          </div>
                          <div>
                            <div className="text-[10px] uppercase tracking-[0.2em] font-mono" style={{ color: step.colorNum }}>
                              {t(`Passo ${idx + 1}`, `Step ${idx + 1}`)}
                            </div>
                            <h3 className="font-serif text-[20px] text-stone-900 leading-tight mt-0.5"
                              style={{ fontFamily: "'Fraunces', serif", fontWeight: 400 }}>
                              {t(step.titleIt, step.titleEn)}
                            </h3>
                          </div>
                        </div>
                        <p className="text-[13px] text-stone-600 leading-relaxed">
                          {t(step.descIt, step.descEn)}
                        </p>
                        {/* Tips */}
                        <div className="mt-4 space-y-1.5">
                          {step.tips.map((tip, i) => (
                            <div key={i} className="flex items-start gap-2 text-[12px] text-stone-500">
                              <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: step.colorNum }} />
                              {tip}
                            </div>
                          ))}
                        </div>
                      </div>
                      {/* CTA */}
                      <button
                        onClick={() => onNavigate?.(step.page)}
                        className="self-start mt-4 flex items-center gap-2 px-4 py-2 text-[12px] font-semibold border transition-all hover:shadow-sm"
                        style={{ borderColor: step.colorBorder, color: step.colorNum, background: step.colorBg }}>
                        {t("Vai alla sezione", "Go to section")}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════════
          TAB 2 — WORKFLOW GIORNALIERO
      ════════════════════════════════════════════════════════════════════════ */}
      {activeTab === "workflow" && (
        <div className="space-y-5">
          <div className="text-[13px] text-stone-600">
            {t("La routine giornaliera raccomandata per gestire il negozio in modo efficiente.",
               "The recommended daily routine for managing your shop efficiently.")}
          </div>
          {/* Timeline SVG */}
          <div className="bg-white border border-stone-200 shadow-sm p-6"
            style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
            <div className="text-[10px] uppercase tracking-[0.2em] font-mono text-stone-500 mb-5">
              {t("Flusso di Lavoro Giornaliero", "Daily Work Flow")}
            </div>
            <IlluWorkflow />
          </div>
          {/* Phase detail cards */}
          <div className="grid grid-cols-3 gap-4">
            {[
              {
                time: "08:00 – 11:00",
                labelIt: "Mattina — Apertura",
                labelEn: "Morning — Opening",
                color: "#d4a437",
                bg: "#fbf3df",
                border: "#e6d2a4",
                tasks: [
                  { it: "Controlla il cruscotto: scorte basse e scadenze", en: "Check dashboard: low stock & expiries" },
                  { it: "Ricevi le consegne dai fornitori (DDT → Movimenti)", en: "Receive supplier deliveries (DDT → Movements)" },
                  { it: "Aggiorna le giacenze dopo ogni consegna", en: "Update stock quantities after each delivery" },
                  { it: "Verifica prodotti in scadenza questa settimana", en: "Check products expiring this week" },
                ],
              },
              {
                time: "11:00 – 16:00",
                labelIt: "Giorno — Operatività",
                labelEn: "Day — Operations",
                color: "#1a1a1a",
                bg: "#f8f4ef",
                border: "#e8e0d5",
                tasks: [
                  { it: "Registra ogni vendita su Vendite → Nuova Vendita", en: "Record each sale in Sales → New Sale" },
                  { it: "Gestisci ordini WhatsApp (Vendite con nota cliente)", en: "Handle WhatsApp orders (Sales with customer note)" },
                  { it: "Monitora lo stock in tempo reale dal cruscotto", en: "Monitor stock in real time from dashboard" },
                  { it: "Aggiungi movimenti di rettifica se necessario", en: "Add adjustment movements if needed" },
                ],
              },
              {
                time: "16:00 – 20:00",
                labelIt: "Sera — Chiusura",
                labelEn: "Evening — Closing",
                color: "#059669",
                bg: "#ecfdf5",
                border: "#a7f3d0",
                tasks: [
                  { it: "Vai su Vendite: controlla i corrispettivi del giorno", en: "Go to Sales: review today's corrispettivi" },
                  { it: "Trasmetti corrispettivi via RT (SumUp/Cassa in Cloud)", en: "Transmit corrispettivi via RT (SumUp/Cassa in Cloud)" },
                  { it: "Crea ordini per prodotti sotto il livello minimo", en: "Create orders for products below reorder level" },
                  { it: "Scarica backup settimanale da Impostazioni", en: "Download weekly backup from Settings" },
                ],
              },
            ].map((phase) => (
              <div key={phase.time} className="bg-white border border-stone-200 p-5 shadow-sm">
                <div className="mb-4 pb-3 border-b border-stone-100">
                  <div className="text-[10px] font-mono" style={{ color: phase.color }}>{phase.time}</div>
                  <div className="font-serif text-[18px] text-stone-900 mt-1"
                    style={{ fontFamily: "'Fraunces', serif", fontWeight: 400 }}>
                    {t(phase.labelIt, phase.labelEn)}
                  </div>
                </div>
                <div className="space-y-2.5">
                  {phase.tasks.map((task, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px] font-mono font-bold"
                        style={{ background: phase.bg, border: `1px solid ${phase.border}`, color: phase.color }}>
                        {i + 1}
                      </div>
                      <span className="text-[12px] text-stone-600 leading-snug">{t(task.it, task.en)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════════
          TAB 3 — FUNZIONALITÀ
      ════════════════════════════════════════════════════════════════════════ */}
      {activeTab === "funzioni" && (
        <div className="grid grid-cols-2 gap-4">
          {[
            {
              icon: LayoutDashboard, page: "dashboard",
              titleIt: "Cruscotto", titleEn: "Dashboard",
              colorNum: "#d4a437", colorBg: "#fbf3df", colorBorder: "#e6d2a4",
              descIt: "Panoramica istantanea: valore magazzino, alert scadenze, scorte critiche, movimenti recenti, grafico entrate/uscite e top prodotti venduti.",
              descEn: "Instant overview: stock value, expiry alerts, critical stock, recent movements, in/out chart and top selling products.",
              features: ["Alert scorte basse", "Avvisi scadenza prodotti", "Grafico stock 7 giorni", "Top 5 prodotti venduti"],
            },
            {
              icon: Package, page: "products",
              titleIt: "Prodotti", titleEn: "Products",
              colorNum: "#2563eb", colorBg: "#eff6ff", colorBorder: "#bfdbfe",
              descIt: "Catalogo completo con SKU, fornitore, prezzo, IVA, scadenza e stock. Filtra per stato, categoria, ordina per valore. Esporta CSV per il commercialista.",
              descEn: "Full catalog with SKU, supplier, price, VAT, expiry and stock. Filter by status, category, sort by value. Export CSV for accountant.",
              features: ["Codice SKU univoco", "Aliquota IVA per prodotto", "Tracking scadenze", "Export CSV per contabilità"],
            },
            {
              icon: ArrowLeftRight, page: "movements",
              titleIt: "Movimenti di Magazzino", titleEn: "Stock Movements",
              colorNum: "#059669", colorBg: "#ecfdf5", colorBorder: "#a7f3d0",
              descIt: "Registra tutti i movimenti: carico DDT, scarico vendite, rettifiche inventario, smaltimento scaduti e trasferimenti tra locali.",
              descEn: "Record all movements: DDT goods in, sales out, inventory adjustments, expired disposal and transfers between areas.",
              features: ["Carico DDT da fornitore", "Scarico vendite automatico", "Rettifica inventario", "Tipo 'Scaduto' per sprechi"],
            },
            {
              icon: ShoppingBag, page: "vendite",
              titleIt: "Vendite & Cassa", titleEn: "Sales & Checkout",
              colorNum: "#7c3aed", colorBg: "#fdf4ff", colorBorder: "#e9d5ff",
              descIt: "Vendita multi-prodotto con calcolo automatico IVA, supporto peso variabile, 5 metodi di pagamento, Documento Commerciale stampabile e corrispettivi telematici.",
              descEn: "Multi-product sale with automatic VAT calculation, variable weight support, 5 payment methods, printable Commercial Document and telematic corrispettivi.",
              features: ["Contante, POS, Buoni Pasto, Satispay, Bonifico", "IVA automatica per prodotto", "Documento Commerciale stampabile", "Corrispettivi per ADE"],
            },
            {
              icon: Truck, page: "suppliers",
              titleIt: "Fornitori", titleEn: "Suppliers",
              colorNum: "#ea580c", colorBg: "#fff7ed", colorBorder: "#fed7aa",
              descIt: "Rubrica fornitori con P.IVA, contatti, link WhatsApp diretto per ordini veloci, tempi di consegna, termini di pagamento e valutazione.",
              descEn: "Supplier directory with P.IVA, contacts, direct WhatsApp link for quick orders, lead times, payment terms and rating.",
              features: ["WhatsApp diretto per ordini", "P.IVA e dati fiscali", "Tempi di consegna", "Rating fornitore"],
            },
            {
              icon: MapPin, page: "locali",
              titleIt: "Locali del Negozio", titleEn: "Shop Areas",
              colorNum: "#0e7490", colorBg: "#ecfeff", colorBorder: "#a5f3fc",
              descIt: "Mappa le aree fisiche del negozio: Scaffali, Magazzino Retro, Banco Frigo, Congelatore. Monitora la capacità di ogni area in tempo reale.",
              descEn: "Map your physical shop areas: Shelves, Back Storage, Fridge Counter, Freezer. Monitor capacity of each area in real time.",
              features: ["4 tipi: Scaffale, Magazzino, Frigo, Congelatore", "Capacità e utilizzo in %", "Valore merce per area", "Responsabile per area"],
            },
            {
              icon: ShoppingCart, page: "purchases",
              titleIt: "Ordini di Acquisto", titleEn: "Purchase Orders",
              colorNum: "#b45309", colorBg: "#fffbeb", colorBorder: "#fde68a",
              descIt: "Gestisci gli ordini ai fornitori con stati: Bozza → In attesa → In transito → Ricevuto. Tieni traccia di tutti gli ordini e la spesa per fornitore.",
              descEn: "Manage supplier orders with statuses: Draft → Pending → In transit → Received. Track all orders and spend per supplier.",
              features: ["Stato ordine tracciabile", "Collegato al fornitore", "Data attesa consegna", "Totale e numero articoli"],
            },
            {
              icon: BarChart3, page: "reports",
              titleIt: "Report & Analisi", titleEn: "Reports & Analytics",
              colorNum: "#059669", colorBg: "#ecfdf5", colorBorder: "#a7f3d0",
              descIt: "Grafici ricavi vs costi ultimi 6 mesi, margine lordo con confronto mese precedente, top 8 prodotti per vendite e salute del magazzino per categoria.",
              descEn: "Revenue vs costs charts last 6 months, gross margin with previous month comparison, top 8 products by sales and inventory health by category.",
              features: ["Grafico ricavi 6 mesi", "Margine lordo automatico", "Top 8 prodotti più venduti", "Salute magazzino per stato"],
            },
          ].map(({ icon: Icon, page, titleIt, titleEn, colorNum, colorBg, colorBorder, descIt, descEn, features }) => (
            <div key={page} className="bg-white border border-stone-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group"
              style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 flex items-center justify-center"
                    style={{ background: colorBg, border: `1.5px solid ${colorBorder}` }}>
                    <Icon className="w-5 h-5" style={{ color: colorNum }} strokeWidth={1.75} />
                  </div>
                  <button onClick={() => onNavigate?.(page)}
                    className="flex items-center gap-1 text-[11px] font-mono opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: colorNum }}>
                    {t("Apri","Open")} <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <h3 className="font-serif text-[18px] text-stone-900 mb-2"
                  style={{ fontFamily: "'Fraunces', serif", fontWeight: 400 }}>
                  {t(titleIt, titleEn)}
                </h3>
                <p className="text-[12px] text-stone-500 leading-relaxed mb-4">{t(descIt, descEn)}</p>
                <div className="flex flex-wrap gap-1.5">
                  {features.map((f, i) => (
                    <span key={i} className="text-[10px] font-mono px-2 py-0.5 border"
                      style={{ background: colorBg, borderColor: colorBorder, color: colorNum }}>
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════════
          TAB 4 — FAQ
      ════════════════════════════════════════════════════════════════════════ */}
      {activeTab === "faq" && (
        <div className="max-w-3xl space-y-3">
          <div className="text-[13px] text-stone-600 mb-5">
            {t("Domande frequenti sul gestionale e sulla normativa italiana.",
               "Frequently asked questions about the shop manager and Italian regulations.")}
          </div>
          {FAQ_ITEMS.map((item, i) => (
            <div key={i} className="bg-white border border-stone-200 shadow-sm overflow-hidden"
              style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-stone-50 transition-colors">
                <span className="text-[14px] font-medium text-stone-900 pr-4">{t(item.q, item.qEn)}</span>
                <ChevronDown className={`w-4 h-4 text-stone-500 flex-shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
              </button>
              {openFaq === i && (
                <div className="px-6 pb-5 border-t border-stone-100">
                  <p className="text-[13px] text-stone-600 leading-relaxed pt-4">{t(item.a, item.aEn)}</p>
                </div>
              )}
            </div>
          ))}
          {/* Contact support card */}
          <div className="bg-[#1a1a1a] border border-stone-800 p-6 mt-6">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-5 h-5 text-[#d4a437] flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-[13px] font-semibold text-stone-100 mb-1">
                  {t("Hai ancora domande?", "Still have questions?")}
                </div>
                <div className="text-[12px] text-stone-400 leading-relaxed">
                  {t(
                    "Per assistenza tecnica o domande sulla normativa fiscale italiana, consulta il tuo commercialista di fiducia. Per supporto sul software, contatta il team di sviluppo.",
                    "For technical assistance or questions about Italian tax regulations, consult your accountant. For software support, contact the development team."
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

