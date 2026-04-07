/* =====================================================
   challenges.js — Daily challenge definitions + renderer
   ===================================================== */

// ── All 30 daily challenges ───────────────────────────
const CHALLENGES = [
  // 🌊 Natuur & Seizoenen
  { emoji:'🌊', title:'Oceaanvis',    description:'Kleur je vis als een echte oceaanvis!',
    instructions:['Maak het lichaam blauw of turkoois','Vinnen in zilver of wit','Voeg golven toe als patroon'] },
  { emoji:'🦑', title:'Diepzeevis',   description:'Uit de diepste oceaan!',
    instructions:['Gebruik zwart en donkerblauw','Oog in neonblauw','Voeg een snorkel toe'] },
  { emoji:'🧊', title:'IJsvis',       description:'Bevroren in de Noordpool!',
    instructions:['Lichaam in wit of babyblauw','Vinnen in zilver of lichtpaars','Zet een kroon toe'] },
  { emoji:'🌋', title:'Lavavis',      description:'Uit een gloeiende vulkaan!',
    instructions:['Lichaam in rood of oranje','Staart in geel','Voeg vlekken toe'] },
  { emoji:'🌿', title:'Junglevis',    description:'Verborgen tussen de bladeren!',
    instructions:['Gebruik groene tinten','Voeg vlekken-patroon toe','Rugvin donkergroen'] },
  { emoji:'🏜️', title:'Woestijnvis',  description:'Overleven in de woestijn!',
    instructions:['Lichaam in bruin of geel','Warme kleuren overal','Voeg stippen toe'] },

  // 🎉 Feesten & Seizoenen
  { emoji:'🎄', title:'Kerstvis',     description:'Ho ho ho! 🎅',
    instructions:['Lichaam in rood of groen','Vinnen in goud','Zet een kroon op!'] },
  { emoji:'🎃', title:'Halloweenvis', description:'Zo eng mogelijk!',
    instructions:['Gebruik oranje, zwart en paars','Oog in neongroen','Voeg vlekken toe'] },
  { emoji:'💝', title:'Valentijnsvis',description:'Verliefd op de oceaan!',
    instructions:['Lichaam in roze of rood','Oog in lavendel','Zet een strikje op!'] },
  { emoji:'🎊', title:'Feestvis',     description:'Het is feest in de oceaan!',
    instructions:['Elk onderdeel een andere kleur','Voeg regenboog-patroon toe','Zet een hoed op!'] },
  { emoji:'🌸', title:'Lentervis',    description:'Fris en nieuw als de lente!',
    instructions:['Mintgroen, pastelroze of geel','Vinnen in een lichte kleur','Voeg stippen toe'] },
  { emoji:'☀️', title:'Zomervis',     description:'Op vakantie in de zon!',
    instructions:['Lichaam in geel of oranje','Vinnen turkoois','Zet een zonnebril op!'] },

  // 👾 Karakter Challenges
  { emoji:'🤡', title:'Clownvis',     description:'Nemo-stijl!',
    instructions:['Lichaam oranje','Rugvin wit of zwart','Oog helder geel'] },
  { emoji:'🥷', title:'Ninjavis',     description:'Onzichtbaar in de nacht!',
    instructions:['Alles in zwart','Oog in neonrood of neonblauw','Geen accessoires — ninjas zijn verborgen!'] },
  { emoji:'👽', title:'Alienvis',     description:'Niet van deze planeet!',
    instructions:['Neongroen en paars','Oog in neonblauw','Voeg vlekken toe voor alien huid'] },
  { emoji:'🤖', title:'Robotvis',     description:'Gemaakt van metaal!',
    instructions:['Lichaam in zilver of grijs','Vinnen in neonblauw','Voeg ruiten-patroon toe'] },
  { emoji:'🦸', title:'Superheldvis', description:'Redder van de oceaan!',
    instructions:['Lichaam in rood of blauw','Rugvin in goud','Verplicht: kroon!'] },
  { emoji:'🏴‍☠️', title:'Piratenvis',  description:'Schrik van de zeven zeeën!',
    instructions:['Lichaam in zwart','Staart in rood','Voeg vlekken toe'] },
  { emoji:'🧜', title:'Zeemeerminvis',description:'Magisch uit de diepte!',
    instructions:['Pastelroze, turkoois en goud','Schalen-patroon op het lichaam','Zet een kroon op!'] },
  { emoji:'👑', title:'Koningsvis',   description:'Heerser van de oceaan!',
    instructions:['Lichaam in paars','Vinnen in goud','Verplicht: kroon!'] },

  // 🎨 Stijl Challenges
  { emoji:'☠️', title:'Giftige vis',  description:'Aanraakbaar is VERBODEN!',
    instructions:['Alleen neon kleuren','Elke vin een andere neon kleur','Oog in neonpaars'] },
  { emoji:'🍬', title:'Pastelvis',    description:'Zacht en lief!',
    instructions:['Alleen pastel kleuren','Mintgroen, babyblauw of pastelroze','Voeg stippen toe'] },
  { emoji:'⚙️', title:'Metallic vis', description:'Glanzend als een spiegel!',
    instructions:['Lichaam in zilver of goud','Vinnen in brons of koper','Voeg schalen-patroon toe'] },
  { emoji:'🌈', title:'Regenboogvis', description:'Alle kleuren van de regenboog!',
    instructions:['Elk onderdeel een andere kleur','Gebruik het regenboog-commando','Probeer verloop-patroon'] },
  { emoji:'🐙', title:'Camouflagevis',description:'Niemand kan je zien!',
    instructions:['Donkerblauw en zwart','Voeg vlekken-patroon toe','Vinnen iets lichter dan het lichaam'] },
  { emoji:'🖼️', title:'Van Gogh vis', description:'Een levend schilderij!',
    instructions:['Lichaam in diepblauw','Voeg golven-patroon toe','Rugvin in goud'] },
  { emoji:'🕺', title:'Discovis',     description:'Dansen in de oceaan!',
    instructions:['Zo veel mogelijk kleuren','Elk onderdeel anders','Zet een hoed op!'] },
  { emoji:'🇳🇱', title:'Nederlandsevis',description:'Oranje boven!',
    instructions:['Lichaam in oranje','Rugvin in rood','Staart in blauw'] },
  { emoji:'🌙', title:'Nachtvis',     description:'De oceaan bij nacht!',
    instructions:['Lichaam donkerblauw of zwart','Neonblauw of neonpaars details','Oog helderwit'] },
  { emoji:'🔥', title:'Vuurvis',      description:'Brandend heet!',
    instructions:['Lichaam in rood','Rugvin in oranje','Staart in geel — van heet naar warm!'] },
];

// ── Pick today's challenge (deterministic by calendar day) ──
function getTodaysChallenge() {
  const d = new Date();
  // Day-of-year ensures the same challenge all day regardless of timezone drift
  const start  = new Date(d.getFullYear(), 0, 0);
  const dayIdx = Math.floor((d - start) / 86400000);
  return CHALLENGES[dayIdx % CHALLENGES.length];
}

// ── Inject challenge card into .app before the first child ──
function renderChallengeCard() {
  const challenge = getTodaysChallenge();

  const card = document.createElement('div');
  card.className = 'challenge-card';
  card.id = 'challenge-card';
  card.innerHTML = `
    <div class="challenge-badge">🎯 Uitdaging van Vandaag</div>
    <div class="challenge-header">
      <span class="challenge-emoji">${challenge.emoji}</span>
      <div>
        <h2 class="challenge-title">${challenge.title}</h2>
        <p class="challenge-desc">${challenge.description}</p>
      </div>
    </div>
    <ol class="challenge-steps">
      ${challenge.instructions.map(i => `<li>${i}</li>`).join('')}
    </ol>
  `;

  const main = document.querySelector('.app');
  main.insertBefore(card, main.firstChild);
}

renderChallengeCard();
