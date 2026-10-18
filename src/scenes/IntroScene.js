import Phaser from 'phaser';
import { W, txt } from '../ui/ui.js';
import Personaje from '../systems/Personaje.js';
import { cargar } from '../systems/progreso.js';

// Animación de llegada: el empleado camina hacia la planta y entra por la puerta.
export default class IntroScene extends Phaser.Scene {
  constructor() { super('Intro'); }

  create() {
    const g = this.add.graphics();
    g.fillGradientStyle(0x14223f, 0x14223f, 0xf2a65a, 0xf2a65a, 1).fillRect(0, 0, W, 800);
    g.fillStyle(0x2a3140).fillRect(0, 800, W, 280);
    g.fillStyle(0xf5c542, 0.9).fillRect(0, 820, W, 8);
    g.fillStyle(0x3b4658).fillRoundedRect(1080, 380, 680, 420, 14).fillStyle(0x56637a).fillRect(1080, 380, 680, 44);
    g.fillStyle(0x2f3847).fillRect(1160, 250, 56, 130).fillRect(1280, 300, 56, 80);
    g.fillStyle(0x0d1520).fillRoundedRect(1340, 600, 160, 200, 10);
    g.fillStyle(0x00d2ff, 0.8).fillRect(1120, 560, 120, 40).fillRect(1600, 560, 120, 40);
    txt(this, 1420, 490, 'MAQUILOCO S.A. DE C.V.', 40, '#ffffff', { fontStyle: 'bold' });
    [1188, 1308].forEach((x, k) => {
      const h = this.add.circle(x, k ? 290 : 240, 22, 0xdfe6ee, 0.5);
      this.tweens.add({ targets: h, y: h.y - 140, scale: 2, alpha: 0, duration: 2600, repeat: -1, delay: k * 900 });
    });

    const pj = new Personaje(this, 160, 705, cargar().personaje || 'hombre', 'produccion').setScale(1.5);
    pj.caminar(true);
    this.tweens.add({
      targets: pj, x: 1420, duration: 4500,
      onComplete: () => {
        pj.caminar(false);
        this.tweens.add({ targets: pj, alpha: 0, scale: 1.2, duration: 600, onComplete: () => this.fin() });
      }
    });
  }

  fin() {
    this.cameras.main.fadeOut(600, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('Juego'));
  }
}
