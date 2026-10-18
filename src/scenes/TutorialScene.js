import Phaser from 'phaser';
import { W, FUENTE, txt, fondo, boton } from '../ui/ui.js';
import { TUTORIAL } from '../data/tutorial.js';

export default class TutorialScene extends Phaser.Scene {
  constructor() { super('Tutorial'); }

  preload() {
    TUTORIAL.forEach(d => d.imagen && this.load.image('tut_' + d.imagen, 'assets/tutorial/' + d.imagen));
  }

  create() {
    fondo(this);
    this.i = 0;
    this.titulo = txt(this, W / 2, 130, '', 64, '#00d2ff', { fontStyle: 'bold' });
    this.cuerpo = this.add.text(240, 270, '', { fontFamily: FUENTE, fontSize: '40px', color: '#ffffff', wordWrap: { width: 760 }, lineSpacing: 16 }).setResolution(2);
    this.marco = this.add.graphics();
    this.contador = txt(this, W / 2, 870, '', 28, '#9fb7cc');
    this.ant = boton(this, 560, 960, '◀ ANTERIOR', () => this.ir(-1), 400);
    this.sig = boton(this, 1360, 960, 'SIGUIENTE ▶', () => this.ir(1), 400, 0xff9f1c);
    this.input.keyboard.on('keydown-RIGHT', () => this.ir(1));
    this.input.keyboard.on('keydown-LEFT', () => this.i > 0 && this.ir(-1));
    this.mostrar();
  }

  mostrar() {
    const d = TUTORIAL[this.i];
    this.titulo.setText(d.titulo);
    this.cuerpo.setText(d.texto);
    this.contador.setText(`${this.i + 1} / ${TUTORIAL.length}`);
    this.ant.setVisible(this.i > 0);
    this.sig.etiqueta.setText(this.i === TUTORIAL.length - 1 ? 'INICIAR ▶' : 'SIGUIENTE ▶');

    this.imagen?.destroy();
    this.marco.clear().fillStyle(0x0b1a2b, 0.8).fillRoundedRect(1100, 250, 580, 520, 24)
      .lineStyle(3, 0x00d2ff, 0.6).strokeRoundedRect(1100, 250, 580, 520, 24);
    const key = 'tut_' + d.imagen;
    if (d.imagen && this.textures.exists(key)) {
      this.imagen = this.add.image(1390, 510, key);
      this.imagen.setScale(Math.min(540 / this.imagen.width, 480 / this.imagen.height));
    } else {
      this.imagen = txt(this, 1390, 510, d.imagen ? 'Falta la imagen:\n' + d.imagen : 'Imagen de referencia', 30, '#7fa6c4', { align: 'center' });
    }
  }

  ir(n) {
    if (this.i + n >= TUTORIAL.length) return this.scene.start('Intro');
    this.i += n;
    this.mostrar();
  }
}
