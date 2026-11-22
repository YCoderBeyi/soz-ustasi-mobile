const fs = require("fs");
const path = require("path");
const dir = "public/assets/ui/start";

const gold = `<svg width="760" height="160" viewBox="0 0 760 160" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gG" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#fbbf24"/>
      <stop offset="40%" stop-color="#f59e0b"/>
      <stop offset="50%" stop-color="#d97706"/>
      <stop offset="60%" stop-color="#f59e0b"/>
      <stop offset="100%" stop-color="#b45309"/>
    </linearGradient>
    <linearGradient id="gS" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="rgba(255,255,255,0.35)"/>
      <stop offset="50%" stop-color="rgba(255,255,255,0)"/>
      <stop offset="100%" stop-color="rgba(0,0,0,0.25)"/>
    </linearGradient>
    <filter id="gSh">
      <feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="rgba(120,50,0,0.4)"/>
    </filter>
  </defs>
  <rect x="2" y="2" width="756" height="156" rx="28" fill="url(#gG)" filter="url(#gSh)"/>
  <rect x="6" y="6" width="748" height="148" rx="24" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>
  <rect x="2" y="2" width="756" height="78" rx="28" fill="url(#gS)"/>
  <rect x="2" y="2" width="756" height="78" rx="28" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>
  <path d="M30 130 Q380 145 730 130" stroke="rgba(255,255,255,0.12)" stroke-width="2" fill="none"/>
</svg>`;

const blue = `<svg width="360" height="96" viewBox="0 0 360 96" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bG" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1e3a5f"/>
      <stop offset="50%" stop-color="#0a1929"/>
      <stop offset="100%" stop-color="#07101e"/>
    </linearGradient>
    <linearGradient id="bS" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="rgba(255,255,255,0.2)"/>
      <stop offset="40%" stop-color="rgba(255,255,255,0)"/>
      <stop offset="100%" stop-color="rgba(0,0,0,0.3)"/>
    </linearGradient>
    <linearGradient id="bGld" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#fbbf24"/>
      <stop offset="50%" stop-color="#d97706"/>
      <stop offset="100%" stop-color="#92400e"/>
    </linearGradient>
    <filter id="bSh">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="rgba(0,0,0,0.5)"/>
    </filter>
  </defs>
  <rect x="1" y="1" width="358" height="94" rx="16" fill="url(#bG)" stroke="url(#bGld)" stroke-width="3" filter="url(#bSh)"/>
  <rect x="5" y="5" width="350" height="86" rx="13" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
  <rect x="1" y="1" width="358" height="47" rx="16" fill="url(#bS)"/>
</svg>`;

const welcome = `<svg width="620" height="150" viewBox="0 0 620 150" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="wG" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1e3a5f"/>
      <stop offset="50%" stop-color="#0a1929"/>
      <stop offset="100%" stop-color="#07101e"/>
    </linearGradient>
    <linearGradient id="wGld" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#fbbf24"/>
      <stop offset="50%" stop-color="#d97706"/>
      <stop offset="100%" stop-color="#92400e"/>
    </linearGradient>
    <linearGradient id="wS" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="rgba(255,255,255,0.18)"/>
      <stop offset="50%" stop-color="rgba(255,255,255,0)"/>
      <stop offset="100%" stop-color="rgba(0,0,0,0.2)"/>
    </linearGradient>
    <filter id="wSh">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="rgba(0,0,0,0.4)"/>
    </filter>
  </defs>
  <rect x="2" y="10" width="616" height="130" rx="10" fill="url(#wG)" stroke="url(#wGld)" stroke-width="2.5" filter="url(#wSh)"/>
  <rect x="2" y="10" width="616" height="40" rx="10" fill="url(#wS)"/>
  <path d="M290 10 L295 0 L300 6 L310 0 L310 10 Z" fill="url(#wGld)"/>
  <path d="M280 10 L290 4 L295 10" fill="url(#wGld)"/>
  <path d="M310 10 L320 4 L330 10" fill="url(#wGld)"/>
  <path d="M30 50 Q50 40 60 55 Q70 40 90 50" stroke="url(#wGld)" stroke-width="1.5" fill="none"/>
  <path d="M530 50 Q550 40 560 55 Q570 40 590 50" stroke="url(#wGld)" stroke-width="1.5" fill="none"/>
  <path d="M30 100 Q50 110 60 95 Q70 110 90 100" stroke="url(#wGld)" stroke-width="1.5" fill="none"/>
  <path d="M530 100 Q550 110 560 95 Q570 110 590 100" stroke="url(#wGld)" stroke-width="1.5" fill="none"/>
</svg>`;

fs.writeFileSync(path.join(dir, "button-gold-frame.svg"), gold);
console.log("button-gold-frame.svg OK");

fs.writeFileSync(path.join(dir, "button-blue-frame.svg"), blue);
console.log("button-blue-frame.svg OK");

fs.writeFileSync(path.join(dir, "welcome-plaque.svg"), welcome);
console.log("welcome-plaque.svg OK");
