export function Background() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
    <svg className="absolute -top-8 -left-8 w-36 h-36 sm:w-44 sm:h-44 opacity-95" viewBox="0 0 160 160">
      <g className="sun-rays-spin">
        <polygon points="80,6 88,28 72,28" fill="#facc15" stroke="#1e1b4b" strokeWidth="3.5" strokeLinejoin="round"/>
        <polygon points="80,154 88,132 72,132" fill="#facc15" stroke="#1e1b4b" strokeWidth="3.5" strokeLinejoin="round"/>
        <polygon points="6,80 28,88 28,72" fill="#facc15" stroke="#1e1b4b" strokeWidth="3.5" strokeLinejoin="round"/>
        <polygon points="154,80 132,88 132,72" fill="#facc15" stroke="#1e1b4b" strokeWidth="3.5" strokeLinejoin="round"/>
        <polygon points="26,26 46,36 36,46" fill="#fb923c" stroke="#1e1b4b" strokeWidth="3.5" strokeLinejoin="round"/>
        <polygon points="134,134 114,124 124,114" fill="#fb923c" stroke="#1e1b4b" strokeWidth="3.5" strokeLinejoin="round"/>
        <polygon points="134,26 124,46 114,36" fill="#fb923c" stroke="#1e1b4b" strokeWidth="3.5" strokeLinejoin="round"/>
        <polygon points="26,134 36,114 46,124" fill="#fb923c" stroke="#1e1b4b" strokeWidth="3.5" strokeLinejoin="round"/>
      </g>
      <circle cx="80" cy="80" r="42" fill="#fde047" stroke="#1e1b4b" strokeWidth="4"/>
      <circle cx="67" cy="74" r="4.5" fill="#1e1b4b"/>
      <circle cx="93" cy="74" r="4.5" fill="#1e1b4b"/>
      <circle cx="60" cy="84" r="5.5" fill="#fb7185" opacity="0.75"/>
      <circle cx="100" cy="84" r="5.5" fill="#fb7185" opacity="0.75"/>
      <path d="M68 88 Q80 100 92 88" stroke="#1e1b4b" strokeWidth="4" fill="none" strokeLinecap="round"/>
    </svg>

    
    <svg className="absolute top-12 right-[-40px] w-72 h-40 sm:w-96 sm:h-52 opacity-75" viewBox="0 0 320 180">
      <path d="M20 170 A140 140 0 0 1 300 170" fill="none" stroke="#f43f5e" strokeWidth="14" strokeLinecap="round"/>
      <path d="M34 170 A126 126 0 0 1 286 170" fill="none" stroke="#fb923c" strokeWidth="14" strokeLinecap="round"/>
      <path d="M48 170 A112 112 0 0 1 272 170" fill="none" stroke="#facc15" strokeWidth="14" strokeLinecap="round"/>
      <path d="M62 170 A98 98 0 0 1 258 170" fill="none" stroke="#4ade80" strokeWidth="14" strokeLinecap="round"/>
      <path d="M76 170 A84 84 0 0 1 244 170" fill="none" stroke="#38bdf8" strokeWidth="14" strokeLinecap="round"/>
    </svg>

    
    <svg className="cloud-drift-1 absolute top-14 left-0 w-32 h-20 opacity-95" viewBox="0 0 160 95">
      <path d="M35 76 H125 A22 22 0 0 0 123 33 A28 28 0 0 0 70 25 A24 24 0 0 0 33 44 A18 18 0 0 0 35 76 Z"
        fill="#ffffff" stroke="#1e1b4b" strokeWidth="4" strokeLinejoin="round"/>
    </svg>

    
    <svg className="cloud-drift-2 absolute top-36 left-0 w-28 h-16 opacity-90" viewBox="0 0 160 95">
      <path d="M35 76 H125 A22 22 0 0 0 123 33 A28 28 0 0 0 70 25 A24 24 0 0 0 33 44 A18 18 0 0 0 35 76 Z"
        fill="#ffffff" stroke="#1e1b4b" strokeWidth="4" strokeLinejoin="round"/>
    </svg>

    
    <svg className="star-twinkle absolute top-24 left-[28%] w-7 h-7" viewBox="0 0 40 40">
      <polygon points="20,2 25,15 38,20 25,25 20,38 15,25 2,20 15,15" fill="#fde047" stroke="#1e1b4b" strokeWidth="3" strokeLinejoin="round"/>
    </svg>
    <svg className="star-twinkle absolute top-44 right-[14%] w-6 h-6" style={{ animationDelay: "1.1s" }} viewBox="0 0 40 40">
      <polygon points="20,2 25,15 38,20 25,25 20,38 15,25 2,20 15,15" fill="#f472b6" stroke="#1e1b4b" strokeWidth="3" strokeLinejoin="round"/>
    </svg>

    
    <svg className="absolute bottom-0 left-0 w-full h-28 sm:h-36" viewBox="0 0 1440 220" preserveAspectRatio="none">
      <path d="M0,110 Q360,20 760,115 T1440,85 L1440,220 L0,220 Z" fill="#34d399" stroke="#1e1b4b" strokeWidth="6"/>
      <path d="M0,145 Q440,215 920,130 T1440,155 L1440,220 L0,220 Z" fill="#4ade80" stroke="#1e1b4b" strokeWidth="6"/>
    </svg>
    </div>
  );
}
