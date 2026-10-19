// src/scenes/DinamicaScene.js
import Phaser from 'phaser';
import { W, H, FUENTE, txt } from '../ui/ui.js';
import { AREAS } from '../data/areas.js';
import { preguntasPorArea } from '../data/preguntas.js';
import { cargar, guardarProgreso } from '../systems/progreso.js';

const hex = c => '#' + c.toString(16).padStart(6, '0');

// Función para dibujar un fondo sólido que cubra todo el juego
function dibujarFondo(scene) {
  scene.add.rectangle(W / 2, H / 2, W, H, 0x0b1220).setDepth(1000);
  // Borde decorativo futurista
  scene.add.graphics().setDepth(1001)
    .lineStyle(4, 0x00d2ff, 0.3)
    .strokeRect(20, 20, W - 40, H - 40);
}

export default class DinamicaScene extends Phaser.Scene {
  constructor() {
    super('Dinamica');
  }

  init(d) {
    this.areaIndex = d.areaIndex !== undefined ? d.areaIndex : 0;
    this.areaId = d.areaId;
  }

  create() {
    // 1. Fondo sólido para que NO se vea el juego detrás
    dibujarFondo(this);

    // 2. Obtener datos del área (con valores por defecto por seguridad)
    this.areaData = preguntasPorArea[this.areaIndex] || preguntasPorArea[0];
    this.areaInfo = AREAS.find(a => a.id === this.areaId) || { nombre: 'Área', acento: 0x00d2ff, minimo: 8 };
    this.ac = this.areaInfo.acento || 0x00d2ff;

    // 3. Preparar preguntas (mezclar aleatoriamente)
    const banco = this.areaData.preguntas;
    this.preguntas = Phaser.Utils.Array.Shuffle([...banco]);
    this.i = 0;
    this.aciertos = 0;
    this.opciones = [];
    this.bloqueado = false;

    // 4. Interfaz superior
    this.add.text(100, 50, this.areaData.nombre.toUpperCase() + ' · EVALUACIÓN', {
      fontFamily: FUENTE || 'Arial', fontSize: '34px', color: hex(this.ac), fontStyle: 'bold'
    }).setDepth(1002).setResolution(2);

    this.cont = this.add.text(W - 100, 50, '', {
      fontFamily: FUENTE || 'Arial', fontSize: '28px', color: '#9fb7cc'
    }).setOrigin(1, 0).setDepth(1002).setResolution(2);

    this.barra = this.add.graphics().setDepth(1002);

    this.txtP = this.add.text(W / 2, 250, '', {
      fontFamily: FUENTE || 'Arial', fontSize: '36px', color: '#ffffff', fontStyle: 'bold', align: 'center', wordWrap: { width: 1000 }
    }).setOrigin(0.5).setDepth(1002).setResolution(2);

    this.mostrar();
  }

  mostrar() {
    this.opciones.forEach(o => o.destroy());
    this.opciones = [];
    const q = this.preguntas[this.i];

    this.txtP.setText(q.p);
    this.cont.setText(`Pregunta ${this.i + 1} / ${this.preguntas.length}`);

    // Barra de progreso
    this.barra.clear()
      .fillStyle(0x16283d).fillRoundedRect(100, 110, 1080, 12, 6)
      .fillStyle(this.ac).fillRoundedRect(100, 110, Math.max(12, 1080 * this.i / this.preguntas.length), 12, 6);

    // Preparar opciones: 1 correcta y las demás incorrectas
    const respuestaCorrectaTexto = q.opciones[q.correcta];
    const respuestasIncorrectas = q.opciones.filter((_, idx) => idx !== q.correcta);

    // Mezclar opciones para que la correcta no siempre esté en el mismo lugar
    const ops = Phaser.Utils.Array.Shuffle([
      { t: respuestaCorrectaTexto, ok: true },
      ...respuestasIncorrectas.map(t => ({ t, ok: false }))
    ]);

    ops.forEach((op, k) => this.opciones.push(this.crearOpcion(op, k)));
    this.bloqueado = false;
  }

  crearOpcion(op, k) {
    const ancho = 1000;
    const c = this.add.container(W / 2, 380 + k * 110).setDepth(1002);
    const g = this.add.graphics();

    const pintar = (fill, linea, a = 1) => {
      g.clear()
        .fillStyle(fill).fillRoundedRect(-ancho / 2, -40, ancho, 80, 16)
        .lineStyle(3, linea, a).strokeRoundedRect(-ancho / 2, -40, ancho, 80, 16);
    };

    pintar(0x0b1a2b, this.ac, 0.5);

    const letras = ['A', 'B', 'C', 'D'];
    const t = this.add.text(-ancho / 2 + 40, 0, `${letras[k]})  ${op.t}`, {
      fontFamily: FUENTE || 'Arial', fontSize: '28px', color: '#ffffff', wordWrap: { width: ancho - 80 }
    }).setOrigin(0, 0.5).setDepth(1003).setResolution(2);

    c.add([g, t]).setSize(ancho, 80).setInteractive({ useHandCursor: true });

    c.on('pointerover', () => !this.bloqueado && pintar(0x12263b, this.ac, 1));
    c.on('pointerout', () => !this.bloqueado && pintar(0x0b1a2b, this.ac, 0.5));
    c.on('pointerup', () => this.responder(op));

    c.op = op;
    c.pintar = pintar;
    return c;
  }

  responder(op) {
    if (this.bloqueado) return;
    this.bloqueado = true;

    if (op.ok) this.aciertos++;

    // Mostrar visualmente cuál era la correcta (verde) y cuál se eligió (rojo si fue incorrecta)
    this.opciones.forEach(o => {
      if (o.op.ok) o.pintar(0x12361f, 0x5cff9d);
      else if (o.op === op) o.pintar(0x3a1616, 0xff5c5c);
    });

    this.time.delayedCall(1100, () => {
      this.i++;
      if (this.i < this.preguntas.length) {
        this.mostrar();
      } else {
        const calif = Math.round((this.aciertos / this.preguntas.length) * 100) / 10;
        this.final(calif);
      }
    });
  }

  // --- LÓGICA UNIFICADA DE FINALIZACIÓN (CORREGIDA) ---
  finalizar(calif) {
    const p = cargar();
    const ok = calif >= this.dinamica.minimo;
    const num = Number.isInteger(calif) ? calif : calif.toFixed(1);

    if (ok) {
      if (!p.superadas.includes(this.areaId)) p.superadas.push(this.areaId);
      const siguienteArea = AREAS[this.areaIndex + 1];
      if (siguienteArea && !p.desbloqueadas.includes(siguienteArea.id)) p.desbloqueadas.push(siguienteArea.id);
      if (this.areaIndex >= 3) p.ropa = 'formal';
      guardarProgreso(p);
    }

    const volver = ['VOLVER AL MAPA', () => this.volver()];

    // Si no aprobó, mostrar mensaje de reintentar
    if (!ok) {
      return this.panel('NO APROBASTE', '#ff5c5c',
        [`Calificación: ${num}/10`, `Mínimo: ${this.dinamica.minimo}/10`, 'Debes realizar la dinámica nuevamente.'],
        [['REINTENTAR', () => this.scene.restart({ areaId: this.areaId, areaIndex: this.areaIndex })], volver]
      );
    }

    // --- CORRECCIÓN: Si es Gerencia (índice 7) y aprobó, ir directo a la escena Final ---
    const esGerencia = this.areaIndex === 7;
    if (esGerencia) {
      return this.panel('¡FELICIDADES!', '#ffd166',
        ['¡Has superado todas las áreas!', 'Prepárate para la animación final...'],
        [['CONTINUAR', () => this.scene.start('Final')]] // <-- Aquí está la corrección
      );
    }

    // Para las demás áreas, mostrar el mensaje de desbloqueo normal
    const siguienteArea = AREAS[this.areaIndex + 1];
    const siguiente = siguienteArea
      ? [['CONTINUAR', () => this.panel('¡ÁREA DESBLOQUEADA!', hex(this.ac), [`Se desbloqueó: ${siguienteArea.nombre.toUpperCase()}`, 'Camina hasta su puerta en el mapa.'], [volver])]]
      : [volver];

    this.panel('¡ÁREA SUPERADA!', '#5cff9d', [`Área: ${this.dinamica.nombre}`, `Calificación: ${num}/10`], siguiente);
  }

  panel(titulo, color, lineas, botones) {
    this.tweens.killAll();
    this.children.removeAll(true);
    dibujarFondo(this); // Vuelve a dibujar el fondo para el panel final

    txt(this, W / 2, 200, titulo, 80, color, { fontStyle: 'bold' }).setDepth(1002);
    lineas.forEach((l, i) =>
      txt(this, W / 2, 350 + i * 70, l, 36, '#ffffff', { align: 'center', wordWrap: { width: 1000 } }).setDepth(1002)
    );

    botones.forEach(([t, cb], i) => {
      const esPrincipal = i === 0;
      const colorBtn = esPrincipal ? this.ac : 0x7f8c99;
      this.crearBoton(W / 2, 550 + i * 100, t, cb, 400, colorBtn);
    });
  }

  crearBoton(x, y, texto, callback, ancho, color) {
    const c = this.add.container(x, y).setDepth(1002);
    const g = this.add.graphics();
    const pintar = (fill) => g.clear().fillStyle(fill).fillRoundedRect(-ancho / 2, -35, ancho, 70, 16);

    pintar(color);
    const t = this.add.text(0, 0, texto, {
      fontFamily: FUENTE || 'Arial', fontSize: '32px', color: '#ffffff', fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(1003);

    c.add([g, t]).setSize(ancho, 70).setInteractive({ useHandCursor: true });

    // Efecto hover iluminando el botón
    c.on('pointerover', () => {
      const base = Phaser.Display.Color.ValueToColor(color);
      pintar(Phaser.Display.Color.GetColor(
        Math.min(255, base.r + 40),
        Math.min(255, base.g + 40),
        Math.min(255, base.b + 40)
      ));
    });
    c.on('pointerout', () => pintar(color));
    c.on('pointerup', () => callback());
  }

  volver() {
    this.scene.stop();
    this.scene.resume('Juego'); // Regresa al mapa
  }
}