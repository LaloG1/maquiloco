import Phaser from 'phaser';
import { W, H, FUENTE, txt } from '../ui/ui.js';
import { MUNDO, INICIO, PASILLOS, SALAS } from '../data/mapa.js';
import { AREAS } from '../data/areas.js';
import { cargar } from '../systems/progreso.js';
import Personaje from '../systems/Personaje.js';
import { crearTexturas, lamparas, decorar } from '../systems/Decoracion.js';

const ESC = 1.2, VEL = 280;   // escala del personaje y velocidad al caminar (px/s)
const hex = c => '#' + c.toString(16).padStart(6, '0');

export default class GameScene extends Phaser.Scene {
  constructor() { super('Juego'); }

  create() {
    this.prog = cargar();
    this.obst = [];
    this.puertas = SALAS.map(s => ({ ...s.puerta, id: s.id, abierta: this.prog.desbloqueadas.includes(s.id), obj: [] }));
    this.zonas = [...PASILLOS, ...SALAS, ...this.puertas.filter(d => d.abierta)];

    this.cameras.main.setBackgroundColor('#04070d').setBounds(0, 0, MUNDO.w, MUNDO.h).fadeIn(700);
    crearTexturas(this);
    this.dibujarMapa();
    PASILLOS.forEach(p => lamparas(this, p));
    SALAS.forEach(s => decorar(this, s));
    this.puertas.forEach(d => this.dibujarPuerta(d));

    // Personaje: viste según el último área desbloqueada
    const ult = Math.max(...this.prog.desbloqueadas.map(id => AREAS.findIndex(a => a.id === id)));
    this.pj = new Personaje(this, INICIO.x, INICIO.y - 64 * ESC, this.prog.personaje || 'hombre', AREAS[ult].atuendo).setScale(ESC).setDepth(50);
    this.cameras.main.startFollow(this.pj, false, 0.1, 0.1);

    this.k = this.input.keyboard.addKeys({ W: 'W', A: 'A', S: 'S', D: 'D', arr: 'UP', aba: 'DOWN', izq: 'LEFT', der: 'RIGHT' });
    this.input.keyboard.on('keydown-ESC', () => this.scene.start('Menu'));

    // Interfaz fija en pantalla
    this.meta = this.add.text(40, 30, '', { fontFamily: FUENTE, fontSize: '34px', color: '#ffffff', fontStyle: 'bold', backgroundColor: 'rgba(11,26,43,0.8)', padding: { x: 22, y: 12 } })
      .setScrollFactor(0).setDepth(100).setResolution(2);
    this.add.text(40, H - 56, 'Mover: W A S D / flechas   ·   Esc: menú', { fontFamily: FUENTE, fontSize: '24px', color: '#9fb7cc' }).setScrollFactor(0).setDepth(100).setResolution(2);
    this.toast = this.add.text(W / 2, 150, '', { fontFamily: FUENTE, fontSize: '34px', color: '#ffffff', backgroundColor: 'rgba(160,30,30,0.9)', padding: { x: 26, y: 14 } })
      .setOrigin(0.5).setScrollFactor(0).setDepth(100).setAlpha(0).setResolution(2);
    this.flecha = this.add.graphics().fillStyle(0xff9f1c).fillTriangle(-14, -16, 18, 0, -14, 16).setDepth(60);
    this.actualizarObjetivo();
  }

  // ---------- Mapa ----------
  dibujarMapa() {
    const g = this.add.graphics().setDepth(-10);
    const todo = [...PASILLOS, ...SALAS, ...this.puertas];
    g.fillStyle(0x121a28);                                           // paredes
    todo.forEach(r => g.fillRoundedRect(r.x - 26, r.y - 26, r.w + 52, r.h + 52, 20));
    g.lineStyle(4, 0x00d2ff, 0.3);
    todo.forEach(r => g.strokeRoundedRect(r.x - 26, r.y - 26, r.w + 52, r.h + 52, 20));
    PASILLOS.forEach(p => g.fillStyle(0x2c3646).fillRect(p.x, p.y, p.w, p.h));   // pisos
    SALAS.forEach(s => g.fillStyle(s.color).fillRect(s.x, s.y, s.w, s.h));
    g.lineStyle(2, 0xffffff, 0.05);                                  // juntas de losas (rejilla de 160 px)
    [...PASILLOS, ...SALAS].forEach(r => {
      for (let x = Math.ceil(r.x / 160) * 160; x < r.x + r.w; x += 160) g.lineBetween(x, r.y, x, r.y + r.h);
      for (let y = Math.ceil(r.y / 160) * 160; y < r.y + r.h; y += 160) g.lineBetween(r.x, y, r.x + r.w, y);
    });
    SALAS.forEach(s => {                                             // borde de color y rótulo de cada área
      g.lineStyle(6, s.acento, 0.5).strokeRect(s.x + 8, s.y + 8, s.w - 16, s.h - 16);
      const nombre = AREAS.find(a => a.id === s.id).nombre.toUpperCase();
      txt(this, s.x + s.w / 2, s.puerta.lado === 'arriba' ? s.y + 55 : s.y + s.h - 55, nombre, 50, hex(s.acento), { fontStyle: 'bold' }).setAlpha(0.45).setDepth(-9);
    });
    txt(this, 190, 1500, 'ENTRADA', 44, '#ffd166', { fontStyle: 'bold' }).setAngle(-90).setAlpha(0.55).setDepth(-9);
  }

  dibujarPuerta(d) {
    const vert = d.lado === 'izq' || d.lado === 'der';
    const c = d.abierta ? 0x5cff9d : 0xff4d4d;
    const g = this.add.graphics().setDepth(5);
    if (d.abierta) g.fillStyle(0x3a4658).fillRect(d.x, d.y, d.w, d.h);
    g.fillStyle(c, d.abierta ? 0.12 : 0.5).fillRect(d.x, d.y, d.w, d.h).lineStyle(4, c, 0.9).strokeRect(d.x, d.y, d.w, d.h);
    const t = txt(this, d.x + d.w / 2, d.y + d.h / 2, d.abierta ? AREAS.find(a => a.id === d.id).nombre.toUpperCase() : 'BLOQUEADA', 16, hex(c), { fontStyle: 'bold' })
      .setDepth(6).setAngle(vert ? 90 : 0);
    if (!d.abierta) this.tweens.add({ targets: g, alpha: 0.45, yoyo: true, repeat: -1, duration: 700 });
    d.obj = [g, t];
  }

  // La Fase 4 llamará a este método al superar un área
  abrirPuerta(id) {
    const d = this.puertas.find(p => p.id === id);
    if (!d || d.abierta) return;
    d.abierta = true;
    this.zonas.push(d);
    d.obj.forEach(o => { this.tweens.killTweensOf(o); o.destroy(); });
    this.dibujarPuerta(d);
  }

  // ---------- Lógica ----------
  objetivo() { return AREAS.find(a => !this.prog.superadas.includes(a.id)); }

  actualizarObjetivo() {
    const o = this.objetivo();
    this.meta.setText(o ? `Objetivo: ve al área de ${o.nombre.toUpperCase()}` : '¡Has superado todas las áreas!');
  }

  caminable(x, y) {
    const en = r => x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h;
    return this.zonas.some(en) && !this.obst.some(en);
  }

  libre(px, py) {   // caja de los pies del personaje
    return [[-16, -6], [16, -6], [-16, 4], [16, 4]].every(([a, b]) => this.caminable(px + a, py + b));
  }

  aviso(t) {
    if (this.time.now < (this.tAviso || 0)) return;
    this.tAviso = this.time.now + 3000;
    this.tweens.killTweensOf(this.toast);
    this.toast.setText(t).setAlpha(1);
    this.tweens.add({ targets: this.toast, alpha: 0, delay: 2200, duration: 600 });
  }

  update(_, dt) {
    const k = this.k, pj = this.pj, pie = 64 * ESC;
    const dx = (k.D.isDown || k.der.isDown ? 1 : 0) - (k.A.isDown || k.izq.isDown ? 1 : 0);
    const dy = (k.S.isDown || k.aba.isDown ? 1 : 0) - (k.W.isDown || k.arr.isDown ? 1 : 0);
    if (dx || dy) {
      const d = VEL * dt / 1000 / Math.hypot(dx, dy);
      if (this.libre(pj.x + dx * d, pj.y + pie)) pj.x += dx * d;       // ejes por separado: se desliza por las paredes
      if (this.libre(pj.x, pj.y + dy * d + pie)) pj.y += dy * d;
      pj.caminar(true);
    } else pj.caminar(false);

    const fy = pj.y + pie;
    this.puertas.forEach(d => {
      if (!d.abierta && fy > d.y - 50 && fy < d.y + d.h + 50 && pj.x > d.x - 50 && pj.x < d.x + d.w + 50) {
        const i = AREAS.findIndex(a => a.id === d.id);
        this.aviso(`Área bloqueada: primero supera ${AREAS[i - 1].nombre}`);
      }
    });

    // Flecha guía hacia la puerta del objetivo
    const o = this.objetivo(), d = o && this.puertas.find(p => p.id === o.id);
    if (d) {
      const ang = Math.atan2(d.y + d.h / 2 - (pj.y + 30), d.x + d.w / 2 - pj.x);
      const dist = Phaser.Math.Distance.Between(pj.x, pj.y + 30, d.x + d.w / 2, d.y + d.h / 2);
      this.flecha.setVisible(dist > 450).setPosition(pj.x + Math.cos(ang) * 150, pj.y + 30 + Math.sin(ang) * 150).setRotation(ang);
    } else this.flecha.setVisible(false);
  }
}
