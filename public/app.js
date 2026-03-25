/* =====================================================
   Fish Coloring App – app.js  (voice-only, two-canvas)
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
  swatch.tabIndex = -1; // voice-only, not interactive
  palette.appendChild(swatch);
});
palette.firstChild.classList.add('active');

function selectColor(hex) {
  currentColor = hex;
  document.querySelectorAll('.swatch').forEach(s => {
    s.classList.toggle('active', s.dataset.hex === hex);
  });
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
function clearFish() {
  saveUndo();
  paintCtx.clearRect(0, 0, W, H);
}

document.getElementById('btn-undo' ).addEventListener('click', undo);
document.getElementById('btn-clear').addEventListener('click', clearFish);

// ── SVG definitions (inline data URLs – no CORS taint) ──────────────────────

// FILL SVG: white-filled fish — used ONLY for building the mask
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

// OUTLINE SVG: transparent fills — drawn permanently on the top overlay canvas
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

const encode = s => 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(s);

// ── Mask canvas ───────────────────────────────────────
const maskCanvas = document.createElement('canvas');
maskCanvas.width  = W;
maskCanvas.height = H;
const maskCtx  = maskCanvas.getContext('2d', { willReadFrequently: true });
let   maskData = null;

// ── Load images ───────────────────────────────────────
const fillImg    = new Image();
const outlineImg = new Image();
let imagesReady  = 0;

function onImageReady() {
  imagesReady++;
  if (imagesReady === 2) init();
}

fillImg.onload = () => {
  // Build mask: red bg + fill SVG → red = outside fish
  maskCtx.fillStyle = '#ff0000';
  maskCtx.fillRect(0, 0, W, H);
  maskCtx.drawImage(fillImg, 0, 0, W, H);
  maskData = maskCtx.getImageData(0, 0, W, H).data;
  onImageReady();
};

outlineImg.onload = () => {
  // Draw outline permanently on top canvas
  outlineCtx.clearRect(0, 0, W, H);
  outlineCtx.drawImage(outlineImg, 0, 0, W, H);
  onImageReady();
};

fillImg.src    = encode(FILL_SVG);
outlineImg.src = encode(OUTLINE_SVG);

function init() {
  // Paint canvas starts clear — no fill, just transparent
  paintCtx.clearRect(0, 0, W, H);
  document.getElementById('canvas-hint').classList.add('hidden');
  setupVoice();
}

// ── Mask helper ───────────────────────────────────────
function isInsideFish(x, y) {
  if (!maskData) return true;
  if (x < 0 || x >= W || y < 0 || y >= H) return false;
  const i = ((y * W) + x) * 4;
  return !(maskData[i] > 200 && maskData[i+1] < 40 && maskData[i+2] < 40);
}

// ── Flood fill (on paintCanvas only) ─────────────────
function hexToRgba(hex) {
  return [
    parseInt(hex.slice(1,3), 16),
    parseInt(hex.slice(3,5), 16),
    parseInt(hex.slice(5,7), 16),
    255,
  ];
}

function colorMatch(data, idx, target, tol = 40) {
  return Math.abs(data[idx  ] - target[0]) <= tol &&
         Math.abs(data[idx+1] - target[1]) <= tol &&
         Math.abs(data[idx+2] - target[2]) <= tol &&
         Math.abs(data[idx+3] - target[3]) <= tol;
}

function floodFill(startX, startY, fillColor) {
  if (!isInsideFish(startX, startY)) return;

  const imgData = paintCtx.getImageData(0, 0, W, H);
  const data    = imgData.data;
  const si      = (startY * W + startX) * 4;
  const target  = [data[si], data[si+1], data[si+2], data[si+3]];
  const fill    = hexToRgba(fillColor);

  if (colorMatch(target, 0, fill, 8)) return;

  // For transparent start pixel (unpainted area), target alpha = 0
  // We still want to fill — just match any transparent pixel
  const fillTransparent = target[3] < 10;

  const stack   = [[startX, startY]];
  const visited = new Uint8Array(W * H);

  while (stack.length) {
    const [x, y] = stack.pop();
    if (x < 0 || x >= W || y < 0 || y >= H) continue;
    const i  = y * W + x;
    if (visited[i]) continue;

    // Stop at pixels outside the fish mask
    if (!isInsideFish(x, y)) continue;

    const pi = i * 4;
    if (fillTransparent) {
      // Filling an empty (transparent) region — stop at any opaque pixel
      if (data[pi + 3] >= 10) continue;
    } else {
      if (!colorMatch(data, pi, target)) continue;
    }

    visited[i]   = 1;
    data[pi]     = fill[0];
    data[pi+1]   = fill[1];
    data[pi+2]   = fill[2];
    data[pi+3]   = 255;
    stack.push([x+1,y],[x-1,y],[x,y+1],[x,y-1]);
  }

  // NO SVG redraw here — outline lives on outlineCanvas
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
    // Composite: paint layer + outline on top → single PNG
    const tmpCanvas = document.createElement('canvas');
    tmpCanvas.width  = W;
    tmpCanvas.height = H;
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
    micLabel.textContent = 'Voice not supported (use Chrome/Edge)';
    return;
  }

  // ── Colour vocabulary ──────────────────────────────
  const COLOR_MAP = {
    red:       '#f44336', crimson:   '#f44336', scarlet:  '#f44336',
    orange:    '#ff9800', amber:     '#ff9800', coral:    '#ff6b35',
    yellow:    '#ffd600', gold:      '#ffd600', lime:     '#a5d6a7',
    green:     '#4caf50', emerald:   '#4caf50', forest:   '#4caf50',
    teal:      '#00bcd4', cyan:      '#00bcd4', aqua:     '#4db6ac', turquoise: '#4db6ac',
    blue:      '#2196f3', navy:      '#0a2342', sky:      '#90caf9', cobalt:    '#2196f3',
    purple:    '#9c27b0', violet:    '#9c27b0', lavender: '#ce93d8',
    pink:      '#e91e63', rose:      '#e91e63', magenta:  '#e91e63', salmon:    '#ff8a65',
    white:     '#ffffff', ivory:     '#ffffff',
    grey:      '#78909c', gray:      '#78909c', silver:   '#78909c',
    black:     '#1a1a2e',
    brown:     '#795548',
    rainbow:   'rainbow',
  };

  // ── Fish region vocabulary ──────────────────────────
  const REGION_MAP = [
    { words: ['body','main','belly','torso','side','middle','center','centre'], x: 430, y: 250 },
    { words: ['tail','caudal','rear'],                                          x:  80, y: 250 },
    { words: ['top fin','dorsal fin','dorsal','top','back'],                    x: 380, y: 108 },
    { words: ['side fin','pectoral fin','pectoral','chest'],                    x: 395, y: 285 },
    { words: ['bottom fin','pelvic fin','pelvic','lower fin'],                  x: 470, y: 375 },
    { words: ['small fin','anal fin','anal'],                                   x: 355, y: 375 },
    { words: ['eye','pupil','iris'],                                            x: 583, y: 230 },
    { words: ['scales','scale','skin'],                                         x: 430, y: 220 },
    { words: ['everything','all','whole','entire','fish','all parts'],          x: null, y: null },
  ];

  const RAINBOW = ['#f44336','#ff9800','#ffd600','#4caf50','#00bcd4','#2196f3','#9c27b0'];

  let recognition;
  let listening = false;

  function startListening() {
    recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults  = true;
    recognition.continuous      = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      listening = true;
      micBtn.classList.add('listening');
      micLabel.textContent = 'Listening… say a colour + part';
      voiceDiv.classList.add('listening');
      voiceText.innerHTML = '🎙️ Listening — try <em>"orange body"</em> or <em>"blue tail"</em>';
    };

    recognition.onresult = (e) => {
      const interim = Array.from(e.results)
        .map(r => r[0].transcript).join(' ').toLowerCase().trim();
      voiceText.textContent = `"${interim}"`;

      for (const result of e.results) {
        if (result.isFinal) {
          handleVoiceCommand(result[0].transcript.toLowerCase().trim());
        }
      }
    };

    recognition.onerror = (e) => {
      if (e.error === 'no-speech') return;
      voiceText.textContent = `⚠️ ${e.error}`;
    };

    recognition.onend = () => {
      if (listening) recognition.start(); // keep alive
    };

    recognition.start();
  }

  function stopListening() {
    listening = false;
    if (recognition) recognition.stop();
    micBtn.classList.remove('listening');
    micLabel.textContent = 'Tap to start listening';
    voiceDiv.classList.remove('listening');
    voiceText.innerHTML = 'Voice off — tap 🎙️ to start again.';
  }

  micBtn.addEventListener('click', () => {
    if (listening) stopListening();
    else startListening();
  });

  // ── Command parser ─────────────────────────────────
  function handleVoiceCommand(text) {
    if (/\bclear\b|\breset\b|\bstart over\b/.test(text)) {
      clearFish();
      voiceText.textContent = '🗑️ Cleared!';
      showToast('🗑️ Canvas cleared');
      return;
    }
    if (/\bundo\b/.test(text)) {
      undo();
      voiceText.textContent = '↩️ Undone!';
      return;
    }

    // Find colour
    let foundColor = null, colorName = null;
    for (const [word, hex] of Object.entries(COLOR_MAP)) {
      if (text.includes(word)) { foundColor = hex; colorName = word; break; }
    }

    // Find region (check multi-word phrases first, then single words)
    let foundRegion = null, regionName = null;
    outer:
    for (const region of REGION_MAP) {
      for (const w of region.words) {
        if (text.includes(w)) { foundRegion = region; regionName = region.words[0]; break outer; }
      }
    }

    if (!foundColor && !foundRegion) {
      voiceText.textContent = `❓ Didn't catch that — try "blue body" or "red tail"`;
      return;
    }

    // Select colour in palette
    if (foundColor && foundColor !== 'rainbow') selectColor(foundColor);

    if (foundRegion) {
      saveUndo();

      if (foundRegion.x === null) {
        // Fill ALL regions
        REGION_MAP.filter(r => r.x !== null).forEach((r, idx) => {
          const clr = foundColor === 'rainbow'
            ? RAINBOW[idx % RAINBOW.length]
            : (foundColor || currentColor);
          if (foundColor === 'rainbow') selectColor(clr);
          floodFill(r.x, r.y, clr);
        });
      } else {
        const clr = foundColor === 'rainbow'
          ? RAINBOW[Math.floor(Math.random() * RAINBOW.length)]
          : (foundColor || currentColor);
        if (foundColor === 'rainbow') selectColor(clr);
        floodFill(foundRegion.x, foundRegion.y, clr);
      }

      const msg = foundColor
        ? `✨ Painted ${regionName} ${colorName}!`
        : `✨ Painted ${regionName}!`;
      voiceText.textContent = msg;
      showToast(msg);

    } else {
      // Only colour, no region
      voiceText.innerHTML = `🎨 Colour set to <em>${colorName}</em> — now say a fish part!`;
    }
  }
}
