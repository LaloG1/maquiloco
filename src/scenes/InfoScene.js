import Phaser from 'phaser';
import { W, H, FUENTE, txt, boton } from '../ui/ui.js';
import { AREAS } from '../data/areas.js';
import { SALAS } from '../data/mapa.js';
import { cargar, guardar } from '../systems/progreso.js';

const hex = c => '#' + c.toString(16).padStart(6, '0');

// Panel de información del área. Al cerrarlo se marca como visto, lo que habilita la dinámica.
export default class InfoScene extends Phaser.Scene {
  constructor() { super('Info'); }

  init(d) { this.areaId = d.areaId; }

  create() {
    const a = AREAS.find(x => x.id === this.areaId), ac = SALAS.find(s => s.id === this.areaId).acento;
    this.add.rectangle(W / 2, H / 2, W, H, 0x000000, 0.8).setInteractive();
    this.add.graphics().fillStyle(0x0b1a2b).fillRoundedRect(190, 80, W - 380, 920, 30)
      .lineStyle(4, ac, 0.9).strokeRoundedRect(190, 80, W - 380, 920, 30);
    txt(this, W / 2, 160, 'INFORMACIÓN · ' + a.nombre.toUpperCase(), 52, hex(ac), { fontStyle: 'bold' });
    this.add.text(260, 240, a.info.map(t => '• ' + t).join('\n'), {
      fontFamily: FUENTE, fontSize: '31px', color: '#ffffff', wordWrap: { width: W - 520 }, lineSpacing: 10
    }).setResolution(2);
    boton(this, W / 2, 925, 'ENTENDIDO', () => {
      const p = cargar(); p.info[this.areaId] = true; guardar(p);
      this.scene.stop();
      this.scene.resume('Juego');
    }, 420, ac);
  }
}
