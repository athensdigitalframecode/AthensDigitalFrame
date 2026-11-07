/* Hand-built vector art (no external assets). Everything is generated here and injected by main.js */
window.ART = (function () {
  const ns = 'http://www.w3.org/2000/svg';

  /* ---------- reach stacker (side view, faces right) ---------- */
  const stacker = `
<svg viewBox="0 0 600 430" xmlns="${ns}" class="svg-stacker">
  <defs>
    <linearGradient id="stB" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a97dd"/><stop offset="1" stop-color="#176aa6"/></linearGradient>
    <pattern id="hz" width="18" height="18" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="9" height="18" fill="#f2b705"/><rect x="9" width="9" height="18" fill="#17181b"/></pattern>
  </defs>
  <!-- boom -->
  <g id="boom" style="transform-origin:215px 258px">
    <polygon points="205,238 232,262 585,52 565,22" fill="#15171c"/>
    <polygon points="212,246 228,258 575,40 568,30" fill="#2b2e36"/>
    <text x="352" y="170" fill="#8fd0ff" font-size="11" font-family="Tomorrow,Inter,sans-serif" font-weight="700" letter-spacing="2" transform="rotate(-32 352 170)">ARCLINES</text>
    <polygon points="268,350 290,350 420,150 402,142" fill="#23262d"/>
    <rect x="515" y="22" width="86" height="16" fill="url(#hz)"/>
    <rect x="523" y="12" width="70" height="12" fill="#15171c"/>
  </g>
  <!-- chassis -->
  <path d="M82 292 Q82 258 118 258 L196 258 L196 232 L262 232 L272 258 L392 258 Q426 258 426 290 L426 340 L82 340Z" fill="url(#stB)"/>
  <rect x="196" y="236" width="62" height="40" rx="3" fill="#0f1a24"/>
  <rect x="204" y="242" width="46" height="28" rx="2" fill="#7fb7e0" opacity=".85"/>
  <rect x="82" y="306" width="344" height="10" fill="#0e4f7d" opacity=".7"/>
  <!-- wheels -->
  <g><circle cx="150" cy="352" r="64" fill="#0b0c0f"/><circle cx="150" cy="352" r="32" fill="#2a2d34"/><circle cx="150" cy="352" r="12" fill="#6c7280"/></g>
  <g><circle cx="368" cy="360" r="56" fill="#0b0c0f"/><circle cx="368" cy="360" r="28" fill="#2a2d34"/><circle cx="368" cy="360" r="11" fill="#6c7280"/></g>
</svg>`;

  /* ---------- truck (side view, faces right). container is separate DOM ---------- */
  const truck = `
<svg viewBox="0 0 1000 300" xmlns="${ns}" class="svg-truck">
  <!-- trailer chassis -->
  <rect x="0" y="205" width="800" height="16" fill="#202228"/>
  <rect x="40" y="221" width="500" height="8" fill="#14151a"/>
  <rect x="610" y="221" width="150" height="14" fill="#2b2d34"/>
  <rect x="64" y="229" width="12" height="40" fill="#14151a"/>
  <!-- trailer axles -->
  ${[120, 196, 272].map(x => `<g><circle cx="${x}" cy="262" r="30" fill="#0a0b0d"/><circle cx="${x}" cy="262" r="15" fill="#3b3e47"/><circle cx="${x}" cy="262" r="5" fill="#8b909c"/></g>`).join('')}
  <!-- cab -->
  <path d="M790 205 L790 70 Q790 48 812 46 L930 46 Q956 46 968 74 L992 150 Q1000 172 1000 196 L1000 232 L790 232Z" fill="#111216"/>
  <path d="M902 62 L944 62 Q956 62 962 76 L984 140 L902 140Z" fill="#2c3239"/>
  <path d="M912 70 L942 70 L968 132 L912 132Z" fill="#6f7a86" opacity=".55"/>
  <rect x="800" y="150" width="86" height="44" rx="3" fill="#1b1d22"/>
  <rect x="800" y="204" width="200" height="14" fill="#2a2d34"/>
  <rect x="812" y="20" width="40" height="26" rx="3" fill="#15161a"/>
  <!-- cab wheels -->
  ${[850, 944].map(x => `<g><circle cx="${x}" cy="258" r="36" fill="#0a0b0d"/><circle cx="${x}" cy="258" r="18" fill="#3b3e47"/><circle cx="${x}" cy="258" r="6" fill="#8b909c"/></g>`).join('')}
  <rect x="20" y="205" width="780" height="4" fill="#3a3d46"/>
</svg>`;

  /* ---------- truck top-down (faces right) ---------- */
  const truckTop = `
<svg viewBox="0 0 320 100" xmlns="${ns}" class="svg-trucktop">
  <defs>
    <pattern id="ttrib" width="8" height="100" patternUnits="userSpaceOnUse"><rect width="8" height="100" fill="#cfd3dc"/><rect x="5" width="3" height="100" fill="#aeb3bf"/></pattern>
  </defs>
  <rect x="2" y="8" width="236" height="84" rx="3" fill="url(#ttrib)"/>
  <rect x="2" y="8" width="236" height="84" rx="3" fill="none" stroke="#8a8f9b" stroke-width="2"/>
  <rect x="236" y="40" width="14" height="20" fill="#2a2d34"/>
  <rect x="250" y="14" width="68" height="72" rx="8" fill="#101115"/>
  <rect x="296" y="22" width="18" height="56" rx="4" fill="#4a525d"/>
  <rect x="254" y="20" width="36" height="60" rx="5" fill="#1d1f25"/>
</svg>`;

  /* ---------- container ship top-down (bow up) ---------- */
  function ship() {
    const pal = ['#d8362f', '#2f56e0', '#f4f6fb', '#3fae4a', '#e88b25', '#e0508f', '#f4f6fb', '#2a8cd8', '#d8362f', '#e7c928'];
    let seed = 7;
    const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
    let bays = '';
    const bayDefs = [[70, 150], [168, 252], [270, 354], [372, 440]];
    bayDefs.forEach(([y0, y1]) => {
      for (let c = 0; c < 6; c++) {
        let y = y0;
        while (y < y1 - 6) {
          const h = (y1 - y) > 40 ? (rnd() < .5 ? 22 : 34) : (y1 - y - 2);
          const col = pal[Math.floor(rnd() * pal.length)];
          bays += `<rect x="${21 + c * 10.5}" y="${y}" width="9.2" height="${h - 2}" fill="${col}"/>`;
          y += h;
        }
      }
    });
    const wavy = (side, off, amp, ph) => {
      let d = '';
      for (let y = 40; y <= 590; y += 10) {
        const spread = Math.min(1, y / 140) * off;
        const x = side < 0 ? 12 - spread + amp * Math.sin(y / 9 + ph) : 88 + spread + amp * Math.sin(y / 9 + ph);
        d += (y === 40 ? 'M' : 'L') + x.toFixed(1) + ' ' + y;
      }
      return d;
    };
    let wake = '';
    [[-1, 6, 1.6, 0, 3, '16 7', .8, 1.2], [-1, 10, 2.4, 2, 6, '9 14', .5, 1.7], [-1, 15, 3, 4, 10, '5 20', .35, 2.2],
     [1, 6, 1.6, 1, 3, '16 7', .8, 1.2], [1, 10, 2.4, 3, 6, '9 14', .5, 1.7], [1, 15, 3, 5, 10, '5 20', .35, 2.2]].forEach(([sd, off, amp, ph, w, da, op, dur]) => {
      wake += `<path d="${wavy(sd, off, amp, ph)}" stroke-width="${w}" opacity="${op}" stroke-dasharray="${da}" filter="url(#blurW)"><animate attributeName="stroke-dashoffset" from="0" to="-${da.split(' ').reduce((a, b) => a + +b, 0) * 2}" dur="${dur}s" repeatCount="indefinite"/></path>`;
    });
    wake += '<path d="M50 556 Q36 590 50 640 Q64 590 50 556" stroke-width="14" opacity=".28" filter="url(#blurW)"/>';
    wake += '<path d="M28 20 Q50 -22 72 20" stroke-width="5" opacity=".8" filter="url(#blurW)"/>';
    return `
<svg viewBox="0 0 100 560" xmlns="${ns}" class="svg-ship">
  <defs>
    <linearGradient id="hull" x1="0" x2="1"><stop offset="0" stop-color="#0b1a52"/><stop offset=".5" stop-color="#16307f"/><stop offset="1" stop-color="#0b1a52"/></linearGradient>
    <filter id="blurW"><feGaussianBlur stdDeviation="1.4"/></filter>
  </defs>
  <g class="wake" fill="none" stroke="#eaf3ff" stroke-linecap="round">
    ${wake}
  </g>
  <path d="M50 4 Q74 30 86 92 L88 520 Q88 548 70 552 L30 552 Q12 548 12 520 L14 92 Q26 30 50 4Z" fill="url(#hull)" stroke="#9fc4ff" stroke-width="1.2"/>
  ${bays}
  <rect x="26" y="452" width="48" height="74" rx="3" fill="#eef2fa"/>
  <rect x="30" y="458" width="40" height="12" fill="#1a2a64"/>
  <rect x="30" y="476" width="40" height="40" fill="#dfe5f2"/>
  <rect x="44" y="40" width="12" height="18" rx="2" fill="#eef2fa"/>
</svg>`;
  }

  /* ---------- airplane top-down (nose right) ---------- */
  const plane = `
<svg viewBox="0 0 1200 700" xmlns="${ns}" class="svg-plane">
  <defs>
    <linearGradient id="fus" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".55" stop-color="#e9edf5"/><stop offset="1" stop-color="#b9c0cf"/></linearGradient>
    <linearGradient id="wing" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#c3cad8"/></linearGradient>
    <filter id="pshadow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="14"/></filter>
  </defs>
  <g opacity=".22" filter="url(#pshadow)" transform="translate(30,60)" fill="#1a2a64">
    <path d="M70 340 Q70 300 220 300 L1020 300 Q1160 316 1170 350 Q1160 384 1020 400 L220 400 Q70 400 70 360Z"/>
    <path d="M520 300 L760 20 L850 20 L760 300Z"/><path d="M520 400 L760 680 L850 680 L760 400Z"/>
  </g>
  <!-- wings -->
  <path d="M500 300 L720 24 L820 24 L752 300Z" fill="url(#wing)"/>
  <path d="M500 400 L720 676 L820 676 L752 400Z" fill="url(#wing)"/>
  <rect x="640" y="130" width="64" height="38" rx="14" fill="#cfd5e2"/><rect x="640" y="532" width="64" height="38" rx="14" fill="#a9b1c2"/>
  <!-- tailplanes -->
  <path d="M110 330 L40 190 L108 190 L196 316Z" fill="url(#wing)"/>
  <path d="M110 370 L40 510 L108 510 L196 384Z" fill="url(#wing)"/>
  <path d="M40 190 L70 190 L84 216 L56 216Z" fill="#c8312f"/><path d="M40 510 L70 510 L84 484 L56 484Z" fill="#c8312f"/>
  <!-- fuselage -->
  <path d="M60 350 Q60 304 200 304 L980 304 Q1130 312 1160 350 Q1130 388 980 396 L200 396 Q60 396 60 350Z" fill="url(#fus)"/>
  <path d="M60 350 Q60 304 200 304 L980 304 Q1130 312 1160 350" fill="none" stroke="#fff" stroke-width="3" opacity=".7"/>
  <rect x="330" y="344" width="580" height="4" fill="#c8312f" opacity=".85"/>
  <path d="M1040 332 Q1100 330 1128 350 Q1100 370 1040 368Z" fill="#7d8798"/>
  <path d="M380 304 L380 396" stroke="#cfd5e2" stroke-width="2"/><path d="M620 304 L620 396" stroke="#cfd5e2" stroke-width="2"/>
</svg>`;

  /* ---------- icons ---------- */
  const s = (d, extra = '') => `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" ${extra}>${d}</svg>`;
  const icons = {
    air: s('<path d="M4 18l8-2 6-10 3 1-3 9 8 2v3l-9-1-3 5-2-.5 1-5-9 0z"/>'),
    ocean: s('<path d="M4 20h24l-3 6H7z"/><path d="M9 20v-7h14v7M13 13V8h6v5"/>'),
    customs: s('<rect x="7" y="4" width="18" height="24" rx="2"/><path d="M11 11h10M11 16h10M11 21h6"/>'),
    warehouse: s('<path d="M3 13L16 5l13 8v14H3z"/><path d="M10 27V17h12v10M10 21h12"/>'),
    project: s('<rect x="4" y="16" width="14" height="10"/><path d="M18 22h8l3-4v8H18zM8 16V7l10-3v12"/>'),
    pin: s('<path d="M16 28s9-8 9-14a9 9 0 10-18 0c0 6 9 14 9 14z"/><circle cx="16" cy="14" r="3.5"/>'),
    globe: s('<circle cx="16" cy="16" r="11"/><path d="M5 16h22M16 5c4 3 5 7 5 11s-1 8-5 11c-4-3-5-7-5-11s1-8 5-11z"/>'),
    headset: s('<path d="M6 18v-3a10 10 0 0120 0v3"/><rect x="4" y="18" width="5" height="8" rx="2"/><rect x="23" y="18" width="5" height="8" rx="2"/><path d="M25 26c0 2-3 3-7 3"/>'),
    dot: s('<circle cx="16" cy="16" r="10"/><circle cx="16" cy="16" r="3" fill="currentColor"/>'),
    eye: s('<path d="M3 16s5-8 13-8 13 8 13 8-5 8-13 8S3 16 3 16z"/><circle cx="16" cy="16" r="4"/>'),
    shield: s('<path d="M16 4l10 4v8c0 6-4 10-10 12C10 26 6 22 6 16V8z"/><path d="M11 16l4 4 6-8"/>'),
    coin: s('<circle cx="16" cy="16" r="11"/><path d="M16 9v14M19.5 12.5c-1-1.5-6-1.5-6.5 1.2.5 3 6.5 1.6 6.5 4.6-.5 2.700-5.500 2.700-7 .5"/>'),
    fast: s('<path d="M6 8l8 8-8 8M16 8l8 8-8 8"/>')
  };

  /* ---------- placeholder partner wordmarks (fictional) ---------- */
  const logos = [
    ['ALTAIR', 'w'], ['Nordvik', 'i'], ['SEAWAY', 'b'], ['pacific arc', 'l'], ['KESTREL', 'w'],
    ['ORION', 'b'], ['Tidewater', 'i'], ['HALO AIR', 'w'], ['mirai', 'l'], ['NORTHSTAR', 'b'],
    ['Cobalt', 'i'], ['AEROLINE', 'w'], ['VESPER', 'b'], ['coralis', 'l'], ['SUNDA', 'w'],
    ['Meridian', 'i'], ['TRANSPAC', 'b'], ['ZENITH', 'w'], ['harbor&co', 'l'], ['LUMEN', 'b']
  ];

  return { stacker, truck, truckTop, ship, plane, icons, logos };
})();
