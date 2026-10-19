import Phaser from 'phaser';
import { txt } from '../ui/ui.js';
import { PASILLOS, SALAS } from '../data/mapa.js';

// Phaser.Math.RND se crea al arrancar el juego, así que se consulta en cada llamada (no al importar el módulo)
const RND = {
  between: (a, b) => Phaser.Math.RND.between(a, b),
  realInRange: (a, b) => Phaser.Math.RND.realInRange(a, b),
  pick: arr => Phaser.Math.RND.pick(arr),
  frac: () => Phaser.Math.RND.frac()
};
// Capas: piso < marcas pintadas < sombras < objetos < luces (el personaje va en 50, los iconos en 3)
const D = { piso: -9, pint: -8, sombra: -6, obj: 0, luz: 2 };
// Sentido del recorrido de cada pasillo, en el orden de PASILLOS (mapa.js): este, norte, este, sur, oeste
const DIR = [[1, 0], [0, -1], [1, 0], [0, 1], [-1, 0]];

const tono = (c, f) => { const ch = k => Math.min(255, Math.round(((c >> k) & 255) * f)); return (ch(16) << 16) | (ch(8) << 8) | ch(0); };
const gr = (s, d = D.obj) => s.add.graphics().setDepth(d);
const rr = (s, x, y, w, h, c, a = 1, r = 8) => s.add.graphics().fillStyle(c, a).fillRoundedRect(x, y, w, h, r);
const obs = (s, x, y, w, h) => s.obst.push({ x, y, w, h });
const sombra = (s, x, y, w, h, r = 10) => gr(s, D.sombra).fillStyle(0x000000, 0.3).fillRoundedRect(x + 4, y + 8, w, h, r);
// Charco de luz aditivo (luminarias del techo, resplandores)
const pool = (s, x, y, w, h, color = 0xfff1d0, a = 0.1) =>
  s.add.image(x, y, 'luz').setScale(w / 256, h / 256).setTint(color).setBlendMode(Phaser.BlendModes.ADD).setAlpha(a).setDepth(D.luz);

// Bloque con volumen: sombra + cara lateral oscura + cara superior + brillo de arista
function blk(s, x, y, w, h, c, r = 6, f = 6) {
  sombra(s, x, y, w, h, r);
  return gr(s).fillStyle(tono(c, 0.6)).fillRoundedRect(x, y, w, h, r)
    .fillStyle(c).fillRoundedRect(x, y, w, h - f, r)
    .fillStyle(tono(c, 1.35), 0.45).fillRect(x + r, y + 2, Math.max(0, w - 2 * r), 2);
}

// ================= TEXTURAS =================
function texConcreto(s, key, base, tam = 128, ruido = 1, lustre = false) {
  const g = s.make.graphics({ add: false });
  g.fillStyle(base).fillRect(0, 0, tam, tam);
  for (let i = 0; i < 4; i++) g.fillStyle(i % 2 ? 0xffffff : 0x000000, 0.035).fillEllipse(RND.between(0, tam), RND.between(0, tam), RND.between(40, 90), RND.between(30, 70));
  for (let i = 0; i < 130 * ruido; i++)
    g.fillStyle(RND.pick([tono(base, 1.25), tono(base, 0.7), 0x000000]), RND.realInRange(0.05, 0.14)).fillRect(RND.between(0, tam), RND.between(0, tam), RND.between(1, 3), RND.between(1, 3));
  if (lustre) for (let i = -tam; i < tam; i += 32) g.lineStyle(10, 0xffffff, 0.025).lineBetween(i, tam, i + tam, 0);
  g.lineStyle(2, 0x000000, 0.25).strokeRect(0, 0, tam, tam).lineStyle(1, 0xffffff, 0.06).lineBetween(2, 2, tam - 2, 2).lineBetween(2, 2, 2, tam - 2);
  g.generateTexture(key, tam, tam); g.destroy();
}

function texPlaca(s, key, base) {   // placa antiderrapante (diamante)
  const t = 64, g = s.make.graphics({ add: false });
  g.fillStyle(base).fillRect(0, 0, t, t);
  for (let j = 0; j < 4; j++) for (let i = 0; i < 4; i++) {
    const x = i * 16 + (j % 2 ? 8 : 0), y = j * 16;
    g.lineStyle(3, tono(base, 1.55), 0.55);
    if ((i + j) % 2) g.lineBetween(x + 2, y + 3, x + 10, y + 11); else g.lineBetween(x + 2, y + 11, x + 10, y + 3);
  }
  g.lineStyle(2, 0x000000, 0.3).strokeRect(0, 0, t, t);
  g.generateTexture(key, t, t); g.destroy();
}

function texAlfombra(s, key, base) {   // loseta de alfombra de oficina
  const t = 64, g = s.make.graphics({ add: false });
  g.fillStyle(base).fillRect(0, 0, t, t);
  for (let i = 0; i < 320; i++) g.fillStyle(RND.pick([tono(base, 1.3), tono(base, 0.7)]), RND.realInRange(0.08, 0.2)).fillRect(RND.between(0, t), RND.between(0, t), 1, 1);
  g.lineStyle(1, 0x000000, 0.3).strokeRect(0, 0, t, t).lineStyle(1, 0xffffff, 0.05).lineBetween(1, 1, t - 1, 1);
  g.generateTexture(key, t, t); g.destroy();
}

function texMadera(s, key, base) {   // duela de madera
  const t = 128, h = 16, g = s.make.graphics({ add: false });
  g.fillStyle(tono(base, 0.8)).fillRect(0, 0, t, t);
  for (let j = 0; j < t / h; j++) {
    const off = (j % 2) * 32;
    for (let x = -off; x < t; x += 64) {
      g.fillStyle(tono(base, RND.realInRange(0.85, 1.15))).fillRect(x, j * h, 64, h);
      g.lineStyle(1, 0x000000, 0.35).strokeRect(x, j * h, 64, h);
      for (let k = 0; k < 3; k++) g.lineStyle(1, 0x000000, 0.07).lineBetween(x + 3, j * h + RND.between(3, 13), x + 61, j * h + RND.between(3, 13));
    }
  }
  g.generateTexture(key, t, t); g.destroy();
}

const TIPO = {
  produccion: (s, k, c) => texConcreto(s, k, c),
  calidad: (s, k, c) => texConcreto(s, k, tono(c, 1.25), 128, 0.5, true),
  almacen: (s, k, c) => texConcreto(s, k, c),
  mantenimiento: (s, k, c) => texPlaca(s, k, c),
  ingenieria: (s, k, c) => texAlfombra(s, k, c),
  supervision: (s, k, c) => texAlfombra(s, k, c),
  rrhh: (s, k, c) => texAlfombra(s, k, c),
  gerencia: (s, k) => texMadera(s, k, 0x5a4126)
};

export function crearTexturas(s) {
  const T = s.textures;
  if (!T.exists('banda')) {
    const g = s.make.graphics({ add: false });
    g.fillStyle(0x1e232c).fillRect(0, 0, 40, 50).fillStyle(0x2f3744).fillRect(0, 0, 18, 50)
      .fillStyle(0x0d1015, 0.6).fillRect(0, 0, 2, 50).fillStyle(0xffffff, 0.06).fillRect(18, 0, 2, 50);
    g.generateTexture('banda', 40, 50); g.destroy();
  }
  if (!T.exists('luz')) {   // gradiente radial para luces y resplandores
    const c = T.createCanvas('luz', 256, 256), ctx = c.getContext();
    const gd = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    gd.addColorStop(0, 'rgba(255,255,255,1)'); gd.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gd; ctx.fillRect(0, 0, 256, 256); c.refresh();
  }
  if (!T.exists('pasillo')) texConcreto(s, 'pasillo', 0x2e394a, 128, 0.9);
  SALAS.forEach(z => { const k = 'piso_' + z.id; if (!T.exists(k)) TIPO[z.id](s, k, z.color); });
}

// ================= PISOS, PASILLOS Y ENTRADA =================
// Divide el tramo [a0, a1] de una línea (eje 'h': y fija / 'v': x fija) quitando lo que cae dentro de `quitar`
function tramos(eje, fijo, a0, a1, quitar) {
  let r = [[a0, a1]];
  quitar.forEach(q => {
    const dentro = eje === 'h' ? fijo > q.y && fijo < q.y + q.h : fijo > q.x && fijo < q.x + q.w;
    if (!dentro) return;
    const q0 = eje === 'h' ? q.x : q.y, q1 = q0 + (eje === 'h' ? q.w : q.h);
    r = r.flatMap(([u, v]) => (q1 <= u || q0 >= v) ? [[u, v]] : [[u, Math.min(v, q0)], [Math.max(u, q1), v]].filter(([m, n]) => n - m > 4));
  });
  return r;
}

export function suelos(s) {
  const tile = (r, key) => { const t = s.add.tileSprite(r.x, r.y, r.w, r.h, key).setOrigin(0).setDepth(D.piso); t.tilePositionX = r.x; t.tilePositionY = r.y; };
  PASILLOS.forEach(p => tile(p, 'pasillo'));
  SALAS.forEach(z => { tile(z, 'piso_' + z.id); senda(s, z); });
  PASILLOS.forEach((p, i) => pasillo(s, p, i));
  entrada(s);
}

// Senda peatonal verde desde la puerta hasta la zona de iconos
function senda(s, z) {
  const d = z.puerta, cx = z.x + z.w / 2, cy = z.y + z.h / 2, iy = cy + (d.lado === 'arriba' ? -40 : 40);
  let r;
  if (d.lado === 'abajo') r = { x: d.x + 30, y: iy + 100, w: d.w - 60, h: z.y + z.h - iy - 100 };
  else if (d.lado === 'arriba') r = { x: d.x + 30, y: z.y, w: d.w - 60, h: iy - 100 - z.y };
  else if (d.lado === 'izq') r = { x: z.x, y: d.y + 40, w: cx - 215 - z.x, h: d.h - 80 };
  else r = { x: cx + 215, y: d.y + 40, w: z.x + z.w - cx - 215, h: d.h - 80 };
  if (r.w <= 0 || r.h <= 0) return;
  const g = gr(s, D.pint);
  g.fillStyle(0x5cff9d, 0.07).fillRect(r.x, r.y, r.w, r.h).lineStyle(3, 0x5cff9d, 0.4);
  if (d.lado === 'abajo' || d.lado === 'arriba') g.lineBetween(r.x, r.y, r.x, r.y + r.h).lineBetween(r.x + r.w, r.y, r.x + r.w, r.y + r.h);
  else g.lineBetween(r.x, r.y, r.x + r.w, r.y).lineBetween(r.x, r.y + r.h, r.x + r.w, r.y + r.h);
}

function pasillo(s, p, i) {
  const h = p.w > p.h, largo = h ? p.w : p.h, a0 = h ? p.x : p.y;
  const otros = PASILLOS.filter(q => q !== p);
  const todo = [...PASILLOS, ...SALAS, ...s.puertas].filter(q => q !== p);
  const pint = gr(s, D.pint);

  // Líneas amarillas de seguridad (se interrumpen en los cruces)
  [14, (h ? p.h : p.w) - 14].forEach(off => {
    const fijo = (h ? p.y : p.x) + off;
    tramos(h ? 'h' : 'v', fijo, a0, a0 + largo, otros).forEach(([u, v]) => {
      pint.fillStyle(0xf5c542, 0.55);
      if (h) pint.fillRect(u, fijo - 2, v - u, 4); else pint.fillRect(fijo - 2, u, 4, v - u);
    });
  });

  // Flechas de sentido del recorrido
  const [dx, dy] = DIR[i] || [1, 0], ang = Math.atan2(dy, dx);
  for (let t = 260; t < largo - 200; t += 420) {
    const cx = h ? p.x + t : p.x + p.w / 2, cy = h ? p.y + p.h / 2 : p.y + t;
    s.add.graphics({ x: cx, y: cy }).setDepth(D.pint).setRotation(ang).lineStyle(7, 0x5cff9d, 0.3)
      .lineBetween(-12, -16, 6, 0).lineBetween(6, 0, -12, 16).lineBetween(-34, -16, -16, 0).lineBetween(-16, 0, -34, 16);
  }

  // Charolas de cables y gabinetes de seguridad en las paredes
  const bandas = h
    ? [{ eje: 'h', ini: p.y - 26, fijo: p.y - 20 }, { eje: 'h', ini: p.y + p.h, fijo: p.y + p.h + 20 }]
    : [{ eje: 'v', ini: p.x - 26, fijo: p.x - 20 }, { eje: 'v', ini: p.x + p.w, fijo: p.x + p.w + 20 }];
  bandas.forEach((b, k) => {
    tramos(b.eje, b.fijo, a0, a0 + largo, todo).forEach(([u, v]) => bandeja(pint, b.eje, b.fijo, u, v));
    for (let a = 220 + 320 * k; a < largo - 40; a += 640) {
      const al = a0 + a;
      const rx = h ? al - 18 : b.ini + 2, ry = h ? b.ini + 2 : al - 18, rw = h ? 36 : 22, rh = h ? 22 : 36;
      if (!todo.some(q => rx < q.x + q.w && rx + rw > q.x && ry < q.y + q.h && ry + rh > q.y))
        gabinete(s, rx, ry, rw, rh, (k + Math.floor(a / 640) + i) % 4);
    }
  });

  // Luces fluorescentes del techo
  for (let t = 120; t < largo; t += 240) {
    const l = pool(s, h ? p.x + t : p.x + p.w / 2, h ? p.y + p.h / 2 : p.y + t, h ? 300 : 240, h ? 240 : 300, 0xcfe8ff, 0.11);
    if (RND.frac() < 0.2) s.tweens.add({ targets: l, alpha: 0.03, duration: 80, yoyo: true, repeat: -1, repeatDelay: RND.between(2500, 7000) });
  }
}

function bandeja(g, eje, fijo, u, v) {
  if (eje === 'h') {
    g.fillStyle(0x0b111b, 0.9).fillRect(u, fijo - 4, v - u, 8).fillStyle(0x3a4a63).fillRect(u, fijo - 3, v - u, 6);
    for (let a = u; a < v; a += 26) g.fillStyle(0x1b2434).fillRect(a, fijo - 3, 2, 6);
    g.fillStyle(0xff5c5c, 0.7).fillRect(u, fijo - 1.5, v - u, 1).fillStyle(0x4dabff, 0.7).fillRect(u, fijo + 0.5, v - u, 1);
  } else {
    g.fillStyle(0x0b111b, 0.9).fillRect(fijo - 4, u, 8, v - u).fillStyle(0x3a4a63).fillRect(fijo - 3, u, 6, v - u);
    for (let a = u; a < v; a += 26) g.fillStyle(0x1b2434).fillRect(fijo - 3, a, 6, 2);
    g.fillStyle(0xff5c5c, 0.7).fillRect(fijo - 1.5, u, 1, v - u).fillStyle(0x4dabff, 0.7).fillRect(fijo + 0.5, u, 1, v - u);
  }
}

function gabinete(s, x, y, w, h, t) {   // 0 extintor, 1 botiquín, 2 tablero eléctrico, 3 manguera contra incendio
  const g = gr(s, D.pint + 0.5), c = [0xc62828, 0x2e7d32, 0x5b6575, 0xb23a1c][t], cx = x + w / 2, cy = y + h / 2;
  g.fillStyle(0x000000, 0.35).fillRoundedRect(x + 2, y + 3, w, h, 3).fillStyle(c).fillRoundedRect(x, y, w, h, 3)
    .lineStyle(1.5, tono(c, 1.4), 0.9).strokeRoundedRect(x, y, w, h, 3);
  if (t === 0) g.fillStyle(0xffffff).fillCircle(cx, cy, 6).fillStyle(0xc62828).fillCircle(cx, cy, 3.5);
  if (t === 1) g.fillStyle(0xffffff).fillRect(cx - 7, cy - 2, 14, 4).fillRect(cx - 2, cy - 7, 4, 14);
  if (t === 2) g.fillStyle(0xf5c542).fillTriangle(cx - 7, cy + 5, cx + 7, cy + 5, cx, cy - 6);
  if (t === 3) g.lineStyle(3, 0xf5f5f5, 0.9).strokeCircle(cx, cy, 6).fillStyle(0xf5f5f5).fillCircle(cx, cy, 2);
}

// Portón de acceso, tapete y luces de aviso en el extremo oeste del pasillo de entrada
function entrada(s) {
  const g = gr(s, D.pint);
  g.fillStyle(0x151a22).fillRoundedRect(112, 1400, 120, 200, 10).lineStyle(3, 0xf5c542, 0.7).strokeRoundedRect(112, 1400, 120, 200, 10);
  g.fillStyle(0x56637a).fillRect(76, 1400, 24, 200);
  for (let y = 1400, k = 0; y < 1600; y += 10, k++) g.fillStyle(k % 2 ? 0x111111 : 0xf5c542).fillRect(76, y, 24, 10);
  [1388, 1612].forEach((y, k) => {
    const l = s.add.circle(88, y, 6, 0xff9f1c).setDepth(D.pint + 0.5), h = pool(s, 88, y, 90, 90, 0xff9f1c, 0.3);
    s.tweens.add({ targets: [l, h], alpha: 0.15, yoyo: true, repeat: -1, duration: 600, delay: k * 300 });
  });
}

// Luces de advertencia parpadeantes en las paredes de los pasillos
export function lamparas(s, p) {
  const h = p.w > p.h, largo = h ? p.w : p.h;
  for (let i = 0, a = 60; a < largo - 40; i++, a += 320) {
    const lx = h ? p.x + a : p.x - 12, ly = h ? p.y - 12 : p.y + a;
    const l = s.add.circle(lx, ly, 7, 0xff9f1c).setDepth(-5), halo = pool(s, lx, ly, 110, 110, 0xff9f1c, 0.3);
    s.tweens.add({ targets: [l, halo], alpha: 0.2, yoyo: true, repeat: -1, duration: 900, delay: i * 250 });
  }
}

// ================= PIEZAS COMUNES =================
function monitor(s, x, y, col, w = 54, h = 26) {
  gr(s).fillStyle(0x0b1220).fillRoundedRect(x, y, w, h, 4).fillStyle(0x374151).fillRect(x + w / 2 - 6, y + h, 12, 4);
  const p = rr(s, x + 3, y + 3, w - 6, h - 6, col, 0.8, 2);
  const l = gr(s).lineStyle(1, 0xffffff, 0.35);
  for (let k = 0; k < 3; k++) l.lineBetween(x + 6, y + 8 + k * 5, x + w - 10 - k * 6, y + 8 + k * 5);
  s.tweens.add({ targets: p, alpha: 0.35, yoyo: true, repeat: -1, duration: RND.between(800, 1800), delay: RND.between(0, 800) });
}

function silla(s, x, y, c = 0x1f2937) {
  gr(s, D.sombra).fillStyle(0x000000, 0.3).fillEllipse(x + 3, y + 6, 34, 30);
  gr(s).fillStyle(tono(c, 0.7)).fillCircle(x, y, 16).fillStyle(c).fillCircle(x, y, 14).fillStyle(tono(c, 1.8), 0.5).fillCircle(x, y, 7);
}

function escritorio(s, x, y, w, { c = 0x7a5c3a, mon = [0x4dabff], sentado = 'abajo', h = 56 } = {}) {
  blk(s, x, y, w, h, c, 6, 6);
  obs(s, x, y, w, h);
  const n = mon.length, cell = (w - 20) / n, mw = Math.min(56, cell - 6);
  mon.forEach((col, i) => monitor(s, x + 10 + i * cell + (cell - mw) / 2, y + 4, col, mw, 26));
  rr(s, x + w / 2 - 22, y + h - 22, 44, 12, 0x1f2937, 1, 3);   // teclado
  rr(s, x + w / 2 + 28, y + h - 21, 8, 10, 0x1f2937, 1, 4);     // ratón
  if (sentado) silla(s, x + w / 2, sentado === 'abajo' ? y + h + 20 : y - 18);
}

function planta(s, x, y, r = 18) {
  gr(s, D.sombra).fillStyle(0x000000, 0.3).fillEllipse(x + 4, y + 8, r * 2.2, r * 1.8);
  const g = gr(s);
  g.fillStyle(0x5b4636).fillCircle(x, y, r).fillStyle(0x3b2d22).fillCircle(x, y, r * 0.78);
  for (let i = 0; i < 9; i++) { const a = i * 0.7; g.fillStyle(i % 2 ? 0x2e7d32 : 0x43a047).fillEllipse(x + Math.cos(a) * r * 0.63, y + Math.sin(a) * r * 0.63, r * 1.1, r * 0.8); }
  g.fillStyle(0x66bb6a).fillCircle(x, y, r * 0.45);
  obs(s, x - r, y - r, r * 2, r * 2);
}

function engrane(s, x, y, r, c, dir, dur = 6000) {
  const g = s.add.graphics({ x, y }).fillStyle(c);
  for (let i = 0; i < 10; i++) g.fillCircle(Math.cos(i * Math.PI / 5) * r, Math.sin(i * Math.PI / 5) * r, r * 0.22);
  g.fillCircle(0, 0, r).fillStyle(0x151b26).fillCircle(0, 0, r * 0.35);
  s.tweens.add({ targets: g, angle: 360 * dir, duration: dur, repeat: -1 });
}

function holograma(s, cx, cy, c) {
  for (let i = 0; i < 2; i++) {
    const r = s.add.circle(cx, cy, 34).setStrokeStyle(3, c, 0.9);
    s.tweens.add({ targets: r, scale: 1.7, alpha: 0, duration: 1800, repeat: -1, delay: i * 900 });
  }
  const q = s.add.rectangle(cx, cy, 30, 30).setStrokeStyle(3, c);
  s.tweens.add({ targets: q, angle: 360, duration: 4000, repeat: -1 });
  const l = pool(s, cx, cy, 160, 160, c, 0.22);
  s.tweens.add({ targets: l, alpha: 0.1, yoyo: true, repeat: -1, duration: 1200 });
}

function mesaHolo(s, cx, cy, c) {
  sombra(s, cx - 44, cy - 44, 88, 88, 44);
  gr(s).fillStyle(0x2b3444).fillCircle(cx, cy, 44).fillStyle(0x0f1722).fillCircle(cx, cy, 38).lineStyle(3, c, 0.9).strokeCircle(cx, cy, 40);
  obs(s, cx - 44, cy - 44, 88, 88);
  holograma(s, cx, cy, c);
}

function palet(s, x, y, w = 100, h = 60) {   // palet con cajas de cartón y playo
  blk(s, x, y, w, h, 0x8b6b43, 4, 6);
  const g = gr(s), cols = [0xc58b4b, 0xa8743c, 0xd9a066, 0xb98550];
  for (let j = 0; j < 2; j++) for (let i = 0; i < 2; i++) {
    const bx = x + 4 + i * (w / 2 - 2), by = y + 3 + j * (h / 2 - 3), bw = w / 2 - 8, bh = h / 2 - 6, c = cols[(i + j * 2) % 4];
    g.fillStyle(tono(c, 0.7)).fillRoundedRect(bx, by + 2, bw, bh, 3).fillStyle(c).fillRoundedRect(bx, by, bw, bh - 1, 3)
      .fillStyle(0xe8dcc4, 0.7).fillRect(bx + bw / 2 - 2, by, 4, bh - 1);
  }
  g.fillStyle(0xffffff, 0.12).fillRoundedRect(x, y, w, h - 6, 4);
  obs(s, x, y, w, h);
}

// ================= PRODUCCIÓN =================
function prensa(s, x, y) {
  blk(s, x, y, 150, 120, 0x39424f, 10, 10);
  rr(s, x + 12, y + 12, 126, 84, 0x1a212b, 1, 8);
  gr(s).fillStyle(0x56606f).fillCircle(x + 75, y + 54, 34).fillStyle(0x2b323d).fillCircle(x + 75, y + 54, 27)
    .lineStyle(3, 0xf5c542, 0.9).strokeCircle(x + 75, y + 54, 34);
  const pis = s.add.circle(x + 75, y + 54, 20, 0xaab3c0).setStrokeStyle(2, 0x6b7380);
  s.tweens.add({ targets: pis, scale: 0.82, yoyo: true, repeat: -1, duration: 700, hold: 600, repeatDelay: 800 });
  const glow = pool(s, x + 75, y + 54, 110, 110, 0xff7a1c, 0.22);
  s.tweens.add({ targets: glow, alpha: 0.08, yoyo: true, repeat: -1, duration: 1100 });
  const g = gr(s);
  g.fillStyle(0xf2f2f2).fillCircle(x + 22, y + 102, 7).lineStyle(1.5, 0xc62828).lineBetween(x + 22, y + 102, x + 26, y + 98);   // manómetro
  g.fillStyle(0xf5c542).fillCircle(x + 128, y + 100, 10).fillStyle(0xd32f2f).fillCircle(x + 128, y + 100, 6.5);                    // paro de emergencia
  const led = s.add.circle(x + 40, y + 102, 3.5, 0x5cff9d);
  s.tweens.add({ targets: led, alpha: 0.25, yoyo: true, repeat: -1, duration: 600 });
  txt(s, x + 82, y + 102, 'PRENSA', 11, '#9aa5b1', { fontStyle: 'bold' }).setOrigin(0.5).setDepth(1);
  obs(s, x, y, 150, 120);
}

function banda(s, x, y, w) {
  sombra(s, x - 8, y - 8, w + 16, 66, 10);
  const g = gr(s);
  g.fillStyle(0x6b7380).fillRoundedRect(x - 8, y - 8, w + 16, 66, 10).fillStyle(0x1a1f29).fillRect(x, y - 2, w, 54);
  const t = s.add.tileSprite(x, y, w, 50, 'banda').setOrigin(0);
  s.tweens.add({ targets: t, tilePositionX: -40, duration: 700, repeat: -1 });
  gr(s).fillStyle(0xf5c542).fillRect(x, y - 6, w, 4).fillRect(x, y + 52, w, 4);        // guías laterales
  for (let a = 0; a <= w; a += 60) gr(s).fillStyle(0x2b323d).fillRect(x + a - 3, y - 8, 6, 8).fillRect(x + a - 3, y + 50, 6, 8);   // soportes
  obs(s, x - 8, y - 8, w + 16, 66);
  for (let i = 0; i < 3; i++) {   // balatas que viajan por la banda
    const p = gr(s).fillStyle(0x9aa5b1).fillRoundedRect(0, 0, 38, 24, 10).fillStyle(0x2b2f36).fillRoundedRect(6, 5, 26, 14, 6).setPosition(x, y + 13);
    s.tweens.add({ targets: p, x: x + w - 44, duration: 3600, repeat: -1, delay: i * 1200 });
  }
}

function brazo(s, x, y) {
  sombra(s, x - 30, y - 30, 60, 60, 30);
  gr(s).fillStyle(0x2b323d).fillCircle(x, y, 30).lineStyle(4, 0xf5c542, 0.9).strokeCircle(x, y, 30).fillStyle(0x4b5563).fillCircle(x, y, 22);
  const c = s.add.container(x, y);
  const a = s.add.graphics().fillStyle(0xff9f1c).fillRoundedRect(-9, -92, 18, 92, 8).fillStyle(0xffc46b, 0.5).fillRect(-6, -88, 4, 80)
    .fillStyle(0x374151).fillCircle(0, -92, 11).fillStyle(0x9aa5b1).fillRoundedRect(-14, -112, 6, 22, 2).fillRoundedRect(8, -112, 6, 22, 2);
  const b = s.add.graphics().fillStyle(0x4b5563).fillCircle(0, 0, 18).fillStyle(0xff9f1c).fillCircle(0, 0, 9);
  c.add([a, b]);
  s.tweens.add({ targets: a, angle: { from: -30, to: 30 }, duration: 1400, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
  obs(s, x - 30, y - 30, 60, 60);
}

function produccion(s, x, y, w) {
  gr(s, D.pint).lineStyle(4, 0xf5c542, 0.55).strokeRect(x - 12, y - 12, 174, 156).strokeRect(x + w - 162, y - 12, 174, 156);   // zonas de seguridad
  prensa(s, x, y);
  prensa(s, x + w - 150, y);
  banda(s, x + 165, y + 25, w - 330);
  brazo(s, x + 262, y + 130);
  brazo(s, x + w - 262, y + 130);
  palet(s, x + w / 2 - 50, y + 100);
}

// ================= CALIDAD =================
function mesaInspeccion(s, x, y, w) {
  blk(s, x, y + 30, w, 84, 0x8f9aa8, 8, 8);
  rr(s, x + 10, y + 38, w - 20, 58, 0xe9f1fa, 0.92, 6);
  for (let i = 0; i < 4; i++) {
    const px = x + 20 + i * ((w - 60) / 4 + 6);
    gr(s).fillStyle(0xaab3c0).fillRoundedRect(px, y + 50, 38, 26, 10).fillStyle(0x2b2f36).fillRoundedRect(px + 5, y + 55, 28, 16, 6);
  }
  gr(s).lineStyle(2, 0x1f2937).lineBetween(x + 20, y + 88, x + 110, y + 88).fillStyle(0x1f2937).fillRect(x + 20, y + 84, 5, 10).fillRect(x + 60, y + 85, 4, 8);   // calibrador
  gr(s).lineStyle(4, 0x6b7380).lineBetween(x + w - 22, y + 40, x + w - 40, y + 62).fillStyle(0x9fd8ff, 0.35).fillCircle(x + w - 40, y + 62, 15).lineStyle(3, 0x6b7380).strokeCircle(x + w - 40, y + 62, 15);   // lámpara con lupa
  obs(s, x, y + 30, w, 84);
}

function tunel(s, x, y, w) {
  blk(s, x, y + 30, w, 84, 0x3b4a5c, 14, 8);
  rr(s, x + 16, y + 46, w - 32, 44, 0x0f1722, 1, 10);
  for (let i = 0; i < 3; i++) {
    const p = gr(s).fillStyle(0xaab3c0).fillRoundedRect(0, 0, 32, 22, 10).fillStyle(0x2b2f36).fillRoundedRect(5, 4, 22, 14, 6).setPosition(x + 22, y + 57);
    s.tweens.add({ targets: p, x: x + w - 54, duration: 3600, repeat: -1, delay: i * 1200 });
  }
  rr(s, x + w / 2 - 16, y + 24, 32, 96, 0x56637a, 0.9, 8);
  const haz = gr(s).fillStyle(0x00d2ff, 0.95).fillRect(0, 0, 24, 3).setPosition(x + w / 2 - 12, y + 34);
  s.tweens.add({ targets: haz, y: y + 106, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
  const led = s.add.circle(x + w - 22, y + 40, 4, 0x5cff9d);
  s.tweens.add({ targets: led, alpha: 0.25, yoyo: true, repeat: -1, duration: 700 });
  obs(s, x, y + 30, w, 84);
}

function calidad(s, x, y, w) {
  mesaInspeccion(s, x, y, 200);
  tunel(s, x + 225, y, 250);
  escritorio(s, x + 500, y + 40, 200, { c: 0x6b7280, mon: [0x5cff9d, 0x00d2ff] });
}

// ================= ALMACÉN =================
function rack(s, x, y, w, h, idx) {
  sombra(s, x, y, w, h, 4);
  const g = gr(s), cols = [0xc58b4b, 0xa8743c, 0xd9a066, 0xb98550];
  g.fillStyle(0x24303f).fillRect(x, y, w, h);
  for (let j = 0; j < 4; j++) {
    const bx = x + 8 + j * 52, c = cols[(j + idx) % 4];
    g.fillStyle(tono(c, 0.7)).fillRoundedRect(bx, y + 10, 46, 52, 4).fillStyle(c).fillRoundedRect(bx, y + 8, 46, 46, 4)
      .fillStyle(0xe8dcc4, 0.7).fillRect(bx + 21, y + 8, 4, 46).fillStyle(0xffffff, 0.85).fillRect(bx + 6, y + 14, 14, 9);
  }
  g.fillStyle(0xe8741a).fillRect(x, y, w, 5).fillRect(x, y + h - 5, w, 5);
  g.fillStyle(0x1f5fbf).fillRect(x - 3, y - 3, 9, h + 6).fillRect(x + w - 6, y - 3, 9, h + 6);
  obs(s, x - 3, y - 3, w + 6, h + 6);
}

function montacargas(s, x, y, xf) {
  const f = s.add.container(x, y);
  const g = s.add.graphics();
  g.fillStyle(0x000000, 0.28).fillEllipse(4, 26, 110, 26);
  g.fillStyle(0xf2b705).fillRoundedRect(-45, -22, 90, 44, 8).fillStyle(0xc99400).fillRect(-45, 12, 90, 10);
  g.fillStyle(0x263238).fillRoundedRect(-30, -17, 40, 34, 6).lineStyle(2, 0x111111).strokeRoundedRect(-30, -17, 40, 34, 6);
  g.fillStyle(0x9aa5b1).fillRect(45, -26, 6, 52).fillRect(51, -20, 28, 5).fillRect(51, 15, 28, 5);
  g.fillStyle(0x111111).fillRoundedRect(-36, -27, 20, 8, 3).fillRoundedRect(14, -27, 20, 8, 3).fillRoundedRect(-36, 19, 20, 8, 3).fillRoundedRect(14, 19, 20, 8, 3);
  const luz = s.add.circle(-10, 0, 5, 0xff9f1c);
  s.tweens.add({ targets: luz, alpha: 0.2, yoyo: true, repeat: -1, duration: 350 });
  f.add([g, luz]);
  const flip = () => { f.scaleX = -f.scaleX; };
  s.tweens.add({ targets: f, x: xf, duration: 3800, yoyo: true, repeat: -1, ease: 'Sine.inOut', onYoyo: flip, onRepeat: flip });
}

function almacen(s, x, y, w) {
  const p = gr(s, D.pint).lineStyle(4, 0xf5c542, 0.5);   // carril del montacargas
  [y + 88, y + 134].forEach(ly => { for (let a = 0; a < w; a += 40) p.lineBetween(x + a, ly, x + a + 24, ly); });
  for (let i = 0; i < 3; i++) rack(s, x + i * 240, y, 220, 70, i);
  palet(s, x + w - 82, y + 102, 76, 58);
  montacargas(s, x + 60, y + 111, x + 560);
}

// ================= MANTENIMIENTO =================
function torno(s, x, y) {
  blk(s, x, y, 210, 76, 0x2f5d8a, 8, 8);
  rr(s, x + 6, y + 6, 66, 56, 0x274b6e, 1, 6);
  rr(s, x + 76, y + 24, 110, 24, 0x9aa5b1, 1, 4);
  rr(s, x + 150, y + 10, 52, 54, 0x274b6e, 1, 6);
  rr(s, x + 78, y + 31, 96, 10, 0xc9d1db, 1, 3);   // pieza en el torno
  const m = s.add.graphics({ x: x + 40, y: y + 34 }).fillStyle(0xc9d1db).fillCircle(0, 0, 20).fillStyle(0x4b5563).fillCircle(0, 0, 6);
  for (let k = 0; k < 3; k++) { const a = k * 2 * Math.PI / 3; m.fillStyle(0x2b323d).fillCircle(Math.cos(a) * 13, Math.sin(a) * 13, 4); }
  s.tweens.add({ targets: m, angle: 360, duration: 1500, repeat: -1 });
  obs(s, x, y, 210, 76);
}

function banco(s, x, y) {
  blk(s, x, y, 190, 62, 0x8b6b43, 6, 6);
  rr(s, x + 8, y + 6, 174, 40, 0x6b7380, 0.45, 4);
  rr(s, x + 12, y + 10, 26, 26, 0x2b323d, 1, 4);
  rr(s, x + 19, y + 17, 12, 12, 0xc0392b, 1, 3);                                       // tornillo de banco
  gr(s).lineStyle(4, 0xb0bac6).lineBetween(x + 52, y + 14, x + 94, y + 14).lineBetween(x + 52, y + 26, x + 88, y + 30)   // llaves
    .lineStyle(5, 0x8b5a2b).lineBetween(x + 56, y + 40, x + 90, y + 40).fillStyle(0x4b5563).fillRect(x + 88, y + 34, 12, 12);  // martillo
  engrane(s, x + 125, y + 28, 18, 0x9aa5b1, 1, 3000);
  engrane(s, x + 166, y + 28, 14, 0xff5c5c, -1.29, 3000);
  obs(s, x, y, 190, 62);
}

function carro(s, x, y) {
  blk(s, x, y, 58, 76, 0xc0392b, 6, 8);
  const g = gr(s);
  for (let k = 0; k < 4; k++) g.lineStyle(2, 0x000000, 0.4).lineBetween(x + 4, y + 14 + k * 14, x + 54, y + 14 + k * 14).fillStyle(0xcfd6df).fillRect(x + 22, y + 6 + k * 14, 14, 3);
  obs(s, x, y, 58, 76);
}

function barriles(s, x, y) {
  [[x, y], [x + 33, y], [x + 16, y + 32]].forEach(([bx, by]) => {
    gr(s, D.sombra).fillStyle(0x000000, 0.3).fillEllipse(bx + 3, by + 6, 38, 34);
    gr(s).fillStyle(0x1f5fbf).fillCircle(bx, by, 17).lineStyle(2, 0x6fa3ef, 0.8).strokeCircle(bx, by, 13).strokeCircle(bx, by, 8).fillStyle(0x0f2f5f).fillCircle(bx - 5, by - 5, 3);
    obs(s, bx - 17, by - 17, 34, 34);
  });
}

function soldadura(s, x, y) {
  blk(s, x, y, 110, 80, 0x4a5568, 6, 8);
  rr(s, x + 8, y + 8, 94, 52, 0x8a93a3, 0.5, 4);
  rr(s, x + 4, y + 2, 102, 10, 0xff9f1c, 0.45, 3);   // cortina de soldadura
  const arco = pool(s, x + 55, y + 36, 120, 120, 0x9fd8ff, 0.3);
  s.tweens.add({ targets: arco, alpha: 0.06, duration: 90, yoyo: true, repeat: -1, repeatDelay: 250 });
  for (let i = 0; i < 6; i++) {   // chispas
    const c = s.add.circle(x + 55, y + 34, 3, 0xffd166);
    s.tweens.add({ targets: c, y: c.y - 30 - i * 6, x: c.x + RND.between(-45, 45), alpha: 0, duration: 650 + i * 60, repeat: -1, delay: i * 170 });
  }
  obs(s, x, y, 110, 80);
}

function mantenimiento(s, x, y, w) {
  torno(s, x, y + 30);
  banco(s, x + 235, y + 36);
  carro(s, x + 455, y + 28);
  barriles(s, x + 535, y + 50);
  soldadura(s, x + w - 110, y + 28);
}

// ================= OFICINAS =================
function pizarra(s, x, y, w) {
  rr(s, x - 3, y - 3, w + 6, 28, 0x9aa5b1, 1, 3);
  rr(s, x, y, w, 22, 0xf3f6fa, 1, 2);
  const g = gr(s).lineStyle(1.5, 0x2b5aa5, 0.9);
  g.strokeCircle(x + 24, y + 11, 7).lineBetween(x + 40, y + 6, x + 90, y + 6).lineBetween(x + 40, y + 12, x + 76, y + 12);
  [[110, 40, 0x4dabff], [150, 54, 0x5cff9d], [200, 36, 0xffd166]].forEach(([a, b, c], k) => g.fillStyle(c, 0.9).fillRect(x + a, y + 5 + k * 5, b, 3));
  obs(s, x - 3, y - 3, w + 6, 28);
}

function plotter(s, x, y) {
  blk(s, x, y, 125, 64, 0x9aa5b1, 8, 8);
  rr(s, x + 12, y + 10, 101, 12, 0x1a212b, 1, 3);
  obs(s, x, y, 125, 64);
  const g = gr(s).fillStyle(0x1b4f8a).fillRect(0, 0, 90, 36).lineStyle(1, 0xffffff, 0.5);
  for (let k = 1; k < 4; k++) g.lineBetween(0, k * 9, 90, k * 9);
  for (let k = 1; k < 6; k++) g.lineBetween(k * 15, 0, k * 15, 36);
  g.setPosition(x + 17, y + 64);
  s.tweens.add({ targets: g, y: y + 72, duration: 1800, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
}

function ingenieria(s, x, y, w, z) {
  pizarra(s, x + 30, z.y + 3, 300);
  escritorio(s, x, y + 50, 130, { c: 0x6b7280, mon: [0x4dabff, 0x7ee0ff] });
  escritorio(s, x + 140, y + 50, 130, { c: 0x6b7280, mon: [0x4dabff, 0x7ee0ff] });
  mesaHolo(s, x + 350, y + 85, 0x4dabff);
  escritorio(s, x + 430, y + 50, 130, { c: 0x6b7280, mon: [0x4dabff, 0x7ee0ff] });
  plotter(s, x + w - 125, y + 40);
}

function andon(s, x, y) {
  rr(s, x, y, 34, 120, 0x0b1220, 1, 5);
  const luces = [[0xff4d4d, 0.9], [0xffd166, 0.9], [0x5cff9d, 0.9]];
  luces.forEach(([c], k) => {
    const l = s.add.circle(x + 17, y + 22 + k * 36, 10, c);
    if (k === 1) s.tweens.add({ targets: l, alpha: 0.2, yoyo: true, repeat: -1, duration: 800 });
    if (k === 0) s.tweens.add({ targets: l, alpha: 0.2, yoyo: true, repeat: -1, duration: 400, repeatDelay: 4000 });
  });
  txt(s, x + 17, y + 133, 'ANDON', 11, '#9fb7cc', { fontStyle: 'bold' }).setOrigin(0.5).setDepth(1);
  obs(s, x, y, 34, 140);
}

function paredVideo(s, x, y, w) {
  rr(s, x - 6, y - 4, w + 12, 86, 0x0b1018, 1, 6);
  obs(s, x - 6, y - 4, w + 12, 86);
  const cw = (w - 8) / 3;
  for (let j = 0; j < 2; j++) for (let i = 0; i < 3; i++) {
    const mx = x + i * (cw + 4), my = y + j * 40, mw = cw - 4;
    rr(s, mx, my, mw, 36, 0x1a2433, 1, 3);
    rr(s, mx + 3, my + 3, mw - 6, 30, 0x10261d, 1, 2);
    gr(s).lineStyle(1, 0x5cff9d, 0.25).lineBetween(mx + 6, my + 24, mx + mw - 6, my + 24).lineBetween(mx + mw / 2, my + 6, mx + mw / 2, my + 30);
    const p = rr(s, 0, 0, 10, 10, 0x5cff9d, 0.85, 5).setPosition(mx + 10, my + 14);
    s.tweens.add({ targets: p, x: mx + mw - 24, duration: RND.between(2500, 5000), yoyo: true, repeat: -1, ease: 'Sine.inOut' });
    const rec = s.add.circle(mx + mw - 10, my + 9, 3, 0xff4d4d);
    s.tweens.add({ targets: rec, alpha: 0.15, yoyo: true, repeat: -1, duration: 700, delay: (i + j) * 200 });
  }
}

function supervision(s, x, y, w, z) {
  andon(s, z.x + 8, y + 6);
  paredVideo(s, x + 100, z.y + 12, 500);
  [x + 190, x + 350, x + 510].forEach(cx => silla(s, cx, y + 62, 0x2b3444));
  escritorio(s, x + 80, y + 78, 540, { c: 0x3b4252, mon: [0xb48cff, 0xff5c5c, 0x5cff9d, 0x4dabff, 0xb48cff, 0x5cff9d], sentado: null });
}

function archivero(s, x, y) {
  blk(s, x, y, 40, 72, 0x9aa5b1, 3, 6);
  const g = gr(s);
  for (let k = 0; k < 3; k++) g.lineStyle(1.5, 0x000000, 0.35).strokeRect(x + 3, y + 4 + k * 20, 34, 18).fillStyle(0x4b5563).fillRect(x + 14, y + 10 + k * 20, 12, 3);
  obs(s, x, y, 40, 72);
}

function reloj(s, x, y) {
  blk(s, x, y, 44, 60, 0x374151, 6, 8);
  rr(s, x + 6, y + 6, 32, 16, 0x0f2a1d, 1, 3);
  const t = rr(s, x + 10, y + 10, 24, 8, 0x5cff9d, 0.85, 2);
  s.tweens.add({ targets: t, alpha: 0.4, yoyo: true, repeat: -1, duration: 900 });
  rr(s, x + 8, y + 28, 28, 6, 0x0b1220, 1, 2);   // ranura de tarjeta
  const led = s.add.circle(x + 22, y + 44, 4, 0x5cff9d);
  s.tweens.add({ targets: led, alpha: 0.2, yoyo: true, repeat: -1, duration: 1200 });
  obs(s, x, y, 44, 60);
}

function rrhh(s, x, y, w) {
  for (let i = 0; i < 3; i++) archivero(s, x + i * 44, y + 50);
  escritorio(s, x + 160, y + 56, 190, { c: 0xb99362, mon: [0x5cff9d] });
  rr(s, x + 300, y + 62, 24, 18, 0xf3f4f6, 1, 2);   // papeles sobre el mostrador
  reloj(s, x + 372, y + 40);
  planta(s, x + w - 25, y + 140, 18);
}

function ventanal(s, x, y, w) {
  const g = gr(s);
  g.fillStyle(0x0b1220).fillRect(x - 4, y - 4, w + 8, 40);
  g.fillGradientStyle(0x7fb9e8, 0x7fb9e8, 0xf2c58a, 0xf2c58a, 1).fillRect(x, y, w, 32);
  for (let bx = x; bx < x + w;) { const bw = RND.between(24, 56), bh = RND.between(8, 24); g.fillStyle(0x24324a).fillRect(bx, y + 32 - bh, Math.min(bw, x + w - bx), bh); bx += bw + RND.between(0, 6); }
  for (let m = x + 100; m < x + w; m += 100) g.fillStyle(0x0b1220).fillRect(m - 2, y, 4, 32);
  g.fillStyle(0xffffff, 0.12).fillRect(x, y, w, 8);
  obs(s, x - 4, y - 4, w + 8, 40);
}

function librero(s, x, y, w) {
  blk(s, x, y, w, 52, 0x5b3a1e, 4, 6);
  const g = gr(s), libros = [0x8e2f2f, 0x2f5d8e, 0x2f8e5d, 0xc9a227, 0x6b4a9e, 0xd8d8d8];
  [6, 28].forEach(fy => { for (let bx = x + 6; bx < x + w - 40;) { const bw = RND.between(5, 9); g.fillStyle(RND.pick(libros)).fillRect(bx, y + fy, bw, 16); bx += bw + 1; } });
  g.fillStyle(0xffd166).fillCircle(x + w - 22, y + 16, 9).fillRect(x + w - 26, y + 24, 8, 8).fillStyle(0x8a6d1f).fillRect(x + w - 30, y + 32, 16, 5);   // trofeo
  obs(s, x, y, w, 52);
}

function gerencia(s, x, y, w, z) {
  const iy = z.y + z.h / 2 + 40, cx = z.x + z.w / 2;
  const rug = gr(s, D.piso + 0.5);   // tapete bajo la zona de iconos
  rug.fillStyle(0x6b1f2a, 0.85).fillRoundedRect(cx - 330, iy - 110, 660, 220, 14).lineStyle(4, 0xffd166, 0.7).strokeRoundedRect(cx - 318, iy - 98, 636, 196, 10)
    .lineStyle(2, 0xffd166, 0.4).strokeRoundedRect(cx - 306, iy - 86, 612, 172, 8);
  ventanal(s, x + 40, z.y + 6, w - 80);
  librero(s, x, y + 20, 230);
  // escritorio ejecutivo
  silla(s, x + 400, y + 12, 0x3b2a1e);
  blk(s, x + 270, y + 40, 260, 70, 0x4a2f1b, 8, 8);
  rr(s, x + 282, y + 48, 236, 44, 0x1f3a2a, 1, 4);
  monitor(s, x + 310, y + 50, 0xffd166, 54, 26); monitor(s, x + 400, y + 50, 0x4dabff, 54, 26);
  rr(s, x + 466, y + 82, 40, 10, 0xffd166, 1, 2);   // placa con nombre
  const lamp = pool(s, x + 290, y + 62, 90, 90, 0xffe2a0, 0.25);
  s.tweens.add({ targets: lamp, alpha: 0.18, yoyo: true, repeat: -1, duration: 2000 });
  obs(s, x + 270, y + 40, 260, 70);
  silla(s, x + 335, y + 135, 0x2b3444); silla(s, x + 465, y + 135, 0x2b3444);
  mesaHolo(s, x + 660, y + 90, 0xffd166);
  planta(s, x + w - 25, y + 150, 20);
}

// ================= AMBIENTE =================
function luzSala(s, z) {
  const frio = ['produccion', 'calidad', 'almacen', 'mantenimiento'].includes(z.id);
  const nx = Math.ceil(z.w / 280), ny = Math.ceil(z.h / 250);
  for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++)
    pool(s, z.x + (i + 0.5) * z.w / nx, z.y + (j + 0.5) * z.h / ny, z.w / nx * 1.25, z.h / ny * 1.25, frio ? 0xcfe8ff : 0xffe2b0, 0.1);
  pool(s, z.x + z.w / 2, z.y + z.h / 2, z.w * 0.8, z.h * 0.8, z.acento, 0.05);   // resplandor del color del área
}

function manchas(s, z, n) {   // derrames de aceite y suciedad en el piso
  const g = gr(s, D.pint);
  for (let i = 0; i < n; i++) {
    const x = RND.between(z.x + 90, z.x + z.w - 90), y = RND.between(z.y + 90, z.y + z.h - 90), w = RND.between(40, 110), h = RND.between(22, 60);
    g.fillStyle(0x000000, 0.14).fillEllipse(x, y, w, h).fillStyle(0x0a0a12, 0.12).fillEllipse(x + 6, y - 3, w * 0.5, h * 0.5);
  }
}

export function decorar(s, z) {
  const arriba = z.puerta.lado !== 'arriba';   // los adornos van en la pared del fondo, lejos de la puerta
  const x = z.x + 50, w = z.w - 100, y = arriba ? z.y + 50 : z.y + z.h - 190;
  switch (z.id) {
    case 'produccion': produccion(s, x, y, w); manchas(s, z, 5); break;
    case 'calidad': calidad(s, x, y, w); break;
    case 'almacen': almacen(s, x, y, w); manchas(s, z, 3); break;
    case 'mantenimiento': mantenimiento(s, x, y, w); manchas(s, z, 6); break;
    case 'ingenieria': ingenieria(s, x, y, w, z); break;
    case 'supervision': supervision(s, x, y, w, z); break;
    case 'rrhh': rrhh(s, x, y, w); break;
    case 'gerencia': gerencia(s, x, y, w, z); break;
  }
  luzSala(s, z);
}