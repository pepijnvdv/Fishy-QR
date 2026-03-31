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
    micLabel.textContent = 'Niet ondersteund – gebruik Chrome/Edge';
    return;
  }

  // ── Levenshtein fuzzy distance ───────────────────────
  // Returns 0 for identical strings, higher = more different.
  // Normalized: divide by max word length → 0..1 score.
  function levenshtein(a, b) {
    const m = a.length, n = b.length;
    const dp = [];
    for (let i = 0; i <= m; i++) { dp[i] = [i]; }
    for (let j = 0; j <= n; j++) { dp[0][j] = j; }
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (a[i-1] === b[j-1]) dp[i][j] = dp[i-1][j-1];
        else dp[i][j] = 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
      }
    }
    return dp[m][n];
  }

  // Best fuzzy match from a candidate list. Returns null if no match within threshold.
  function bestFuzzy(word, candidates, threshold = 0.40) {
    let best = null, bestScore = Infinity;
    for (const c of candidates) {
      const score = levenshtein(word, c) / Math.max(word.length, c.length, 1);
      if (score < bestScore) { bestScore = score; best = c; }
    }
    return bestScore <= threshold ? best : null;
  }

  // ── Vocabulary ───────────────────────────────────────
  // Colours – include inflected forms (rode, blauwe, groene…) to catch browser inflections
  const COLOR_MAP = {
    rood: '#f44336', rode: '#f44336', rooie: '#f44336', root: '#f44336',
    oranje: '#ff9800', oranja: '#ff9800',
    geel: '#ffd600', gele: '#ffd600', goud: '#ffd600', gouden: '#ffd600',
    groen: '#4caf50', groene: '#4caf50', grune: '#4caf50',
    turkoois: '#00bcd4', turquoise: '#00bcd4', cyaan: '#00bcd4', aqua: '#4db6ac',
    blauw: '#2196f3', blauwe: '#2196f3', blaauwe: '#2196f3', blouw: '#2196f3',
    paars: '#9c27b0', paarze: '#9c27b0', paarze: '#9c27b0', violet: '#9c27b0',
    roze: '#e91e63', roze: '#e91e63', pink: '#e91e63',
    wit: '#ffffff', witte: '#ffffff', ivoor: '#ffffff',
    zwart: '#1a1a2e', zwarte: '#1a1a2e',
    grijs: '#78909c', grijze: '#78909c', grize: '#78909c', zilver: '#78909c',
    bruin: '#795548', bruine: '#795548',
    regenboog: 'rainbow', kleurrijk: 'rainbow',
  };

  // Regions – seed coords land inside the zone on the hidden zone canvas
  const REGION_MAP = [
    { words: ['lichaam','lijf','romp','midden','centrum','body'], x: 430, y: 250 },
    { words: ['staart','achterkant','achterin','tail'],            x:  55, y: 195 },
    { words: ['oog','pupil','iris','ogen','eye'],                  x: 580, y: 230 },
    { words: ['rugvin','rugfin','bovenvin','topvin','bovenfin','dorsal','rug'], x: 390, y: 105 },
    { words: ['borstvin','borstfin','zijvin','middelvin','borst'], x: 385, y: 290 },
    { words: ['buikvinnen','buikvin','ondervin','ondervinnen','onderfin','buik','onderste'], x: 465, y: 373 },
    { words: ['alles','geheel','heel','everything','hele'],         x: null, y: null },
  ];

  // Patterns
  const PATTERN_MAP = [
    { words: ['stippen','stip','bolletjes','dots'],           fn: paintDots,        label: '⚪ Stippen' },
    { words: ['ruiten','ruit','blokjes','dambord','checker'], fn: paintChecker,     label: '◆ Ruiten' },
    { words: ['schalen','schubben','schaal','scales'],        fn: paintScales,      label: '🐠 Schalen' },
    { words: ['vlekken','vlek','vlekjes','spots'],            fn: paintBlotches,    label: '🐆 Vlekken' },
    { words: ['verloop','gradient','fade','gradiënt'],        fn: paintGradient,    label: '🌈 Verloop' },
    { words: ['golven','golvend','strepen','patroon','streep','waves'], fn: paintWavyPattern, label: '🌊 Golven' },
  ];
  const RAINBOW = ['#f44336','#ff9800','#ffd600','#4caf50','#00bcd4','#2196f3','#9c27b0'];

  // Flat lookup maps for fuzzy scanning
  const colorWords   = Object.keys(COLOR_MAP);
  const regionWordToRegion = {};
  REGION_MAP.forEach(r => r.words.forEach(w => { regionWordToRegion[w] = r; }));
  const regionWords  = Object.keys(regionWordToRegion);
  const patternWordToPat = {};
  PATTERN_MAP.forEach(p => p.words.forEach(w => { patternWordToPat[w] = p; }));
  const patternWords = Object.keys(patternWordToPat);
  const clearWords   = ['wissen','leegmaken','opnieuw','schoon','clear','reset'];
  const undoWords    = ['ongedaan','terugdraaien','terug','undo'];

  // ── Smart parser ─────────────────────────────────────
  // Splits text into words and fuzzy-matches each against the full vocabulary.
  function parseCommand(text) {
    const words = text.toLowerCase().replace(/[.,!?]/g, '').split(/\s+/).filter(Boolean);

    let foundColor = null, colorName = null;
    let foundRegion = null, regionName = null;
    let foundPattern = null;

    for (const word of words) {
      // Actions first
      if (!foundColor && !foundRegion && !foundPattern) {
        if (bestFuzzy(word, clearWords, 0.30)) return { action: 'clear' };
        if (bestFuzzy(word, undoWords,  0.30)) return { action: 'undo' };
      }
      // Color
      if (!foundColor) {
        const m = bestFuzzy(word, colorWords, 0.38);
        if (m) { foundColor = COLOR_MAP[m]; colorName = m; }
      }
      // Region
      if (!foundRegion) {
        const m = bestFuzzy(word, regionWords, 0.38);
        if (m) { foundRegion = regionWordToRegion[m]; regionName = m; }
      }
      // Pattern
      if (!foundPattern) {
        const m = bestFuzzy(word, patternWords, 0.38);
        if (m) { foundPattern = patternWordToPat[m]; }
      }
    }
    return { action: 'paint', color: foundColor, colorName, region: foundRegion, regionName, pattern: foundPattern };
  }

  // Try up to 3 browser alternatives, return the first one that parses usefully
  function tryAlternatives(result) {
    for (let i = 0; i < result.length; i++) {
      const transcript = result[i].transcript.toLowerCase().trim();
      const cmd = parseCommand(transcript);
      const useful = cmd.action !== 'paint' || cmd.color || cmd.region || cmd.pattern;
      if (useful) return { cmd, transcript };
    }
    return { cmd: parseCommand(result[0].transcript.toLowerCase().trim()), transcript: result[0].transcript };
  }

  // ── Execute parsed command ───────────────────────────
  function executeCommand(cmd, rawText) {
    if (cmd.action === 'clear') {
      clearFish();
      voiceText.textContent = '🗑️ Gewist!';
      showToast('🗑️ Canvas gewist');
      return;
    }
    if (cmd.action === 'undo') {
      undo();
      voiceText.textContent = '↩️ Teruggedraaid!';
      return;
    }
    if (cmd.pattern) {
      saveUndo();
      let c1 = cmd.color && cmd.color !== 'rainbow' ? cmd.color : currentColor;
      let c2 = '#ffffff';
      if (cmd.color && cmd.color !== 'rainbow') selectColor(cmd.color);
      if (cmd.color === 'rainbow') { c1 = '#2196f3'; c2 = '#ff9800'; }
      cmd.pattern.fn(c1, c2);
      voiceText.textContent = `${cmd.pattern.label} geschilderd!`;
      showToast(`${cmd.pattern.label} klaar!`);
      return;
    }
    if (!cmd.color && !cmd.region) {
      voiceText.textContent = `❓ Niet begrepen: "${rawText}" — probeer "oranje lichaam"`;
      return;
    }
    if (cmd.color && cmd.color !== 'rainbow') selectColor(cmd.color);
    if (cmd.region) {
      saveUndo();
      if (cmd.region.x === null) {
        const seeds = REGION_MAP.filter(r => r.x !== null);
        seeds.forEach((r, idx) => {
          const clr = cmd.color === 'rainbow' ? RAINBOW[idx % RAINBOW.length] : (cmd.color || currentColor);
          if (cmd.color === 'rainbow') selectColor(clr);
          fillZone(r.x, r.y, clr);
        });
      } else {
        const clr = cmd.color === 'rainbow'
          ? RAINBOW[Math.floor(Math.random() * RAINBOW.length)]
          : (cmd.color || currentColor);
        if (cmd.color === 'rainbow') selectColor(clr);
        fillZone(cmd.region.x, cmd.region.y, clr);
      }
      const msg = cmd.color ? `✨ ${cmd.regionName} → ${cmd.colorName}!` : `✨ ${cmd.regionName} geschilderd!`;
      voiceText.textContent = msg;
      showToast(msg);
    } else {
      voiceText.innerHTML = `🎨 Kleur: <em>${cmd.colorName}</em> — zeg nu een visonderdeel!`;
    }
  }

  // ── Single-utterance recognition (tap → speak → auto-done) ──
  // This is far more reliable than continuous mode, which drops out
  // after a few seconds of silence, especially on mobile.
  let isListening = false;

  function startListening() {
    if (isListening) return;
    const recognition = new SpeechRecognition();
    recognition.lang            = 'nl-NL';
    recognition.continuous      = false;   // ← key: one utterance, then auto-stop
    recognition.interimResults  = true;    // show live text while speaking
    recognition.maxAlternatives = 3;       // try up to 3 browser guesses

    recognition.onstart = () => {
      isListening = true;
      micBtn.classList.add('listening');
      micLabel.textContent = 'Spreek nu…';
      voiceDiv.classList.add('listening');
      voiceText.innerHTML  = '🎙️ Luisteren… zeg bijv. <em>"rode rugvin"</em>';
    };

    recognition.onresult = (e) => {
      const interim = Array.from(e.results).map(r => r[0].transcript).join(' ');
      voiceText.textContent = `"${interim}"`;

      for (const result of e.results) {
        if (result.isFinal) {
          const { cmd, transcript } = tryAlternatives(result);
          executeCommand(cmd, transcript);
        }
      }
    };

    recognition.onerror = (e) => {
      if (e.error === 'no-speech') {
        voiceText.textContent = '🎙️ Geen spraak gehoord — tik opnieuw';
      } else {
        voiceText.textContent = `⚠️ Fout: ${e.error}`;
      }
    };

    // onend fires automatically after the utterance is processed
    recognition.onend = () => {
      isListening = false;
      micBtn.classList.remove('listening');
      micLabel.textContent = 'Tik om te spreken';
      voiceDiv.classList.remove('listening');
    };

    try { recognition.start(); }
    catch (err) { isListening = false; console.warn('recognition.start():', err); }
  }

  micBtn.addEventListener('click', () => { if (!isListening) startListening(); });

  // Initial label
  micLabel.textContent = 'Tik om te spreken';
  voiceText.innerHTML  = 'Zeg een kleur + visonderdeel — bijv. <em>"oranje lichaam"</em> of <em>"groene rugvin"</em>';
}

