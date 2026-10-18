import Phaser from 'phaser';

// Zona libre de adornos reservada en el centro de cada sala: la Fase 4 pondrá ahí los iconos.
const rr = (s, x, y, w, h, c, a = 1, r = 8) => s.add.graphics().fillStyle(c, a).fillRoundedRect(x, y, w, h, r);
const obs = (s, x, y, w, h) => s.obst.push({ x, y, w, h });

export function crearTexturas(s) {
  if (s.textures.exists('banda')) return;
  const g = s.make.graphics({ add: false });
  g.fillStyle(0x2a303b).fillRect(0, 0, 40, 50).fillStyle(0x3c4554).fillRect(0, 0, 16, 50);
  g.generateTexture('banda', 40, 50);
  g.destroy();
}

// Luces de advertencia parpadeantes en las paredes de los pasillos
export function lamparas(s, p) {
  const h = p.w > p.h, largo = h ? p.w : p.h;
  for (let i = 0, a = 60; a < largo - 40; i++, a += 320) {
    const l = s.add.circle(h ? p.x + a : p.x - 12, h ? p.y - 12 : p.y + a, 7, 0xff9f1c).setDepth(-5);
    s.tweens.add({ targets: l, alpha: 0.2, yoyo: true, repeat: -1, duration: 900, delay: i * 250 });
  }
}

function banda(s, x, y, w) {
  rr(s, x - 6, y - 6, w + 12, 62, 0x11161f, 1, 12);
  const t = s.add.tileSprite(x, y, w, 50, 'banda').setOrigin(0);
  s.tweens.add({ targets: t, tilePositionX: 40, duration: 700, repeat: -1 });
  obs(s, x - 6, y - 6, w + 12, 62);
  for (let i = 0; i < 3; i++) {   // balatas que viajan por la banda
    const p = rr(s, 0, 0, 38, 24, 0x8a93a3, 1, 12).setPosition(x, y + 13);
    s.tweens.add({ targets: p, x: x + w - 44, duration: 3600, repeat: -1, delay: i * 1200 });
  }
}

function brazo(s, x, y) {
  const c = s.add.container(x, y);
  const a = s.add.graphics().fillStyle(0xff9f1c).fillRoundedRect(-8, -90, 16, 90, 8).fillStyle(0x374151).fillCircle(0, -90, 10);
  const b = s.add.graphics().fillStyle(0x4b5563).fillCircle(0, 0, 26).fillStyle(0xff9f1c).fillCircle(0, 0, 12);
  c.add([a, b]);
  s.tweens.add({ targets: a, angle: { from: -30, to: 30 }, duration: 1400, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
  obs(s, x - 26, y - 26, 52, 52);
}

function escaner(s, x, y) {
  rr(s, x, y + 30, 320, 70, 0x3b4a5c, 1, 14);
  rr(s, x + 20, y + 40, 280, 50, 0x0f1722, 1, 10);
  for (let i = 0; i < 5; i++) rr(s, x + 40 + i * 54, y + 52, 36, 26, 0x8a93a3, 1, 12);
  obs(s, x, y + 30, 320, 70);
  const h = rr(s, 0, 0, 6, 100, 0x00d2ff, 0.9, 3).setPosition(x + 30, y + 5);
  s.tweens.add({ targets: h, x: x + 290, duration: 1600, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
}

function estantes(s, x, y) {
  for (let i = 0; i < 3; i++) {
    const ex = x + i * 235;
    rr(s, ex, y, 220, 70, 0x5b6575, 1, 8);
    for (let j = 0; j < 4; j++) rr(s, ex + 10 + j * 52, y + 12, 44, 46, [0xc58b4b, 0xa8743c, 0xd9a066][j % 3], 1, 6);
    obs(s, ex, y, 220, 70);
  }
  const f = s.add.container(x + 60, y + 108);   // montacargas que patrulla
  f.add([
    s.add.graphics().fillStyle(0xffc107).fillRoundedRect(-45, -22, 90, 44, 8).fillStyle(0x263238).fillRoundedRect(-8, -30, 30, 14, 4)
      .fillStyle(0x9aa5b1).fillRect(45, -26, 6, 52).fillRect(51, 14, 26, 6).fillStyle(0x111111).fillCircle(-26, 22, 9).fillCircle(26, 22, 9)
  ]);
  const flip = () => { f.scaleX = -f.scaleX; };
  s.tweens.add({ targets: f, x: x + 560, duration: 3800, yoyo: true, repeat: -1, ease: 'Sine.inOut', onYoyo: flip, onRepeat: flip });
}

function engrane(s, x, y, r, c, dir) {
  const g = s.add.graphics({ x, y }).fillStyle(c);
  for (let i = 0; i < 10; i++) g.fillCircle(Math.cos(i * Math.PI / 5) * r, Math.sin(i * Math.PI / 5) * r, r * 0.22);
  g.fillCircle(0, 0, r).fillStyle(0x151b26).fillCircle(0, 0, r * 0.35);
  s.tweens.add({ targets: g, angle: 360 * dir, duration: 6000, repeat: -1 });
}

function taller(s, x, y, w) {
  engrane(s, x + 70, y + 70, 50, 0x9aa5b1, 1);
  engrane(s, x + 166, y + 70, 36, 0xff5c5c, -1.4);
  engrane(s, x + 262, y + 70, 44, 0x6b7280, 1.1);
  obs(s, x + 10, y + 10, 300, 120);
  const bx = x + w - 300;
  rr(s, bx, y + 60, 300, 70, 0x4a5568, 1, 12);
  obs(s, bx, y + 60, 300, 70);
  for (let i = 0; i < 6; i++) {   // chispas
    const c = s.add.circle(bx + 150, y + 55, 3, 0xffd166);
    s.tweens.add({ targets: c, y: c.y - 30 - i * 6, x: c.x + Phaser.Math.Between(-45, 45), alpha: 0, duration: 650 + i * 60, repeat: -1, delay: i * 170 });
  }
}

function holograma(s, cx, cy, c) {
  for (let i = 0; i < 2; i++) {
    const r = s.add.circle(cx, cy, 34).setStrokeStyle(3, c, 0.9);
    s.tweens.add({ targets: r, scale: 1.7, alpha: 0, duration: 1800, repeat: -1, delay: i * 900 });
  }
  const q = s.add.rectangle(cx, cy, 30, 30).setStrokeStyle(3, c);
  s.tweens.add({ targets: q, angle: 360, duration: 4000, repeat: -1 });
}

function oficina(s, x, y, w, v) {
  rr(s, x, y + 70, w, 64, 0x4a5568, 1, 12);
  obs(s, x, y + 70, w, 64);
  const col = { ing: [0x4dabff], sup: [0xb48cff, 0xff5c5c, 0x5cff9d], rrhh: [0x5cff9d], ger: [0xffd166] }[v];
  for (let i = 0, n = Math.floor(w / 170); i < n; i++) {
    const mx = x + 25 + i * 170;
    rr(s, mx, y + 14, 120, 56, 0x0b1220, 1, 8);
    const p = rr(s, mx + 8, y + 20, 104, 40, col[i % col.length], 0.9, 4);
    s.tweens.add({ targets: p, alpha: 0.3, yoyo: true, repeat: -1, duration: 700 + i * 230, delay: i * 150 });
  }
  if (v === 'ing') holograma(s, x + w / 2, y + 100, 0x4dabff);
  if (v === 'ger') holograma(s, x + w / 2, y + 100, 0xffd166);
  if (v === 'rrhh') { s.add.circle(x + w - 20, y + 100, 22, 0x2e7d32); s.add.circle(x + w - 26, y + 94, 12, 0x43a047); }
}

export function decorar(s, z) {
  const arriba = z.puerta.lado !== 'arriba';   // los adornos van en la pared del fondo, lejos de la puerta
  const x = z.x + 50, w = z.w - 100, y = arriba ? z.y + 50 : z.y + z.h - 190;
  switch (z.id) {
    case 'produccion': banda(s, x, y + 10, 300); banda(s, x + w - 300, y + 10, 300); brazo(s, x + 150, y + 130); brazo(s, x + w - 150, y + 130); break;
    case 'calidad': escaner(s, x + (w - 320) / 2, y); break;
    case 'almacen': estantes(s, x, y); break;
    case 'mantenimiento': taller(s, x, y, w); break;
    case 'ingenieria': oficina(s, x, y, w, 'ing'); break;
    case 'supervision': oficina(s, x, y, w, 'sup'); break;
    case 'rrhh': oficina(s, x, y, w, 'rrhh'); break;
    case 'gerencia': oficina(s, x, y, w, 'ger'); break;
  }
}
