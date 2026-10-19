import Phaser from 'phaser';
import { W, txt } from '../ui/ui.js';
import Personaje from '../systems/Personaje.js';
import { cargar } from '../systems/progreso.js';

const PUERTA = { x: 1340, y: 600, w: 160, h: 200 };
const SUELO = 800;

// Llegada a la planta: amanecer, cámara que acompaña, el empleado camina con polvo en cada paso,
// pasa su gafete en el lector, la puerta corrediza se abre y entra a la planta.
export default class IntroScene extends Phaser.Scene {
  constructor() { super('Intro'); }

  create() {
    this.terminando = false;
    this.cameras.main.fadeIn(800, 0, 0, 0);
    this.cielo();
    this.planta();
    this.puerta();
    this.ambiente();

    this.pj = new Personaje(this, -80, 722, cargar().personaje || 'hombre', 'produccion').setScale(1.25).setDepth(10);
    this.secuencia();

    // Saltar la intro (clic o espacio)
    this.input.once('pointerdown', () => this.fin());
    this.input.keyboard?.once('keydown-SPACE', () => this.fin());
  }

  // ---------- Escenario ----------
  cielo() {
    const g = this.add.graphics().setDepth(0);
    g.fillGradientStyle(0x0f1c38, 0x0f1c38, 0xf2a65a, 0xf2a65a, 1).fillRect(0, 0, W, SUELO);
    for (let i = 0; i < 45; i++)
      g.fillStyle(0xffffff, Phaser.Math.FloatBetween(0.2, 0.7)).fillCircle(Phaser.Math.Between(0, W), Phaser.Math.Between(0, 320), Phaser.Math.FloatBetween(0.8, 1.6));
    // Sol bajo
    g.fillStyle(0xffd9a0, 0.3).fillCircle(380, 700, 170).fillStyle(0xffe7bd, 0.9).fillCircle(380, 700, 70);
    // Nubes a la deriva
    for (let i = 0; i < 5; i++) {
      const c = this.add.container(Phaser.Math.Between(100, W - 100), Phaser.Math.Between(120, 360)).setDepth(0.5).setAlpha(0.35);
      c.add([this.add.ellipse(0, 0, 220, 38, 0xffe3c4), this.add.ellipse(40, -14, 120, 34, 0xffe3c4), this.add.ellipse(-50, -10, 100, 28, 0xffe3c4)]);
      this.tweens.add({ targets: c, x: c.x + 180, duration: 14000 + i * 2500, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    }
    // Siluetas de ciudad en dos capas
    const sil = (color, hmin, hmax, wmin, wmax, a) => {
      let x = -20;
      while (x < W) {
        const w = Phaser.Math.Between(wmin, wmax), h = Phaser.Math.Between(hmin, hmax);
        g.fillStyle(color, a).fillRect(x, SUELO - h, w, h);
        x += w;
      }
    };
    sil(0x2a2f55, 70, 210, 60, 140, 0.55);
    sil(0x1a1f3d, 30, 130, 50, 110, 0.9);

    // Banqueta, calle y rayas
    g.fillStyle(0x2a3140).fillRect(0, SUELO, W, 280);
    g.fillStyle(0x4b566b).fillRect(0, SUELO - 24, W, 30).fillStyle(0x6a768c).fillRect(0, SUELO - 24, W, 4);
    g.fillStyle(0x1f2531).fillRect(0, SUELO + 6, W, 6);
    for (let x = 20; x < W; x += 220) g.fillStyle(0xf5c542, 0.85).fillRect(x, 960, 120, 8);
  }

  planta() {
    const g = this.add.graphics().setDepth(1);
    g.fillStyle(0x000000, 0.25).fillEllipse(1420, SUELO + 6, 780, 26);                       // sombra en el suelo
    g.fillStyle(0x3b4658).fillRoundedRect(1080, 380, 680, 420, 14).fillStyle(0x56637a).fillRect(1080, 380, 680, 44);
    g.fillStyle(0xf5c542, 0.9).fillRect(1080, 424, 680, 5);                                   // franja de seguridad
    for (let x = 1165; x < 1760; x += 85) g.fillStyle(0x000000, 0.12).fillRect(x, 430, 3, 370); // paneles de lámina
    g.fillStyle(0x2f3847).fillRect(1160, 250, 56, 130).fillRect(1280, 300, 56, 80);          // chimeneas
    g.fillStyle(0xf5c542).fillRect(1160, 250, 56, 8).fillRect(1280, 300, 56, 8);
    g.fillStyle(0x00d2ff, 0.8).fillRect(1120, 560, 120, 40).fillRect(1600, 560, 120, 40);   // ventanas
    g.fillStyle(0xffffff, 0.25).fillRect(1120, 560, 120, 8).fillRect(1600, 560, 120, 8);

    // Rótulo
    g.fillStyle(0x0b1220).fillRoundedRect(1200, 440, 440, 112, 14).lineStyle(3, 0x7df9ff, 0.85).strokeRoundedRect(1200, 440, 440, 112, 14);
    this.rotulo = txt(this, 1420, 484, 'MAQUI-LOCO', 58, '#7df9ff', { fontStyle: 'bold' }).setOrigin(0.5).setDepth(4);
    this.sub = txt(this, 1420, 530, 'S.A. DE C.V.', 22, '#cfe9f2', { fontStyle: 'bold' }).setOrigin(0.5).setDepth(4);
    if (this.game.renderer.type === Phaser.WEBGL && this.rotulo.postFX) this.rotulo.postFX.addGlow(0x00d2ff, 4, 0, false, 0.1, 16);
    // Parpadeo de neón ocasional
    this.time.addEvent({
      delay: 2600, loop: true,
      callback: () => this.tweens.add({ targets: this.rotulo, alpha: 0.45, duration: 60, yoyo: true, repeat: 3 })
    });

    // Humo de chimeneas y luces rojas de la azotea
    [1188, 1308].forEach((x, k) => {
      const y0 = k ? 290 : 240;
      for (let i = 0; i < 3; i++) {
        const h = this.add.circle(x, y0, 18, 0xdfe6ee, 0.45).setDepth(1);
        this.tweens.add({ targets: h, y: y0 - 150, x: x + 40, scale: 2.4, alpha: 0, duration: 3200, repeat: -1, delay: i * 1000 + k * 700 });
      }
      const l = this.add.circle(x, y0 - 14, 4, 0xff3b3b).setDepth(2);
      this.tweens.add({ targets: l, alpha: 0.2, duration: 700, yoyo: true, repeat: -1 });
    });
  }

  puerta() {
    const { x, y, w, h } = PUERTA;
    const g = this.add.graphics().setDepth(1.6);
    g.fillStyle(0x56637a).fillRect(x - 10, y - 12, w + 20, h + 16);
    g.fillStyle(0xf5c542).fillRect(x - 10, y - 12, w + 20, 6);

    // Interior iluminado
    const gi = this.add.graphics().setDepth(2);
    gi.fillGradientStyle(0x3a2e24, 0x3a2e24, 0xffd88a, 0xffd88a, 1).fillRect(x, y, w, h);
    gi.fillStyle(0x1b2230, 0.65).fillRect(x + 14, y + 100, 46, 100).fillRect(x + 96, y + 70, 50, 130).fillRect(x + 60, y + 130, 30, 70);
    gi.fillStyle(0xfff3d0, 0.9).fillRect(x + 20, y + 14, 120, 5);

    // Luz que se derrama hacia afuera
    this.luz = this.add.graphics().setDepth(1.5).setAlpha(0);
    this.luz.fillStyle(0xffd88a, 0.33).fillPoints([{ x, y: SUELO }, { x: x + w, y: SUELO }, { x: x + w + 130, y: SUELO + 90 }, { x: x - 130, y: SUELO + 90 }], true);

    // Hojas corredizas (se recogen hacia los lados)
    const hoja = (px, lado) => {
      const c = this.add.container(px, y).setDepth(3);
      const ox = lado < 0 ? 0 : -w / 2;
      c.add([
        this.add.rectangle(ox, 0, w / 2, h, 0x56637a).setOrigin(0, 0).setStrokeStyle(2, 0x3b4658),
        this.add.rectangle(ox + 14, 26, w / 2 - 28, 70, 0x7fd8ff, 0.35).setOrigin(0, 0)
      ]);
      return c;
    };
    this.hojaIzq = hoja(x, -1);
    this.hojaDer = hoja(x + w, 1);

    txt(this, x + w / 2, y - 32, 'ENTRADA PERSONAL', 16, '#f5c542', { fontStyle: 'bold' }).setOrigin(0.5).setDepth(4);

    // Lector de gafete
    this.add.rectangle(1318, 676, 26, 44, 0x10151f).setDepth(4).setStrokeStyle(2, 0x56637a);
    this.led = this.add.circle(1318, 662, 4.5, 0xff3b3b).setDepth(5);
    this.add.rectangle(1318, 680, 14, 10, 0x2b3a55).setDepth(5);
  }

  ambiente() {
    // Poste de luz
    const g = this.add.graphics().setDepth(1.2);
    g.fillStyle(0x1c212c).fillRect(742, 520, 10, 260).fillRect(742, 520, 60, 8).fillRoundedRect(790, 520, 26, 10, 3);
    g.fillStyle(0xffd88a, 0.14).fillTriangle(803, 530, 740, 780, 870, 780);
    g.fillStyle(0xfff0c0, 0.95).fillCircle(803, 534, 6);
  }

  // ---------- Secuencia ----------
  secuencia() {
    const pj = this.pj, cam = this.cameras.main;
    cam.pan(1180, 590, 7000, 'Sine.easeInOut');
    cam.zoomTo(1.3, 7000, 'Sine.easeInOut');

    pj.caminar(true);
    pj.tw.timeScale = 0.8;                      // cadencia acorde al largo de zancada (menos "patinaje")
    this.polvo = this.time.addEvent({ delay: 310, loop: true, callback: () => this.polvoPaso() });
    this.tweens.add({
      targets: pj, x: 1190, duration: 5000, ease: 'Linear',
      onComplete: () => {
        pj.tw.timeScale = 0.6;
        this.tweens.add({ targets: pj, x: 1262, duration: 400, ease: 'Linear', onComplete: () => this.escanear() });
      }
    });
  }

  polvoPaso() {
    const pj = this.pj;
    for (let i = 0; i < 2; i++) {
      const p = this.add.circle(pj.x - 10 + Phaser.Math.Between(-5, 5), SUELO - 2, Phaser.Math.Between(3, 5), 0xc9bfae, 0.5).setDepth(9);
      this.tweens.add({
        targets: p, x: p.x - Phaser.Math.Between(10, 28), y: p.y - Phaser.Math.Between(8, 20),
        scale: 2.2, alpha: 0, duration: 600, onComplete: () => p.destroy()
      });
    }
  }

  // Camina hasta quedar frente a la puerta, gira hacia ella y entra de espaldas
  entrar() {
    const pj = this.pj, cam = this.cameras.main;
    pj.caminar(true);
    pj.tw.timeScale = 0.7;
    this.polvo = this.time.addEvent({ delay: 350, loop: true, callback: () => this.polvoPaso() });
    this.tweens.add({
      targets: pj, x: 1420, duration: 700, ease: 'Linear',
      onComplete: () => {
        this.polvo.remove();
        pj.caminar(false);
        this.time.delayedCall(250, () => {
          pj.orientar('espalda');                 // gira hacia la puerta
          this.time.delayedCall(300, () => {
            pj.caminar(true);
            pj.tw.timeScale = 0.7;
            cam.zoomTo(1.55, 2200, 'Sine.easeInOut');
            // Se aleja hacia el interior: se hace más pequeño y sus pies suben
            this.tweens.add({ targets: pj, y: 716, scale: 0.95, duration: 1900, ease: 'Linear' });
            this.tweens.add({
              targets: pj, alpha: 0, delay: 1300, duration: 600,
              onComplete: () => { pj.caminar(false); this.cerrarPuerta(); }
            });
          });
        });
      }
    });
  }

  // Se detiene y pasa el gafete: levanta el brazo hacia el lector
  escanear() {
    const pj = this.pj, br = pj.bm[0], cod = br.cod;
    this.polvo.remove();
    pj.caminar(false);
    this.tweens.add({ targets: br, rotation: -1.3, duration: 350, ease: 'Sine.easeOut' });
    this.tweens.add({
      targets: cod, rotation: -0.5, duration: 350, ease: 'Sine.easeOut',
      onComplete: () => this.time.delayedCall(250, () => {
        this.led.setFillStyle(0x3dff7a);
        this.tweens.add({ targets: this.led, scale: 1.6, duration: 120, yoyo: true });
        this.time.delayedCall(450, () => this.abrirPuerta());
      })
    });
  }

  abrirPuerta() {
    const pj = this.pj;
    // El brazo regresa a su lugar
    this.tweens.add({ targets: pj.bm[0], rotation: 0, duration: 400 });
    this.tweens.add({ targets: pj.bm[0].cod, rotation: 0, duration: 400 });
    this.tweens.add({ targets: [this.hojaIzq, this.hojaDer], scaleX: 0.06, duration: 1000, ease: 'Cubic.easeInOut' });
    this.tweens.add({ targets: this.luz, alpha: 1, duration: 1000 });
    this.time.delayedCall(1150, () => this.entrar());
  }

  cerrarPuerta() {
    this.tweens.add({ targets: [this.hojaIzq, this.hojaDer], scaleX: 1, duration: 800, ease: 'Cubic.easeInOut' });
    this.tweens.add({ targets: this.luz, alpha: 0.2, duration: 800 });
    this.led.setFillStyle(0xff3b3b);
    this.time.delayedCall(1100, () => this.fin());
  }

  fin() {
    if (this.terminando) return;
    this.terminando = true;
    this.cameras.main.fadeOut(600, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('Juego'));
  }
}