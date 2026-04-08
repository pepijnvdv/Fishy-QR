/* =====================================================
   creatures.js — Fish / Shark SVG definitions
   ===================================================== */

const CREATURES = [

/* ── VIS (Fish) ─────────────────────────────────────── */
{
  id:'vis', name:'Vis', emoji:'🐟',

  fillSvg:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
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
</svg>`,

  outlineSvg:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
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
  <path d="M 220 250 C 320 245,450 248,570 252" fill="none" stroke="#1a1a2e" stroke-width="2" stroke-linecap="round" opacity="0.4" stroke-dasharray="8,6"/>
  <path d="M 560 185 C 545 220,547 280,560 315" fill="none" stroke="#1a1a2e" stroke-width="3" stroke-linecap="round"/>
</svg>`,

  zoneSvg:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
  <path d="M 180 250 C 200 170,320 110,460 140 C 560 160,620 200,640 250 C 620 300,560 340,460 360 C 320 390,200 330,180 250 Z" fill="#ff0000"/>
  <path d="M 280 145 C 310 90,370 70,420 85 C 460 100,490 130,490 145 L 280 145 Z" fill="#00ffff"/>
  <path d="M 380 230 C 400 270,420 310,400 340 C 370 320,350 290,360 250 Z" fill="#ff00ff"/>
  <path d="M 440 350 C 450 380,480 400,500 390 C 490 370,470 355,460 350 Z" fill="#ffff00"/>
  <path d="M 340 355 C 340 385,360 400,380 395 C 375 375,355 360,350 355 Z" fill="#ffff00"/>
  <path d="M 140 250 C 110 200,60 160,30 130 C 70 170,80 220,80 250 C 80 280,70 330,30 370 C 60 340,110 300,140 250 Z" fill="#00ff00"/>
  <path d="M 190 250 C 175 210,145 210,140 250 C 145 290,175 290,190 250 Z" fill="#00ff00"/>
  <circle cx="580" cy="230" r="28" fill="#0000ff"/>
</svg>`,

  regionMap:[
    { words:['lichaam','lijf','romp','midden','centrum','body'], x:430, y:250 },
    { words:['staart','achterkant','achterin','tail'],            x:100, y:250 },
    { words:['oog','pupil','iris','ogen','eye'],                  x:580, y:230 },
    { words:['rugvin','rugfin','bovenvin','topvin','bovenfin','dorsal','rug'], x:390, y:105 },
    { words:['borstvin','borstfin','zijvin','middelvin','borst'], x:385, y:290 },
    { words:['buikvinnen','buikvin','ondervin','onderfin','buik','onderste'], x:465, y:373 },
    { words:['alles','geheel','heel','everything','hele'],         x:null, y:null },
  ],
},

/* ── HAAI (Shark) ───────────────────────────────────── */
{
  id:'haai', name:'Haai', emoji:'🦈',

  fillSvg:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
  <!-- Body -->
  <path d="M 168 250 C 200 186,402 160,552 168 C 652 173,720 210,724 250 C 720 290,652 327,552 332 C 402 340,200 314,168 250 Z" fill="white" stroke="#1a1a2e" stroke-width="4"/>
  <!-- Dorsal fin -->
  <path d="M 352 170 C 376 128,430 82,468 95 C 490 104,497 146,494 170 Z" fill="white" stroke="#1a1a2e" stroke-width="3.5"/>
  <!-- Tail upper lobe -->
  <path d="M 168 246 C 144 222,106 190,68 158 C 88 188,116 220,140 242 Z" fill="white" stroke="#1a1a2e" stroke-width="3.5"/>
  <!-- Tail lower lobe -->
  <path d="M 168 254 C 144 278,106 310,68 342 C 88 312,116 280,140 258 Z" fill="white" stroke="#1a1a2e" stroke-width="3.5"/>
  <!-- Tail connector -->
  <path d="M 192 244 C 172 224,148 224,143 244 C 148 262,172 262,192 256 Z" fill="white" stroke="none"/>
  <!-- Pectoral fin -->
  <path d="M 440 318 C 416 352,372 396,338 412 C 356 386,396 352,418 330 Z" fill="white" stroke="#1a1a2e" stroke-width="3.5"/>
  <!-- Eye -->
  <circle cx="628" cy="245" r="18" fill="white" stroke="#1a1a2e" stroke-width="3"/>
  <circle cx="630" cy="244" r="9" fill="#2a2a4e"/>
  <circle cx="633" cy="241" r="4" fill="rgba(255,255,255,0.6)"/>
</svg>`,

  outlineSvg:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
  <path d="M 168 250 C 200 186,402 160,552 168 C 652 173,720 210,724 250 C 720 290,652 327,552 332 C 402 340,200 314,168 250 Z" fill="none" stroke="#1a1a2e" stroke-width="4"/>
  <path d="M 352 170 C 376 128,430 82,468 95 C 490 104,497 146,494 170 Z" fill="none" stroke="#1a1a2e" stroke-width="3.5"/>
  <path d="M 168 246 C 144 222,106 190,68 158 C 88 188,116 220,140 242 Z" fill="none" stroke="#1a1a2e" stroke-width="3.5"/>
  <path d="M 168 254 C 144 278,106 310,68 342 C 88 312,116 280,140 258 Z" fill="none" stroke="#1a1a2e" stroke-width="3.5"/>
  <path d="M 440 318 C 416 352,372 396,338 412 C 356 386,396 352,418 330 Z" fill="none" stroke="#1a1a2e" stroke-width="3.5"/>
  <circle cx="628" cy="245" r="18" fill="none" stroke="#1a1a2e" stroke-width="3"/>
  <circle cx="630" cy="244" r="9" fill="#2a2a4e"/>
  <circle cx="633" cy="241" r="4" fill="rgba(255,255,255,0.5)"/>
  <!-- Gills -->
  <path d="M 556 192 Q 553 250 556 308" fill="none" stroke="#1a1a2e" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M 576 188 Q 573 250 576 312" fill="none" stroke="#1a1a2e" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M 596 185 Q 593 250 596 315" fill="none" stroke="#1a1a2e" stroke-width="2.5" stroke-linecap="round"/>
  <!-- Lateral line -->
  <path d="M 200 268 C 360 280,510 278,648 264" fill="none" stroke="#1a1a2e" stroke-width="1.8" opacity="0.4" stroke-dasharray="8,6" stroke-linecap="round"/>
  <!-- Mouth -->
  <path d="M 724 250 C 732 237,736 231,734 264 C 730 274,722 266,724 250 Z" fill="none" stroke="#1a1a2e" stroke-width="3"/>
  <!-- Nostril -->
  <ellipse cx="702" cy="236" rx="5" ry="3" fill="#1a1a2e" opacity="0.5"/>
</svg>`,

  zoneSvg:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
  <!-- Body (red) -->
  <path d="M 168 250 C 200 186,402 160,552 168 C 652 173,720 210,724 250 C 720 290,652 327,552 332 C 402 340,200 314,168 250 Z" fill="#ff0000"/>
  <!-- Dorsal fin (cyan) -->
  <path d="M 352 170 C 376 128,430 82,468 95 C 490 104,497 146,494 170 Z" fill="#00ffff"/>
  <!-- Pectoral fin (magenta) -->
  <path d="M 440 318 C 416 352,372 396,338 412 C 356 386,396 352,418 330 Z" fill="#ff00ff"/>
  <!-- Tail lobes (green) + wide connector -->
  <path d="M 168 246 C 144 222,106 190,68 158 C 88 188,116 220,140 242 Z" fill="#00ff00"/>
  <path d="M 168 254 C 144 278,106 310,68 342 C 88 312,116 280,140 258 Z" fill="#00ff00"/>
  <path d="M 196 242 C 172 218,144 218,138 242 C 144 264,172 264,196 258 Z" fill="#00ff00"/>
  <!-- Eye (blue) -->
  <circle cx="628" cy="245" r="16" fill="#0000ff"/>
</svg>`,

  regionMap:[
    { words:['lichaam','lijf','romp','midden','centrum','body'], x:440, y:250 },
    { words:['staart','achterkant','achterin','tail'],            x:165, y:250 },
    { words:['oog','pupil','iris','ogen','eye'],                  x:628, y:245 },
    { words:['rugvin','rugfin','bovenvin','topvin','bovenfin','dorsal','rug'], x:430, y:130 },
    { words:['borstvin','borstfin','zijvin','middelvin','borst','buikvin','buikvinnen'], x:392, y:370 },
    { words:['alles','geheel','heel','everything','hele'],         x:null, y:null },
  ],
},

]; // end CREATURES

// ── Active creature (set by app.js) ──────────────────
let currentCreature  = CREATURES[0];
let currentRegionMap = currentCreature.regionMap;

function switchCreature(id) {
  const c = CREATURES.find(c => c.id === id);
  if (!c || c === currentCreature) return;
  currentCreature  = c;
  currentRegionMap = c.regionMap;

  // Update selector buttons
  document.querySelectorAll('.creature-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.creature === id)
  );

  // Reload SVG images → triggers onCreatureReady in app.js
  window._creatureLoadCount = 0;
  fillImg.src    = encode(c.fillSvg);
  outlineImg.src = encode(c.outlineSvg);
  zoneImg.src    = encode(c.zoneSvg);
}
