import Phaser from 'phaser';
import { ATUENDOS } from '../data/atuendos.js';

// Personaje vectorial (liso, sin pixeles) formado por piezas que se animan al caminar.
export default class Personaje extends Phaser.GameObjects.Container {
  constructor(scene, x, y, genero = 'hombre', atuendo = 'produccion') {
    super(scene, x, y);
    this.genero = genero;
    this.vestir(atuendo);
    scene.add.existing(this);
  }

  vestir(nombre) {
    this.caminar(false);
    this.removeAll(true);
    const a = ATUENDOS[nombre], mujer = this.genero === 'mujer';
    const piel = 0xf1c7a0, pelo = mujer ? 0x4a2c17 : 0x1f1a17;
    const mk = (x, y, fn) => { const g = this.scene.add.graphics({ x, y }); fn(g); this.add(g); return g; };
    const pierna = g => g.fillStyle(a.pantalon).fillRoundedRect(-7, 0, 14, 48, 6).fillStyle(0x1b1f27).fillRoundedRect(-8, 42, 16, 9, 4);
    const brazo = g => g.fillStyle(a.camisa).fillRoundedRect(-5, 0, 10, 36, 5).fillStyle(piel).fillCircle(0, 38, 5.5);

    mk(0, 0, g => g.fillStyle(0x000000, 0.22).fillEllipse(0, 66, 64, 14));          // sombra
    this.pI = mk(-9, 16, pierna); this.pD = mk(9, 16, pierna);                        // piernas
    if (mujer) mk(0, -52, g => g.fillStyle(pelo).fillCircle(0, 2, 19).fillRoundedRect(-17, 2, 34, 40, 14));
    mk(0, -4, g => {                                                                  // torso
      g.fillStyle(a.camisa).fillRoundedRect(-20, -24, 40, 44, 10);
      if (a.corbata) g.fillStyle(0xffffff).fillTriangle(-9, -24, 9, -24, 0, -6).fillStyle(a.corbata).fillRect(-2.5, -18, 5, 20);
      if (a.chaleco) g.fillStyle(a.chaleco).fillRoundedRect(-20, -24, 40, 44, 10).fillStyle(0xe8e8e8).fillRect(-20, -6, 40, 5).fillRect(-20, 8, 40, 5);
    });
    this.bI = mk(-25, -26, brazo); this.bD = mk(25, -26, brazo);                      // brazos
    mk(0, -52, g => {                                                                 // cabeza
      g.fillStyle(piel).fillCircle(0, 0, 17).fillStyle(0x222222).fillCircle(-6, -1, 2.2).fillCircle(6, -1, 2.2);
      g.lineStyle(2, 0x9a5b45).beginPath().arc(0, 3, 6, 0.3, Math.PI - 0.3).strokePath();
    });
    mk(0, -57, g => g.fillStyle(pelo).slice(0, 0, 18, Math.PI, Math.PI * 2).fillPath());   // cabello
    if (a.casco) mk(0, -58, g => g.fillStyle(a.casco).slice(0, 0, 21, Math.PI, Math.PI * 2).fillPath().fillRoundedRect(-24, -2, 48, 5, 2));
  }

  // Animación de caminar: balanceo de piernas, brazos y cuerpo
  caminar(on = true) {
    if (!on) {
      this.tw?.remove(); this.tw = null;
      [this.pI, this.pD, this.bI, this.bD].forEach(p => p && (p.rotation = 0));
      this.rotation = 0;
      return;
    }
    if (this.tw) return;
    const o = { v: -1 };
    this.tw = this.scene.tweens.add({
      targets: o, v: 1, duration: 380, yoyo: true, repeat: -1, ease: 'Sine.inOut',
      onUpdate: () => {
        const r = o.v * 0.5;
        this.pI.rotation = r; this.pD.rotation = -r;
        this.bI.rotation = -r * 0.8; this.bD.rotation = r * 0.8;
        this.rotation = o.v * 0.03;
      }
    });
  }
}
