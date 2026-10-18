import Phaser from 'phaser';
import { W, FUENTE, txt, fondo, boton } from '../ui/ui.js';
import { AREAS } from '../data/areas.js';
import { SALAS } from '../data/mapa.js';
import { PREGUNTAS } from '../data/preguntas.js';
import { cargar, guardar } from '../systems/progreso.js';

const hex = c => '#' + c.toString(16).padStart(6, '0');

// Dinámica del área (por ahora quiz de opción múltiple). Califica sobre 10, guarda el avance y desbloquea la siguiente área.
export default class DinamicaScene extends Phaser.Scene {
  constructor() { super('Dinamica'); }

  init(d) { this.areaId = d.areaId; }

  create() {
    this.area = AREAS.find(a => a.id === this.areaId);
    this.ac = SALAS.find(s => s.id === this.areaId).acento;
    const banco = PREGUNTAS[this.areaId];
    if (!banco) return this.enConstruccion();

    fondo(this);
    this.preguntas = Phaser.Utils.Array.Shuffle([...banco]).slice(0, this.area.n);
    this.i = 0; this.aciertos = 0; this.opciones = [];
    this.add.text(100, 50, this.area.nombre.toUpperCase() + ' · DINÁMICA', { fontFamily: FUENTE, fontSize: '34px', color: hex(this.ac), fontStyle: 'bold' }).setResolution(2);
    this.cont = this.add.text(W - 100, 50, '', { fontFamily: FUENTE, fontSize: '34px', color: '#9fb7cc' }).setOrigin(1, 0).setResolution(2);
    this.barra = this.add.graphics();
    this.txtP = this.add.text(W / 2, 270, '', { fontFamily: FUENTE, fontSize: '46px', color: '#ffffff', fontStyle: 'bold', align: 'center', wordWrap: { width: 1500 } }).setOrigin(0.5).setResolution(2);
    this.mostrar();
  }

  mostrar() {
    this.opciones.forEach(o => o.destroy());
    this.opciones = [];
    const q = this.preguntas[this.i];
    this.txtP.setText(q.p);
    this.cont.setText(`Pregunta ${this.i + 1} / ${this.preguntas.length}`);
    this.barra.clear().fillStyle(0x16283d).fillRoundedRect(100, 110, 1720, 12, 6)
      .fillStyle(this.ac).fillRoundedRect(100, 110, Math.max(12, 1720 * this.i / this.preguntas.length), 12, 6);
    const ops = Phaser.Utils.Array.Shuffle([{ t: q.ok, ok: true }, ...q.mal.map(t => ({ t, ok: false }))]);
    ops.forEach((op, k) => this.opciones.push(this.opcion(op, k)));
    this.bloqueado = false;
  }

  opcion(op, k) {
    const ancho = 1300, c = this.add.container(W / 2, 480 + k * 120), g = this.add.graphics();
    const pintar = (fill, linea, a = 1) => g.clear().fillStyle(fill).fillRoundedRect(-ancho / 2, -48, ancho, 96, 24)
      .lineStyle(3, linea, a).strokeRoundedRect(-ancho / 2, -48, ancho, 96, 24);
    pintar(0x0b1a2b, this.ac, 0.5);
    const t = this.add.text(-ancho / 2 + 40, 0, `${'ABCD'[k]})  ${op.t}`, { fontFamily: FUENTE, fontSize: '32px', color: '#ffffff', wordWrap: { width: ancho - 80 } }).setOrigin(0, 0.5).setResolution(2);
    c.add([g, t]).setSize(ancho, 96).setInteractive({ useHandCursor: true });
    c.on('pointerover', () => !this.bloqueado && pintar(0x12263b, this.ac, 1));
    c.on('pointerout', () => !this.bloqueado && pintar(0x0b1a2b, this.ac, 0.5));
    c.on('pointerup', () => this.responder(op));
    c.op = op; c.pintar = pintar;
    return c;
  }

  responder(op) {
    if (this.bloqueado) return;
    this.bloqueado = true;
    if (op.ok) this.aciertos++;
    this.opciones.forEach(o => { if (o.op.ok) o.pintar(0x12361f, 0x5cff9d); else if (o.op === op) o.pintar(0x3a1616, 0xff5c5c); });
    this.time.delayedCall(1100, () => {
      this.i++;
      if (this.i < this.preguntas.length) this.mostrar();
      else this.final(Math.round(this.aciertos / this.preguntas.length * 100) / 10);
    });
  }

  // Califica, guarda el avance y muestra los mensajes: área superada → área desbloqueada (o reintentar)
  final(calif) {
    const p = cargar(), ok = calif >= this.area.minimo, num = Number.isInteger(calif) ? calif : calif.toFixed(1);
    let nueva = null;
    if (ok) {
      if (!p.superadas.includes(this.areaId)) p.superadas.push(this.areaId);
      p.puntajes[this.areaId] = Math.max(p.puntajes[this.areaId] || 0, calif);
      const sig = AREAS[AREAS.indexOf(this.area) + 1];
      if (sig && !p.desbloqueadas.includes(sig.id)) { p.desbloqueadas.push(sig.id); nueva = sig; }
      guardar(p);
    }
    const volver = ['VOLVER AL MAPA', () => this.volver()];
    if (!ok) {
      return this.panel('NO APROBASTE', '#ff5c5c', [`Calificación: ${num}/10`, `Mínimo para aprobar: ${this.area.minimo}/10`, 'Debes realizar la dinámica nuevamente hasta aprobar.'],
        [['REINTENTAR', () => this.scene.restart({ areaId: this.areaId })], volver]);
    }
    const ultima = this.area.id === 'gerencia';
    const siguiente = !nueva && !ultima ? [volver] : [['CONTINUAR', () => nueva
      ? this.panel('ÁREA DESBLOQUEADA', hex(this.ac), [`Se desbloqueó: ${nueva.nombre.toUpperCase()}`, 'Camina hasta su puerta en el mapa para entrar.'], [volver])
      : this.panel('¡FELICIDADES!', '#ffd166', ['Superaste todas las áreas.', '(La animación final llegará en la Fase 6)'], [volver])]];
    this.panel('¡ÁREA SUPERADA!', '#5cff9d', [`Área: ${this.area.nombre}`, `Calificación: ${num}/10`], siguiente);
  }

  // Dinámicas aún no hechas (Fase 5): permite simular un resultado para probar el desbloqueo
  enConstruccion() {
    this.panel('DINÁMICA EN CONSTRUCCIÓN', '#ffd166',
      ['Esta dinámica se desarrolla en la Fase 5.', 'Mientras tanto puedes simular un resultado para probar el desbloqueo.'],
      [['SIMULAR 10/10 (PRUEBA)', () => this.final(10)], ['SIMULAR 5/10 (PRUEBA)', () => this.final(5)], ['VOLVER AL MAPA', () => this.volver()]]);
  }

  panel(titulo, color, lineas, botones) {
    this.tweens.killAll();
    this.children.removeAll(true);
    fondo(this);
    txt(this, W / 2, 250, titulo, 90, color, { fontStyle: 'bold' });
    lineas.forEach((l, i) => txt(this, W / 2, 420 + i * 80, l, 40, '#ffffff', { align: 'center', wordWrap: { width: 1500 } }));
    botones.forEach(([t, cb], i) => boton(this, W / 2, 780 + i * 110, t, cb, 560, i === 0 ? this.ac : 0x7f8c99));
  }

  volver() {
    this.scene.stop();
    this.scene.resume('Juego');
  }
}
