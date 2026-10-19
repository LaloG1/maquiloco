// src/scenes/FinalScene.js
import Phaser from 'phaser';
import { W, H, FUENTE, txt, boton } from '../ui/ui.js';
import { reiniciarProgreso } from '../systems/progreso.js';

export default class FinalScene extends Phaser.Scene {
  constructor() { super('Final'); }

  create() {
    // 1. Fondo oscuro elegante
    this.add.rectangle(W / 2, H / 2, W, H, 0x050a14).setDepth(0);

    // 2. Efecto de Confeti (Partículas generadas por código)
    this.crearConfeti();

    // 3. Luces de fondo pulsantes (Efecto de celebración)
    const luz1 = this.add.circle(W / 2 - 300, H / 2, 400, 0x00d2ff, 0.1);
    const luz2 = this.add.circle(W / 2 + 300, H / 2, 400, 0xffd166, 0.1);
    this.tweens.add({ targets: [luz1, luz2], alpha: 0.25, duration: 1500, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

    // 4. Textos Triunfales
    const titulo = txt(this, W / 2, H / 2 - 150, '¡FELICIDADES!', 90, '#ffd166', { fontStyle: 'bold', stroke: '#000000', strokeThickness: 6 }).setDepth(10);
    const subtitulo = txt(this, W / 2, H / 2 - 40, 'Ahora eres Gerente General / CEO', 48, '#ffffff', { fontStyle: 'bold' }).setDepth(10);
    const empresa = txt(this, W / 2, H / 2 + 30, 'de Maquiloco S.A. de C.V.', 56, '#00d2ff', { fontStyle: 'bold', stroke: '#000000', strokeThickness: 4 }).setDepth(10);
    const mensaje = txt(this, W / 2, H / 2 + 120, 'Has demostrado conocimiento, liderazgo y excelencia\nen todas las áreas de la planta industrial.', 32, '#9fb7cc', { align: 'center' }).setDepth(10);

    // Animación de entrada de los textos
    [titulo, subtitulo, empresa, mensaje].forEach((el, i) => {
      el.setScale(0.5).setAlpha(0);
      this.tweens.add({
        targets: el,
        scale: 1,
        alpha: 1,
        duration: 800,
        delay: i * 200,
        ease: 'Back.easeOut'
      });
    });

    // 5. Botón para volver al inicio
    this.time.delayedCall(1500, () => {
      const btn = boton(this, W / 2, H / 2 + 260, 'VOLVER AL INICIO', () => {
        reiniciarProgreso(); // Borra el progreso para poder jugar de nuevo
        this.scene.start('Menu');
      }, 500, 0x00d2ff);
      
      btn.setDepth(10);
      if (btn.list) btn.list.forEach(c => c.setDepth(10));
    });
  }

  crearConfeti() {
    // Generamos una textura de cuadrado pequeño para el confeti
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(0xffffff).fillRect(0, 0, 8, 8);
    g.generateTexture('confeti', 8, 8);

    const colores = [0xffd166, 0x00d2ff, 0x5cff9d, 0xff5c5c, 0xffffff];
    
    // Creamos 100 partículas de confeti
    for (let i = 0; i < 100; i++) {
      const color = Phaser.Utils.Array.GetRandom(colores);
      const x = Phaser.Math.Between(0, W);
      const part = this.add.image(x, -20, 'confeti').setTint(color).setDepth(5);
      
      // Animación de caída con balanceo
      this.tweens.add({
        targets: part,
        y: H + 50,
        x: x + Phaser.Math.Between(-100, 100),
        rotation: Phaser.Math.Between(-6, 6),
        duration: Phaser.Math.Between(3000, 6000),
        delay: Phaser.Math.Between(0, 4000),
        repeat: -1,
        ease: 'Linear'
      });
    }
  }
}