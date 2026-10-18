import Phaser from 'phaser';
import { W, txt, fondo, boton } from '../ui/ui.js';
import Personaje from '../systems/Personaje.js';
import { cargar, guardar } from '../systems/progreso.js';

export default class PersonajeScene extends Phaser.Scene {
  constructor() { super('Personaje'); }

  create() {
    fondo(this);
    txt(this, W / 2, 120, 'ELIGE A TU EMPLEADO', 72, '#ffffff', { fontStyle: 'bold' });
    this.sel = null;
    this.tarjetas = [['hombre', W / 2 - 300, 'EMPLEADO'], ['mujer', W / 2 + 300, 'EMPLEADA']].map(([genero, x, nombre]) => {
      const marco = this.add.graphics();
      const p = new Personaje(this, x, 520, genero, 'produccion').setScale(3.2);
      txt(this, x, 830, nombre, 44);
      const zona = this.add.zone(x, 520, 420, 540).setInteractive({ useHandCursor: true });
      zona.on('pointerover', () => p.caminar(true));
      zona.on('pointerout', () => this.sel !== genero && p.caminar(false));
      zona.on('pointerup', () => this.elegir(genero));
      return { genero, x, p, marco };
    });
    this.pintar();
    this.btn = boton(this, W / 2, 960, 'CONTINUAR', () => {
      const pr = cargar(); pr.personaje = this.sel; guardar(pr);
      this.scene.start('Tutorial');
    }, 460, 0xff9f1c).setVisible(false);
  }

  elegir(g) {
    this.sel = g;
    this.tarjetas.forEach(t => t.p.caminar(t.genero === g));
    this.pintar();
    this.btn.setVisible(true);
  }

  pintar() {
    this.tarjetas.forEach(({ genero, x, marco }) => {
      const s = this.sel === genero;
      marco.clear().fillStyle(0x0b1a2b, 0.6).fillRoundedRect(x - 210, 260, 420, 540, 30)
        .lineStyle(s ? 6 : 2, s ? 0xff9f1c : 0x00d2ff, s ? 1 : 0.35).strokeRoundedRect(x - 210, 260, 420, 540, 30);
    });
  }
}
