// src/scenes/LogoScene.js
import Phaser from 'phaser';
import { W, H, txt } from '../ui/ui.js';

export default class LogoScene extends Phaser.Scene {
  constructor() { super('Logo'); }

  preload() { this.load.image('logo', 'assets/ui/logo.png'); }

  create() {
    const items = [];
    if (this.textures.exists('logo')) {
      const img = this.add.image(W / 2, H / 2, 'logo');
      img.setScale(Math.min(800 / img.width, 480 / img.height));
      items.push(img);
    } else {
      const g = this.add.graphics().lineStyle(4, 0x00d2ff, 0.8).strokeRoundedRect(W / 2 - 320, H / 2 - 180, 640, 360, 30);
      items.push(g, txt(this, W / 2, H / 2 - 20, 'LOGO DEL CREADOR', 52), txt(this, W / 2, H / 2 + 55, 'Guarda tu logo en public/assets/ui/logo.png', 26, '#7fa6c4'));
    }
    items.forEach(i => i.setAlpha(0));
    
    // Animación del logo
    this.tweens.add({ 
      targets: items, 
      alpha: 1, 
      duration: 900, 
      yoyo: true, 
      hold: 1700, 
      onComplete: () => this.siguiente() 
    });
  }

  siguiente() {
    if (this.listo) return;
    this.listo = true;
    
    // 1. Mostrar el spinner de neón
    const overlay = document.getElementById('loading-overlay');
    if (overlay) overlay.style.display = 'flex';
    
    // 2. Esperar 2.5 segundos (2500 ms) para que se aprecie la animación de giro
    this.time.delayedCall(4000, () => {
      this.scene.start('Menu');
    });
  }
}