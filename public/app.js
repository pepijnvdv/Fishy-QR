/* =====================================================
   Fish Coloring App – app.js  (voice-only, zone-fill)
   ===================================================== */

// ── Two-canvas setup ─────────────────────────────────
// paintCanvas (bottom): where colours are drawn
// outlineCanvas (top, pointer-events:none): permanent fish outline
const paintCanvas   = document.getElementById('fishCanvas');
const paintCtx      = paintCanvas.getContext('2d', { willReadFrequently: true });
const outlineCanvas = document.getElementById('outlineCanvas');
const outlineCtx    = outlineCanvas.getContext('2d');
const W = paintCanvas.width;   // 800
const H = paintCanvas.height;  // 500

// ── State ─────────────────────────────────────────────
let currentColor = '#ff6b35';
const undoStack  = [];
const MAX_UNDO   = 20;

// ── Colours ───────────────────────────────────────────
const COLORS = [
  '#ff6b35','#ff9800','#ffd600',
  '#4caf50','#00bcd4','#2196f3',
  '#9c27b0','#e91e63','#f44336',
  '#ffffff','#90caf9','#a5d6a7',
  '#ffe082','#ef9a9a','#ce93d8',
  '#4db6ac','#ff8a65','#78909c',
];

const palette = document.getElementById('palette');
COLORS.forEach(c => {
  const swatch = document.createElement('button');
  swatch.className = 'swatch';
  swatch.style.background = c;
  swatch.setAttribute('aria-label', `Colour ${c}`);
  swatch.dataset.hex = c;
  swatch.tabIndex = -1;
  palette.appendChild(swatch);
});
palette.firstChild.classList.add('active');

function selectColor(hex) {
  currentColor = hex;
  document.querySelectorAll('.swatch').forEach(s =>
    s.classList.toggle('active', s.dataset.hex === hex)
  );
}

// ── Undo / Clear ──────────────────────────────────────
function saveUndo() {
  if (undoStack.length >= MAX_UNDO) undoStack.shift();
  undoStack.push(paintCtx.getImageData(0, 0, W, H));
}
function undo() {
  if (!undoStack.length) return;
  paintCtx.putImageData(undoStack.pop(), 0, 0);
}
function drawFish() {
  // White-filled fish as painting surface — strokes provide visual structure
  paintCtx.clearRect(0, 0, W, H);
  paintCtx.drawImage(fillImg, 0, 0, W, H);
}
function clearFish() {
  saveUndo();
  drawFish();
}

document.getElementById('btn-undo' ).addEventListener('click', undo);
document.getElementById('btn-clear').addEventListener('click', clearFish);

const encode = s => 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(s);

// ══════════════════════════════════════════════════════
// FILL SVG – white fills + dark strokes (drawn on paint canvas as the coloring surface)
// ══════════════════════════════════════════════════════
const FILL_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
  <path d="M 180 250 C 200 170,320 110,460 140 C 560 160,620 200,640 250 C 620 300,560 340,460 360 C 320 390,200 330,180 250 Z" fill="white" stroke="#1a1a2e" stroke-width="4"/>
  <path d="M 140 250 C 110 200,60 160,30 130 C 70 170,80 220,80 250 C 80 280,70 330,30 370 C 60 340,110 300,140 250 Z" fill="white" stroke="#1a1a2e" stroke-width="4"/>
  <path d="M 180 250 C 170 230,145 230,140 250 C 145 270,170 270,180 250 Z" fill="white" stroke="#1a1a2e" stroke-width="3"/>
  <path d="M 280 145 C 310 90,370 70,420 85 C 460 100,490 130,490 145" fill="white" stroke="#1a1a2e" stroke-width="4" stroke-linejoin="round"/>
  <path d="M 380 230 C 400 270,420 310,400 340 C 370 320,350 290,360 250 Z" fill="white" stroke="#1a1a2e" stroke-width="3"/>
  <path d="M 440 350 C 450 380,480 400,500 390 C 490 370,470 355,460 350 Z" fill="white" stroke="#1a1a2e" stroke-width="3"/>
  <path d="M 340 355 C 340 385,360 400,380 395 C 375 375,355 360,350 355 Z" fill="white" stroke="#1a1a2e" stroke-width="3"/>
  <circle cx="580" cy="230" r="30" fill="white" stroke="#1a1a2e" stroke-width="4"/>
  <circle cx="585" cy="230" r="18" fill="white" stroke="#1a1a2e" stroke-width="3"/>
  <circle cx="585" cy="230" r="10" fill="#4a7c59"/>
  <circle cx="589" cy="225" r="4" fill="white"/>
</svg>`;

// ══════════════════════════════════════════════════════
// OUTLINE SVG – transparent fills, strokes only (permanent overlay)
// ══════════════════════════════════════════════════════
const OUTLINE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
  <path d="M 180 250 C 200 170,320 110,460 140 C 560 160,620 200,640 250 C 620 300,560 340,460 360 C 320 390,200 330,180 250 Z" fill="none" stroke="#1a1a2e" stroke-width="4"/>
  <path d="M 140 250 C 110 200,60 160,30 130 C 70 170,80 220,80 250 C 80 280,70 330,30 370 C 60 340,110 300,140 250 Z" fill="none" stroke="#1a1a2e" stroke-width="4"/>
  <path d="M 180 250 C 170 230,145 230,140 250 C 145 270,170 270,180 250 Z" fill="none" stroke="#1a1a2e" stroke-width="3"/>
  <path d="M 280 145 C 310 90,370 70,420 85 C 460 100,490 130,490 145" fill="none" stroke="#1a1a2e" stroke-width="4" stroke-linejoin="round"/>
  <path d="M 380 230 C 400 270,420 310,400 340 C 370 320,350 290,360 250 Z" fill="none" stroke="#1a1a2e" stroke-width="3"/>
  <path d="M 440 350 C 450 380,480 400,500 390 C 490 370,470 355,460 350 Z" fill="none" stroke="#1a1a2e" stroke-width="3"/>
  <path d="M 340 355 C 340 385,360 400,380 395 C 375 375,355 360,350 355 Z" fill="none" stroke="#1a1a2e" stroke-width="3"/>
  <circle cx="580" cy="230" r="30" fill="none" stroke="#1a1a2e" stroke-width="4"/>
  <circle cx="585" cy="230" r="18" fill="none" stroke="#1a1a2e" stroke-width="3"/>
  <circle cx="585" cy="230" r="10" fill="#4a7c59"/>
  <circle cx="589" cy="225" r="4" fill="rgba(255,255,255,0.6)"/>
  <path d="M 640 265 C 650 275,648 285,638 288" fill="none" stroke="#1a1a2e" stroke-width="3" stroke-linecap="round"/>
  <path d="M 420 160 C 400 180,395 210,400 240" fill="none" stroke="#1a1a2e" stroke-width="2" stroke-linecap="round" opacity="0.5"/>
  <path d="M 370 155 C 350 175,345 210,350 240" fill="none" stroke="#1a1a2e" stroke-width="2" stroke-linecap="round" opacity="0.5"/>
  <path d="M 470 165 C 455 185,450 215,455 245" fill="none" stroke="#1a1a2e" stroke-width="2" stroke-linecap="round" opacity="0.5"/>
  <path d="M 320 165 C 302 185,298 215,303 245" fill="none" stroke="#1a1a2e" stroke-width="2" stroke-linecap="round" opacity="0.5"/>
  <path d="M 510 185 C 498 205,496 230,500 255" fill="none" stroke="#1a1a2e" stroke-width="2" stroke-linecap="round" opacity="0.5"/>
  <path d="M 220 250 C 320 245,450 248,570 252" fill="none" stroke="#1a1a2e" stroke-width="2" stroke-linecap="round" opacity="0.4" stroke-dasharray="8,6"/>
  <path d="M 560 185 C 545 220,547 280,560 315" fill="none" stroke="#1a1a2e" stroke-width="3" stroke-linecap="round"/>
  <path d="M 558 190 C 530 225,532 275,558 310" fill="none" stroke="#1a1a2e" stroke-width="2" stroke-linecap="round" opacity="0.3"/>
</svg>`;

// ══════════════════════════════════════════════════════
// ZONE SVG – each paintable section is a distinct solid color.
// Zone colours:
//   BODY (main oval)   → #ff0000  red
//   TAIL               → #00ff00  green
//   EYE                → #0000ff  blue
//   DORSAL FIN (top)   → #00ffff  cyan
//   PECTORAL FIN (mid) → #ff00ff  magenta
//   BOTTOM FINS        → #ffff00  yellow
// Painted in order: body first, fins on top (override body), tail+eye last.
// ══════════════════════════════════════════════════════
const ZONE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
  <!-- BODY zone (red) — main oval only -->
  <path d="M 180 250 C 200 170,320 110,460 140 C 560 160,620 200,640 250 C 620 300,560 340,460 360 C 320 390,200 330,180 250 Z" fill="#ff0000"/>

  <!-- DORSAL FIN zone (cyan) — closed arc on top -->
  <path d="M 280 145 C 310 90,370 70,420 85 C 460 100,490 130,490 145 L 280 145 Z" fill="#00ffff"/>

  <!-- PECTORAL FIN zone (magenta) — middle leaf fin -->
  <path d="M 380 230 C 400 270,420 310,400 340 C 370 320,350 290,360 250 Z" fill="#ff00ff"/>

  <!-- BOTTOM FINS zone (yellow) — pelvic + anal fins -->
  <path d="M 440 350 C 450 380,480 400,500 390 C 490 370,470 355,460 350 Z" fill="#ffff00"/>
  <path d="M 340 355 C 340 385,360 400,380 395 C 375 375,355 360,350 355 Z" fill="#ffff00"/>

  <!-- TAIL zone (green) — painted ON TOP of body -->
  <path d="M 140 250 C 110 200,60 160,30 130 C 70 170,80 220,80 250 C 80 280,70 330,30 370 C 60 340,110 300,140 250 Z" fill="#00ff00"/>
  <!-- Tail connector → tail zone -->
  <path d="M 190 250 C 175 210,145 210,140 250 C 145 290,175 290,190 250 Z" fill="#00ff00"/>

  <!-- EYE zone (blue) — always on top -->
  <circle cx="580" cy="230" r="28" fill="#0000ff"/>
</svg>`;

// ── Offscreen canvases ────────────────────────────────
// zoneCanvas: zone membership map (body/tail/eye)
const zoneCanvas = document.createElement('canvas');
zoneCanvas.width  = W; zoneCanvas.height = H;
const zoneCtx    = zoneCanvas.getContext('2d', { willReadFrequently: true });
let   zoneData   = null;

// ── Image loading ─────────────────────────────────────
const fillImg    = new Image();
const outlineImg = new Image();
const zoneImg    = new Image();
let   loadCount  = 0;

function onReady() {
  loadCount++;
  if (loadCount < 3) return; // wait for all 3 images

  // Zone canvas
  zoneCtx.clearRect(0, 0, W, H);
  zoneCtx.drawImage(zoneImg, 0, 0, W, H);
  zoneData = zoneCtx.getImageData(0, 0, W, H).data;

  // Outline canvas (permanent top layer)
  outlineCtx.clearRect(0, 0, W, H);
  outlineCtx.drawImage(outlineImg, 0, 0, W, H);

  // Paint canvas (white-filled fish as starting state)
  drawFish();

  document.getElementById('canvas-hint').classList.add('hidden');
  setupVoice();
}

fillImg.onload    = onReady;
outlineImg.onload = onReady;
zoneImg.onload    = onReady;

fillImg.src    = encode(FILL_SVG);
outlineImg.src = encode(OUTLINE_SVG);
zoneImg.src    = encode(ZONE_SVG);

// ── Zone-aware flood fill ─────────────────────────────
function hexToRgba(hex) {
  return [
    parseInt(hex.slice(1,3), 16),
    parseInt(hex.slice(3,5), 16),
    parseInt(hex.slice(5,7), 16),
    255,
  ];
}

function colorMatch(data, idx, target, tol = 20) {
  return Math.abs(data[idx  ] - target[0]) <= tol &&
         Math.abs(data[idx+1] - target[1]) <= tol &&
         Math.abs(data[idx+2] - target[2]) <= tol &&
         Math.abs(data[idx+3] - target[3]) <= tol;
}

// Returns the zone colour [r,g,b] at a pixel, or null if outside all zones
function getZone(x, y) {
  if (!zoneData || x < 0 || x >= W || y < 0 || y >= H) return null;
  const pi = (y * W + x) * 4;
  if (zoneData[pi + 3] < 10) return null; // transparent = no zone
  return [zoneData[pi], zoneData[pi+1], zoneData[pi+2]];
}

function sameZone(a, b) {
  if (!a || !b) return false;
  return Math.abs(a[0]-b[0]) < 30 && Math.abs(a[1]-b[1]) < 30 && Math.abs(a[2]-b[2]) < 30;
}

// Paint every pixel in the zone, regardless of connectivity.
function fillZone(seedX, seedY, fillColor) {
  const targetZone = getZone(seedX, seedY);
  if (!targetZone) return;

  const imgData = paintCtx.getImageData(0, 0, W, H);
  const data    = imgData.data;
  const fill    = hexToRgba(fillColor);

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (!sameZone(getZone(x, y), targetZone)) continue;
      const pi = (y * W + x) * 4;
      if (data[pi + 3] < 10) continue;
      data[pi]   = fill[0];
      data[pi+1] = fill[1];
      data[pi+2] = fill[2];
      data[pi+3] = 255;
    }
  }
  paintCtx.putImageData(imgData, 0, 0);
}

// Wavy sine-wave stripe pattern painted across all fish zones.
// color1 = stripe color (current voice color), color2 = alternating stripe color.
function paintWavyPattern(color1, color2) {
  const imgData = paintCtx.getImageData(0, 0, W, H);
  const data    = imgData.data;
  const fill1   = hexToRgba(color1);
  const fill2   = hexToRgba(color2);
  const STRIPE  = 28; // stripe width in pixels

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (!getZone(x, y)) continue; // outside fish
      const pi = (y * W + x) * 4;
      if (data[pi + 3] < 10) continue;
      // Sine wave shifts the stripe boundary horizontally
      const wave  = Math.sin(y * 0.12) * 22;
      const band  = Math.floor((x + wave) / STRIPE);
      const fill  = band % 2 === 0 ? fill1 : fill2;
      data[pi]   = fill[0];
      data[pi+1] = fill[1];
      data[pi+2] = fill[2];
      data[pi+3] = 255;
    }
  }
  paintCtx.putImageData(imgData, 0, 0);
}

// ── STIPPEN – polka dots ──────────────────────────────
function paintDots(color1, color2) {
  const imgData = paintCtx.getImageData(0, 0, W, H);
  const data = imgData.data;
  const f1 = hexToRgba(color1), f2 = hexToRgba(color2);
  const R = 18, GAP = 44;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (!getZone(x, y)) continue;
      const pi = (y * W + x) * 4;
      if (data[pi+3] < 10) continue;
      const row = Math.floor(y / GAP);
      const ox  = row % 2 === 0 ? 0 : GAP / 2;
      const cx  = Math.floor((x + ox) / GAP) * GAP - ox + GAP / 2;
      const cy  = row * GAP + GAP / 2;
      const f   = Math.hypot(x - cx, y - cy) < R ? f1 : f2;
      data[pi]=f[0]; data[pi+1]=f[1]; data[pi+2]=f[2]; data[pi+3]=255;
    }
  }
  paintCtx.putImageData(imgData, 0, 0);
}

// ── RUITEN – checkerboard ─────────────────────────────
function paintChecker(color1, color2) {
  const imgData = paintCtx.getImageData(0, 0, W, H);
  const data = imgData.data;
  const f1 = hexToRgba(color1), f2 = hexToRgba(color2);
  const S = 36;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (!getZone(x, y)) continue;
      const pi = (y * W + x) * 4;
      if (data[pi+3] < 10) continue;
      const f = (Math.floor(x/S) + Math.floor(y/S)) % 2 === 0 ? f1 : f2;
      data[pi]=f[0]; data[pi+1]=f[1]; data[pi+2]=f[2]; data[pi+3]=255;
    }
  }
  paintCtx.putImageData(imgData, 0, 0);
}

// ── SCHALEN – fish-scale arc pattern ─────────────────
function paintScales(color1, color2) {
  const imgData = paintCtx.getImageData(0, 0, W, H);
  const data = imgData.data;
  const f1 = hexToRgba(color1), f2 = hexToRgba(color2);
  const R = 30, CX = 50, CY = 26;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (!getZone(x, y)) continue;
      const pi = (y * W + x) * 4;
      if (data[pi+3] < 10) continue;
      const row = Math.floor(y / CY);
      const ox  = row % 2 === 0 ? 0 : CX / 2;
      const scx = Math.floor((x + ox) / CX) * CX - ox + CX / 2;
      const scy = row * CY;
      const f   = Math.hypot(x - scx, y - scy) < R ? f1 : f2;
      data[pi]=f[0]; data[pi+1]=f[1]; data[pi+2]=f[2]; data[pi+3]=255;
    }
  }
  paintCtx.putImageData(imgData, 0, 0);
}

// ── VLEKKEN – organic Voronoi blotches ───────────────
function paintBlotches(color1, color2) {
  const rng = s => { const v = Math.sin(s) * 43758.5453; return v - Math.floor(v); };
  const COLS = 8, ROWS = 5;
  const seeds = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      seeds.push({
        x: (c / COLS + rng(r*100+c*7+1) / COLS) * W,
        y: (r / ROWS + rng(r*100+c*7+3) / ROWS) * H,
        id: rng(r*100+c*7+9) > 0.5 ? 0 : 1,
      });
    }
  }
  const imgData = paintCtx.getImageData(0, 0, W, H);
  const data = imgData.data;
  const f1 = hexToRgba(color1), f2 = hexToRgba(color2);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (!getZone(x, y)) continue;
      const pi = (y * W + x) * 4;
      if (data[pi+3] < 10) continue;
      let minD = Infinity, id = 0;
      for (const s of seeds) { const d = Math.hypot(x-s.x,y-s.y); if (d<minD){minD=d;id=s.id;} }
      const f = id === 0 ? f1 : f2;
      data[pi]=f[0]; data[pi+1]=f[1]; data[pi+2]=f[2]; data[pi+3]=255;
    }
  }
  paintCtx.putImageData(imgData, 0, 0);
}

// ── VERLOOP – smooth colour gradient left→right ───────
function paintGradient(color1, color2) {
  const imgData = paintCtx.getImageData(0, 0, W, H);
  const data = imgData.data;
  const f1 = hexToRgba(color1), f2 = hexToRgba(color2);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (!getZone(x, y)) continue;
      const pi = (y * W + x) * 4;
      if (data[pi+3] < 10) continue;
      const t = x / W;
      data[pi]  =Math.round(f1[0]+(f2[0]-f1[0])*t);
      data[pi+1]=Math.round(f1[1]+(f2[1]-f1[1])*t);
      data[pi+2]=Math.round(f1[2]+(f2[2]-f1[2])*t);
      data[pi+3]=255;
    }
  }
  paintCtx.putImageData(imgData, 0, 0);
}

// ── Toast ──────────────────────────────────────────────
function showToast(msg, duration = 2800) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}

// ── Send to server ─────────────────────────────────────
document.getElementById('sendBtn').addEventListener('click', async () => {
  const btn = document.getElementById('sendBtn');
  btn.disabled = true;
  btn.textContent = '⏳ Sending…';

  try {
    const tmpCanvas = document.createElement('canvas');
    tmpCanvas.width  = W; tmpCanvas.height = H;
    const tmp = tmpCanvas.getContext('2d');
    tmp.drawImage(paintCanvas,   0, 0);
    tmp.drawImage(outlineCanvas, 0, 0);

    const imageData = tmpCanvas.toDataURL('image/png');
    const res = await fetch('/submit-fish', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ imageData }),
    });
    const json = await res.json();
    if (res.ok && json.success) {
      showToast('🌊 Your fish is swimming! 🐟');
    } else {
      showToast('❌ Something went wrong.');
    }
  } catch (err) {
    showToast('❌ Could not reach the server.');
    console.error(err);
  } finally {
    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = '<span class="send-icon">🌊</span> Send to Ocean!';
    }, 2000);
  }
});

// ── Voice Painting ─────────────────────────────────────
function setupVoice() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const micBtn    = document.getElementById('btn-mic');
  const micLabel  = document.getElementById('micLabel');
  const voiceDiv  = document.getElementById('voiceStatus');
  const voiceText = document.getElementById('voiceText');

  if (!SpeechRecognition) {
    micBtn.style.opacity = '0.4';
    micBtn.style.cursor  = 'not-allowed';
    micLabel.textContent = 'Spraakherkenning niet ondersteund (gebruik Chrome/Edge)';
    return;
  }

  // ── Kleurenschema (Nederlands) ─────────────────────────
  const COLOR_MAP = {
    rood:        '#f44336', karmijn:     '#f44336', scharlaken:  '#f44336',
    oranje:      '#ff9800', amber:       '#ff9800', koraal:      '#ff6b35',
    geel:        '#ffd600', goud:        '#ffd600', limoen:      '#a5d6a7',
    groen:       '#4caf50', smaragd:     '#4caf50', bosgroen:    '#4caf50',
    turkoois:    '#00bcd4', cyaan:       '#00bcd4', aqua:        '#4db6ac', turquoise:   '#4db6ac',
    blauw:       '#2196f3', donkerblauw: '#0a2342', hemelsblauw: '#90caf9', kobalt:      '#2196f3',
    paars:       '#9c27b0', violet:      '#9c27b0', lavendel:    '#ce93d8',
    roze:        '#e91e63', magenta:     '#e91e63', zalm:        '#ff8a65',
    wit:         '#ffffff', ivoor:       '#ffffff',
    grijs:       '#78909c', zilver:      '#78909c',
    zwart:       '#1a1a2e',
    bruin:       '#795548',
    regenboog:   'rainbow',
  };

  // ── Visonderdelen (Nederlands) ──────────────────────
  // Seed coords must land inside the correct zone color on the zone canvas.
  const REGION_MAP = [
    { words: ['lijf','romp','lichaam','midden','centrum'],                                   x: 430, y: 250 },
    { words: ['staart','achterkant'],                                                         x:  55, y: 195 },
    { words: ['oog','pupil','iris'],                                                           x: 580, y: 230 },
    { words: ['rugvin','bovenste vin','topvin','bovenfin','rugfin'],                          x: 390, y: 105 },
    { words: ['borstvin','zijvin','middelste vin','middelste fin'],                           x: 385, y: 290 },
    { words: ['buikvinnen','onderste vinnen','kleine vinnen','buikvin','onderfin','onderin'], x: 465, y: 373 },
    { words: ['alles','geheel','vis','heel'],                                                  x: null, y: null },
  ];

  const RAINBOW = ['#f44336','#ff9800','#ffd600','#4caf50','#00bcd4','#2196f3','#9c27b0'];

  let recognition, listening = false;

  function startListening() {
    recognition = new SpeechRecognition();
    recognition.lang = 'nl-NL';
    recognition.interimResults  = true;
    recognition.continuous      = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      listening = true;
      micBtn.classList.add('listening');
      micLabel.textContent = 'Luisteren…';
      voiceDiv.classList.add('listening');
      voiceText.innerHTML = '🎙️ Luisteren… probeer <em>"oranje lijf"</em> of <em>"groene rugvin"</em>';
    };

    recognition.onresult = (e) => {
      const interim = Array.from(e.results).map(r => r[0].transcript).join(' ').toLowerCase().trim();
      voiceText.textContent = `"${interim}"`;
      for (const result of e.results) {
        if (result.isFinal) handleVoiceCommand(result[0].transcript.toLowerCase().trim());
      }
    };

    recognition.onerror = e => { if (e.error !== 'no-speech') voiceText.textContent = `⚠️ ${e.error}`; };
    recognition.onend   = () => { if (listening) recognition.start(); };
    recognition.start();
  }

  function stopListening() {
    listening = false;
    if (recognition) recognition.stop();
    micBtn.classList.remove('listening');
    micLabel.textContent = 'Tik om te beginnen';
    voiceDiv.classList.remove('listening');
    voiceText.innerHTML = 'Spraak uit — tik 🎙️ om opnieuw te beginnen.';
  }

  micBtn.addEventListener('click', () => listening ? stopListening() : startListening());

  function handleVoiceCommand(text) {
    if (/\bwissen\b|\bopnieuw\b|\bleegmaken\b/.test(text)) {
      clearFish();
      voiceText.textContent = '🗑️ Gewist!';
      showToast('🗑️ Canvas gewist');
      return;
    }
    if (/\bongedaan\b|\bterugdraaien\b/.test(text)) { undo(); voiceText.textContent = '↩️ Teruggedraaid!'; return; }

    // ── Patronen ────────────────────────────────────────
    const PATTERN_MAP = [
      { re: /\bstippen\b|\bstippen\b|\bbolletjes\b/, fn: paintDots,     label: '⚪ Stippen' },
      { re: /\bruiten\b|\bblokjes\b|\bdambord\b/,     fn: paintChecker,  label: '◆ Ruiten' },
      { re: /\bschalen\b|\bschubben\b/,               fn: paintScales,   label: '🐠 Schalen' },
      { re: /\bvlekken\b|\bvlekjes\b/,                fn: paintBlotches, label: '🐆 Vlekken' },
      { re: /\bverloop\b|\bgradient\b/,               fn: paintGradient, label: '🌈 Verloop' },
      { re: /\bgolven\b|\bgolvend\b|\bstrepen\b|\bpatroon\b/, fn: paintWavyPattern, label: '🌊 Golven' },
    ];

    const matchedPattern = PATTERN_MAP.find(p => p.re.test(text));
    if (matchedPattern) {
      saveUndo();
      let c1 = currentColor, c2 = '#ffffff';
      for (const [word, hex] of Object.entries(COLOR_MAP)) {
        if (text.includes(word) && hex !== 'rainbow') { c1 = hex; selectColor(c1); break; }
      }
      if (text.includes('regenboog')) { c1 = '#2196f3'; c2 = '#ff9800'; }
      matchedPattern.fn(c1, c2);
      voiceText.textContent = `${matchedPattern.label} geschilderd!`;
      showToast(`${matchedPattern.label} klaar!`);
      return;
    }

    // Find colour
    let foundColor = null, colorName = null;
    for (const [word, hex] of Object.entries(COLOR_MAP)) {
      if (text.includes(word)) { foundColor = hex; colorName = word; break; }
    }

    // Find region (longest match first)
    let foundRegion = null, regionName = null;
    outer:
    for (const region of REGION_MAP) {
      for (const w of region.words) {
        if (text.includes(w)) { foundRegion = region; regionName = region.words[0]; break outer; }
      }
    }

    if (!foundColor && !foundRegion) {
      voiceText.textContent = `❓ Niet begrepen — probeer "blauw lijf" of "rode staart"`;
      return;
    }

    if (foundColor && foundColor !== 'rainbow') selectColor(foundColor);

    if (foundRegion) {
      saveUndo();
      if (foundRegion.x === null) {
        // Fill ALL zones separately
        const seeds = REGION_MAP.filter(r => r.x !== null);
        seeds.forEach((r, idx) => {
          const clr = foundColor === 'rainbow' ? RAINBOW[idx % RAINBOW.length] : (foundColor || currentColor);
          if (foundColor === 'rainbow') selectColor(clr);
          fillZone(r.x, r.y, clr);
        });
      } else {
        const clr = foundColor === 'rainbow'
          ? RAINBOW[Math.floor(Math.random() * RAINBOW.length)]
          : (foundColor || currentColor);
        if (foundColor === 'rainbow') selectColor(clr);
        fillZone(foundRegion.x, foundRegion.y, clr);
      }

      const msg = foundColor ? `✨ ${regionName} geschilderd in ${colorName}!` : `✨ ${regionName} geschilderd!`;
      voiceText.textContent = msg;
      showToast(msg);

    } else {
      voiceText.innerHTML = `🎨 Kleur ingesteld op <em>${colorName}</em> — zeg nu een visonderdeel!`;
    }
  }
}
