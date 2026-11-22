const fs = require("fs");
const path = require("path");

const outDir = path.join(process.cwd(), "public", "assets", "ui", "v2");
fs.mkdirSync(outDir, { recursive: true });

function write(name, content) {
  fs.writeFileSync(path.join(outDir, name), content.trim() + "\n", "utf8");
}

function svg(w, h, body) {
  return `
<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none" xmlns="http://www.w3.org/2000/svg">
${body}
</svg>`;
}

const shadow = `
<filter id="shadow" x="-20%" y="-20%" width="140%" height="150%" color-interpolation-filters="sRGB">
  <feDropShadow dx="0" dy="10" stdDeviation="8" flood-color="#0F172A" flood-opacity="0.28"/>
</filter>
`;

function iconButton({ base1, base2, depth, icon }) {
  return svg(128, 128, `
<defs>
  ${shadow}
  <linearGradient id="base" x1="18" y1="12" x2="110" y2="110" gradientUnits="userSpaceOnUse">
    <stop stop-color="${base1}"/>
    <stop offset="1" stop-color="${base2}"/>
  </linearGradient>
  <linearGradient id="shine" x1="34" y1="18" x2="94" y2="54" gradientUnits="userSpaceOnUse">
    <stop stop-color="#FFFFFF" stop-opacity="0.8"/>
    <stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/>
  </linearGradient>
</defs>

<rect x="18" y="24" width="92" height="92" rx="31" fill="${depth}"/>
<rect x="18" y="12" width="92" height="92" rx="31" fill="url(#base)" filter="url(#shadow)"/>
<rect x="22" y="16" width="84" height="84" rx="27" stroke="#FFFFFF" stroke-opacity="0.42" stroke-width="4"/>

<path d="M38 20H90C99 20 106 27 106 36V42C106 42 89 32 64 32C39 32 22 42 22 42V36C22 27 29 20 38 20Z" fill="url(#shine)"/>

<g transform="translate(32 32)">
${icon}
</g>
`);
}

const icons = {
  back: `
<path d="M39 12L16 32L39 52" stroke="#FFFFFF" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
`,
  settings: `
<path d="M32 4L39 8L46 6L52 15L49 22L55 29V39L49 46L52 53L46 62L39 60L32 64L25 60L18 62L12 53L15 46L9 39V29L15 22L12 15L18 6L25 8L32 4Z" fill="#FFFFFF"/>
<circle cx="32" cy="34" r="12" fill="#64748B"/>
<circle cx="32" cy="34" r="5" fill="#FFFFFF"/>
`,
  hint: `
<path d="M32 5C20 5 11 14 11 25C11 33 15 39 21 43C23 44 24 47 24 50V53H40V50C40 47 41 44 43 43C49 39 53 33 53 25C53 14 44 5 32 5Z" fill="#FFF7D6"/>
<path d="M24 58H40" stroke="#8A4B00" stroke-width="5" stroke-linecap="round"/>
<path d="M27 64H37" stroke="#8A4B00" stroke-width="5" stroke-linecap="round"/>
<path d="M32 0V-5M10 10L5 5M54 10L59 5" stroke="#FFF7D6" stroke-width="5" stroke-linecap="round"/>
`,
  shuffle: `
<path d="M5 20H18C27 20 31 32 40 32H50" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round"/>
<path d="M5 48H18C27 48 31 36 40 36H50" stroke="#DBEAFE" stroke-width="8" stroke-linecap="round"/>
<path d="M48 18L63 32L48 46V18Z" fill="#FFFFFF"/>
<path d="M48 34L63 48L48 62V34Z" fill="#DBEAFE"/>
`,
  tasks: `
<circle cx="32" cy="32" r="27" fill="#FFFFFF"/>
<circle cx="32" cy="32" r="20" fill="#FB7185"/>
<circle cx="32" cy="32" r="12" fill="#FFFFFF"/>
<circle cx="32" cy="32" r="5" fill="#FB7185"/>
<path d="M43 21L60 4" stroke="#1F2937" stroke-width="6" stroke-linecap="round"/>
<path d="M55 4H64V13" stroke="#1F2937" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
`,
  dictionary: `
<path d="M7 12C7 8.7 9.7 6 13 6H29C34 6 37 9 37 14V61C37 56 33 53 27 53H13C9.7 53 7 50.3 7 47V12Z" fill="#FFFFFF"/>
<path d="M57 12C57 8.7 54.3 6 51 6H35C30 6 27 9 27 14V61C27 56 31 53 37 53H51C54.3 53 57 50.3 57 47V12Z" fill="#D1FAE5"/>
<path d="M16 20H28M16 31H27M39 20H50M39 31H49" stroke="#15803D" stroke-width="4" stroke-linecap="round"/>
`,
  map: `
<path d="M8 13L25 7L41 13L56 7V54L41 60L25 54L8 60V13Z" fill="#FFFFFF"/>
<path d="M25 7V54M41 13V60" stroke="#38BDF8" stroke-width="4"/>
<path d="M34 38C34 38 47 28 47 18C47 11 41 6 34 6C27 6 21 11 21 18C21 28 34 38 34 38Z" fill="#FB7185"/>
<circle cx="34" cy="18" r="6" fill="#FFFFFF"/>
`,
  shop: `
<path d="M11 23H53L49 61H15L11 23Z" fill="#FFFFFF"/>
<path d="M20 23V17C20 10 25 5 32 5C39 5 44 10 44 17V23" stroke="#6D28D9" stroke-width="6" stroke-linecap="round"/>
<circle cx="23" cy="35" r="3.5" fill="#6D28D9"/>
<circle cx="41" cy="35" r="3.5" fill="#6D28D9"/>
<path d="M24 47C28 51 36 51 40 47" stroke="#6D28D9" stroke-width="5" stroke-linecap="round"/>
`,
  profile: `
<circle cx="32" cy="22" r="15" fill="#FFFFFF"/>
<path d="M8 62C10 46 20 39 32 39C44 39 54 46 56 62H8Z" fill="#FFFFFF"/>
`,
  coin: `
<circle cx="32" cy="32" r="28" fill="#FFE082"/>
<circle cx="32" cy="32" r="21" fill="#F59E0B"/>
<path d="M32 14L37 25L49 26.5L40.5 35L42.5 47L32 41L21.5 47L23.5 35L15 26.5L27 25L32 14Z" fill="#FFF7D6"/>
`,
  timer: `
<circle cx="32" cy="35" r="24" fill="#FFFFFF"/>
<circle cx="32" cy="35" r="17" fill="#DBEAFE"/>
<path d="M32 23V35L42 41" stroke="#0284C7" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M24 5H40" stroke="#FFFFFF" stroke-width="7" stroke-linecap="round"/>
`,
};

function resourcePill({ type }) {
  const isCoin = type === "coin";
  return svg(230, 72, `
<defs>
  ${shadow}
  <linearGradient id="pill" x1="14" y1="8" x2="216" y2="62" gradientUnits="userSpaceOnUse">
    <stop stop-color="#FFF9EF"/>
    <stop offset="1" stop-color="${isCoin ? "#F4E6C8" : "#D8E4F0"}"/>
  </linearGradient>
</defs>
<rect x="18" y="16" width="194" height="46" rx="23" fill="${isCoin ? "#8A6622" : "#172235"}"/>
<rect x="18" y="8" width="194" height="46" rx="23" fill="url(#pill)" filter="url(#shadow)"/>
<rect x="22" y="12" width="186" height="38" rx="19" stroke="#FFFFFF" stroke-opacity="0.55" stroke-width="3"/>
<circle cx="46" cy="31" r="25" fill="${isCoin ? "#D9A441" : "#3A5068"}"/>
<g transform="translate(14 -1) scale(0.8)">${isCoin ? icons.coin : icons.timer}</g>
`);
}

function waxSealButton() {
  return svg(128, 128, `
<defs>
  <radialGradient id="waxOuter" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(48 36) rotate(42) scale(78)">
    <stop offset="0" stop-color="#FF7A8F"/>
    <stop offset="0.38" stop-color="#D93A57"/>
    <stop offset="0.72" stop-color="#A81F3B"/>
    <stop offset="1" stop-color="#7C132A"/>
  </radialGradient>
  <radialGradient id="waxInner" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(58 48) rotate(35) scale(52)">
    <stop offset="0" stop-color="#F25F77"/>
    <stop offset="0.52" stop-color="#B92541"/>
    <stop offset="1" stop-color="#83162D"/>
  </radialGradient>
  <linearGradient id="highlight" x1="38" y1="28" x2="89" y2="54" gradientUnits="userSpaceOnUse">
    <stop offset="0" stop-color="#FFD5DC" stop-opacity="0.85"/>
    <stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/>
  </linearGradient>
  <linearGradient id="emboss" x1="48" y1="42" x2="84" y2="84" gradientUnits="userSpaceOnUse">
    <stop offset="0" stop-color="#F7A9B7"/>
    <stop offset="1" stop-color="#761225"/>
  </linearGradient>
  <filter id="outerShadow" x="4" y="8" width="120" height="120" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
    <feDropShadow dx="0" dy="10" stdDeviation="8" flood-color="#0F172A" flood-opacity="0.30"/>
  </filter>
</defs>
<g filter="url(#outerShadow)">
  <path d="M64 14C69 18 76 16 81 19C86 22 93 22 97 27C101 31 107 34 110 40C113 46 117 52 116 59C115 65 118 72 115 78C112 84 113 91 108 96C103 101 99 107 92 109C86 111 80 116 73 115C66 114 60 118 53 115C46 112 39 113 34 108C29 103 22 100 19 94C16 88 11 82 11 75C11 68 8 62 10 55C12 48 11 41 15 35C19 30 21 23 28 20C34 17 40 13 47 14C54 15 59 11 64 14Z" fill="url(#waxOuter)"/>
</g>
<circle cx="64" cy="64" r="31" fill="#8E1830"/>
<circle cx="64" cy="64" r="28.5" fill="url(#waxInner)"/>
<circle cx="64" cy="64" r="28.5" stroke="#761327" stroke-width="3"/>
<circle cx="64" cy="64" r="20.5" stroke="#9E2740" stroke-width="2.5"/>
<path d="M41 35C48 29 59 26 71 27C78 28 84 31 88 35" stroke="url(#highlight)" stroke-width="6" stroke-linecap="round"/>
<path d="M73 49C70 45 65 43 60 44C54 45 50 49 50 55C50 61 55 64 62 65C67 66 70 67 70 71C70 75 66 77 61 76C56 75 53 73 50 69" stroke="url(#emboss)" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M56 51C60 48 66 48 70 52" stroke="#FFD3DA" stroke-opacity="0.45" stroke-width="3" stroke-linecap="round"/>
<ellipse cx="43" cy="47" rx="4" ry="2.8" fill="#F4A4B1" fill-opacity="0.38"/>
<ellipse cx="85" cy="42" rx="3.5" ry="2.4" fill="#FFD2D9" fill-opacity="0.42"/>
`);
}

function wordTileEmpty() {
  return svg(96, 96, `
<defs>
  ${shadow}
  <linearGradient id="tile" x1="12" y1="8" x2="84" y2="84" gradientUnits="userSpaceOnUse">
    <stop stop-color="#FFF9EF"/><stop offset="1" stop-color="#F4E6C8"/>
  </linearGradient>
</defs>
<rect x="14" y="18" width="68" height="68" rx="18" fill="#6B4E15"/>
<rect x="14" y="10" width="68" height="68" rx="18" fill="url(#tile)" filter="url(#shadow)"/>
<rect x="18" y="14" width="60" height="60" rx="15" stroke="#FFFFFF" stroke-opacity="0.55" stroke-width="3"/>
`);
}

function letterNode({ selected = false }) {
  return svg(96, 96, `
<defs>
  ${shadow}
  <linearGradient id="node" x1="12" y1="8" x2="84" y2="84" gradientUnits="userSpaceOnUse">
    <stop stop-color="${selected ? "#FFF7D6" : "#F4E6C8"}"/>
    <stop offset="1" stop-color="${selected ? "#F1C96A" : "#D9C4A0"}"/>
  </linearGradient>
</defs>
<rect x="14" y="18" width="68" height="68" rx="24" fill="${selected ? "#8A6622" : "#4B3323"}"/>
<rect x="14" y="10" width="68" height="68" rx="24" fill="url(#node)" filter="url(#shadow)"/>
<rect x="18" y="14" width="60" height="60" rx="20" stroke="#FFFFFF" stroke-opacity="0.5" stroke-width="3"/>
`);
}

function wordTileFilled() {
  return svg(96, 96, `
<defs>
  ${shadow}
  <linearGradient id="tileFill" x1="12" y1="8" x2="84" y2="84" gradientUnits="userSpaceOnUse">
    <stop stop-color="#FFF7D6"/><stop offset="1" stop-color="#F1C96A"/>
  </linearGradient>
</defs>
<rect x="14" y="18" width="68" height="68" rx="18" fill="#8A6622"/>
<rect x="14" y="10" width="68" height="68" rx="18" fill="url(#tileFill)" filter="url(#shadow)"/>
<rect x="18" y="14" width="60" height="60" rx="15" stroke="#FFFFFF" stroke-opacity="0.55" stroke-width="3"/>
`);
}

function wideButtonFrame({ color1, color2, depth, w = 360 }) {
  const h = 86;
  return svg(w, h, `
<defs>
  ${shadow}
  <linearGradient id="wideBtn" x1="12" y1="8" x2="${w - 12}" y2="76" gradientUnits="userSpaceOnUse">
    <stop stop-color="${color1}"/><stop offset="1" stop-color="${color2}"/>
  </linearGradient>
  <linearGradient id="wideShine" x1="20" y1="10" x2="${w - 40}" y2="40" gradientUnits="userSpaceOnUse">
    <stop stop-color="#FFFFFF" stop-opacity="0.72"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/>
  </linearGradient>
</defs>
<rect x="16" y="20" width="${w - 32}" height="52" rx="20" fill="${depth}"/>
<rect x="16" y="10" width="${w - 32}" height="52" rx="20" fill="url(#wideBtn)" filter="url(#shadow)"/>
<rect x="20" y="14" width="${w - 40}" height="44" rx="17" stroke="#FFFFFF" stroke-opacity="0.42" stroke-width="3"/>
<path d="M36 16H${w - 36}C${w - 24} 16 ${w - 16} 24 ${w - 16} 36V40C${w - 16} 40 ${Math.round(w * 0.55)} 30 ${Math.round(w * 0.5)} 30C${Math.round(w * 0.45)} 30 16 40 16 40V36C16 24 24 16 36 16Z" fill="url(#wideShine)"/>
`);
}

function tabPill({ active = false }) {
  return svg(180, 52, `
<defs>${shadow}
  <linearGradient id="tab" x1="10" y1="6" x2="170" y2="44" gradientUnits="userSpaceOnUse">
    <stop stop-color="${active ? "#FFF7D6" : "#E8DFCE"}"/>
    <stop offset="1" stop-color="${active ? "#F1C96A" : "#B8A98B"}"/>
  </linearGradient>
</defs>
<rect x="10" y="14" width="160" height="34" rx="17" fill="${active ? "#8A6622" : "#4B3323"}"/>
<rect x="10" y="8" width="160" height="34" rx="17" fill="url(#tab)" filter="url(#shadow)"/>
<rect x="14" y="12" width="152" height="26" rx="13" stroke="#FFFFFF" stroke-opacity="0.45" stroke-width="2"/>
`);
}

function panelFrame({ w, h, rx, depth, fill1, fill2, stroke = 0.42 }) {
  return svg(w, h, `
<defs>
  ${shadow}
  <linearGradient id="panelFill" x1="12" y1="8" x2="${w - 12}" y2="${h - 8}" gradientUnits="userSpaceOnUse">
    <stop stop-color="${fill1}"/><stop offset="1" stop-color="${fill2}"/>
  </linearGradient>
  <linearGradient id="panelShine" x1="24" y1="10" x2="${w - 40}" y2="48" gradientUnits="userSpaceOnUse">
    <stop stop-color="#FFFFFF" stop-opacity="0.55"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/>
  </linearGradient>
</defs>
<rect x="14" y="22" width="${w - 28}" height="${h - 30}" rx="${rx}" fill="${depth}"/>
<rect x="14" y="12" width="${w - 28}" height="${h - 30}" rx="${rx}" fill="url(#panelFill)" filter="url(#shadow)"/>
<rect x="18" y="16" width="${w - 36}" height="${h - 38}" rx="${rx - 4}" stroke="#FFFFFF" stroke-opacity="${stroke}" stroke-width="3"/>
<path d="M32 18H${w - 32}C${w - 20} 18 ${w - 12} 26 ${w - 12} 38V42C${w - 12} 42 ${Math.round(w * 0.55)} 32 ${Math.round(w * 0.5)} 32C${Math.round(w * 0.45)} 32 12 42 12 42V38C12 26 20 18 32 18Z" fill="url(#panelShine)"/>
`);
}

function meaningCardFrame() {
  const w = 380;
  const h = 108;
  return svg(w, h, `
<defs>
  ${shadow}
  <linearGradient id="parchment" x1="20" y1="10" x2="360" y2="98" gradientUnits="userSpaceOnUse">
    <stop stop-color="#FFF9EF"/><stop offset="1" stop-color="#F4E6C8"/>
  </linearGradient>
</defs>
<rect x="14" y="22" width="352" height="72" rx="18" fill="#6B4E15"/>
<rect x="14" y="12" width="352" height="72" rx="18" fill="url(#parchment)" filter="url(#shadow)"/>
<rect x="18" y="16" width="344" height="64" rx="15" stroke="#FFFFFF" stroke-opacity="0.5" stroke-width="3"/>
<path d="M28 24H42V28H32V38H28V24Z" fill="#D9A441" fill-opacity="0.45"/>
<path d="M352 24H338V28H348V38H352V24Z" fill="#D9A441" fill-opacity="0.45"/>
<path d="M28 84H42V80H32V70H28V84Z" fill="#8A6622" fill-opacity="0.35"/>
<path d="M352 84H338V80H348V70H352V84Z" fill="#8A6622" fill-opacity="0.35"/>
`);
}

function shopBuyFrame() {
  return svg(120, 52, `
<defs>${shadow}
  <linearGradient id="buy" x1="8" y1="6" x2="112" y2="44" gradientUnits="userSpaceOnUse">
    <stop stop-color="#7FD4A8"/><stop offset="1" stop-color="#3FBF7F"/>
  </linearGradient>
</defs>
<rect x="8" y="14" width="104" height="34" rx="17" fill="#1F6B4A"/>
<rect x="8" y="8" width="104" height="34" rx="17" fill="url(#buy)" filter="url(#shadow)"/>
<rect x="12" y="12" width="96" height="26" rx="13" stroke="#FFFFFF" stroke-opacity="0.42" stroke-width="2"/>
`);
}

function actionButton({ label, icon, color1, color2, depth }) {
  return svg(250, 86, `
<defs>
  ${shadow}
  <linearGradient id="btn" x1="12" y1="8" x2="238" y2="76" gradientUnits="userSpaceOnUse">
    <stop stop-color="${color1}"/><stop offset="1" stop-color="${color2}"/>
  </linearGradient>
</defs>
<rect x="16" y="20" width="218" height="52" rx="20" fill="${depth}"/>
<rect x="16" y="10" width="218" height="52" rx="20" fill="url(#btn)" filter="url(#shadow)"/>
<rect x="20" y="14" width="210" height="44" rx="17" stroke="#FFFFFF" stroke-opacity="0.38" stroke-width="3"/>
<g transform="translate(26 12) scale(0.62)">${icon}</g>
<text x="145" y="45" text-anchor="middle" font-size="22" font-weight="900" font-family="Inter, Arial, sans-serif" fill="white" stroke="#0F172A" stroke-opacity="0.25" stroke-width="3" paint-order="stroke">${label}</text>
`);
}

const ottoman = {
  goldHi: "#F1C96A",
  gold: "#D9A441",
  goldDeep: "#8A6622",
  navy: "#172235",
  navyDeep: "#101827",
  parchment: "#F4E6C8",
  ink: "#4B3323",
  emerald: "#3FBF7F",
  emeraldDeep: "#1F6B4A",
  burgundy: "#9F2D3E",
  burgundyDeep: "#6F1D2B",
};

write("01-back-button.svg", iconButton({ base1: ottoman.goldHi, base2: ottoman.gold, depth: ottoman.goldDeep, icon: icons.back }));
write("02-settings-button.svg", iconButton({ base1: ottoman.parchment, base2: "#B8A98B", depth: ottoman.ink, icon: icons.settings }));
write("03-coin-pill.svg", resourcePill({ type: "coin" }));
write("04-timer-pill.svg", resourcePill({ type: "timer" }));
write("05-wax-seal-button.svg", waxSealButton());
write("06-hint-action-button.svg", actionButton({ label: "İpucu", icon: icons.hint, color1: "#FFE082", color2: ottoman.gold, depth: ottoman.goldDeep }));
write("07-shuffle-action-button.svg", actionButton({ label: "Karıştır", icon: icons.shuffle, color1: "#7FD4A8", color2: ottoman.emerald, depth: ottoman.emeraldDeep }));
write("08-seal-action-button.svg", actionButton({ label: "Mühür", icon: `<g transform="scale(0.5)">${waxSealButton().replace(/<svg[^>]*>|<\/svg>/g, "")}</g>`, color1: "#E85D75", color2: ottoman.burgundy, depth: ottoman.burgundyDeep }));
write("09-bottom-tasks.svg", iconButton({ base1: "#E8A0A8", base2: ottoman.burgundy, depth: ottoman.burgundyDeep, icon: icons.tasks }));
write("10-bottom-dictionary.svg", iconButton({ base1: "#8FD9B0", base2: ottoman.emerald, depth: ottoman.emeraldDeep, icon: icons.dictionary }));
write("11-bottom-map-active.svg", iconButton({ base1: "#FFF7D6", base2: ottoman.goldHi, depth: ottoman.goldDeep, icon: icons.map }));
write("11-bottom-map.svg", iconButton({ base1: "#8A9BB0", base2: ottoman.navy, depth: ottoman.navyDeep, icon: icons.map }));
write("12-bottom-shop.svg", iconButton({ base1: "#E8C878", base2: "#A67C2E", depth: "#6B4E15", icon: icons.shop }));
write("13-bottom-profile.svg", iconButton({ base1: ottoman.parchment, base2: "#9A8B72", depth: ottoman.ink, icon: icons.profile }));
write("14-word-tile-empty.svg", wordTileEmpty());
write("15-letter-node.svg", letterNode({ selected: false }));
write("16-letter-node-selected.svg", letterNode({ selected: true }));
write("17-sound-button.svg", iconButton({ base1: ottoman.goldHi, base2: ottoman.gold, depth: ottoman.goldDeep, icon: `<path d="M9 25H21L37 11V53L21 39H9V25Z" fill="#FFFFFF"/><path d="M45 22C49 28 49 36 45 42" stroke="#FFF7D6" stroke-width="6" stroke-linecap="round"/><path d="M52 14C60 25 60 39 52 50" stroke="#FFF7D6" stroke-width="6" stroke-linecap="round"/>` }));
write("18-sound-off-button.svg", iconButton({ base1: "#B8A98B", base2: "#7A6B55", depth: ottoman.ink, icon: `<path d="M9 25H21L37 11V53L21 39H9V25Z" fill="#FFFFFF" fill-opacity="0.7"/><path d="M48 18L58 28M58 18L48 28" stroke="#FFF7D6" stroke-width="6" stroke-linecap="round"/>` }));
write("19-close-button.svg", iconButton({ base1: "#E8A0A8", base2: ottoman.burgundy, depth: ottoman.burgundyDeep, icon: `<path d="M18 18L46 46M46 18L18 46" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round"/>` }));
write("20-button-gold.svg", wideButtonFrame({ color1: "#FFE082", color2: ottoman.gold, depth: ottoman.goldDeep }));
write("21-button-green.svg", wideButtonFrame({ color1: "#7FD4A8", color2: ottoman.emerald, depth: ottoman.emeraldDeep }));
write("22-button-blue.svg", wideButtonFrame({ color1: "#A8C4E0", color2: ottoman.navy, depth: ottoman.navyDeep }));
write("23-word-tile-filled.svg", wordTileFilled());
write("24-tab-active.svg", tabPill({ active: true }));
write("25-tab-inactive.svg", tabPill({ active: false }));
write("26-shop-buy.svg", shopBuyFrame());
write("27-meaning-card.svg", meaningCardFrame());
write("28-map-hero-panel.svg", panelFrame({ w: 400, h: 168, rx: 22, depth: ottoman.navyDeep, fill1: "#1E2D45", fill2: ottoman.navyDeep, stroke: 0.28 }));
write("29-map-featured-panel.svg", panelFrame({ w: 400, h: 112, rx: 20, depth: ottoman.goldDeep, fill1: "#3D3528", fill2: "#1A3040", stroke: 0.38 }));
write("30-map-stat-chip.svg", panelFrame({ w: 92, h: 72, rx: 14, depth: ottoman.navyDeep, fill1: "#1A2838", fill2: ottoman.navyDeep, stroke: 0.22 }));
write("31-map-widget-panel.svg", panelFrame({ w: 400, h: 88, rx: 16, depth: ottoman.emeraldDeep, fill1: "#1A3530", fill2: ottoman.navyDeep, stroke: 0.3 }));

function levelBadgeFrame() {
  const w = 260;
  const h = 64;
  return svg(w, h, `
<defs>${shadow}
  <linearGradient id="badge" x1="20" y1="8" x2="240" y2="56" gradientUnits="userSpaceOnUse">
    <stop stop-color="#1E3A5F"/><stop offset="1" stop-color="#101827"/>
  </linearGradient>
</defs>
<rect x="12" y="16" width="236" height="40" rx="20" fill="${ottoman.goldDeep}"/>
<rect x="12" y="8" width="236" height="40" rx="20" fill="url(#badge)" filter="url(#shadow)"/>
<rect x="16" y="12" width="228" height="32" rx="16" stroke="${ottoman.gold}" stroke-opacity="0.55" stroke-width="2.5"/>
<path d="M26 18H38V22H30V34H26V18Z" fill="${ottoman.gold}" fill-opacity="0.45"/>
<path d="M234 18H222V22H230V34H234V18Z" fill="${ottoman.gold}" fill-opacity="0.45"/>
`);
}

function wheelRingFrame() {
  const s = 300;
  const c = s / 2;
  return svg(s, s, `
<defs>${shadow}</defs>
<circle cx="${c}" cy="${c + 6}" r="118" fill="${ottoman.navyDeep}"/>
<circle cx="${c}" cy="${c}" r="118" fill="#1A2D48" filter="url(#shadow)"/>
<circle cx="${c}" cy="${c}" r="114" stroke="${ottoman.gold}" stroke-opacity="0.38" stroke-width="4" fill="none"/>
<circle cx="${c}" cy="${c}" r="98" fill="rgba(16,24,39,0.62)" stroke="#FFFFFF" stroke-opacity="0.1" stroke-width="2"/>
`);
}

function gridPanelFrame() {
  return panelFrame({ w: 400, h: 220, rx: 18, depth: "#0A1628", fill1: "#1E3A5F", fill2: "#142338", stroke: 0.22 });
}

function wordPillFrame() {
  return svg(220, 44, `
<defs>${shadow}
  <linearGradient id="wp" x1="10" y1="6" x2="210" y2="38" gradientUnits="userSpaceOnUse">
    <stop stop-color="#E85D75"/><stop offset="1" stop-color="#9F2D3E"/>
  </linearGradient>
</defs>
<rect x="8" y="12" width="204" height="28" rx="14" fill="${ottoman.burgundyDeep}"/>
<rect x="8" y="6" width="204" height="28" rx="14" fill="url(#wp)" filter="url(#shadow)"/>
<rect x="12" y="10" width="196" height="20" rx="10" stroke="#FFFFFF" stroke-opacity="0.28" stroke-width="2"/>
`);
}

function statChipFrame() {
  return panelFrame({ w: 124, h: 58, rx: 12, depth: ottoman.navyDeep, fill1: "#1A2838", fill2: ottoman.navyDeep, stroke: 0.2 });
}

write("32-level-badge.svg", levelBadgeFrame());
write("33-wheel-ring.svg", wheelRingFrame());
write("34-grid-panel.svg", gridPanelFrame());
write("35-word-pill.svg", wordPillFrame());
write("36-stat-chip.svg", statChipFrame());

console.log("✅ Modern game UI v2 SVG assetleri oluşturuldu:");
console.log(outDir);
