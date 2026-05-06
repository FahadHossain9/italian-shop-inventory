import React, { useState } from "react";
import { ArrowRight, Box, Eye, EyeOff } from "lucide-react";

// ─── Flag SVGs ────────────────────────────────────────────────────────────────
const FlagIT = () => (
  <svg viewBox="0 0 3 2" className="w-5 h-3.5 flex-shrink-0 rounded-[1px]">
    <rect width="1" height="2" fill="#009246"/>
    <rect x="1" width="1" height="2" fill="#FFF"/>
    <rect x="2" width="1" height="2" fill="#CE2B37"/>
  </svg>
);
const FlagGB = () => (
  <svg viewBox="0 0 60 40" className="w-5 h-3.5 flex-shrink-0 rounded-[1px]">
    <rect width="60" height="40" fill="#012169"/>
    <path d="M0,0 L60,40 M60,0 L0,40" stroke="white" strokeWidth="9"/>
    <path d="M0,0 L60,40 M60,0 L0,40" stroke="#C8102E" strokeWidth="5"/>
    <rect x="25" y="0" width="10" height="40" fill="white"/>
    <rect x="0" y="15" width="60" height="10" fill="white"/>
    <rect x="27" y="0" width="6" height="40" fill="#C8102E"/>
    <rect x="0" y="17" width="60" height="6" fill="#C8102E"/>
  </svg>
);

const LANGS = [
  { id: "it", label: "Italiano", Flag: FlagIT },
  { id: "en", label: "English",  Flag: FlagGB },
];

const STYLES = `
  @keyframes lp-fadein {
    from { opacity:0; transform:translateY(18px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes lp-fadeout { from{opacity:1} to{opacity:0} }
  @keyframes lp-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
  @keyframes lp-glow  { 0%,100%{box-shadow:0 0 22px rgba(212,164,55,.3)} 50%{box-shadow:0 0 44px rgba(212,164,55,.55)} }
  .lp-a1 { animation: lp-fadein .55s ease both; animation-delay:.05s }
  .lp-a2 { animation: lp-fadein .55s ease both; animation-delay:.18s }
  .lp-a3 { animation: lp-fadein .55s ease both; animation-delay:.30s }
  .lp-a4 { animation: lp-fadein .55s ease both; animation-delay:.42s }
  .lp-float { animation: lp-float 5s ease-in-out infinite }
  .lp-glow  { animation: lp-glow  3s ease-in-out infinite }
`;

// ─── Italian Bazar Scene SVG ─────────────────────────────────────────────────
const BazarScene = () => (
  <svg viewBox="0 0 560 420" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="bs-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"  stopColor="#C8E0F0"/>
        <stop offset="65%" stopColor="#EAD8C0"/>
        <stop offset="100%" stopColor="#D8C4A4"/>
      </linearGradient>
      <linearGradient id="bs-gnd" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stopColor="#9B8B7A"/>
        <stop offset="100%" stopColor="#7A6B5A"/>
      </linearGradient>
      <clipPath id="bs-awn">
        <polygon points="120,168 440,168 460,212 100,212"/>
      </clipPath>
    </defs>

    <rect width="560" height="420" fill="url(#bs-sky)"/>
    <circle cx="470" cy="62" r="52" fill="#F5D870" opacity="0.12"/>
    <circle cx="470" cy="62" r="32" fill="#F5D870" opacity="0.18"/>
    <circle cx="470" cy="62" r="17" fill="#FAE890" opacity="0.55"/>
    <rect x="243" y="95" width="34" height="85" fill="#C4B49A" opacity="0.28"/>
    <ellipse cx="260" cy="96" rx="24" ry="30" fill="#C4B49A" opacity="0.28"/>

    <rect x="0" y="358" width="560" height="62" fill="url(#bs-gnd)"/>
    {[0,1,2].map(row=>Array.from({length:32},(_,col)=>(
      <rect key={`${row}-${col}`} x={col*18+(row%2===1?9:0)} y={359+row*19} width="14" height="15" rx="1.5"
        fill={col%3===0?"#8A7A6A":col%3===1?"#A09080":"#948474"} opacity="0.48"/>
    )))}

    {/* Left building */}
    <rect x="0" y="108" width="155" height="272" fill="#CC8B5A"/>
    <rect x="0" y="100" width="155" height="16" fill="#B87B4A"/>
    <rect x="0" y="93"  width="155" height="11" fill="#CC8B5A"/>
    <rect x="142" y="108" width="13" height="272" fill="#1A1A1A" opacity="0.08"/>
    {[12,55,100].map(x=>(
      <g key={x}>
        <rect x={x} y="126" width="30" height="44" rx="2" fill="#A8CDD8" opacity="0.68"/>
        <rect x={x} y="126" width="30" height="44" rx="2" fill="none" stroke="#A07048" strokeWidth="1.4"/>
        <rect x={x}    y="152" width="14" height="18" fill="#2D5A3D" opacity="0.75"/>
        <rect x={x+16} y="152" width="14" height="18" fill="#2D5A3D" opacity="0.75"/>
      </g>
    ))}
    {[12,55,100].map(x=>(
      <g key={x}>
        <rect x={x} y="196" width="30" height="44" rx="2" fill="#A8CDD8" opacity="0.68"/>
        <rect x={x} y="196" width="30" height="44" rx="2" fill="none" stroke="#A07048" strokeWidth="1.4"/>
        <rect x={x}    y="222" width="14" height="18" fill="#2D5A3D" opacity="0.75"/>
        <rect x={x+16} y="222" width="14" height="18" fill="#2D5A3D" opacity="0.75"/>
      </g>
    ))}
    {[12,55,100].map(x=>(
      <g key={x}>
        <rect x={x} y="266" width="30" height="44" rx="2" fill="#A8CDD8" opacity="0.55"/>
        <rect x={x} y="266" width="30" height="44" rx="2" fill="none" stroke="#A07048" strokeWidth="1.4"/>
      </g>
    ))}
    <path d="M 18 380 L 18 330 Q 43 305 68 330 L 68 380 Z" fill="#3A2818"/>

    {/* Right building */}
    <rect x="405" y="88"  width="155" height="292" fill="#D4A455"/>
    <rect x="405" y="80"  width="155" height="16"  fill="#C09040"/>
    <rect x="405" y="73"  width="155" height="11"  fill="#D4A455"/>
    <rect x="405" y="88"  width="13"  height="292" fill="#1A1A1A" opacity="0.08"/>
    {[418,461,504].map(x=>([104,174,244,308].map(y=>(
      <g key={`${x}-${y}`}>
        <rect x={x} y={y} width="30" height="44" rx="2" fill="#A8CDD8" opacity={y<200?0.65:0.5}/>
        <rect x={x} y={y} width="30" height="44" rx="2" fill="none" stroke="#B09050" strokeWidth="1.4"/>
        {y<200&&<><rect x={x}    y={y+26} width="14" height="18" fill="#8B5A2A" opacity="0.72"/>
                   <rect x={x+16} y={y+26} width="14" height="18" fill="#8B5A2A" opacity="0.72"/></>}
      </g>
    ))))}

    {/* Center shop */}
    <rect x="148" y="148" width="264" height="232" fill="#F5EDD8"/>
    <rect x="148" y="148" width="14"  height="232" fill="#1A1A1A" opacity="0.05"/>
    <rect x="398" y="148" width="14"  height="232" fill="#1A1A1A" opacity="0.05"/>

    {/* Sign */}
    <rect x="192" y="112" width="176" height="50" rx="3" fill="#0D0C09"/>
    <rect x="195" y="115" width="170" height="44" rx="2" fill="none" stroke="#d4a437" strokeWidth="1.5" opacity="0.65"/>
    <text x="280" y="141" fill="#d4a437" fontSize="17" fontFamily="Georgia,serif" textAnchor="middle" fontWeight="bold" letterSpacing="5">AL BAZAR</text>
    <text x="280" y="153" fill="#7B6B55" fontSize="7.5" textAnchor="middle" fontFamily="monospace" letterSpacing="2">VIA PADOVA 104 · MILANO</text>

    {/* Awning */}
    <polygon points="120,168 440,168 460,212 100,212" fill="#2D6A4F"/>
    <g clipPath="url(#bs-awn)">
      {Array.from({length:10},(_,i)=>(
        <rect key={i} x={104+i*37} y="165" width="18" height="52" fill="#F5EDD8" opacity="0.22"/>
      ))}
    </g>
    {Array.from({length:11},(_,i)=>(
      <path key={i} d={`M ${100+i*32.7} 212 Q ${100+i*32.7+16.3} 232 ${100+(i+1)*32.7} 212 Z`} fill="#1B4332"/>
    ))}

    {/* Shop window */}
    <rect x="162" y="228" width="142" height="122" fill="#D4EEF8" opacity="0.82"/>
    <rect x="162" y="228" width="142" height="122" fill="none" stroke="#C8B898" strokeWidth="2.5"/>
    <line x1="233" y1="228" x2="233" y2="350" stroke="#C8B898" strokeWidth="1.8"/>
    <line x1="162" y1="292" x2="304" y2="292" stroke="#C8B898" strokeWidth="1.8"/>
    <rect x="172" y="238" width="13" height="42" rx="6.5" fill="#D4B44A" opacity="0.9"/>
    <rect x="174" y="234" width="9"  height="8"  rx="2"   fill="#8B6B2A" opacity="0.9"/>
    <rect x="192" y="242" width="26" height="34" rx="4" fill="#E8D4A8" opacity="0.88"/>
    <rect x="192" y="238" width="26" height="8"  rx="2" fill="#9B8B6A" opacity="0.8"/>
    <text x="205" y="263" fill="#5B4B2A" fontSize="6" textAnchor="middle">pomod.</text>
    <rect x="240" y="240" width="17" height="40" rx="2" fill="#F5C842" opacity="0.88"/>
    <rect x="260" y="246" width="20" height="30" rx="3" fill="#E85A3A" opacity="0.82"/>
    {[[175,"#FF7B35"],[197,"#FF5050"],[218,"#FFD700"],[240,"#78C850"],[261,"#FF7B35"],[282,"#E85A3A"]].map(([cx,fill])=>(
      <circle key={cx} cx={cx} cy="318" r="9.5" fill={fill} opacity="0.88"/>
    ))}

    {/* Door */}
    <path d="M 318 380 L 318 266 Q 352 238 386 266 L 386 380 Z" fill="#4A3020"/>
    <rect x="324" y="278" width="22" height="34" rx="2" fill="#5A4030"/>
    <rect x="350" y="278" width="22" height="34" rx="2" fill="#5A4030"/>
    <rect x="324" y="320" width="22" height="30" rx="2" fill="#5A4030"/>
    <rect x="350" y="320" width="22" height="30" rx="2" fill="#5A4030"/>
    <circle cx="343" cy="337" r="5" fill="#d4a437"/>
    <path d="M 318 266 Q 352 238 386 266 Z" fill="#A8CDD8" opacity="0.75"/>
    <rect x="324" y="248" width="52" height="16" rx="2" fill="#2D6A4F" opacity="0.92"/>
    <text x="350" y="259" fill="#F5EDD8" fontSize="7.5" textAnchor="middle" fontFamily="monospace" letterSpacing="1.2">APERTO</text>

    {/* Chalk board */}
    <rect x="394" y="310" width="44" height="52" rx="2" fill="#2D3A2D"/>
    <rect x="396" y="312" width="40" height="48" rx="1" fill="#334433"/>
    <text x="416" y="328" fill="#F5EDD8" fontSize="7"   textAnchor="middle" opacity="0.9">OFFERTE</text>
    <text x="416" y="340" fill="#d4a437" fontSize="7.5" textAnchor="middle">OGGI:</text>
    <text x="416" y="352" fill="#d4a437" fontSize="6.5" textAnchor="middle">Riso 1kg €1.80</text>

    {/* String lights */}
    <path d="M 16 108 Q 280 90 544 80" stroke="#d4a437" strokeWidth="0.9" fill="none" opacity="0.4"/>
    {[38,90,148,200,260,320,378,436,490,534].map((x,i)=>(
      <circle key={i} cx={x} cy={92+(i%3)*5-4} r="3.8" fill="#F5D870" opacity={0.65+i*0.02}/>
    ))}

    {/* Hanging items */}
    <line x1="175" y1="212" x2="175" y2="232" stroke="#8B7B5A" strokeWidth="1.2"/>
    {[0,1,2].map(i=><ellipse key={i} cx={170+i*6} cy={234+i*4} rx="4.5" ry="5.5" fill="#F5EDD8" stroke="#C8B8A0" strokeWidth="0.8"/>)}
    <line x1="215" y1="212" x2="215" y2="224" stroke="#8B7B5A" strokeWidth="1.2"/>
    <rect x="208" y="224" width="14" height="30" rx="7" fill="#8B3A2A"/>
    <line x1="255" y1="212" x2="255" y2="225" stroke="#8B7B5A" strokeWidth="1.2"/>
    {[-4,0,4].map(i=><ellipse key={i} cx={255+i} cy={232} rx="3.5" ry="9" fill="#2D6A4F" opacity="0.82"/>)}
    <line x1="395" y1="212" x2="395" y2="232" stroke="#8B7B5A" strokeWidth="1.2"/>
    {[0,1,2].map(i=><ellipse key={i} cx={390+i*6} cy={234+i*4} rx="4.5" ry="5.5" fill="#F5EDD8" stroke="#C8B8A0" strokeWidth="0.8"/>)}
    <line x1="433" y1="212" x2="433" y2="222" stroke="#8B7B5A" strokeWidth="1.2"/>
    <path d="M 421 222 Q 433 215 445 222 L 441 252 Q 433 257 425 252 Z" fill="#8B3A2A"/>

    {/* Produce crates */}
    <rect x="20"  y="335" width="72" height="28" rx="2" fill="#8B6B3A"/>
    <line x1="20" y1="346" x2="92" y2="346" stroke="#7A5A2A" strokeWidth="1.4"/>
    {[32,46,60,74,86].map(x=><circle key={x} cx={x} cy="330" r="8.5" fill="#FF7B35"/>)}
    {[39,53,67,80].map(x=><circle key={x} cx={x} cy="318" r="7.5" fill="#FF9040"/>)}
    <rect x="100" y="338" width="56" height="24" rx="2" fill="#8B6B3A"/>
    {[111,125,138,150].map(x=>(
      <g key={x}><circle cx={x} cy="334" r="7.5" fill="#E83A2A"/>
      <line x1={x} y1="326" x2={x} y2="321" stroke="#2D6A4F" strokeWidth="1.4"/></g>
    ))}
    <rect x="414" y="338" width="62" height="26" rx="2" fill="#8B6B3A"/>
    {[424,438,452,466].map(x=><ellipse key={x} cx={x} cy="333" rx="9" ry="6.5" fill="#FFD700"/>)}
    <rect x="484" y="340" width="54" height="24" rx="2" fill="#8B6B3A"/>
    {[488,496,504,512,520,528,532].map((x,i)=>(
      <ellipse key={i} cx={x} cy="336" rx="3.5" ry="10" fill={i%2===0?"#2D6A4F":"#4A8B60"} opacity="0.85"/>
    ))}

    {/* Flag */}
    <line x1="155" y1="62" x2="155" y2="148" stroke="#9B8B7A" strokeWidth="2"/>
    <polygon points="155,64 208,76 155,95" fill="#d4a437" opacity="0.92"/>
  </svg>
);

// ─── Landing ─────────────────────────────────────────────────────────────────
export default function Landing({ onEnter, lang = "bilingual", setLang = () => {} }) {
  const [user, setUser]       = useState("gestore");
  const [pass, setPass]       = useState("albazar2025");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [exiting, setExiting] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setExiting(true);
      setTimeout(onEnter, 480);
    }, 600);
  };

  return (
    <>
      <style>{STYLES}</style>
      <div
        className="h-screen flex overflow-hidden"
        style={{ opacity: exiting ? 0 : 1, transition: "opacity .48s ease" }}
      >
        {/* ── Left: illustration panel ─────────────────────────────────── */}
        <div className="hidden lg:flex flex-1 relative flex-col overflow-hidden"
          style={{ background: "linear-gradient(135deg, #0D0C09 0%, #1a1410 100%)" }}>

          {/* Subtle grid overlay */}
          <div className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: "linear-gradient(#d4a437 1px,transparent 1px),linear-gradient(90deg,#d4a437 1px,transparent 1px)",
              backgroundSize: "48px 48px",
            }}/>

          {/* Gold radial glow */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] opacity-20 blur-3xl"
            style={{ background: "radial-gradient(ellipse, #d4a437 0%, transparent 70%)" }}/>

          {/* Top brand */}
          <div className="relative z-10 flex items-center gap-3 px-10 pt-10">
            <div className="w-9 h-9 bg-[#d4a437] flex items-center justify-center lp-glow flex-shrink-0">
              <Box className="w-4.5 h-4.5 text-[#1a1a1a]" strokeWidth={2.5}/>
            </div>
            <div>
              <div style={{fontFamily:"'Fraunces',serif", fontWeight:500}}
                className="text-[17px] text-[#F5F0E8] tracking-tight leading-none">Al Bazar</div>
              <div className="text-[9px] font-mono tracking-[0.22em] text-[#5B4B3A] uppercase mt-0.5">
                Shop Manager
              </div>
            </div>
          </div>

          {/* Illustration */}
          <div className="relative z-10 flex-1 flex items-center justify-center px-8 pb-4">
            <div className="lp-float w-full max-w-[540px] rounded-sm overflow-hidden"
              style={{ boxShadow: "0 24px 64px rgba(0,0,0,0.55), 0 0 32px rgba(212,164,55,0.08)" }}>
              <BazarScene/>
            </div>
          </div>

          {/* Bottom tagline */}
          <div className="relative z-10 px-10 pb-10 flex items-end justify-between">
            <div>
              <div style={{fontFamily:"'Fraunces',serif", fontWeight:400}}
                className="text-[26px] text-[#F5F0E8] leading-tight tracking-tight">
                Il tuo negozio,<br/>
                <span style={{
                  background:"linear-gradient(90deg,#d4a437,#f0c84a)",
                  WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent"
                }}>sempre sotto controllo.</span>
              </div>
              <div className="text-[12px] text-[#5B4B3A] mt-2 font-mono">
                Via Padova 104 · Milano
              </div>
            </div>
            <div className="flex flex-col gap-1.5 text-right">
              {["✓ Corrispettivi AE","✓ IVA 4·10·22%","✓ Satispay & Buoni Pasto"].map(t=>(
                <div key={t} className="text-[10px] font-mono text-[#4A3A2A] tracking-wide">{t}</div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right: login panel ───────────────────────────────────────── */}
        <div className="w-full lg:w-[420px] flex flex-col justify-center px-10 lg:px-12 relative"
          style={{ background: "#0F0E0C", borderLeft: "1px solid #1E1C19" }}>

          {/* Mobile logo (only on small screens) */}
          <div className="flex lg:hidden items-center gap-3 mb-10">
            <div className="w-9 h-9 bg-[#d4a437] flex items-center justify-center lp-glow">
              <Box className="w-4.5 h-4.5 text-[#1a1a1a]" strokeWidth={2.5}/>
            </div>
            <span style={{fontFamily:"'Fraunces',serif", fontWeight:500}}
              className="text-[17px] text-[#F5F0E8]">Al Bazar</span>
          </div>

          {/* Language selector */}
          <div className="absolute top-6 right-8 flex items-center gap-1.5">
            {LANGS.map(l => (
              <button key={l.id} type="button" onClick={() => setLang(l.id)}
                title={l.label}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] font-mono tracking-wide border transition-all ${
                  lang === l.id
                    ? "border-[#d4a437] text-[#d4a437] bg-[#d4a437]/10"
                    : "border-[#2A2520] text-[#4A3A2A] hover:border-[#3A3020] hover:text-[#6B5B4A]"
                }`}>
                <l.Flag />
                <span>{l.label}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleLogin} className="w-full max-w-[340px] mx-auto lg:mx-0">

            {/* Heading */}
            <div className="lp-a1 mb-8">
              <div className="text-[10px] uppercase tracking-[0.28em] font-mono text-[#d4a437] mb-2">
                Accesso Negozio
              </div>
              <h1 style={{fontFamily:"'Fraunces',serif", fontWeight:400}}
                className="text-[30px] text-[#F5F0E8] tracking-tight leading-tight">
                Bentornato
              </h1>
              <p className="text-[12px] text-[#4A3A2A] mt-1.5 font-mono">
                Inserisci le credenziali per accedere
              </p>
            </div>

            {/* Username */}
            <div className="lp-a2 mb-4">
              <label className="block text-[10px] uppercase tracking-[0.18em] font-mono text-[#6B5B4A] font-semibold mb-1.5">
                Utente
              </label>
              <input
                type="text"
                value={user}
                onChange={e => setUser(e.target.value)}
                className="w-full px-4 py-3 text-[13px] font-mono bg-[#161410] border border-[#2A2520] text-[#F5F0E8] focus:outline-none focus:border-[#d4a437] transition-colors"
                placeholder="nome utente"
                required
              />
            </div>

            {/* Password */}
            <div className="lp-a3 mb-6">
              <label className="block text-[10px] uppercase tracking-[0.18em] font-mono text-[#6B5B4A] font-semibold mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={pass}
                  onChange={e => setPass(e.target.value)}
                  className="w-full px-4 py-3 pr-11 text-[13px] font-mono bg-[#161410] border border-[#2A2520] text-[#F5F0E8] focus:outline-none focus:border-[#d4a437] transition-colors"
                  placeholder="••••••••"
                  required
                />
                <button type="button"
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4A3A2A] hover:text-[#d4a437] transition-colors">
                  {showPass
                    ? <EyeOff className="w-4 h-4"/>
                    : <Eye    className="w-4 h-4"/>}
                </button>
              </div>
            </div>

            {/* Login button */}
            <div className="lp-a4">
              <button type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 text-[13px] font-bold tracking-wide transition-all"
                style={{
                  background: loading
                    ? "#2A2520"
                    : "linear-gradient(90deg, #d4a437 0%, #f0c84a 50%, #d4a437 100%)",
                  backgroundSize: "200% auto",
                  animation: loading ? "none" : "lp-shimmer 2.8s linear infinite",
                  color: loading ? "#6B5B4A" : "#0D0C09",
                  boxShadow: loading ? "none" : "0 4px 24px rgba(212,164,55,0.35)",
                }}>
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-[#6B5B4A] border-t-transparent rounded-full animate-spin"/>
                    Accesso in corso...
                  </>
                ) : (
                  <>
                    Accedi al Negozio
                    <ArrowRight className="w-4 h-4"/>
                  </>
                )}
              </button>

              <div className="mt-4 text-center text-[10px] font-mono text-[#2A2520] tracking-wide">
                Accesso diretto · nessuna registrazione richiesta
              </div>
            </div>
          </form>

          {/* Bottom status */}
          <div className="absolute bottom-8 left-0 right-0 px-10 lg:px-12">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"/>
              <span className="text-[10px] font-mono text-[#3A3530]">Sistema operativo · v1.0</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
