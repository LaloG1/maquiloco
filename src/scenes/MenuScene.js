import Phaser from 'phaser';
import { W, H, txt, fondo, boton } from '../ui/ui.js';
import { AREAS } from '../data/areas.js';
import { cargar, reiniciar } from '../systems/progreso.js';

export default class MenuScene extends Phaser.Scene {
  constructor() { super('Menu'); }

  create() {
    fondo(this);
    const t = txt(this, W / 2, 250, 'MAQUILOCO', 170, '#ffffff', { fontStyle: 'bold' });
    txt(this, W / 2, 370, 'S.A. DE C.V.', 60, '#00d2ff');
    txt(this, W / 2, 440, 'De operador a gerente general', 32, '#9fb7cc');
    this.tweens.add({ targets: t, scale: 1.03, yoyo: true, repeat: -1, duration: 1800, ease: 'Sine.inOut' });

    boton(this, W / 2, 620, 'INICIAR', () => { reiniciar(); this.scene.start('Personaje'); });
    boton(this, W / 2, 730, 'VER PROGRESO', () => this.verProgreso());
    boton(this, W / 2, 840, 'SALIR', () => this.panel('¡GRACIAS POR JUGAR!', [['Ya puedes cerrar esta pestaña.', '']]), 460, 0xff5c5c);
  }

  verProgreso() {
    const p = cargar();
    this.panel('PROGRESO', AREAS.map(a => {
      const sup = p.superadas.includes(a.id), des = p.desbloqueadas.includes(a.id);
      return [a.nombre, sup ? `✔ Superada (${p.puntajes[a.id]}/10)` : des ? 'Disponible' : 'Bloqueada', sup ? '#5cff9d' : des ? '#ffd400' : '#7f8c99'];
    }));
  }

  panel(titulo, lineas) {
    const c = this.add.container(0, 0).setDepth(10);
    const velo = this.add.rectangle(W / 2, H / 2, W, H, 0x000000, 0.78).setInteractive();
    const caja = this.add.graphics().fillStyle(0x0b1a2b).fillRoundedRect(W / 2 - 460, 130, 920, 820, 30)
      .lineStyle(3, 0x00d2ff, 0.8).strokeRoundedRect(W / 2 - 460, 130, 920, 820, 30);
    c.add([velo, caja, txt(this, W / 2, 210, titulo, 56, '#00d2ff', { fontStyle: 'bold' })]);
    lineas.forEach(([izq, der, color], i) => {
      const y = 320 + i * 62;
      c.add(txt(this, W / 2 - 380, y, izq, 34).setOrigin(0, 0.5));
      if (der) c.add(txt(this, W / 2 + 380, y, der, 32, color).setOrigin(1, 0.5));
    });
    c.add(boton(this, W / 2, 880, 'CERRAR', () => c.destroy(), 320));
  }
}
