const fs = require("fs");
const path = require("path");

const outDir = path.join(process.cwd(), "public", "assets", "ui", "start-3d");
fs.mkdirSync(outDir, { recursive: true });

function write(name, svg) {
  fs.writeFileSync(path.join(outDir, name), svg.trim() + "\n", "utf8");
}

function svg(w, h, body) {
  return `
<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none" xmlns="http://www.w3.org/2000/svg">
${body}
</svg>`;
}

function goldButtonFrame() {
  return svg(760, 160, `
<defs>
  <linearGradient id="goldMain" x1="70" y1="20" x2="690" y2="135" gradientUnits="userSpaceOnUse">
    <stop offset="0" stop-color="#FFF4B8"/>
    <stop offset="0.35" stop-color="#FFD166"/>
    <stop offset="0.72" stop-color="#D99622"/>
    <stop offset="1" stop-color="#8B4A00"/>
  </linearGradient>

  <linearGradient id="goldInner" x1="90" y1="30" x2="670" y2="120" gradientUnits="userSpaceOnUse">
    <stop offset="0" stop-color="#FFF7D6"/>
    <stop offset="0.5" stop-color="#F5B83E"/>
    <stop offset="1" stop-color="#B96B05"/>
  </linearGradient>

  <linearGradient id="shine" x1="110" y1="30" x2="650" y2="70" gradientUnits="userSpaceOnUse">
    <stop stop-color="#FFFFFF" stop-opacity="0.9"/>
    <stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/>
  </linearGradient>

  <filter id="shadow" x="0" y="0" width="760" height="180" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
    <feDropShadow dx="0" dy="16" stdDeviation="12" flood-color="#0F172A" flood-opacity="0.35"/>
  </filter>
</defs>

<rect x="82" y="39" width="596" height="96" rx="34" fill="#7A3E00"/>
<rect x="82" y="24" width="596" height="96" rx="34" fill="url(#goldMain)" filter="url(#shadow)"/>
<rect x="96" y="35" width="568" height="72" rx="26" fill="url(#goldInner)"/>
<rect x="98" y="37" width="564" height="68" rx="24" stroke="#FFF7D6" stroke-opacity="0.75" stroke-width="4"/>

<path d="M120 34H640C658 34 672 48 672 66V72C672 72 560 48 380 48C200 48 88 72 88 72V66C88 48 102 34 120 34Z" fill="url(#shine)"/>

<!-- left ornament -->
<g transform="translate(16 28)">
  <path d="M70 48C47 48 39 29 56 16C51 34 78 28 82 4C96 31 78 47 70 48Z" fill="#D99622"/>
  <path d="M54 48C37 43 30 58 18 72C40 72 50 65 54 48Z" fill="#B96B05"/>
  <path d="M54 50C35 53 29 78 4 80C29 91 52 75 61 57" fill="#F5B83E"/>
  <path d="M76 50C92 56 98 76 116 78C100 91 78 75 70 58" fill="#B96B05"/>
  <circle cx="66" cy="50" r="10" fill="#FFF4B8"/>
</g>

<!-- right ornament -->
<g transform="translate(744 28) scale(-1 1)">
  <path d="M70 48C47 48 39 29 56 16C51 34 78 28 82 4C96 31 78 47 70 48Z" fill="#D99622"/>
  <path d="M54 48C37 43 30 58 18 72C40 72 50 65 54 48Z" fill="#B96B05"/>
  <path d="M54 50C35 53 29 78 4 80C29 91 52 75 61 57" fill="#F5B83E"/>
  <path d="M76 50C92 56 98 76 116 78C100 91 78 75 70 58" fill="#B96B05"/>
  <circle cx="66" cy="50" r="10" fill="#FFF4B8"/>
</g>

<circle cx="104" cy="40" r="5" fill="#FFFFFF"/>
<circle cx="650" cy="34" r="4" fill="#FFFFFF"/>
`);
}

function blueButtonFrame() {
  return svg(360, 96, `
<defs>
  <linearGradient id="blueMain" x1="22" y1="10" x2="338" y2="84" gradientUnits="userSpaceOnUse">
    <stop offset="0" stop-color="#0B4B82"/>
    <stop offset="0.55" stop-color="#062B55"/>
    <stop offset="1" stop-color="#03162D"/>
  </linearGradient>

  <linearGradient id="goldStroke" x1="22" y1="10" x2="338" y2="84" gradientUnits="userSpaceOnUse">
    <stop stop-color="#FFF7D6"/>
    <stop offset="0.5" stop-color="#FFD166"/>
    <stop offset="1" stop-color="#9A5A00"/>
  </linearGradient>

  <linearGradient id="shine" x1="40" y1="18" x2="310" y2="44" gradientUnits="userSpaceOnUse">
    <stop stop-color="#FFFFFF" stop-opacity="0.65"/>
    <stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/>
  </linearGradient>

  <filter id="shadow" x="0" y="0" width="360" height="110" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
    <feDropShadow dx="0" dy="10" stdDeviation="9" flood-color="#0F172A" flood-opacity="0.35"/>
  </filter>
</defs>

<rect x="20" y="24" width="320" height="58" rx="25" fill="#020617"/>
<rect x="20" y="12" width="320" height="58" rx="25" fill="url(#blueMain)" filter="url(#shadow)"/>
<rect x="25" y="17" width="310" height="48" rx="20" stroke="url(#goldStroke)" stroke-width="4"/>
<rect x="32" y="22" width="296" height="18" rx="9" fill="url(#shine)"/>
`);
}

function logoPlaqueFrame() {
  return svg(760, 440, `
<defs>
  <linearGradient id="bluePlaque" x1="64" y1="70" x2="696" y2="372" gradientUnits="userSpaceOnUse">
    <stop offset="0" stop-color="#0C3763"/>
    <stop offset="0.45" stop-color="#071F43"/>
    <stop offset="1" stop-color="#041226"/>
  </linearGradient>

  <linearGradient id="gold" x1="60" y1="40" x2="700" y2="396" gradientUnits="userSpaceOnUse">
    <stop stop-color="#FFF7D6"/>
    <stop offset="0.32" stop-color="#FFD166"/>
    <stop offset="0.7" stop-color="#C17A10"/>
    <stop offset="1" stop-color="#6B3500"/>
  </linearGradient>

  <linearGradient id="shine" x1="110" y1="80" x2="620" y2="150" gradientUnits="userSpaceOnUse">
    <stop stop-color="#FFFFFF" stop-opacity="0.45"/>
    <stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/>
  </linearGradient>

  <filter id="shadow" x="0" y="0" width="760" height="460" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
    <feDropShadow dx="0" dy="18" stdDeviation="18" flood-color="#020617" flood-opacity="0.45"/>
  </filter>
</defs>

<path
  d="M118 118
     C118 78 154 62 194 68
     H566
     C606 62 642 78 642 118
     C694 126 714 170 690 214
     C714 258 694 302 642 310
     C642 350 606 366 566 360
     H194
     C154 366 118 350 118 310
     C66 302 46 258 70 214
     C46 170 66 126 118 118Z"
  fill="url(#gold)"
  filter="url(#shadow)"
/>

<path
  d="M132 126
     C132 92 162 82 196 86
     H564
     C598 82 628 92 628 126
     C670 136 682 174 662 214
     C682 254 670 292 628 302
     C628 336 598 346 564 342
     H196
     C162 346 132 336 132 302
     C90 292 78 254 98 214
     C78 174 90 136 132 126Z"
  fill="url(#bluePlaque)"
/>

<path
  d="M142 134
     C142 104 166 98 198 100
     H562
     C594 98 618 104 618 134
     C650 144 658 176 642 214
     C658 252 650 284 618 294
     C618 324 594 330 562 328
     H198
     C166 330 142 324 142 294
     C110 284 102 252 118 214
     C102 176 110 144 142 134Z"
  stroke="url(#gold)"
  stroke-width="6"
/>

<path d="M180 100H580C610 100 624 114 624 144V152C624 152 520 118 380 118C240 118 136 152 136 152V144C136 114 150 100 180 100Z" fill="url(#shine)"/>

<!-- top gold ornament -->
<g transform="translate(310 0)">
  <path d="M70 84C48 58 62 28 70 6C78 28 92 58 70 84Z" fill="url(#gold)"/>
  <path d="M70 84C45 66 28 62 8 70C26 42 48 50 70 84Z" fill="url(#gold)"/>
  <path d="M70 84C95 66 112 62 132 70C114 42 92 50 70 84Z" fill="url(#gold)"/>
  <circle cx="70" cy="78" r="10" fill="#FFF7D6"/>
</g>

<!-- lower ribbon -->
<path d="M170 320H590L560 372H200L170 320Z" fill="#061A36" stroke="url(#gold)" stroke-width="4"/>
`);
}

function welcomePlaqueFrame() {
  return svg(620, 140, `
<defs>
  <linearGradient id="blue" x1="20" y1="14" x2="600" y2="120" gradientUnits="userSpaceOnUse">
    <stop stop-color="#0B4B82"/>
    <stop offset="0.55" stop-color="#062B55"/>
    <stop offset="1" stop-color="#03162D"/>
  </linearGradient>

  <linearGradient id="gold" x1="20" y1="10" x2="600" y2="126" gradientUnits="userSpaceOnUse">
    <stop stop-color="#FFF7D6"/>
    <stop offset="0.45" stop-color="#FFD166"/>
    <stop offset="1" stop-color="#8B4A00"/>
  </linearGradient>

  <filter id="shadow" x="0" y="0" width="620" height="160" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
    <feDropShadow dx="0" dy="12" stdDeviation="10" flood-color="#0F172A" flood-opacity="0.35"/>
  </filter>
</defs>

<path d="M70 40H550C570 40 586 56 586 76V114H34V76C34 56 50 40 70 40Z" fill="#020617"/>
<path d="M70 28H550C570 28 586 44 586 64V102H34V64C34 44 50 28 70 28Z" fill="url(#blue)" filter="url(#shadow)"/>
<path d="M44 92H576" stroke="url(#gold)" stroke-width="5"/>
<path d="M70 28H550C570 28 586 44 586 64V102H34V64C34 44 50 28 70 28Z" stroke="url(#gold)" stroke-width="4"/>

<circle cx="310" cy="30" r="28" fill="url(#gold)"/>
<path d="M310 12L316 25L330 26L319 35L322 49L310 42L298 49L301 35L290 26L304 25L310 12Z" fill="#FFF7D6"/>
`);
}

function progressFrame() {
  return svg(720, 70, `
<defs>
  <linearGradient id="gold" x1="14" y1="10" x2="706" y2="60" gradientUnits="userSpaceOnUse">
    <stop stop-color="#FFF7D6"/>
    <stop offset="0.45" stop-color="#FFD166"/>
    <stop offset="1" stop-color="#8B4A00"/>
  </linearGradient>

  <linearGradient id="blueFill" x1="28" y1="20" x2="620" y2="48" gradientUnits="userSpaceOnUse">
    <stop stop-color="#00A6FF"/>
    <stop offset="0.55" stop-color="#0284C7"/>
    <stop offset="1" stop-color="#38BDF8"/>
  </linearGradient>

  <filter id="shadow" x="0" y="0" width="720" height="90" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
    <feDropShadow dx="0" dy="8" stdDeviation="8" flood-color="#0F172A" flood-opacity="0.35"/>
  </filter>
</defs>

<rect x="18" y="18" width="684" height="34" rx="17" fill="#020617"/>
<rect x="18" y="10" width="684" height="34" rx="17" fill="url(#gold)" filter="url(#shadow)"/>
<rect x="28" y="18" width="664" height="18" rx="9" fill="#061A36"/>
<rect x="28" y="18" width="560" height="18" rx="9" fill="url(#blueFill)"/>
<rect x="34" y="20" width="540" height="6" rx="3" fill="#FFFFFF" opacity="0.55"/>
<circle cx="590" cy="20" r="5" fill="#FFFFFF"/>
`);
}

function waxSealS() {
  return svg(220, 220, `
<defs>
  <radialGradient id="waxOuter" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(76 54) rotate(42) scale(132)">
    <stop offset="0" stop-color="#FF7A8F"/>
    <stop offset="0.38" stop-color="#D93A57"/>
    <stop offset="0.72" stop-color="#A81F3B"/>
    <stop offset="1" stop-color="#7C132A"/>
  </radialGradient>

  <radialGradient id="waxInner" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(96 82) rotate(35) scale(86)">
    <stop offset="0" stop-color="#F25F77"/>
    <stop offset="0.52" stop-color="#B92541"/>
    <stop offset="1" stop-color="#83162D"/>
  </radialGradient>

  <linearGradient id="emboss" x1="72" y1="70" x2="144" y2="145" gradientUnits="userSpaceOnUse">
    <stop offset="0" stop-color="#F7A9B7"/>
    <stop offset="1" stop-color="#761225"/>
  </linearGradient>

  <filter id="shadow" x="0" y="0" width="220" height="240" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
    <feDropShadow dx="0" dy="12" stdDeviation="10" flood-color="#020617" flood-opacity="0.45"/>
  </filter>
</defs>

<g filter="url(#shadow)">
  <path d="M110 18C119 25 130 22 138 27C147 32 158 32 165 40C172 47 182 52 187 62C192 72 199 82 197 94C195 105 201 117 196 128C191 139 193 151 184 160C176 169 168 180 156 183C145 187 136 195 123 193C111 191 101 198 89 193C77 188 66 190 57 181C48 173 36 168 31 157C26 147 18 137 18 125C18 113 13 103 17 91C21 79 19 68 26 58C33 49 36 37 47 32C58 27 68 20 80 22C92 24 101 13 110 18Z" fill="url(#waxOuter)"/>
</g>

<circle cx="110" cy="110" r="55" fill="#8E1830"/>
<circle cx="110" cy="110" r="50" fill="url(#waxInner)"/>
<circle cx="110" cy="110" r="50" stroke="#761327" stroke-width="6"/>
<circle cx="110" cy="110" r="37" stroke="#9E2740" stroke-width="4"/>

<path d="M72 64C84 54 104 48 124 51C138 53 149 59 156 66" stroke="#FFD5DC" stroke-opacity="0.72" stroke-width="9" stroke-linecap="round"/>

<text x="110" y="135" text-anchor="middle" font-size="86" font-weight="900" font-family="Georgia, serif" fill="url(#emboss)">S</text>

<path d="M73 112C84 92 136 90 148 112" stroke="#7C132A" stroke-opacity="0.38" stroke-width="5" stroke-linecap="round"/>

<ellipse cx="70" cy="80" rx="7" ry="4.8" fill="#F4A4B1" fill-opacity="0.38"/>
<ellipse cx="150" cy="72" rx="6" ry="4" fill="#FFD2D9" fill-opacity="0.42"/>
<path d="M176 162C180 180 166 195 156 204C180 202 196 184 188 160Z" fill="#8E1830"/>
<circle cx="160" cy="206" r="10" fill="#A81F3B"/>
`);
}

function iconUser() {
  return svg(80, 80, `
<defs>
  <linearGradient id="gold" x1="10" y1="6" x2="70" y2="74" gradientUnits="userSpaceOnUse">
    <stop stop-color="#FFF7D6"/>
    <stop offset="1" stop-color="#D99622"/>
  </linearGradient>
</defs>
<circle cx="40" cy="24" r="16" fill="url(#gold)"/>
<path d="M14 72C17 52 28 43 40 43C52 43 63 52 66 72H14Z" fill="url(#gold)"/>
`);
}

function iconCloud() {
  return svg(80, 80, `
<defs>
  <linearGradient id="gold" x1="10" y1="12" x2="70" y2="62" gradientUnits="userSpaceOnUse">
    <stop stop-color="#FFF7D6"/>
    <stop offset="1" stop-color="#D99622"/>
  </linearGradient>
</defs>
<path d="M25 62H58C69 62 75 55 75 46C75 37 68 31 60 31C57 20 48 14 38 14C25 14 16 24 16 37C8 39 4 45 4 52C4 58 10 62 25 62Z" fill="url(#gold)"/>
`);
}

function goldOrnament() {
  return svg(120, 50, `
<defs>
  <linearGradient id="gold" x1="0" y1="0" x2="120" y2="50" gradientUnits="userSpaceOnUse">
    <stop stop-color="#FFF7D6"/>
    <stop offset="0.5" stop-color="#FFD166"/>
    <stop offset="1" stop-color="#8B4A00"/>
  </linearGradient>
</defs>
<path d="M60 4C64 16 72 20 88 14C80 26 70 30 60 26C50 30 40 26 32 14C48 20 56 16 60 4Z" fill="url(#gold)"/>
<path d="M10 25H46M74 25H110" stroke="url(#gold)" stroke-width="5" stroke-linecap="round"/>
<path d="M46 25L60 36L74 25L60 14L46 25Z" fill="url(#gold)"/>
`);
}

write("gold-button-frame.svg", goldButtonFrame());
write("blue-button-frame.svg", blueButtonFrame());
write("logo-plaque-frame.svg", logoPlaqueFrame());
write("welcome-plaque-frame.svg", welcomePlaqueFrame());
write("progress-frame.svg", progressFrame());
write("wax-seal-s.svg", waxSealS());
write("icon-user.svg", iconUser());
write("icon-cloud.svg", iconCloud());
write("gold-ornament.svg", goldOrnament());

console.log("✅ Start screen 3D assetleri oluşturuldu:");
console.log(outDir);
