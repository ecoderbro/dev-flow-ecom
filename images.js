// ============================================
// devFlow Creative — product imagery
// Every product gets an illustration that matches its type,
// brand and colour. To use a real photo instead, add the file to an
// /img folder and list it in PHOTO_OVERRIDES below, e.g.
//   "hp-01": "img/hp-pavilion-15.jpg"
// ============================================

const PHOTO_OVERRIDES = {
  // "hp-01": "img/hp-pavilion-15.jpg",
};

let _artId = 0;
function _uid() { return "dfa" + (++_artId); }

function escAttr(s) {
  return String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// ---------- colour helpers ----------
function _hex(h) { h = h.replace("#", ""); return [0, 2, 4].map((i) => parseInt(h.substr(i, 2), 16)); }
function _toHex(a) { return "#" + a.map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join(""); }
function shade(hex, amt) { // amt -1..1
  const c = _hex(hex);
  return _toHex(c.map((v) => (amt >= 0 ? v + (255 - v) * amt : v * (1 + amt))));
}

function bodyColour(name) {
  const n = (name || "").toLowerCase();
  const table = [
    [/space (grey|gray)|storm|onyx|graphite|titanium|grey|gray/, "#6b7078"],
    [/black|carbon|shadow|midnight|obsidian|dark|eclipse|nightfall|jet/, "#2a2e35"],
    [/silver|platinum|mica|aluminium|aluminum|moon|starlight|natural/, "#b9bec6"],
    [/white|ceramic|pearl|ivory|cloud/, "#e9ebee"],
    [/blue|nocturne|navy|ocean|sky/, "#2f4f86"],
    [/green|forest|mint|sage/, "#3f6b57"],
    [/red|crimson|rose/, "#a8383e"],
    [/gold|sand|champagne/, "#c9b48c"],
    [/purple|violet/, "#5d4a8a"],
  ];
  for (const [re, hex] of table) if (re.test(n)) return hex;
  return "#8a9099";
}

const BRAND_WALL = {
  hp:     ["#1f6fe0", "#7fd0ff"],
  dell:   ["#0a8f9e", "#8ce6d8"],
  lenovo: ["#d4402f", "#ffb36b"],
  apple:  ["#7a4de0", "#ff8fb3"],
  acer:   ["#2f9e5a", "#c3f06a"],
  msi:    ["#b3132b", "#ff6a3d"],
};

// ============ LAPTOPS ============
function laptopKind(l) {
  const n = (l.name || "").toLowerCase();
  if (l.brand === "apple" || /macbook/.test(n)) return "apple";
  if (/omen|victus|legion|alienware|predator|nitro|msi|raider|titan|stealth|katana|vector|cyborg|thin gf|pulse|crosshair|loq|g15|g16|rog|helios|gaming/.test(n) || l.brand === "msi") return "gaming";
  if (/thinkpad/.test(n)) return "thinkpad";
  if (/x360|yoga|spectre|flex|2-in-1|convertible/.test(n)) return "convertible";
  return "ultrabook";
}

function laptopArt(l) {
  const kind = laptopKind(l);
  const [w1, w2] = BRAND_WALL[l.brand] || ["#3D8BFD", "#9ad0ff"];
  let body = bodyColour(l.color);
  if (kind === "gaming" && body === "#b9bec6") body = "#4a4f58";
  if (kind === "thinkpad") body = "#23262c";
  const dark = shade(body, -0.35), light = shade(body, 0.22);
  const id = _uid();
  const bezel = kind === "apple" ? shade(body, -0.75) : shade(body, -0.6);
  const chamfer = kind === "gaming";

  const lid = chamfer
    ? `<path d="M52 14h136l6 6v88l-6 4H52l-6-4V20z" fill="${body}"/>`
    : `<rect x="46" y="14" width="148" height="98" rx="${kind === "apple" ? 7 : 5}" fill="${body}"/>`;
  const screen = `<rect x="52" y="20" width="136" height="84" rx="2" fill="url(#${id}w)"/>`;
  const wallpaper = `
    <circle cx="150" cy="44" r="26" fill="${w2}" opacity=".35"/>
    <path d="M52 86c24-18 44-6 66-14s44-22 70-6v38H52z" fill="#000" opacity=".22"/>
    <path d="M52 94c30-12 52 0 78-8s40-8 58-2v20H52z" fill="#000" opacity=".25"/>`;
  const notch = kind === "apple" ? `<rect x="109" y="20" width="22" height="5" rx="2.5" fill="${bezel}"/>` : `<circle cx="120" cy="17" r="1.3" fill="${bezel}"/>`;

  // base in perspective
  const baseY = 112;
  const base = `<path d="M40 ${baseY}h160l26 36q1 6-5 6H19q-6 0-5-6z" fill="${light}"/>
    <path d="M14 148q-1 6 5 6h202q6 0 5-6l-1-2H15z" fill="${dark}"/>`;
  const deck = `<path d="M50 ${baseY + 4}h140l20 29H30z" fill="${kind === "apple" ? shade(body, -0.1) : shade(body, -0.45)}"/>`;
  let keys = "";
  for (let r = 0; r < 4; r++) {
    const y = baseY + 9 + r * 6.2;
    const inset = 44 - r * 5; // widens toward front
    keys += `<path d="M${50 - (r * 4.5)} ${y}H${190 + (r * 4.5)}" stroke="${kind === "apple" ? "#15171b" : light}" stroke-width="3.4" stroke-dasharray="6.4 2.2" opacity="${kind === "apple" ? ".85" : ".5"}"/>`;
  }
  const pad = `<rect x="101" y="${baseY + 31}" width="38" height="9" rx="2" fill="${shade(body, kind === "apple" ? 0.05 : -0.2)}" opacity=".9"/>`;
  const hinge = `<rect x="96" y="${baseY - 2}" width="48" height="5" rx="2.5" fill="${dark}"/>`;

  let extra = "";
  if (kind === "gaming") {
    extra = `<path d="M18 150h204" stroke="url(#${id}g)" stroke-width="2.2" stroke-linecap="round"/>
      <path d="M62 ${baseY + 8}l-8 18M178 ${baseY + 8}l8 18" stroke="${w2}" stroke-width="1.6" opacity=".8"/>
      <path d="M46 ${baseY - 2}l-4 6M194 ${baseY - 2}l4 6" stroke="${w2}" stroke-width="1.6"/>`;
  }
  if (kind === "thinkpad") extra = `<circle cx="120" cy="${baseY + 17}" r="1.8" fill="#e5322d"/>`;
  if (kind === "convertible") extra = `<circle cx="34" cy="${baseY - 2}" r="0" />`;

  return `<svg class="art" viewBox="0 0 240 170" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${escAttr(l.name)}">
    <defs>
      <linearGradient id="${id}w" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${w1}"/><stop offset="1" stop-color="${w2}"/></linearGradient>
      <linearGradient id="${id}g" x1="0" x2="1"><stop offset="0" stop-color="#ff3d71"/><stop offset=".5" stop-color="#ffd23d"/><stop offset="1" stop-color="#3dd6ff"/></linearGradient>
    </defs>
    <ellipse cx="120" cy="160" rx="104" ry="6" fill="#000" opacity=".28"/>
    ${lid}${screen}${wallpaper}${notch}${hinge}${base}${deck}${keys}${pad}${extra}
  </svg>`;
}

// ============ PERIPHERALS ============
function kbArt(item, id) {
  const n = item.name.toLowerCase();
  const mech = /mech/.test(n);
  const body = bodyColour(item.color);
  const cap = mech ? shade(body, 0.12) : shade(body, -0.04);
  const keyC = /white/i.test(item.color) ? "#cfd3d9" : shade(body, 0.2);
  let keys = "";
  const rows = mech ? 5 : 4;
  for (let r = 0; r < rows; r++) {
    const cols = r === rows - 1 ? 7 : 12;
    for (let c = 0; c < cols; c++) {
      const w = r === rows - 1 ? (c === 3 ? 56 : 13) : 12;
      let x = 36 + c * 14.4 + (r * 2.4);
      if (r === rows - 1) x = [36, 51, 66, 81, 142, 157, 172][c] + 0;
      const wd = r === rows - 1 ? (c === 3 ? 58 : 12.5) : 12;
      if (r === rows - 1 && c >= 4) x = 143 + (c - 4) * 14.4;
      keys += `<rect x="${x}" y="${58 + r * 15}" width="${wd}" height="12" rx="2.4" fill="${keyC}"/>`;
    }
  }
  const glow = mech ? `<path d="M30 ${58 + rows * 15 + 4}h180" stroke="url(#${id}g)" stroke-width="2.4" stroke-linecap="round" opacity=".9"/>` : "";
  return `<defs><linearGradient id="${id}g" x1="0" x2="1"><stop offset="0" stop-color="#3dd6ff"/><stop offset=".5" stop-color="#9b5cff"/><stop offset="1" stop-color="#ff3d9a"/></linearGradient></defs>
    <path d="M14 ${mech ? 130 : 122}l10-70q1-6 7-6h178q6 0 7 6l10 70q1 8-6 8H20q-7 0-6-8z" fill="${cap}"/>
    ${keys}${glow}`;
}

function mouseArt(item, id) {
  const gaming = /gaming|dpi/.test(item.name.toLowerCase());
  const body = gaming ? "#23262c" : bodyColour(item.color);
  return `<defs><linearGradient id="${id}b" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${shade(body, 0.2)}"/><stop offset="1" stop-color="${shade(body, -0.25)}"/></linearGradient>
    <linearGradient id="${id}g" x1="0" x2="1"><stop offset="0" stop-color="#3dd6ff"/><stop offset=".5" stop-color="#9b5cff"/><stop offset="1" stop-color="#ff3d9a"/></linearGradient></defs>
    <ellipse cx="120" cy="152" rx="46" ry="6" fill="#000" opacity=".28"/>
    <path d="M120 24c30 0 50 22 50 56v38c0 22-18 36-50 36s-50-14-50-36V80c0-34 20-56 50-56z" fill="url(#${id}b)"/>
    <path d="M120 24v52M70 82c16 6 34 8 50 6 16 2 34 0 50-6" stroke="#000" stroke-opacity=".35" fill="none" stroke-width="2"/>
    <rect x="113" y="42" width="14" height="24" rx="7" fill="${shade(body, -0.5)}"/>
    ${gaming ? `<rect x="116.5" y="46" width="7" height="8" rx="3.5" fill="url(#${id}g)"/><path d="M82 130c10 10 26 14 38 14s28-4 38-14" stroke="url(#${id}g)" stroke-width="3" fill="none" stroke-linecap="round"/>` : `<rect x="108" y="112" width="24" height="3" rx="1.5" fill="${shade(body, 0.35)}" opacity=".6"/>`}`;
}

function bagArt(item, id) {
  const n = item.name.toLowerCase();
  const body = "#2b3340", acc = "#3D8BFD";
  if (/sleeve/.test(n)) {
    return `<ellipse cx="120" cy="156" rx="76" ry="6" fill="#000" opacity=".28"/>
      <rect x="40" y="52" width="160" height="100" rx="10" fill="${body}"/>
      <path d="M40 78h160" stroke="${shade(body, 0.2)}" stroke-width="2"/>
      <path d="M40 66q80 16 160 0" stroke="${shade(body, 0.12)}" stroke-width="2" fill="none"/>
      <rect x="92" y="60" width="56" height="8" rx="4" fill="${acc}"/>
      <rect x="150" y="40" width="30" height="16" rx="3" fill="${shade(body, 0.12)}" opacity=".0"/>
      <rect x="64" y="104" width="38" height="26" rx="5" fill="${shade(body, 0.12)}"/><path d="M64 112h38" stroke="${shade(body, 0.3)}"/>`;
  }
  return `<ellipse cx="120" cy="160" rx="62" ry="6" fill="#000" opacity=".28"/>
    <path d="M92 38c0-14 56-14 56 0" stroke="${shade(body, 0.25)}" stroke-width="7" fill="none" stroke-linecap="round"/>
    <path d="M70 52q50-18 100 0 14 6 14 24v66q0 14-14 14H70q-14 0-14-14V76q0-18 14-24z" fill="${body}"/>
    <path d="M70 52q50-18 100 0" stroke="${shade(body, 0.2)}" stroke-width="2" fill="none"/>
    <rect x="86" y="84" width="68" height="40" rx="8" fill="${shade(body, 0.1)}"/><path d="M86 98h68" stroke="${shade(body, 0.3)}"/>
    <rect x="112" y="90" width="16" height="6" rx="3" fill="${acc}"/>
    <path d="M56 100q-16 4-16 22v14q0 10 12 6" fill="${shade(body, -0.1)}"/><path d="M184 100q16 4 16 22v14q0 10-12 6" fill="${shade(body, -0.1)}"/>`;
}

function hubArt(item, id) {
  const dock = /dock/.test(item.name.toLowerCase());
  if (dock) {
    return `<ellipse cx="120" cy="140" rx="86" ry="7" fill="#000" opacity=".28"/>
      <path d="M26 100l14-30h160l14 30v30q0 8-8 8H34q-8 0-8-8z" fill="#8c929b"/>
      <path d="M26 100h188v30q0 8-8 8H34q-8 0-8-8z" fill="#5d636c"/>
      ${[0, 1, 2, 3, 4, 5].map((i) => `<rect x="${44 + i * 25}" y="112" width="17" height="9" rx="2" fill="#15171b"/>`).join("")}
      <circle cx="198" cy="84" r="3" fill="#4cd68a"/>
      <path d="M60 70V52q0-8 8-8h104q8 0 8 8v18" stroke="#3D8BFD" stroke-width="3" fill="none" stroke-dasharray="1 7" stroke-linecap="round"/>`;
  }
  return `<ellipse cx="120" cy="136" rx="76" ry="6" fill="#000" opacity=".28"/>
    <path d="M12 92h30" stroke="#9aa1ab" stroke-width="6" stroke-linecap="round"/><path d="M42 92h14" stroke="#15171b" stroke-width="10"/>
    <rect x="56" y="70" width="140" height="56" rx="10" fill="#9aa1ab"/><rect x="56" y="104" width="140" height="22" rx="10" fill="#7d838c"/>
    ${[0, 1, 2, 3, 4].map((i) => `<rect x="${70 + i * 24}" y="84" width="17" height="8" rx="2" fill="#15171b"/>`).join("")}
    <rect x="66" y="112" width="24" height="7" rx="2" fill="#15171b"/><rect x="96" y="112" width="24" height="7" rx="2" fill="#15171b"/>
    <rect x="126" y="112" width="30" height="7" rx="2" fill="#3D8BFD"/>`;
}

function coolingArt(item, id) {
  return `<ellipse cx="120" cy="150" rx="94" ry="7" fill="#000" opacity=".28"/>
    <path d="M22 142l22-80h152l22 80q1 8-7 8H29q-8 0-7-8z" fill="#2a2f37"/>
    <path d="M44 62h152" stroke="#3a414c" stroke-width="3"/>
    ${[78, 162].map((cx) => `<g><circle cx="${cx}" cy="108" r="30" fill="#14171c"/><circle cx="${cx}" cy="108" r="30" fill="none" stroke="#3D8BFD" stroke-width="2" opacity=".8"/>
      <g fill="#4a5260"><path d="M${cx} 108l-6-26q6-4 12 0z"/><path d="M${cx} 108l24-12q4 6 0 12z"/><path d="M${cx} 108l6 26q-6 4-12 0z"/><path d="M${cx} 108l-24 12q-4-6 0-12z"/></g><circle cx="${cx}" cy="108" r="5" fill="#8a919c"/></g>`).join("")}`;
}

function chargerArt(item, id) {
  return `<ellipse cx="120" cy="150" rx="56" ry="6" fill="#000" opacity=".28"/>
    <rect x="92" y="26" width="8" height="22" rx="2" fill="#c8cdd4"/><rect x="140" y="26" width="8" height="22" rx="2" fill="#c8cdd4"/>
    <rect x="66" y="46" width="108" height="98" rx="16" fill="#f1f3f5"/>
    <rect x="66" y="46" width="108" height="98" rx="16" fill="none" stroke="#cfd4da" stroke-width="2"/>
    <rect x="102" y="116" width="36" height="14" rx="5" fill="#2a2f37"/><rect x="108" y="121" width="24" height="4" rx="2" fill="#6a717b"/>
    <path d="M122 66l-12 20h10l-4 18 14-22h-10z" fill="#3D8BFD"/>`;
}

function storageArt(item, id) {
  const flash = /flash|usb|drive/.test(item.name.toLowerCase()) && !/ssd/.test(item.name.toLowerCase());
  if (flash) {
    return `<ellipse cx="120" cy="140" rx="70" ry="6" fill="#000" opacity=".28"/>
      <rect x="24" y="76" width="50" height="34" rx="3" fill="#c9ced6"/><rect x="34" y="86" width="10" height="14" fill="#7d838c"/><rect x="50" y="86" width="10" height="14" fill="#7d838c"/>
      <rect x="72" y="66" width="130" height="54" rx="12" fill="#1f242b"/><rect x="72" y="66" width="130" height="54" rx="12" fill="none" stroke="#3a414c" stroke-width="2"/>
      <circle cx="184" cy="93" r="6" fill="#0f1216"/><rect x="92" y="86" width="50" height="14" rx="4" fill="#3D8BFD" opacity=".85"/>`;
  }
  return `<ellipse cx="120" cy="150" rx="66" ry="6" fill="#000" opacity=".28"/>
    <rect x="52" y="34" width="136" height="108" rx="16" fill="#2b3038" transform="rotate(-6 120 88)"/>
    <rect x="52" y="34" width="136" height="108" rx="16" fill="none" stroke="#4a5260" stroke-width="2" transform="rotate(-6 120 88)"/>
    <g transform="rotate(-6 120 88)"><rect x="70" y="52" width="100" height="6" rx="3" fill="#3D8BFD"/><circle cx="170" cy="124" r="5" fill="#4cd68a"/>
    <rect x="70" y="112" width="60" height="5" rx="2.5" fill="#4a5260"/><rect x="70" y="122" width="40" height="5" rx="2.5" fill="#4a5260"/></g>`;
}

function audioArt(item, id) {
  const mic = /mic/.test(item.name.toLowerCase());
  if (mic) {
    return `<ellipse cx="120" cy="156" rx="52" ry="6" fill="#000" opacity=".28"/>
      <path d="M72 120q0 38 48 38t48-38" stroke="#5d636c" stroke-width="5" fill="none" stroke-linecap="round" transform="translate(0 -22) scale(1 .5) translate(0 46)"/>
      <rect x="116" y="104" width="8" height="38" fill="#5d636c"/><rect x="88" y="142" width="64" height="10" rx="5" fill="#3a414c"/>
      <rect x="86" y="20" width="68" height="92" rx="34" fill="#2b3038"/>
      ${[0, 1, 2, 3, 4, 5, 6].map((i) => `<path d="M92 ${34 + i * 10}h56" stroke="#4a5260" stroke-width="2"/>`).join("")}
      <path d="M78 70v10q0 38 42 38t42-38V70" stroke="#8a919c" stroke-width="4" fill="none" stroke-linecap="round"/>
      <circle cx="120" cy="124" r="3" fill="#4cd68a"/>`;
  }
  return `<ellipse cx="120" cy="156" rx="64" ry="6" fill="#000" opacity=".28"/>
    <path d="M58 98V84q0-52 62-52t62 52v14" stroke="#4a5260" stroke-width="10" fill="none" stroke-linecap="round"/>
    <path d="M58 98V84q0-52 62-52t62 52v14" stroke="#2b3038" stroke-width="5" fill="none" stroke-linecap="round"/>
    <rect x="40" y="82" width="38" height="62" rx="16" fill="#23262c"/><rect x="162" y="82" width="38" height="62" rx="16" fill="#23262c"/>
    <rect x="46" y="90" width="26" height="46" rx="11" fill="#3a414c"/><rect x="168" y="90" width="26" height="46" rx="11" fill="#3a414c"/>
    <path d="M52 140q-2 14 22 14" stroke="#4a5260" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="82" cy="154" r="5" fill="#3D8BFD"/>`;
}

function webcamArt(item, id) {
  return `<ellipse cx="120" cy="156" rx="52" ry="6" fill="#000" opacity=".28"/>
    <path d="M100 130h40l8 22H92z" fill="#3a414c"/><rect x="108" y="108" width="24" height="26" fill="#4a5260"/>
    <rect x="52" y="30" width="136" height="82" rx="22" fill="#23262c"/>
    <circle cx="120" cy="71" r="30" fill="#14171c"/><circle cx="120" cy="71" r="22" fill="#0b0d10" stroke="#3D8BFD" stroke-width="2"/>
    <circle cx="120" cy="71" r="10" fill="#1d3a66"/><circle cx="114" cy="65" r="3.5" fill="#fff" opacity=".6"/>
    <circle cx="168" cy="48" r="3" fill="#4cd68a"/>`;
}

function standArt(item, id) {
  return `<ellipse cx="120" cy="154" rx="86" ry="6" fill="#000" opacity=".28"/>
    <path d="M40 150l56-68h88l-48 68z" fill="#b9bec6"/>
    <path d="M96 82h88l-4 8H88z" fill="#8c929b"/>
    <path d="M40 150h92l-2 6H38z" fill="#7d838c"/>
    <path d="M124 150l40-52" stroke="#8c929b" stroke-width="6" stroke-linecap="round"/>
    <rect x="86" y="70" width="104" height="12" rx="4" fill="#9aa1ab" transform="rotate(-8 138 76)"/>
    <path d="M52 72l-12 6M52 84l-12-2" stroke="#3D8BFD" stroke-width="2" opacity="0"/>`;
}

function peripheralArt(item) {
  const id = _uid();
  const map = {
    "Keyboards": kbArt, "Mice": mouseArt, "Laptop Bags": bagArt, "Docks & Hubs": hubArt,
    "Cooling": coolingArt, "Power": chargerArt, "Storage": storageArt, "Audio": audioArt,
    "Webcams": webcamArt, "Stands": standArt,
  };
  const fn = map[item.cat] || storageArt;
  return `<svg class="art" viewBox="0 0 240 180" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${escAttr(item.name)}">${fn(item, id)}</svg>`;
}

// ============ MONITORS ============
function monitorArt(m) {
  const id = _uid();
  const cat = (m.cat || "").toLowerCase();
  const gaming = /gaming/.test(cat);
  const ultra = /ultrawide/.test(cat);
  const portable = /portable/.test(cat);
  const pro = /4k/.test(cat);
  const [w1, w2] = gaming ? ["#b3132b", "#ff6a3d"] : pro ? ["#7a4de0", "#35c9ff"] : ultra ? ["#0a8f9e", "#8ce6d8"] : ["#1f6fe0", "#7fd0ff"];
  const defs = `<defs><linearGradient id="${id}w" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${w1}"/><stop offset="1" stop-color="${w2}"/></linearGradient>
    <linearGradient id="${id}g" x1="0" x2="1"><stop offset="0" stop-color="#3dd6ff"/><stop offset=".5" stop-color="#9b5cff"/><stop offset="1" stop-color="#ff3d9a"/></linearGradient></defs>`;
  const wall = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2" fill="url(#${id}w)"/>
    <circle cx="${x + w * 0.72}" cy="${y + h * 0.32}" r="${h * 0.28}" fill="${w2}" opacity=".35"/>
    <path d="M${x} ${y + h * 0.78}c${w * 0.2}-${h * 0.2} ${w * 0.4}-${h * 0.05} ${w * 0.6}-${h * 0.14}s${w * 0.3}-${h * 0.18} ${w * 0.4}-${h * 0.06}V${y + h}H${x}z" fill="#000" opacity=".25"/>`;

  let inner;
  if (portable) {
    inner = `<ellipse cx="120" cy="150" rx="84" ry="6" fill="#000" opacity=".28"/>
      <path d="M96 150l24-30 24 30z" fill="#2b3038" opacity="0"/>
      <rect x="30" y="30" width="180" height="106" rx="6" fill="#20242b" transform="rotate(-3 120 83)"/>
      <g transform="rotate(-3 120 83)">${wall(35, 35, 170, 96)}</g>
      <path d="M150 136l18 18H190l-16-18z" fill="#2b3038" opacity="0"/>
      <path d="M205 120h20q6 0 6 6v10q0 6-6 6h-8" stroke="#8c929b" stroke-width="3" fill="none"/>`;
  } else if (ultra) {
    inner = `<ellipse cx="120" cy="156" rx="80" ry="6" fill="#000" opacity=".28"/>
      <path d="M118 120h4l3 26H115z" fill="#5d636c"/>
      <path d="M88 150q32-8 64 0v4q-32-6-64 0z" fill="#3a414c"/>
      <path d="M12 44q108 18 216 0v76q-108 14-216 0z" fill="#15181d"/>
      <path d="M17 49q103 16 206 0v66q-103 12-206 0z" fill="url(#${id}w)"/>
      <path d="M17 100q60-10 100-4t106-10v29q-103 12-206 0z" fill="#000" opacity=".25"/>
      <circle cx="170" cy="72" r="16" fill="${w2}" opacity=".35"/>`;
  } else {
    const w = pro ? 192 : 176, h = pro ? 112 : 102, x = (240 - w) / 2, y = pro ? 16 : 20;
    const standY = y + h;
    inner = `<ellipse cx="120" cy="164" rx="72" ry="6" fill="#000" opacity=".28"/>
      ${gaming
        ? `<path d="M120 ${standY}l-30 50h12l18-30 18 30h12z" fill="#2b3038"/><path d="M86 ${standY + 46}l10-6M154 ${standY + 46}l-10-6" stroke="url(#${id}g)" stroke-width="3"/>`
        : `<path d="M110 ${standY}h20l4 30h-28z" fill="#5d636c"/><path d="M84 ${standY + 30}q36-9 72 0v6q-36-6-72 0z" fill="#3a414c"/>`}
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="5" fill="#15181d"/>
      ${wall(x + 5, y + 5, w - 10, h - 16)}
      ${gaming ? `<path d="M${x} ${y + h + 1}h${w}" stroke="url(#${id}g)" stroke-width="2"/>` : ""}
      <circle cx="120" cy="${y + h - 5}" r="1.4" fill="#4cd68a"/>
      ${pro ? `<text x="${x + 12}" y="${y + 22}" font-family="IBM Plex Mono, monospace" font-size="11" font-weight="600" fill="#fff" opacity=".9">4K</text>` : ""}
      ${gaming && m.refresh ? `<text x="${x + w - 12}" y="${y + 22}" text-anchor="end" font-family="IBM Plex Mono, monospace" font-size="11" font-weight="600" fill="#fff" opacity=".9">${m.refresh}Hz</text>` : ""}`;
  }
  return `<svg class="art" viewBox="0 0 240 180" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${escAttr(m.name)}">${defs}${inner}</svg>`;
}

// ============ PUBLIC API ============
function allProducts() {
  const out = {};
  [typeof LAPTOPS !== "undefined" ? LAPTOPS : [], typeof PERIPHERALS !== "undefined" ? PERIPHERALS : [], typeof MONITORS !== "undefined" ? MONITORS : []]
    .forEach((list) => list.forEach((p) => (out[p.id] = p)));
  return out;
}

function productArt(item) {
  if (!item) return "";
  if (PHOTO_OVERRIDES[item.id]) {
    return `<img class="art photo" loading="lazy" src="${escAttr(PHOTO_OVERRIDES[item.id])}" alt="${escAttr(item.name)}">`;
  }
  if (item.brand && /^(hp|dell|lenovo|apple|acer|msi)$/.test(item.brand)) return laptopArt(item);
  if (/^mon-/.test(item.id)) return monitorArt(item);
  return peripheralArt(item);
}

// Static pages (index / peripherals / monitors) ship with placeholder icons;
// swap them for the real illustration using the card's Add-to-cart id.
function hydrateProductThumbs() {
  const products = allProducts();
  document.querySelectorAll(".product-card").forEach((card) => {
    const btn = card.querySelector("[data-add-to-cart]");
    const thumb = card.querySelector(".product-thumb");
    if (!btn || !thumb || thumb.dataset.hydrated) return;
    const p = products[btn.dataset.id];
    if (!p) return;
    const badge = thumb.querySelector(".badge");
    thumb.innerHTML = (badge ? badge.outerHTML : "") + productArt(p);
    thumb.dataset.hydrated = "1";
  });
}

document.addEventListener("DOMContentLoaded", hydrateProductThumbs);
