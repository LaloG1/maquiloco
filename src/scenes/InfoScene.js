// src/scenes/InfoScene.js
import Phaser from 'phaser';
import { W, H, FUENTE, txt, boton } from '../ui/ui.js';
import { AREAS } from '../data/areas.js';
import { SALAS } from '../data/mapa.js';
import { cargar, guardar } from '../systems/progreso.js';

const hex = c => '#' + c.toString(16).padStart(6, '0');

export default class InfoScene extends Phaser.Scene {
  constructor() { super('Info'); }

  init(d) { this.areaId = d.areaId; }

  create() {
    const a = AREAS.find(x => x.id === this.areaId);
    const ac = SALAS.find(s => s.id === this.areaId).acento;
    const colorHex = hex(ac);

    // 1. Fondo oscuro semitransparente (cubre todo el juego)
    this.add.rectangle(W / 2, H / 2, W, H, 0x050a14, 0.88).setDepth(100).setInteractive();

    // 2. Dimensiones originales que funcionan en tu resolución 1920x1080
    const panelX = 190;
    const panelY = 80;
    const panelW = W - 380; // 1540px en 1920p
    const panelH = 920;

    // 3. Gráficos del panel (Fondo y borde)
    const g = this.add.graphics().setDepth(101);
    g.fillStyle(0x0b1a2b, 0.98);
    g.fillRoundedRect(panelX, panelY, panelW, panelH, 30);
    g.lineStyle(4, ac, 0.9);
    g.strokeRoundedRect(panelX, panelY, panelW, panelH, 30);
    
    // Barra decorativa superior de color
    g.fillStyle(ac, 0.4);
    g.fillRoundedRect(panelX, panelY, panelW, 8, 4);

    // Animación de entrada del panel (efecto "pop" suave)
    g.setScale(0.95).setAlpha(0);
    this.tweens.add({
      targets: g,
      scale: 1,
      alpha: 1,
      duration: 400,
      ease: 'Back.easeOut'
    });

    // 4. Títulos con jerarquía visual (Mejora visual aplicada)
    const titulo = txt(this, W / 2, panelY + 70, 'INFORMACIÓN DEL ÁREA', 28, '#9fb7cc', { fontStyle: 'bold', letterSpacing: 2 }).setDepth(102);
    const nombreArea = txt(this, W / 2, panelY + 120, a.nombre.toUpperCase(), 56, colorHex, { fontStyle: 'bold' }).setDepth(102);
    
    // Línea separadora decorativa
    const linea = this.add.graphics().setDepth(101);
    linea.lineStyle(2, ac, 0.4);
    linea.lineBetween((W / 2) - 80, panelY + 160, (W / 2) + 80, panelY + 160);

    // 5. Contenido de la información (Lista mejorada, legible y con viñetas)
    const contenidoY = panelY + 200;
    const maxTextWidth = panelW - 120;
    
    // Formateamos con viñetas elegantes y doble salto de línea para separar ideas
    const textoInfo = a.info.map(item => `▸  ${item}`).join('\n\n');

    const infoText = this.add.text(W / 2, contenidoY, textoInfo, {
      fontFamily: FUENTE || 'Arial',
      fontSize: '30px', // Tamaño cómodo para 1080p
      color: '#e2e8f0',
      wordWrap: { width: maxTextWidth },
      lineSpacing: 14,
      align: 'left'
    }).setOrigin(0.5, 0).setDepth(102).setResolution(2);

    // Aplicamos la misma animación de entrada a los textos
    [titulo, nombreArea, linea, infoText].forEach(el => {
      el.setScale(0.95).setAlpha(0);
    });

    this.tweens.add({
      targets: [titulo, nombreArea, linea, infoText],
      scale: 1,
      alpha: 1,
      duration: 400,
      delay: 100,
      ease: 'Back.easeOut'
    });

    // 6. BOTÓN DE ENTENDIDO (Exactamente en la posición original que funcionaba: Y = 925)
    const btn = boton(this, W / 2, 925, 'ENTENDIDO', () => {
      // Animación de salida elegante antes de volver al juego
      this.tweens.add({
        targets: [g, titulo, nombreArea, linea, infoText, btn],
        alpha: 0,
        scale: 0.95,
        duration: 200,
        ease: 'Quad.easeIn',
        onComplete: () => {
          const p = cargar(); 
          p.info[this.areaId] = true; 
          guardar(p);
          this.scene.stop();
          this.scene.resume('Juego');
        }
      });
    }, 420, ac);

    // FORZAMOS que el botón esté siempre por encima de todo el panel
    btn.setDepth(105);
    if (btn.list) {
      btn.list.forEach(child => child.setDepth(105));
    }
  }
}