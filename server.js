const express = require('express');
const fs = require('fs');
const { WebSocketServer } = require('ws');
const http = require('http');
const QRCode = require('qrcode');
const path = require('path');
const os = require('os');
const localtunnel = require('localtunnel');

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const PORT = process.env.PORT || 3000;

// ── QR helpers ────────────────────────────────────────
async function generateQRFile(url) {
  const outputPath = path.join(__dirname, 'public', 'qrcode.png');
  await QRCode.toFile(outputPath, url, {
    type: 'png', width: 400, margin: 2,
    color: { dark: '#003366', light: '#ffffff' }
  });
  return outputPath;
}

// ── Static files & JSON ───────────────────────────────
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json({ limit: '10mb' }));

// ── Serve QR code image ───────────────────────────────
app.get('/qr', (req, res) => {
  const qrPath = path.join(__dirname, 'public', 'qrcode.png');
  if (fs.existsSync(qrPath)) res.sendFile(qrPath);
  else res.status(404).send('QR not ready yet');
});

// ── Fish submission → WebSocket broadcast ─────────────
app.post('/submit-fish', (req, res) => {
  const { imageData, challengeTitle, challengeEmoji, challengeDescription } = req.body;
  if (!imageData) return res.status(400).json({ error: 'No imageData' });

  const msg = JSON.stringify({
    type: 'fish',
    imageData,
    challengeTitle:       challengeTitle       || '',
    challengeEmoji:       challengeEmoji       || '',
    challengeDescription: challengeDescription || '',
  });

  let sent = 0;
  wss.clients.forEach(client => {
    if (client.readyState === 1) { client.send(msg); sent++; }
  });
  console.log(`🐟 Fish received! [${challengeEmoji} ${challengeTitle}] → ${sent} Unity client(s).`);
  res.json({ success: true, broadcastTo: sent });
});

// ── WebSocket ─────────────────────────────────────────
wss.on('connection', ws => {
  console.log('🎮 Unity client connected');
  ws.on('close', () => console.log('🎮 Unity client disconnected'));
});

// ── Start server + tunnel ─────────────────────────────
server.listen(PORT, '0.0.0.0', async () => {
  console.log(`\n🌊 Fish Coloring Server running on port ${PORT}`);
  console.log(`   Local: http://localhost:${PORT}\n`);

  // 1. Try to create a public tunnel (with 5s timeout)
  try {
    const tunnel = await Promise.race([
      localtunnel({ port: PORT }),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Tunnel service timeout (5s)')), 5000))
    ]);
    const publicUrl = tunnel.url;

    // Fetch public IP for the localtunnel bypass page
    let publicIP = '(unknown)';
    try {
      const res = await fetch('https://api.ipify.org?format=text');
      publicIP = (await res.text()).trim();
    } catch (_) {}

    await generateQRFile(publicUrl);
    console.log(`   🌍 Public URL: ${publicUrl}`);
    console.log(`   📱 Scan public/qrcode.png with any phone!\n`);
    console.log(`   ⚠️  First visit may show a localtunnel warning page.`);
    console.log(`      Enter this IP when asked: ${publicIP}\n`);

    tunnel.on('close', () => console.log('⚠️  Tunnel closed. Restart the server to get a new one.'));
    tunnel.on('error', err => console.error('⚠️  Tunnel error:', err.message));

  } catch (err) {
    // Fallback: LAN IP
    console.error('   ⚠️  Tunnel failed:', err.message);
    const ip = getLanIP();
    const localUrl = `http://${ip}:${PORT}`;
    await generateQRFile(localUrl).catch(() => {});
    console.log(`   📱 Fallback — phone must be on same WiFi: ${localUrl}\n`);
  }
});

// ── LAN IP (fallback only) ────────────────────────────
function getLanIP() {
  for (const addrs of Object.values(os.networkInterfaces())) {
    for (const i of addrs) {
      if (i.family === 'IPv4' && !i.internal && !i.address.startsWith('169.'))
        return i.address;
    }
  }
  return 'localhost';
}
