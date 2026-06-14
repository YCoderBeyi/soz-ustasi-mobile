const fs = require("fs");
const path = require("path");

const outDir = path.join(process.cwd(), "public", "assets", "ui", "svg");
fs.mkdirSync(outDir, { recursive: true });

function svg(w, h, body) {
  return `
<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none" xmlns="http://www.w3.org/2000/svg">
${body}
</svg>`;
}

function defs() {
  return `
  <defs>
    <filter id="shadow3d" x="-20%" y="-20%" width="140%" height="150%" color-interpolation-filters="sRGB">
      <feDropShadow dx="0" dy="10" stdDeviation="8" flood-color="#0F172A" flood-opacity="0.28"/>
    </filter>
    <linearGradient id="shine" x1="20" y1="10" x2="90" y2="64" gradientUnits="userSpaceOnUse">
      <stop stop-color="#FFFFFF" stop-opacity="0.78"/>
      <stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="topGlow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(42 28) rotate(55) scale(60)">
      <stop stop-color="#FFFFFF" stop-opacity="0.55"/>
      <stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/>
    </radialGradient>
  </defs>`;
}

function iconButton({ a, b, depth, icon }) {
  return svg(
    108, 108,
    `${defs()}
  <rect x="10" y="17" width="88" height="84" rx="28" fill="${depth}"/>
  <rect x="10" y="8" width="88" height="84" rx="28" fill="url(#bg)" filter="url(#shadow3d)"/>
  <defs><linearGradient id="bg" x1="10" y1="8" x2="98" y2="92" gradientUnits="userSpaceOnUse">
    <stop stop-color="${a}"/><stop offset="1" stop-color="${b}"/>
  </linearGradient></defs>
  <rect x="13" y="11" width="82" height="78" rx="25" stroke="white" stroke-opacity="0.42" stroke-width="4"/>
  <path d="M28 15H80C87 15 93 21 93 28V34C93 34 78 25 54 25C30 25 15 34 15 34V28C15 21 21 15 28 15Z" fill="url(#shine)"/>
  <circle cx="45" cy="35" r="32" fill="url(#topGlow)"/>
  <g transform="translate(22 22)">${icon}</g>`
  );
}

const icons = {
  hint: `<path d="M32 5C20.5 5 11 14 11 25.2C11 32.4 14.7 38.5 20.3 42.2C22.3 43.6 23.5 45.8 23.5 48.2V51H40.5V48.2C40.5 45.8 41.7 43.6 43.7 42.2C49.3 38.5 53 32.4 53 25.2C53 14 43.5 5 32 5Z" fill="#FFF7D6"/>
    <path d="M24 56H40" stroke="#8A4B00" stroke-width="5" stroke-linecap="round"/>
    <path d="M26 63H38" stroke="#8A4B00" stroke-width="5" stroke-linecap="round"/>
    <path d="M32 0V-5M8 9L4 5M56 9L60 5" stroke="#FFF7D6" stroke-width="5" stroke-linecap="round"/>`,
  shuffle: `<path d="M4 20H17C25 20 28 31 36 31H48" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round"/>
    <path d="M4 48H17C25 48 28 37 36 37H48" stroke="#DBEAFE" stroke-width="8" stroke-linecap="round"/>
    <path d="M47 18L62 31L47 44V18Z" fill="#FFFFFF"/>
    <path d="M47 34L62 48L47 62V34Z" fill="#DBEAFE"/>`,
  seal: `<circle cx="32" cy="27" r="24" fill="#FFE082"/>
    <circle cx="32" cy="27" r="16" stroke="#9A5A00" stroke-width="5" opacity="0.55"/>
    <path d="M32 9L37.2 20L49 21.6L40.5 30L42.6 42L32 36.3L21.4 42L23.5 30L15 21.6L26.8 20L32 9Z" fill="#FFF7D6"/>
    <path d="M20 48L15 66L32 56L49 66L44 48" fill="#F97316"/>`,
  dictionary: `<path d="M7 12C7 8.7 9.7 6 13 6H29C34 6 37 9 37 14V61C37 56 33 53 27 53H13C9.7 53 7 50.3 7 47V12Z" fill="#FFFFFF"/>
    <path d="M57 12C57 8.7 54.3 6 51 6H35C30 6 27 9 27 14V61C27 56 31 53 37 53H51C54.3 53 57 50.3 57 47V12Z" fill="#D1FAE5"/>
    <path d="M16 20H28M16 31H27M39 20H50M39 31H49" stroke="#15803D" stroke-width="4" stroke-linecap="round"/>`,
  tasks: `<circle cx="32" cy="32" r="27" fill="#FFFFFF"/>
    <circle cx="32" cy="32" r="20" fill="#FB7185"/>
    <circle cx="32" cy="32" r="12" fill="#FFFFFF"/>
    <circle cx="32" cy="32" r="5" fill="#FB7185"/>
    <path d="M43 21L60 4" stroke="#1F2937" stroke-width="6" stroke-linecap="round"/>
    <path d="M55 4H64V13" stroke="#1F2937" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>`,
  shop: `<path d="M11 23H53L49 61H15L11 23Z" fill="#FFFFFF"/>
    <path d="M20 23V17C20 10 25 5 32 5C39 5 44 10 44 17V23" stroke="#6D28D9" stroke-width="6" stroke-linecap="round"/>
    <circle cx="23" cy="35" r="3.5" fill="#6D28D9"/>
    <circle cx="41" cy="35" r="3.5" fill="#6D28D9"/>
    <path d="M24 47C28 51 36 51 40 47" stroke="#6D28D9" stroke-width="5" stroke-linecap="round"/>`,
  settings: `<path d="M32 4L39 8L46 6L52 15L49 22L55 29V39L49 46L52 53L46 62L39 60L32 64L25 60L18 62L12 53L15 46L9 39V29L15 22L12 15L18 6L25 8L32 4Z" fill="#FFFFFF"/>
    <circle cx="32" cy="34" r="12" fill="#64748B"/><circle cx="32" cy="34" r="5" fill="#FFFFFF"/>`,
  sound: `<path d="M9 25H21L37 11V53L21 39H9V25Z" fill="#FFFFFF"/>
    <path d="M45 22C49 28 49 36 45 42" stroke="#DBEAFE" stroke-width="6" stroke-linecap="round"/>
    <path d="M52 14C60 25 60 39 52 50" stroke="#DBEAFE" stroke-width="6" stroke-linecap="round"/>`,
  life: `<path d="M32 58C15 45 7 36 7 24C7 15 14 8 23 8C28 8 31 11 32 14C33 11 36 8 41 8C50 8 57 15 57 24C57 36 49 45 32 58Z" fill="#FFFFFF"/>`,
  daily: `<rect x="9" y="12" width="46" height="44" rx="10" fill="#FFFFFF"/>
    <path d="M9 24H55" stroke="#10B981" stroke-width="6"/>
    <path d="M21 7V17M43 7V17" stroke="#0F766E" stroke-width="6" stroke-linecap="round"/>
    <path d="M22 39L29 46L44 31" stroke="#22C55E" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`,
  coin: `<circle cx="32" cy="32" r="28" fill="#FFE082"/>
    <circle cx="32" cy="32" r="20" fill="#F59E0B"/>
    <path d="M32 14L37.3 25L49.5 26.6L40.7 35.1L42.8 47L32 41.4L21.2 47L23.3 35.1L14.5 26.6L26.7 25L32 14Z" fill="#FFF7D6"/>`,
  gem: `<path d="M13 14H51L61 29L32 61L3 29L13 14Z" fill="#E9D5FF"/>
    <path d="M13 14L22 29L32 14H13Z" fill="#F0ABFC"/>
    <path d="M32 14L42 29L51 14H32Z" fill="#C084FC"/>
    <path d="M22 29L32 61L42 29H22Z" fill="#7C3AED"/>`,
  energy: `<path d="M36 3L9 36H30L24 63L55 25H34L36 3Z" fill="#FFF7D6"/>`,
  home: `<path d="M8 32L32 10L56 32" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M16 30V58H48V30" fill="#FFFFFF"/>
    <rect x="27" y="42" width="10" height="16" rx="3" fill="#F97316"/>`,
  map: `<path d="M8 13L25 7L41 13L56 7V54L41 60L25 54L8 60V13Z" fill="#FFFFFF"/>
    <path d="M25 7V54M41 13V60" stroke="#38BDF8" stroke-width="4"/>
    <circle cx="36" cy="29" r="8" fill="#FB7185"/>
    <path d="M36 38C36 38 47 29 47 20C47 14 42 9 36 9C30 9 25 14 25 20C25 29 36 38 36 38Z" fill="#FB7185"/>`,
  play: `<path d="M20 11L55 32L20 53V11Z" fill="#FFFFFF"/>`,
  events: `<path d="M32 4C43 4 52 13 52 24C52 39 32 61 32 61C32 61 12 39 12 24C12 13 21 4 32 4Z" fill="#FFFFFF"/>
    <circle cx="32" cy="24" r="12" fill="#FB923C"/>`,
  crown: `<path d="M8 49L13 18L27 35L32 12L37 35L51 18L56 49H8Z" fill="#FFF7D6"/>
    <rect x="10" y="49" width="44" height="9" rx="4" fill="#FDE68A"/>`,
  back: `<path d="M40 13L18 32L40 51" stroke="#FFFFFF" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>`,
  close: `<path d="M18 18L46 46M46 18L18 46" stroke="#FFFFFF" stroke-width="9" stroke-linecap="round"/>`,
};

function resourcePill({ icon, amount, a, b, depth }) {
  return svg(320, 82, `${defs()}
  <rect x="22" y="18" width="276" height="56" rx="28" fill="${depth}"/>
  <rect x="22" y="10" width="276" height="56" rx="28" fill="url(#pillBg)" filter="url(#shadow3d)"/>
  <defs><linearGradient id="pillBg" x1="22" y1="10" x2="298" y2="66" gradientUnits="userSpaceOnUse">
    <stop stop-color="${a}"/><stop offset="1" stop-color="${b}"/>
  </linearGradient></defs>
  <rect x="26" y="14" width="268" height="48" rx="24" stroke="white" stroke-opacity="0.38" stroke-width="3"/>
  <circle cx="54" cy="38" r="34" fill="${a}" filter="url(#shadow3d)"/>
  <g transform="translate(22 6) scale(.75)">${icon}</g>
  <text x="168" y="48" text-anchor="middle" font-size="30" font-weight="900" font-family="Inter, Arial, sans-serif" fill="white">${amount}</text>
  <rect x="250" y="20" width="42" height="36" rx="14" fill="#22C55E"/>
  <path d="M271 28V48M261 38H281" stroke="white" stroke-width="6" stroke-linecap="round"/>`);
}

function wideButton({ text, icon, a, b, depth, w = 360 }) {
  return svg(w, 92, `${defs()}
  <rect x="18" y="20" width="${w - 36}" height="64" rx="30" fill="${depth}"/>
  <rect x="18" y="10" width="${w - 36}" height="64" rx="30" fill="url(#btnBg)" filter="url(#shadow3d)"/>
  <defs><linearGradient id="btnBg" x1="18" y1="10" x2="${w - 18}" y2="74" gradientUnits="userSpaceOnUse">
    <stop stop-color="${a}"/><stop offset="1" stop-color="${b}"/>
  </linearGradient></defs>
  <path d="M46 16H${w - 46}C${w - 32} 16 ${w - 24} 25 ${w - 24} 38V41C${w - 24} 41 ${w - 92} 29 ${w / 2} 29C92 29 24 41 24 41V38C24 25 32 16 46 16Z" fill="url(#shine)"/>
  <circle cx="58" cy="42" r="24" fill="white" fill-opacity="0.42"/>
  <g transform="translate(26 10) scale(.62)">${icon}</g>
  <text x="${w / 2 + 28}" y="52" text-anchor="middle" font-size="27" font-weight="900" font-family="Inter, Arial, sans-serif" fill="white" stroke="#0F172A" stroke-opacity="0.26" stroke-width="3" paint-order="stroke">${text}</text>`);
}

function levelBadge() {
  return svg(260, 90, `${defs()}
  <rect x="20" y="20" width="220" height="56" rx="22" fill="#8B5CF6"/>
  <rect x="20" y="12" width="220" height="56" rx="22" fill="url(#levelBg)" filter="url(#shadow3d)"/>
  <defs><linearGradient id="levelBg" x1="20" y1="12" x2="240" y2="68" gradientUnits="userSpaceOnUse">
    <stop stop-color="#60A5FA"/><stop offset="1" stop-color="#2563EB"/>
  </linearGradient></defs>
  <path d="M20 12H74V82L47 66L20 82V12Z" fill="#7C3AED"/>
  <text x="47" y="48" text-anchor="middle" font-size="28" font-weight="900" font-family="Inter, Arial, sans-serif" fill="white">24</text>
  <text x="150" y="36" text-anchor="middle" font-size="18" font-weight="900" font-family="Inter, Arial, sans-serif" fill="white">Gezgin Usta</text>
  <rect x="92" y="45" width="122" height="12" rx="6" fill="#1E293B" opacity=".55"/>
  <rect x="92" y="45" width="82" height="12" rx="6" fill="#A78BFA"/>`);
}

function streakBadge() {
  return svg(220, 86, `${defs()}
  <rect x="18" y="18" width="184" height="56" rx="24" fill="#7C2D12"/>
  <rect x="18" y="10" width="184" height="56" rx="24" fill="#92400E" filter="url(#shadow3d)"/>
  <path d="M50 7C62 24 35 28 44 47C33 42 29 32 34 23C22 34 22 57 48 63C78 58 79 30 63 16C66 30 50 27 50 7Z" fill="#F97316"/>
  <text x="49" y="48" text-anchor="middle" font-size="28" font-weight="900" font-family="Inter, Arial, sans-serif" fill="white">7</text>
  <text x="132" y="35" text-anchor="middle" font-size="17" font-weight="900" font-family="Inter, Arial, sans-serif" fill="white">Seri!</text>
  <circle cx="100" cy="49" r="6" fill="#FDBA74"/>
  <circle cx="118" cy="49" r="6" fill="#FDBA74"/>
  <circle cx="136" cy="49" r="6" fill="#FDBA74"/>
  <circle cx="154" cy="49" r="6" fill="#FDBA74"/>`);
}

function wordTile(filled) {
  return svg(76, 82, `${defs()}
  <rect x="8" y="12" width="60" height="60" rx="18" fill="${filled ? "#D97706" : "#CBD5E1"}"/>
  <rect x="8" y="6" width="60" height="60" rx="18" fill="url(#tileBg)" filter="url(#shadow3d)"/>
  <defs><linearGradient id="tileBg" x1="8" y1="6" x2="68" y2="66" gradientUnits="userSpaceOnUse">
    <stop stop-color="${filled ? "#FFF7D6" : "#FFFFFF"}"/>
    <stop offset="1" stop-color="${filled ? "#FDE68A" : "#E2E8F0"}"/>
  </linearGradient></defs>
  <rect x="11" y="9" width="54" height="54" rx="15" stroke="white" stroke-opacity=".75" stroke-width="3"/>
  ${filled ? `<text x="38" y="47" text-anchor="middle" font-size="34" font-weight="900" font-family="Inter, Arial, sans-serif" fill="#1F2937">A</text>` : ""}`);
}

function letterNode() {
  return svg(92, 92, `${defs()}
  <rect x="14" y="18" width="64" height="64" rx="24" fill="#0284C7"/>
  <rect x="14" y="10" width="64" height="64" rx="24" fill="url(#nodeBg)" filter="url(#shadow3d)"/>
  <defs><linearGradient id="nodeBg" x1="14" y1="10" x2="78" y2="74" gradientUnits="userSpaceOnUse">
    <stop stop-color="#FFFFFF"/><stop offset="1" stop-color="#E0F2FE"/>
  </linearGradient></defs>
  <circle cx="38" cy="30" r="24" fill="url(#topGlow)"/>
  <text x="46" y="54" text-anchor="middle" font-size="36" font-weight="900" font-family="Inter, Arial, sans-serif" fill="#1F2937">A</text>`);
}

function meaningCard() {
  return svg(520, 190, `${defs()}
  <rect x="20" y="28" width="480" height="136" rx="32" fill="#CBD5E1"/>
  <rect x="20" y="16" width="480" height="136" rx="32" fill="url(#cardBg)" filter="url(#shadow3d)"/>
  <defs><linearGradient id="cardBg" x1="20" y1="16" x2="500" y2="152" gradientUnits="userSpaceOnUse">
    <stop stop-color="#FFFFFF"/><stop offset="1" stop-color="#E0F2FE"/>
  </linearGradient></defs>
  <rect x="28" y="24" width="464" height="120" rx="26" stroke="white" stroke-opacity=".75" stroke-width="4"/>
  <text x="52" y="72" font-size="36" font-weight="900" font-family="Inter, Arial, sans-serif" fill="#1F2937">MERAK</text>
  <text x="52" y="112" font-size="23" font-weight="600" font-family="Inter, Arial, sans-serif" fill="#475569">Bir şeyi öğrenme veya anlama isteği.</text>
  <rect x="382" y="50" width="70" height="70" rx="24" fill="#38BDF8"/>
  <g transform="translate(385 52) scale(.82)">${icons.sound}</g>`);
}

function rewardModal() {
  return svg(440, 520, `${defs()}
  <rect x="28" y="38" width="384" height="442" rx="42" fill="#CBD5E1"/>
  <rect x="28" y="24" width="384" height="442" rx="42" fill="url(#modalBg)" filter="url(#shadow3d)"/>
  <defs><linearGradient id="modalBg" x1="28" y1="24" x2="412" y2="466" gradientUnits="userSpaceOnUse">
    <stop stop-color="#FFFFFF"/><stop offset="1" stop-color="#DBEAFE"/>
  </linearGradient></defs>
  <circle cx="220" cy="116" r="58" fill="#FFE082"/>
  <g transform="translate(188 84)">${icons.crown}</g>
  <text x="220" y="210" text-anchor="middle" font-size="34" font-weight="900" font-family="Inter, Arial, sans-serif" fill="#1F2937">Mühür Açıldı!</text>
  <text x="220" y="246" text-anchor="middle" font-size="20" font-weight="700" font-family="Inter, Arial, sans-serif" fill="#64748B">Level tamamlandı</text>
  <rect x="84" y="282" width="272" height="62" rx="22" fill="#F8FAFC"/>
  <g transform="translate(95 282) scale(.65)">${icons.coin}</g>
  <text x="240" y="322" text-anchor="middle" font-size="26" font-weight="900" font-family="Inter, Arial, sans-serif" fill="#1F2937">+25 Coin</text>
  <rect x="70" y="386" width="300" height="66" rx="30" fill="#22C55E"/>
  <text x="220" y="428" text-anchor="middle" font-size="25" font-weight="900" font-family="Inter, Arial, sans-serif" fill="white">Sonraki Level</text>`);
}

function taskRow() {
  return svg(500, 110, `${defs()}
  <rect x="20" y="18" width="460" height="74" rx="26" fill="#CBD5E1"/>
  <rect x="20" y="10" width="460" height="74" rx="26" fill="#F8FAFC" filter="url(#shadow3d)"/>
  <rect x="38" y="25" width="52" height="44" rx="16" fill="#FFE082"/>
  <g transform="translate(32 14) scale(.55)">${icons.hint}</g>
  <text x="112" y="40" font-size="20" font-weight="900" font-family="Inter, Arial, sans-serif" fill="#1F2937">5 ipucu kullan</text>
  <rect x="112" y="54" width="200" height="14" rx="7" fill="#CBD5E1"/>
  <rect x="112" y="54" width="130" height="14" rx="7" fill="#38BDF8"/>
  <text x="340" y="58" font-size="22" font-weight="900" font-family="Inter, Arial, sans-serif" fill="#1F2937">100</text>
  <g transform="translate(370 26) scale(.52)">${icons.coin}</g>`);
}

function bottomNav() {
  return svg(620, 116, `${defs()}
  <rect x="18" y="26" width="584" height="76" rx="34" fill="#92400E"/>
  <rect x="18" y="14" width="584" height="76" rx="34" fill="url(#navBg)" filter="url(#shadow3d)"/>
  <defs><linearGradient id="navBg" x1="18" y1="14" x2="602" y2="90" gradientUnits="userSpaceOnUse">
    <stop stop-color="#C084FC"/><stop offset=".5" stop-color="#38BDF8"/><stop offset="1" stop-color="#22C55E"/>
  </linearGradient></defs>
  <g transform="translate(55 22) scale(.52)">${icons.home}</g>
  <g transform="translate(170 22) scale(.52)">${icons.map}</g>
  <g transform="translate(285 22) scale(.52)">${icons.play}</g>
  <g transform="translate(400 22) scale(.52)">${icons.events}</g>
  <g transform="translate(515 22) scale(.52)">${icons.shop}</g>`);
}

const files = {
  "01-icon-hint.svg": iconButton({ a: "#FFE082", b: "#FFB703", depth: "#C97800", icon: icons.hint }),
  "02-icon-shuffle.svg": iconButton({ a: "#60A5FA", b: "#0284C7", depth: "#075985", icon: icons.shuffle }),
  "03-icon-seal.svg": iconButton({ a: "#FDBA74", b: "#F59E0B", depth: "#B45309", icon: icons.seal }),
  "04-icon-dictionary.svg": iconButton({ a: "#86EFAC", b: "#22C55E", depth: "#15803D", icon: icons.dictionary }),
  "05-icon-tasks.svg": iconButton({ a: "#C084FC", b: "#7C3AED", depth: "#581C87", icon: icons.tasks }),
  "06-icon-shop.svg": iconButton({ a: "#F0ABFC", b: "#A855F7", depth: "#6D28D9", icon: icons.shop }),
  "07-icon-settings.svg": iconButton({ a: "#CBD5E1", b: "#64748B", depth: "#334155", icon: icons.settings }),
  "08-icon-sound.svg": iconButton({ a: "#60A5FA", b: "#2563EB", depth: "#1D4ED8", icon: icons.sound }),
  "09-icon-life.svg": iconButton({ a: "#FB7185", b: "#EF4444", depth: "#BE123C", icon: icons.life }),
  "10-icon-daily-reward.svg": iconButton({ a: "#5EEAD4", b: "#14B8A6", depth: "#0F766E", icon: icons.daily }),
  "11-icon-home.svg": iconButton({ a: "#FB923C", b: "#F97316", depth: "#C2410C", icon: icons.home }),
  "12-icon-map.svg": iconButton({ a: "#38BDF8", b: "#0284C7", depth: "#075985", icon: icons.map }),
  "13-icon-play.svg": iconButton({ a: "#A3E635", b: "#65A30D", depth: "#3F6212", icon: icons.play }),
  "14-icon-events.svg": iconButton({ a: "#FDE68A", b: "#F97316", depth: "#C2410C", icon: icons.events }),
  "15-icon-crown.svg": iconButton({ a: "#FDE68A", b: "#F59E0B", depth: "#B45309", icon: icons.crown }),
  "16-icon-back.svg": iconButton({ a: "#60A5FA", b: "#2563EB", depth: "#1D4ED8", icon: icons.back }),
  "17-icon-close.svg": iconButton({ a: "#FB7185", b: "#EF4444", depth: "#BE123C", icon: icons.close }),
  "18-icon-coin.svg": svg(96, 96, `<g transform="translate(16 16)">${icons.coin}</g>`),
  "19-icon-gem.svg": svg(96, 96, `<g transform="translate(16 16)">${icons.gem}</g>`),
  "20-icon-energy.svg": svg(96, 96, `<g transform="translate(16 16)">${icons.energy}</g>`),
  "21-pill-coin.svg": resourcePill({ icon: icons.coin, amount: "12.540", a: "#FFE082", b: "#F59E0B", depth: "#92400E" }),
  "22-pill-gem.svg": resourcePill({ icon: icons.gem, amount: "2.350", a: "#E879F9", b: "#7C3AED", depth: "#581C87" }),
  "23-pill-energy.svg": resourcePill({ icon: icons.energy, amount: "5/5", a: "#FDE68A", b: "#F97316", depth: "#C2410C" }),
  "24-badge-level.svg": levelBadge(),
  "25-badge-streak.svg": streakBadge(),
  "26-button-play.svg": wideButton({ text: "Oyna", icon: icons.play, a: "#A3E635", b: "#65A30D", depth: "#3F6212", w: 360 }),
  "27-button-continue.svg": wideButton({ text: "Devam Et", icon: icons.play, a: "#FFE082", b: "#FFB703", depth: "#C97800", w: 400 }),
  "28-button-reward.svg": wideButton({ text: "Ödülü Al", icon: icons.coin, a: "#86EFAC", b: "#22C55E", depth: "#15803D", w: 400 }),
  "29-button-blue.svg": wideButton({ text: "Görevler", icon: icons.tasks, a: "#60A5FA", b: "#0284C7", depth: "#075985", w: 400 }),
  "30-word-tile-empty.svg": wordTile(false),
  "31-word-tile-filled.svg": wordTile(true),
  "32-letter-node.svg": letterNode(),
  "33-meaning-card.svg": meaningCard(),
  "34-reward-modal.svg": rewardModal(),
  "35-task-row.svg": taskRow(),
  "36-bottom-nav.svg": bottomNav(),
};

for (const [fileName, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(outDir, fileName), content.trim() + "\n", "utf8");
}

console.log(`✅ ${Object.keys(files).length} SVG oluşturuldu:`);
console.log(outDir);
