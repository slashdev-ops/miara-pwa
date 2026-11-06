// Funkcja Vercel: przyjmuje zaszyfrowaną kopię danych z telefonu (rada projektu 06.11.2026, „kopia w chmurze”).
// Serwer nie zna hasła ani klucza. Sprawdza token urządzenia, rozmiar i kształt koperty (bez jawnej treści),
// zapisuje plik jako prywatny pod losową nazwą, pilnuje limitu wysyłek na dobę i trzyma 4 ostatnie kopie.
'use strict';
const crypto = require('crypto');

const MAX_BYTES = 1024 * 1024, KEEP = 4, PER_DAY = 3, PREFIX = 'kopie/';
const B64 = /^[A-Za-z0-9+/]+={0,2}$/;
const FIELDS = ['app', 'v', 'kdf', 'iter', 'salt', 'iv', 'consentV', 'created', 'data'];

// Koperta „miara-szyfr” v1 z app.js: tylko znane pola, treść wyłącznie jako szyfrogram base64
function validEnvelope(o) {
  return !!o && typeof o === 'object' && !Array.isArray(o) && Object.keys(o).every((k) => FIELDS.includes(k))
    && o.app === 'miara-szyfr' && o.v === 1 && o.kdf === 'PBKDF2-SHA-256' && Number.isInteger(o.iter) && o.iter >= 600000
    && [o.salt, o.iv, o.data].every((x) => typeof x === 'string' && B64.test(x))
    && Number.isInteger(o.consentV) && o.consentV >= 1 && typeof o.created === 'string' && o.created.length <= 40;
}

// Porównanie w stałym czasie (skróty SHA-256 mają równą długość)
function tokenOk(given, expected) {
  if (typeof given !== 'string' || !given || !expected) return false;
  const h = (x) => crypto.createHash('sha256').update(x).digest();
  return crypto.timingSafeEqual(h(given), h(expected));
}

function makeHandler(deps) {
  return async function handler(req, res) {
    const send = (code, body) => {
      res.statusCode = code;
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.setHeader('Cache-Control', 'no-store');
      res.end(JSON.stringify(body));
    };
    if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return send(405, { error: 'Tylko POST' }); }
    if (!tokenOk(req.headers['x-miara-token'], deps.token())) return send(401, { error: 'Brak uprawnień' });
    if (!String(req.headers['content-type'] || '').startsWith('application/json')) return send(415, { error: 'Tylko JSON' });
    const raw = typeof req.body === 'string' ? req.body : JSON.stringify(req.body || null);
    if (Buffer.byteLength(raw) > MAX_BYTES) return send(413, { error: 'Za duża kopia' });
    let o;
    try { o = typeof req.body === 'string' ? JSON.parse(req.body) : req.body; } catch (e) { return send(422, { error: 'Zły format' }); }
    if (!validEnvelope(o)) return send(422, { error: 'To nie jest zaszyfrowana kopia' });
    const { blobs } = await deps.list({ prefix: PREFIX });
    const dayAgo = Date.now() - 864e5;
    if (blobs.filter((b) => new Date(b.uploadedAt).getTime() > dayAgo).length >= PER_DAY) return send(429, { error: 'Limit wysyłek na dobę' });
    const name = `${PREFIX}${new Date().toISOString().slice(0, 10)}-${crypto.randomBytes(16).toString('hex')}.json`;
    await deps.put(name, JSON.stringify(o), { access: 'private', contentType: 'application/json', addRandomSuffix: false });
    const old = blobs.slice().sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt)).slice(KEEP - 1);
    if (old.length) await deps.del(old.map((b) => b.url));
    return send(201, { ok: true });
  };
}

const blob = () => require('@vercel/blob');
module.exports = makeHandler({
  token: () => process.env.MIARA_UPLOAD_TOKEN,
  put: (...a) => blob().put(...a), list: (...a) => blob().list(...a), del: (...a) => blob().del(...a),
});
module.exports.makeHandler = makeHandler;
module.exports.validEnvelope = validEnvelope;
